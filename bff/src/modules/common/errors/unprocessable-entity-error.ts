import { AppError } from "./app.js";

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable Entity Error") {
    super(message, 422, "Unprocessable Entity Error");
  }
}
