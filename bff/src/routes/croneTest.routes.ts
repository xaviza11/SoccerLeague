import type { FastifyInstance } from "fastify";
import { GameService } from "../services/index.js";
import type {
  ServiceUserRegistrationPayload,
  ServiceUserLoginPayload,
} from "../modules/models/dto/servicePayloads/users/index.js";
import {
  CreateUserSchema,
  LoginSchema,
} from "../modules/swagger/users/index.js";

export async function testCroneRoutes(app: FastifyInstance) {
  const gameService = new GameService();

  app.get(
    "/create-games",
    /**/ async (request, reply) => {
      try {
        request.log.info("Creating Games");
        const result = await gameService.create();
        return reply.code(201).send(result);
      } catch (error: any) {
        request.log.info("Games created successfully");
        return reply
          .code(error.statusCode || 500)
          .send(error.response?.data || { message: error.message });
      }
    },
  );
}
