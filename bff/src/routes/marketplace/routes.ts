import { type FastifyInstance } from "fastify";
import { MarketplaceServices } from "../../services/index.js";
import { AuthError } from "../../modules/common/errors/auth.js";
import { BuyPlayerSchema } from "./schemas/index.js";

export async function marketplaceRoutes(app: FastifyInstance) {
  const marketplaceServices = new MarketplaceServices();

  app.post(
    "/marketplace/buy/player",
    { schema: BuyPlayerSchema },
    async (request: any, reply) => {
      try {
        request.log.info("Processing player purchase request");

        const payload = request.body;
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
          throw new AuthError("Invalid authorization header");
        }

        const encryptedToken = authHeader.slice(7).trim();

        if (!encryptedToken) {
          throw new AuthError("Empty authorization token");
        }

        const result = await marketplaceServices.buyPlayer(
          encryptedToken,
          payload,
        );

        return reply.code(200).send(result);
      } catch (error: any) {
        request.log.error(`Error in marketplace purchase: ${error.message}`);

        return reply.code(error.statusCode || 500).send(
          error.response?.data || {
            message: error.message || "Internal server error",
          },
        );
      }
    },
  );
}