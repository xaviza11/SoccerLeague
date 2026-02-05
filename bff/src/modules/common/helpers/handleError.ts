import type { NormalizedError } from "../../models/dto/errors/index.js";

export function handleError(error: unknown): NormalizedError {
  if (error instanceof Error && error.message.startsWith("HTTP Error:")) {
    const statusCode = parseInt(error.message.split(": ")[1] as string) || 500;
    
    return {
      statusCode,
      error: getErrorTitle(statusCode),
      message: `The server responded with status ${statusCode}`,
    };
  }

  if (error instanceof Error) {
    if ((error as any).code === 'ECONNREFUSED' || (error as any).code === 'UND_ERR_CONNECT_TIMEOUT') {
      return {
        statusCode: 503,
        error: "Service Unavailable",
        message: "Could not connect to the service. Please try again later.",
      };
    }

    return {
      statusCode: (error as any).statusCode ?? 500,
      error: "Internal Error",
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    error: "Unexpected Error",
    message: "An unexpected error occurred",
  };
}

function getErrorTitle(status: number): string {
  const map: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };
  return map[status] ?? "Error";
}