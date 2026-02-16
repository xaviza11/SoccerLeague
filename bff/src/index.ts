import Fastify from "fastify";

import {
  userRoutes,
  gameDataRoutes,
  gameStatsRoutes,
  marketplaceRoutes,
} from "./routes/index.js";
import { configService } from "./envConfig.js";

const fastify = Fastify({
  logger: true,
});

// Swagger Documentation
await fastify.register(import("@fastify/swagger"));

// Swagger UI
await fastify.register(import("@fastify/swagger-ui"), {
  routePrefix: "/documentation",
});

// Routes
fastify.register(userRoutes, { prefix: "api" });
fastify.register(gameDataRoutes, { prefix: "api" });
fastify.register(gameStatsRoutes, { prefix: "api" });
fastify.register(marketplaceRoutes, { prefix: "api" });

try {
  await fastify.listen({
    port: parseInt(configService.BFF_PORT),
    host: "0.0.0.0",
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
