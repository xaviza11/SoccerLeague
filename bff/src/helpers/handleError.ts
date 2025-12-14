import axios from "axios";

export function handleError(error: any): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { message, error: errMsg, statusCode } = error.response.data;

      const err: any = new Error(
        Array.isArray(message) ? message.join(", ") : message
      );

      err.statusCode = statusCode ?? error.response.status;
      err.error = errMsg ?? "Error";

      throw err;
    }

    const err: any = new Error("Service unavailable");
    err.statusCode = 503;
    err.error = "Service Unavailable";
    throw err;
  }

  throw error instanceof Error ? error : new Error("Unexpected error");
}
