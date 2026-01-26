import { AppError } from "./app.js";

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "Forbidden");
  }
}
