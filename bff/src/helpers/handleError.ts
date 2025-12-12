import axios from "axios";

export function handleError(error: any) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const err: any = new Error(JSON.stringify(error.response.data));
      (err as any).statusCode = error.response.status;
      throw err;
    } else {
      const err: any = new Error("Service unavailable");
      (err as any).statusCode = 500;
      throw err;
    }
  }
  throw error instanceof Error ? error : new Error("Unexpected error");
}
