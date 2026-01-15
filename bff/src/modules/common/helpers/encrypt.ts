import * as crypto from "crypto";
import { configService } from "../../../envConfig.js";
import { AuthError } from "../errors/auth.js";

export class TokenCrypto {
  private static readonly algorithm = "aes-256-cbc";
  private static readonly ivLength = 16;
  private static readonly keyLength = 32;

  private static getSecretKey(): Buffer {
    const secret = configService.ENCRYPTION_SECRET;

    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined");
    }

    const key = Buffer.from(secret, "hex");

    if (key.length !== this.keyLength) {
      throw new Error(`TOKEN_SECRET must be ${this.keyLength} bytes (hex encoded)`);
    }

    return key;
  }

  static encrypt(token: string): string {
    if (!token) {
      throw new Error("Token is required for encryption");
    }

    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.getSecretKey(), iv);

    const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);

    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  }

  static decrypt(encryptedToken: string): string {
    try {
      if (!encryptedToken) {
        throw new Error("Encrypted token is required for decryption");
      }

      const parts = encryptedToken.split(":");

      if (parts.length !== 2) {
        throw new Error("Invalid encrypted token format");
      }

      const [ivHex, encryptedHex] = parts;

      const iv = Buffer.from(ivHex as string, "hex");
      const encryptedText = Buffer.from(encryptedHex as string, "hex");

      const decipher = crypto.createDecipheriv(this.algorithm, this.getSecretKey(), iv);

      const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

      return decrypted.toString("utf8");
    } catch {
      throw new AuthError("Invalid token");
    }
  }
}
