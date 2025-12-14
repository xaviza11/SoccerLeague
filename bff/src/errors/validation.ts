import { AppError } from "./app.js";

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "Validation Error");
  }
}
