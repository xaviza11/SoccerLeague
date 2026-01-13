import { AppError } from "./app.js";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "Not Found");
  }
}
