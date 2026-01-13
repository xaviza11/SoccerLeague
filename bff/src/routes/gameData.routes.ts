import type { FastifyInstance } from "fastify";
import { GameDataService } from "../services/index.js";
import type {
  ServiceUserRegistrationPayload,
  ServiceUserLoginPayload,
} from "../modules/models/dto/servicePayloads/users/index.js";
import { AuthError } from "../modules/common/errors/auth.js";

export async function gameDataRoute(app: FastifyInstance) {
  const gameDataService = new GameDataService();

  app.get("/game-data", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        throw new AuthError("Invalid authorization header");
      }

      const encryptedToken = authHeader.slice(7).trim();

      if (!encryptedToken) {
        throw new AuthError("Empty authorization token");
      }

      const result = await gameDataService.retrieveGameData({
        token: encryptedToken,
      });

      return reply.code(200).send(result);
    } catch (error: any) {
      return reply.code(error.statusCode || 500).send(
        error.response?.data || {
          message: error.message || "Internal server error",
        }
      );
    }
  });
}
