import { type FastifyInstance } from "fastify";
import { GameStatsServices } from "../../services/index.js";
import {
  GetUserRankingSchema,
  RetrieveLeaderboardSchema,
} from "./schemas/index.js";

export async function gameStatsRoutes(app: FastifyInstance) {
  const gameStatsServices = new GameStatsServices();

  app.get(
    "/ranking/leaderboard",
    { schema: RetrieveLeaderboardSchema },
    async (request: any, reply) => {
      try {
        request.log.info("Retrieving global leaderboard");
        
        const { page, limit } = request.query;

        const result = await gameStatsServices.retrieveLeaderboard({
          page,
          limit,
        });

        return reply.code(200).send(result);
      } catch (error: any) {
        request.log.error(`Error retrieving leaderboard: ${error.message}`);
        
        return reply.code(error.statusCode || 500).send(
          error.response?.data || {
            message: error.message || "Internal server error",
          },
        );
      }
    },
  );

  app.get(
    "/ranking/rank/:id",
    { schema: GetUserRankingSchema },
    async (request: any, reply) => {
      try {
        const { id } = request.params as { id: string };
        request.log.info(`Retrieving ranking for user: ${id}`);

        const result = await gameStatsServices.getUserRanking({ userId: id });

        return reply.code(200).send(result);
      } catch (error: any) {
        request.log.error(`Error retrieving user ranking: ${error.message}`);
        
        return reply.code(error.statusCode || 500).send(
          error.response?.data || {
            message: error.message || "Internal server error",
          },
        );
      }
    },
  );
}