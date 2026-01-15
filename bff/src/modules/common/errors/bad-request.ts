import { AppError } from "./app.js";

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "Bad Request");
  }
}
