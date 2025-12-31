import axios, { AxiosError } from "axios";
import { configService } from "../../../env.config";
import { AuthErrorTranslator } from "../../utils/translator";

interface LoginUserPayload {
  email: string;
  password: string;
}

interface LoginUserResponse {
  username: string;
  token: string;
}

interface BffErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<LoginUserPayload>(event);

  try {
    const response = await axios.post<LoginUserResponse>(
      `${configService.BFF_API}/api/users/login`,
      payload
    );

    const token = response.data.token;

    setCookie(event, "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
      path: "/",
    });

    return {username: response.data.username};
  } catch (error) {
    const err = error as AxiosError<BffErrorResponse>;

    if (err.response) {
      throw createError({
        statusCode: err.response.status,
        statusMessage:
          AuthErrorTranslator.translate(err.response.data?.message) ||
          "Translate Error fail",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
