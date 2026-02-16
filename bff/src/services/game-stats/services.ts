import { UsersGameStatsClient } from "../../modules/apiClients/users_game_stats/users_game_stats.js";
import {
  AuthError,
  ServiceUnavailableError,
  UnprocessableEntityError,
  ForbiddenError,
  BadRequestError,
} from "../../modules/common/errors/index.js";
import type { RetrieveLeaderBoardPayload, GetUserRankingPayload } from "./payloads.js";

export class GameStatsServices {
  private gameStatsClient = new UsersGameStatsClient();

  async retrieveLeaderboard(payload: RetrieveLeaderBoardPayload) {
    if (!payload.page) {
      throw new BadRequestError("Page must be defined");
    }

    if (payload.page < 1) {
      throw new BadRequestError("Page must be bigger than 0");
    }

    const result = await this.gameStatsClient.retrieveLeaderBoard({
      page: payload.page,
      limit: payload.limit,
    }
    );

    if ("statusCode" in result) {
      if (result.statusCode !== 200) {
        throw new ServiceUnavailableError("Unexpected error"); //todo: change this error
      }
    }

    return result;
  }

  async getUserRanking(payload: GetUserRankingPayload) {
    if (!payload.userId) {
      throw new BadRequestError("User ID must be defined");
    }
    const result = await this.gameStatsClient.getUserRanking({userId: payload.userId});

    if ("statusCode" in result!) {
      if (result.statusCode !== 200) {
        throw new ServiceUnavailableError("Unexpected error"); //todo: change this error
      }
    }

    return result;
  }
}
