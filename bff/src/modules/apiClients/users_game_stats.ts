import axios from "axios";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/handleError.js";
import type { DeleteUsersGameStatsPayload } from "../models/dto/payloads/users_game_stats/index.js";
import type { CreateUsersGameStatsResponse } from "../models/dto/responses/users_game_stats/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";
import { isUUID } from "../common/validators/uuid.js";
import { ValidationError } from "../common/errors/validation.js";

export class UsersGameStatsClient {
  private createEndpoint = "/users-game-stats";
  private deleteEndpoint = "/users-game-stats";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async createStats(token: string): Promise<CreateUsersGameStatsResponse | NormalizedError> {
    try {
      const response = await axios.post<CreateUsersGameStatsResponse>(
        `${this.CRUD_API}${this.createEndpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async deleteStats(
    token: string,
    payload: DeleteUsersGameStatsPayload,
  ): Promise<NormalizedError | void> {

    if(!isUUID(payload.statsId)) throw new ValidationError('Invalid UUID')

    try {
      await axios.delete(`${this.CRUD_API}${this.deleteEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          statsId: payload.statsId,
        },
      });
    } catch (error) {
      return handleError(error);
    }
  }
}
