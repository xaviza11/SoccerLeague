import { AppError } from "./app.js";

export class AuthError extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, 401, "Unauthorized");
  }
}
