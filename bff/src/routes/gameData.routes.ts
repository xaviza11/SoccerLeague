import { type FastifyInstance } from "fastify";
import { GameDataService } from "../services/index.js";
import { AuthError } from "../modules/common/errors/auth.js";
import { GetGameDataSchema } from "../modules/swagger/gameData/index.js";
import type { UpdateTeamServicePayload } from "../modules/models/dto/servicePayloads/team/index.js";
import { UpdateTeamLineupSchema } from "../modules/swagger/gameData/index.js"

export async function gameDataRoute(app: FastifyInstance) {
  const gameDataService = new GameDataService();

  app.get("/game-data", { schema: GetGameDataSchema }, async (request, reply) => {
    try {
      request.log.info("Retrieving game data");

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
      request.log.error(`Error retrieving game data: ${error.message}`);

      return reply.code(error.statusCode || 500).send(
        error.response?.data || {
          message: error.message || "Internal server error",
        },
      );
    }
  });

  app.patch(
    "/team/update-lineup",
    {
     schema: UpdateTeamLineupSchema,
    },
    async (request, reply) => {
      try {
        request.log.info("Updating team bench");

        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
          throw new AuthError("Invalid authorization header");
        }

        const encryptedToken = authHeader.slice(7).trim();

        if (!encryptedToken) {
          throw new AuthError("Empty authorization token");
        }

        const body = request.body as Omit<
          UpdateTeamServicePayload,
          "token"
        >;

        const result = await gameDataService.updateTeamBench({
          token: encryptedToken,
          players: body.players,
        });

        return reply.code(200).send(result);
      } catch (error: any) {
        request.log.error(`Error updating team bench: ${error.message}`);

        return reply.code(error.statusCode || 500).send(
          error.response?.data || {
            message: error.message || "Internal server error",
          },
        );
      }
    },
  );
}
