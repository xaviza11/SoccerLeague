import { AppError } from "./app.js";

export class ServiceUnavailableError extends AppError {
  constructor(message = "Service unavailable") {
    super(message, 503, "Service Unavailable");
  }
}
