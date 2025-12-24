import axios from "axios";
import {
  isUUID,
  validateEmail,
  validatePassword,
} from "../validators/index.js";
import { configService, handleError } from "../helpers/index.js";
import type {
  UserRegistrationPayload,
  UserLoginPayload,
  UserDeleteOnePayload,
  UserFindByNamePayload,
  UserFindOnePayload,
  UserUpdatePayload,
} from "../dto/payloads/user/index.js";
import type {
  UserRegistrationResponse,
  UserLoginResponse,
  UserDeleteOneResponse,
  UserFindByNameResponse,
  UserFindOneResponse,
  UserUpdateResponse,
  UserFindAllResponse,
} from "../dto/responses/user/index.js";
import { AuthError, ValidationError } from "../errors/index.js";
import type { NormalizedError } from "../dto/errors/index.js";
import { TokenCrypto } from "../helpers/index.js";

export class UserClient {
  private registrationEndpoint = "/users";
  private loginEndpoint = "/users/login";
  private updateEndpoint = "/users/";
  private findOneEndpoint = "/users/";
  private findByNameEndpoint = "/users/search/name/";
  private userDeleteEndpoint = "/users/";
  private findAllEndpoint = "/users";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async create(
    payload: UserRegistrationPayload
  ): Promise<UserRegistrationResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.registrationEndpoint}`;
      const response = await axios.post<UserRegistrationResponse>(url, payload);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async login(
    payload: UserLoginPayload
  ): Promise<UserLoginResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.loginEndpoint}`;
      const response = await axios.post<UserLoginResponse>(url, payload);

      const data = response.data;

      if (data?.accessToken) {
        data.accessToken = TokenCrypto.encrypt(data.accessToken);
      }

      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async update(
    payload: UserUpdatePayload
  ): Promise<UserUpdateResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.updateEndpoint}`;
      const response = await axios.put<UserUpdateResponse>(url, payload);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findOne(
    payload: UserFindOnePayload
  ): Promise<UserFindOneResponse | NormalizedError> {
    try {
      if (!isUUID(payload.id)) {
        throw new ValidationError("Invalid ID format. Expected UUID - BFF");
      }

      const url = `${this.CRUD_API}${this.findOneEndpoint}${payload.id}`;
      const response = await axios.get<UserFindOneResponse>(url);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findAll(): Promise<UserFindAllResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.findAllEndpoint}`;
      const response = await axios.get<UserFindAllResponse>(url);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findByName(
    payload: UserFindByNamePayload
  ): Promise<UserFindByNameResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.findByNameEndpoint}${payload.name}`;
      const response = await axios.get<UserFindByNameResponse>(url);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async deleteOne(
    token: string,
    payload: UserDeleteOnePayload
  ): Promise<UserDeleteOneResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.userDeleteEndpoint}`;
      const response = await axios.delete<UserDeleteOneResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { currentPassword: payload.currentPassword },
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}
