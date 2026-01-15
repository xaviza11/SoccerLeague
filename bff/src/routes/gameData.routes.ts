import { type FastifyInstance } from "fastify";
import { GameDataService } from "../services/index.js";
import { AuthError } from "../modules/common/errors/auth.js";
import { GetGameDataSchema } from "../modules/swagger/gameData/index.js";

export async function gameDataRoute(app: FastifyInstance) {
  const gameDataService = new GameDataService();

  app.get("/api/game-data", { schema: GetGameDataSchema }, async (request, reply) => {
    try {
      request.log.info("Retrieving game data");

      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        request.log.error("Invalid authorization header");
        throw new AuthError("Invalid authorization header");
      }

      const encryptedToken = authHeader.slice(7).trim();

      if (!encryptedToken) {
        request.log.error("Empty authorization token");
        throw new AuthError("Empty authorization token");
      }

      const result = await gameDataService.retrieveGameData({
        token: encryptedToken,
      });

      request.log.info("Game data retrieved successfully");

      return reply.code(200).send(result);
    } catch (error: any) {
      request.log.error(`Error retrieving game data: ${error.message}`);
      return reply.code(error.statusCode || 500).send(
        error.response?.data || {
          message: error.message || "Internal server error",
        },
      );
    }
  });
}
