import { request } from "undici";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/handleError.js";
import type {
  CreatePlayerPayload,
  FindOnePlayerPayload,
} from "../models/dto/payloads/player/index.js";
import type {
  CreatePlayerResponse,
  FindOnePlayerResponse,
  UpdateIsBenchResponse,
} from "../models/dto/responses/player/index.js";
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
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);
      
      return (await body.json()) as CreatePlayerResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findOnePlayer(
    payload: FindOnePlayerPayload,
  ): Promise<FindOnePlayerResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.generatePlayerEndpoint}/?id=${payload.id}`;
      const { body, statusCode } = await request(url, {
        method: "GET",
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      return (await body.json()) as FindOnePlayerResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async updateIsBench(
    accessToken: string,
    payload: { id: string; isBench: boolean },
  ): Promise<UpdateIsBenchResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.generatePlayerEndpoint}/${payload.id}`;
      const { body, statusCode } = await request(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBench: payload.isBench }),
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      return (await body.json()) as UpdateIsBenchResponse;
    } catch (error) {
      return handleError(error);
    }
  }
}