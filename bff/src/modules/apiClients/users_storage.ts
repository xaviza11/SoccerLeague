import { request } from "undici";
import { isUUID } from "../common/validators/uuid.js";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/index.js";
import { ValidationError } from "../common/errors/index.js";
import type {
  DeleteUsersStoragePayload,
  FindOneUsersStoragePayload,
} from "../models/dto/payloads/users_storage/index.js";
import type {
  CreateUsersStorageResponse,
  FindOneUsersStorageResponse,
} from "../models/dto/responses/users_storage/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";

export class UsersStorageClient {
  private baseEndpoint = "/users-storage";
  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async createStorage(
    token: string,
  ): Promise<NormalizedError | CreateUsersStorageResponse> {
    try {
      const url = `${this.CRUD_API}${this.baseEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      return (await body.json()) as CreateUsersStorageResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findOne(
    token: string,
    payload: FindOneUsersStoragePayload,
  ): Promise<FindOneUsersStorageResponse | NormalizedError> {
    try {
      const { storageId } = payload;
      if (!isUUID(storageId)) {
        throw new ValidationError("Invalid UUID format for storage ID");
      }

      const url = `${this.CRUD_API}${this.baseEndpoint}/${storageId}`;
      const { body, statusCode } = await request(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      return (await body.json()) as FindOneUsersStorageResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async deleteStorage(
    token: string,
    payload: DeleteUsersStoragePayload,
  ): Promise<void | NormalizedError> {
    try {
      if (!isUUID(payload.storageId)) {
        throw new ValidationError("Invalid ID");
      }

      const url = `${this.CRUD_API}${this.baseEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storageId: payload.storageId,
        }),
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      await body.dump();
    } catch (error) {
      return handleError(error);
    }
  }
}