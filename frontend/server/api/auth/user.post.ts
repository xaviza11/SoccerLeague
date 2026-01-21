import axios, { AxiosError } from "axios";
import { configService } from "../../../env.config";
import { AuthErrorTranslator } from "../../utils/translator";

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  username: string;
  token: string;
  storage: { id: string };
  stats: {
    elo: number;
    money: number;
    total_games: number;
  };
}

interface BffErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

export default defineEventHandler(async (event) => {
  const payload = await readBody<CreateUserPayload>(event);

  try {
    const response = await axios.post<CreateUserResponse>(
      `${configService.BFF_API}/api/users`,
      payload,
    );

    const token = response.data.token;

    setCookie(event, "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
      path: "/",
    });

    return {
      username: response.data.username,
      storage: response.data.storage,
      elo: response.data.stats.elo,
      money: response.data.stats.money,
      total_games: response.data.stats.total_games,
    };
  } catch (error) {
    const err = error as AxiosError<BffErrorResponse>;

    if (err.response) {
      throw createError({
        statusCode: err.response.status,
        statusMessage:
          AuthErrorTranslator.translate(err.response.data?.message) || "Translate Error fail",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
