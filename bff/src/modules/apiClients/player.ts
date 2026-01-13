import axios from "axios";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/handleError.js";
import type { CreatePlayerPayload } from "../models/dto/payloads/player/index.js";
import type { CreatePlayerResponse } from "../models/dto/responses/player/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";

export class PlayerClient {
  private readonly generatePlayerEndpoint = "/player";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async createPlayer(
    accessToken: string,
    payload: CreatePlayerPayload,
  ): Promise<CreatePlayerResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.generatePlayerEndpoint}`;
      const response = await axios.post<CreatePlayerResponse>(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}
