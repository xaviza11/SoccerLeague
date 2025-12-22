import axios from "axios";

import { isUUID } from "../validators/uuid.js";
import { configService, handleError } from "../helpers/index.js";
import type { addCardUsersStoragePayload, addPositionCardStoragePayload, addTeamStoragePayload } from "../dto/payloads/users_storage/index.js";
import type {CreateUsersStorageResponse} from "../dto/responses/users_storage/index.js";
import type { NormalizedError } from "../dto/errors/index.js";
import {
  ConflictError,
  AuthError,
  ValidationError,
  NotFoundError,
  ServiceUnavailableError,
} from "../errors/index.js";

export class UsersStorageClient {
  private baseEndpoint = "/users-storage";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

public async createStorage(
  token: string
): Promise<NormalizedError | CreateUsersStorageResponse> {
  try {
    const response = await axios.post(
      `${this.CRUD_API}${this.baseEndpoint}`,
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


  /*public async addCard(
    payload: addCardUsersStoragePayload
  ): Promise<addCardUsersStoragePayload | NormalizedError> {
    try {
      if (!isUUID(payload.id)) {
        throw new ValidationError("Invalid UUID format for storage ID");
      }

      const response = await axios.put(
        `${this.CRUD_API}${this.baseEndpoint}/cards`,
        payload
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async addPositionChangeCard(
    payload: addPositionCardStoragePayload
  ): Promise<addPositionCardStoragePayload | NormalizedError> {
    try {
      if (!isUUID(payload.id)) {
        throw new ValidationError("Invalid UUID format for storage ID");
      }

      const response = await axios.put(
        `${this.CRUD_API}${this.baseEndpoint}/positions-change`,
        payload
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async addTeam(
    payload: addTeamStoragePayload
  ): Promise<addTeamStoragePayload | NormalizedError> {
    try {
      if (!isUUID(payload.id)) {
        throw new ValidationError("Invalid UUID format for storage ID");
      }

      const response = await axios.put(
        `${this.CRUD_API}${this.baseEndpoint}/team`,
        payload
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async deleteStorage(
  ): Promise<DeleteUsersStorageResponse | NormalizedError> {
    try {
      const response = await axios.delete(
        `${this.CRUD_API}${this.baseEndpoint}`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findOne(
    id: string
  ): Promise<FindOneUsersStorageResponse | NormalizedError> {
    try {
      if (!isUUID(id)) {
        throw new ValidationError("Invalid UUID format for storage ID");
      }

      const response = await axios.get(
        `${this.CRUD_API}${this.baseEndpoint}/${id}`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findAll(): Promise<
    FindAllUsersStorageResponse | NormalizedError
  > {
    try {
      const response = await axios.get(
        `${this.CRUD_API}${this.baseEndpoint}/all`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }*/
}
