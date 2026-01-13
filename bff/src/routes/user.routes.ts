import type { FastifyInstance } from "fastify";
import { UserService } from "../services/user.services.js";
import type { ServiceUserRegistrationPayload, ServiceUserLoginPayload } from "../modules/models/dto/servicePayloads/users/index.js";

export async function userRoutes(app: FastifyInstance) {
  const userService = new UserService();

  app.post("/users", async (request, reply) => {
    try {
      request.log.info("Registering new user");
      const payload = request.body as ServiceUserRegistrationPayload;
      const result = await userService.registerUser(payload);
      request.log.info("User registered successfully");
      return reply.code(201).send(result);
    } catch (error: any) {
      request.log.error(`Error registering user: ${error.message}`);
      return reply
        .code(error.statusCode || 500)
        .send(error.response?.data || { message: error.message });
    }
  });

  app.post("/users/login", async (request, reply) => {
    try {
      request.log.info("User login attempt");
      const payload = request.body as ServiceUserLoginPayload;
      const result = await userService.login(payload);
      request.log.info("User logged in successfully");
      return reply.code(200).send(result);
    } catch (error: any) {
      request.log.error(`Error during user login: ${error.message}`);
      return reply
        .code(error.statusCode || 500)
        .send(error.response?.data || { message: error.message });
    }
  });

}
