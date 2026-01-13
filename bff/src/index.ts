import Fastify from "fastify";

import { userRoutes, gameDataRoute } from "./routes/index.js";
import { configService } from "./envConfig.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(userRoutes, { prefix: "api" });
fastify.register(gameDataRoute, { prefix: "api" });

try {
  await fastify.listen({ port: parseInt(configService.BFF_PORT), host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
