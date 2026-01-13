import type { FastifyInstance } from "fastify";
import { UserService } from "../services/user.services.js";
import type { ServiceUserRegistrationPayload, ServiceUserLoginPayload } from "../modules/models/dto/servicePayloads/users/index.js";

export async function userRoutes(app: FastifyInstance) {
  const userService = new UserService();

  app.post("/users", async (request, reply) => {
    try {
      const payload = request.body as ServiceUserRegistrationPayload;
      const result = await userService.registerUser(payload);
      return reply.code(201).send(result);
    } catch (error: any) {
      return reply
        .code(error.statusCode || 500)
        .send(error.response?.data || { message: error.message });
    }
  });

  app.post("/users/login", async (request, reply) => {
    try {
      const payload = request.body as ServiceUserLoginPayload;
      const result = await userService.login(payload);
      return reply.code(200).send(result);
    } catch (error: any) {
      return reply
        .code(error.statusCode || 500)
        .send(error.response?.data || { message: error.message });
    }
  });

}
