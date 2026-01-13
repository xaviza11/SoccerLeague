import axios from "axios";

import type { NormalizedError } from "../../models/dto/errors/index.js";

export function handleError(error: unknown): NormalizedError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as any;

      return {
        statusCode: data?.statusCode ?? error.response.status,
        error: data?.error ?? "Error",
        message: Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message ?? "Request failed",
      };
    }

    return {
      statusCode: 503,
      error: "Service Unavailable",
      message: "Service unavailable",
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: 500,
      error: "Internal Server Error",
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    error: "Unexpected Error",
    message: "An unexpected error occurred",
  };
}
