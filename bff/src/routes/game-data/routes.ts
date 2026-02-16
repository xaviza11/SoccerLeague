import { type FastifyInstance } from "fastify";
import { GameDataServices } from "../../services/index.js";
import { AuthError } from "../../modules/common/errors/auth.js";
import {
  GetGameDataSchema,
  RetrieveOpponentTeamSchema,
  RetrieveUserGameSchema,
} from "./schemas/index.js";
import { UpdateTeamLineupSchema } from "./schemas/index.js";

export async function gameDataRoutes(app: FastifyInstance) {
  const gameDataServices = new GameDataServices();

  app.get(
    "/game-data",
    { schema: GetGameDataSchema },
    async (request, reply) => {
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

        const result = await gameDataServices.retrieveGameData({
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
    },
  );

  app.patch(
    "/team/update-lineup",
    {
      schema: UpdateTeamLineupSchema,
    },
    async (request: any, reply) => {
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

        const body = request.body;

        const result = await gameDataServices.updateTeamBench({
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

  app.get(
    "/game/user",
    { schema: RetrieveUserGameSchema },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
          throw new AuthError("Invalid authorization header");
        }

        const encryptedToken = authHeader.slice(7).trim();

        if (!encryptedToken) {
          throw new AuthError("Empty authorization token");
        }

        const result = await gameDataServices.retrieveUserGame({
          token: encryptedToken,
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

  app.get(
    "/team/opponent/:id",
    { schema: RetrieveOpponentTeamSchema },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
          throw new AuthError("Invalid authorization header");
        }

        const encryptedToken = authHeader.slice(7).trim();

        if (!encryptedToken) {
          throw new AuthError("Empty authorization token");
        }

        const result = await gameDataServices.retrieveOpponentTeam({
          token: encryptedToken,
          id,
        });

        return reply.code(200).send(result);
      } catch (error: any) {
        request.log.error(`Error retrieving opponent team: ${error.message}`);
        return reply.code(error.statusCode || 500).send(
          error.response?.data || {
            message: error.message || "Internal server error",
          },
        );
      }
    },
  );
}
