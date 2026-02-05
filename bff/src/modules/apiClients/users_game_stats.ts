import { request } from "undici";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/handleError.js";
import { isUUID } from "../common/validators/uuid.js";
import { ValidationError } from "../common/errors/validation.js";
import type { DeleteUsersGameStatsPayload } from "../models/dto/payloads/users_game_stats/index.js";
import type { CreateUsersGameStatsResponse } from "../models/dto/responses/users_game_stats/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";

export class UsersGameStatsClient {
  private createEndpoint = "/users-game-stats";
  private deleteEndpoint = "/users-game-stats";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async createStats(
    token: string
  ): Promise<CreateUsersGameStatsResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.createEndpoint}`;
      
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (statusCode >= 400) {
        throw new Error(`HTTP Error: ${statusCode}`);
      }

      return (await body.json()) as CreateUsersGameStatsResponse;
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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statsId: payload.statsId,
        }),
      });

      if (statusCode >= 400) {
        throw new Error(`HTTP Error: ${statusCode}`);
      }

      await body.dump();
    } catch (error) {
      return handleError(error);
    }
  }
}