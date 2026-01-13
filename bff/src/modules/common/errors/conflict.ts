import { AppError } from "./app.js";

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "Conflict");
  }
}
