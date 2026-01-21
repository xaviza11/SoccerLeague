import axios, { AxiosError } from "axios";
import { configService } from "../../../env.config";
import { TeamTranslator } from "../../utils/translator";

interface GameDataResponse {
  position_change_cards: any[];
  cards: any[];
  team: {
    id: string;
    name: string;
    players: any[];
    storage: {
      id: string;
    };
    auras: any[];
  };
}

interface BffErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "token");

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    const response = await axios.get<GameDataResponse>(`${configService.BFF_API}/api/game-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<BffErrorResponse>;

    if (err.response) {
      throw createError({
        statusCode: err.response.status,
        statusMessage: TeamTranslator.translate(err.response.data?.message) || "Translate Error fail",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
