import axios from "axios";
import { configService, handleError } from "../helpers/index.js";
import type {
    CreatePlayerPayload,
} from "../dto/payloads/player/index.ts";
import {
  AuthError,
  ValidationError,
  ConflictError,
  NotFoundError,
  ServiceUnavailableError,
} from "../errors/index.js";
import type {
    CreatePlayerResponse,
} from "../dto/responses/player/index.ts";
import type { NormalizedError } from "../dto/errors/index.js";

export class PlayerClient {
    private readonly generatePlayerEndpoint = "/player";

    private CRUD_API: string;

    constructor() {
        this.CRUD_API = configService.CRUD_API || "error";
    }

    public async createPlayer(
        accessToken: string,
        payload: CreatePlayerPayload
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