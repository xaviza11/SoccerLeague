import Fastify from "fastify";

import { userRoutes, gameDataRoute, testCroneRoutes } from "./routes/index.js";
import { configService } from "./envConfig.js";
import { create } from "./crones/game.crones.js";

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
fastify.register(gameDataRoute, { prefix: "api" });

// Test routes
if (configService.MODE === "test") {
  fastify.register(testCroneRoutes, { prefix: "test" });
}

//Add Game Crones
if (configService.MODE !== "test") {
  create(fastify);
}

try {
  await fastify.listen({
    port: parseInt(configService.BFF_PORT),
    host: "0.0.0.0",
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
