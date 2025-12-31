import 'dotenv/config';

export class ConfigService {
  public readonly BFF_API: string;
  public readonly CLIENT_URL: string;

  constructor() {
    this.BFF_API = this.getEnvVar('BFF_API');
    this.CLIENT_URL = this.getEnvVar('CLIENT_URL');
  }

  private getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key} is ${value}`);
    }
    return value;
  }
}

export const configService = new ConfigService();
