import { request } from "undici";
import { configService } from "../../../envConfig.js";
import { handleError } from "../../common/helpers/handleError.js";
import { isUUID } from "../../common/validators/uuid.js";
import { ValidationError } from "../../common/errors/validation.js";
import type { DeleteUsersGameStatsPayload, RetrieveLeaderBoardPayload, GetUserRankingPayload } from "./payloads.js";
import type {
  CreateUsersGameStatsResponse,
  GetLeaderBoardResponse,
  GetUserRankingResponse
} from "./responses.js";
import type { NormalizedError } from "../../models/dto/errors/index.js";

export class UsersGameStatsClient {
  private createEndpoint = "/users-game-stats";
  private deleteEndpoint = "/users-game-stats";
  private leaderboardEndpoint = "/users-game-stats/ranking/leaderboard";
  private getUserRankingEndpoint = "/users-game-stats/ranking/rank";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async createStats(
    token: string,
  ): Promise<CreateUsersGameStatsResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.createEndpoint}`;

      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      const response = await body.json();

      return response as CreateUsersGameStatsResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }

  public async retrieveLeaderBoard(payload: RetrieveLeaderBoardPayload): Promise<GetLeaderBoardResponse | NormalizedError > {
    try {
      const url = `${this.CRUD_API}${this.leaderboardEndpoint}?page=${payload.page}&limit=${payload.limit}`;
      const { body, statusCode } = await request(url);

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      const response = await body.json();

      return response as GetLeaderBoardResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }

  public async deleteStats(
    token: string,
    payload: DeleteUsersGameStatsPayload,
  ): Promise<NormalizedError | void> {
    if (!isUUID(payload.statsId)) throw new ValidationError("Invalid UUID");

    try {
      const url = `${this.CRUD_API}${this.deleteEndpoint}`;

      const { body, statusCode } = await request(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statsId: payload.statsId,
        }),
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      await body.dump();
    } catch (error) {
      return handleError(error);
    }
  }

  public async getUserRanking(
    payload: GetUserRankingPayload,
  ): Promise<GetUserRankingResponse | NormalizedError | undefined> {
    try {
      if (!isUUID(payload.userId)) throw new ValidationError("Invalid UUID");

      const url = `${this.CRUD_API}${this.getUserRankingEndpoint}/${payload.userId}`;
      const { body, statusCode } = await request(url);

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      const response = await body.json();

      return response as GetUserRankingResponse | NormalizedError;
    } catch (error) {
      handleError(error);
    }
  }
}
