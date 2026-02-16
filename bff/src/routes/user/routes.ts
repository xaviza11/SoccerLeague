import type { FastifyInstance } from "fastify";
import { UserServices } from "../../services/index.js";
import { CreateUserSchema, LoginSchema } from "./schemas/index.js";

export async function userRoutes(app: FastifyInstance) {
  const userServices = new UserServices();

  app.post("/users", { schema: CreateUserSchema }, async (request: any, reply) => {
    try {
      request.log.info("Registering new user");
      const payload = request.body;
      const result = await userServices.registerUser(payload);
      request.log.info("User registered successfully");
      return reply.code(201).send(result);
    } catch (error: any) {
      request.log.error(`Error registering user: ${error.message}`);
      return reply
        .code(error.statusCode || 500)
        .send(error.response?.data || { message: error.message });
    }
  });

  app.post("/users/login", { schema: LoginSchema }, async (request: any, reply) => {
    try {
      request.log.info("User login attempt");
      const payload = request.body;
      const result = await userServices.login(payload);
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
