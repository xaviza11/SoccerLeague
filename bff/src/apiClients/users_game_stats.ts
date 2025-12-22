import axios from "axios";

import { isUUID } from "../validators/uuid.js";
import { configService, handleError } from "../helpers/index.js";
import type {} from "../dto/payloads/users_storage/index.js";
import type { CreateUsersGameStatsResponse } from "../dto/responses/users_game_stats/index.js";
import type { NormalizedError } from "../dto/errors/index.js";
import {
  ConflictError,
  AuthError,
  ValidationError,
  NotFoundError,
  ServiceUnavailableError,
} from "../errors/index.js";

export class UsersGameStatsClient {
  private createEndpoint = "/users-game-stats";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async createStats(
    token: string
  ): Promise<CreateUsersGameStatsResponse | NormalizedError> {
    try {
      const response = await axios.post<CreateUsersGameStatsResponse>(
        `${this.CRUD_API}${this.createEndpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}
