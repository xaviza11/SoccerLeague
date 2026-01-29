import axios from "axios";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/handleError.js";
import type { CreateGamePayload } from "../models/dto/payloads/game/index.js";
import type { CreateGameResponse } from "../models/dto/responses/game/index.js";


export class GameClient {
  private readonly gameEndpoint = "/game";
  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async create(payload: CreateGamePayload): Promise<any> {
    try {
      const url = `${this.CRUD_API}${this.gameEndpoint}`;
      const response = await axios.post<CreateGameResponse>(url, { payload });
      response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}
