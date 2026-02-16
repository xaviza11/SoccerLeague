import { request } from "undici";
import { configService } from "../../../envConfig.js";
import { handleError } from "../../common/helpers/handleError.js";
import type {
  CreatePlayerPayload,
  FindOnePlayerPayload,
  UpdateIsBenchPayload,
} from "./payloads.js";
import type { CreatePlayerResponse, FindOnePlayerResponse, UpdateIsBenchResponse } from "./responses.js";
import type { NormalizedError } from "../../models/dto/errors/index.js";

export class PlayersClient {
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

      const response = await body.json();
      
      return response as CreatePlayerResponse | NormalizedError;
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

      const response = await body.json();

      return response as FindOnePlayerResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }

  public async updateIsBench(
    accessToken: string,
    payload: UpdateIsBenchPayload,
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

      const response = await body.json();

      return response as UpdateIsBenchResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }
}