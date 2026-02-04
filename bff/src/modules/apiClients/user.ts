import axios from "axios";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/index.js";
import type {
  UserRegistrationPayload,
  UserLoginPayload,
  UserDeleteOnePayload,
} from "../models/dto/payloads/user/index.js";
import type {
  UserRegistrationResponse,
  UserLoginResponse,
  UserDeleteOneResponse,
  UserFindOneResponse,
  UserFindAllResponse,
} from "../models/dto/responses/user/index.js";
import { validateEmail, validatePassword } from "../common/validators/index.js";
import { AuthError, ValidationError } from "../common/errors/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";
import { request, Pool } from "undici";
import type { User } from "../models/dto/utils/matchMaker/MatchMaker.js";

export class UserClient {
  private registrationEndpoint = "/users";
  private loginEndpoint = "/users/login";
  private updateEndpoint = "/users/";
  private findOneEndpoint = "/users/";
  private findByNameEndpoint = "/users/search/name/";
  private userDeleteEndpoint = "/users/";
  private findAllEndpoint = "/users/all";
  private findSelfUser = "/users/me";
  private client: Pool;

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
    this.client = new Pool(this.CRUD_API, {
      connections: 75, // Number of simultaneous connections opened.
      pipelining: 15, // Send multiple requests
      keepAliveTimeout: 240000, // Keep the connection opened.
    });
  }

  public async create(
    payload: UserRegistrationPayload,
  ): Promise<UserRegistrationResponse | NormalizedError> {
    try {
      if (payload.name.length === 0) {
        throw new ValidationError("Name must have almost one character");
      }

      if (!validateEmail(payload.email)) {
        throw new ValidationError("Invalid Email");
      }

      if (!validatePassword(payload.password)) {
        throw new ValidationError("Invalid Password");
      }

      const url = `${this.CRUD_API}${this.registrationEndpoint}`;
      const response = await axios.post<UserRegistrationResponse>(url, payload);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async login(
    payload: UserLoginPayload,
  ): Promise<UserLoginResponse | NormalizedError> {
    try {
      if (!validateEmail(payload.email)) {
        throw new ValidationError("Invalid Email");
      }

      if (!validatePassword(payload.password)) {
        throw new ValidationError("Invalid Password");
      }

      const url = `${this.CRUD_API}${this.loginEndpoint}`;
      const response = await axios.post<UserLoginResponse>(url, payload);

      const data = response.data;

      return data;
    } catch (error) {
      return handleError(error);
    }
  }

  /*public async update(
    payload: UserUpdatePayload
  ): Promise<UserUpdateResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.updateEndpoint}`;
      const response = await axios.put<UserUpdateResponse>(url, payload);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }*/

  /*public async findOne(
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
  }*/

  public async findMe(
    token: string,
  ): Promise<UserFindOneResponse | NormalizedError> {
    try {
      if (!token) {
        throw new AuthError("Missing auth token");
      }

      const url = `${this.CRUD_API}${this.findSelfUser}`;

      const response = await axios.get<UserFindOneResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findAll(
    page: number = 0,
    pageSize: number = 50,
  ): Promise<User[]> {
    try {
      const { statusCode, body } = await this.client.request({
        path: `${this.findAllEndpoint}`,
        method: "GET",
        query: { page, pageSize },
      });

      if (statusCode !== 200) {
        await body.dump();
        throw new Error(`HTTP ${statusCode}`);
      }

      return (await body.json()) as User[];
    } catch (error: any) {
      console.error(`Error fetching page ${page}:`, error.message);
      throw error;
    }
  }

  /*public async findByName(
    payload: UserFindByNamePayload
  ): Promise<UserFindByNameResponse | NormalizedError> {
    try {
      const url = `${this.CRUD_API}${this.findByNameEndpoint}${payload.name}`;
      const response = await axios.get<UserFindByNameResponse>(url);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }*/

  public async deleteOne(
    token: string,
    payload: UserDeleteOnePayload,
  ): Promise<UserDeleteOneResponse | NormalizedError> {
    if (!validatePassword(payload.currentPassword)) {
      throw new ValidationError("Invalid Password");
    }

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

  public async close() {
    await this.client.close();
  }
}
