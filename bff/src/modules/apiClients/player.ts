import axios from "axios";
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

  public async findOnePlayer(
    payload: FindOnePlayerPayload,
  ): Promise<FindOnePlayerResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.generatePlayerEndpoint}/?id=${payload.id}}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async updateIsBench(
    accessToken: string,
    payload: {
      id: string;
      isBench: boolean;
    },
  ): Promise<UpdateIsBenchResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.generatePlayerEndpoint}/${payload.id}`;
      const response = await axios.put<UpdateIsBenchResponse>(
        url,
        { isBench: payload.isBench },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}
