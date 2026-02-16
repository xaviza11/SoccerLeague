import { request } from "undici";
import { configService, handleError } from "../../common/helpers/index.js";
import {
  validateEmail,
  validatePassword,
} from "../../common/validators/index.js";
import {
  AuthError,
  BadRequestError,
  ValidationError,
} from "../../common/errors/index.js";
import type {
  UserRegistrationPayload,
  UserLoginPayload,
  UserDeleteOnePayload,
  FindAllPayload,
} from "./payloads.js";
import type {
  UserRegistrationResponse,
  UserLoginResponse,
  UserDeleteOneResponse,
  UserFindOneResponse,
} from "./responses.js";
import type { NormalizedError } from "../../models/dto/errors/index.js";
import type { User } from "../../models/dto/utils/matchMaker/MatchMaker.js";

export class UsersClient {
  private registrationEndpoint = "/users";
  private loginEndpoint = "/users/login";
  private findSelfUser = "/users/me";
  private userDeleteEndpoint = "/users/";
  private findAllEndpoint = "/users/all";
  private findOpponentEndpoint = "/users/search/id";

  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async create(
    payload: UserRegistrationPayload,
  ): Promise<UserRegistrationResponse | NormalizedError> {
    try {
      if (payload.name.length === 0)
        throw new ValidationError("Name must have at least one character");
      if (!validateEmail(payload.email))
        throw new ValidationError("Invalid Email");
      if (!validatePassword(payload.password))
        throw new ValidationError("Invalid Password");

      const url = `${this.CRUD_API}${this.registrationEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }
      
      return (await body.json()) as UserRegistrationResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }

  public async login(
    payload: UserLoginPayload,
  ): Promise<UserLoginResponse | NormalizedError> {
    try {
      if (!validateEmail(payload.email))
        throw new ValidationError("Invalid Email");
      if (!validatePassword(payload.password))
        throw new ValidationError("Invalid Password");

      const url = `${this.CRUD_API}${this.loginEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      return (await body.json()) as NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findMe(
    token: string,
  ): Promise<UserFindOneResponse | NormalizedError> {
    try {
      if (!token) throw new AuthError("Missing auth token");

      const url = `${this.CRUD_API}${this.findSelfUser}`;
      const { body, statusCode } = await request(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      return (await body.json()) as UserFindOneResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findOpponent(
    id: string,
    token: string,
  ): Promise<UserFindOneResponse | NormalizedError> {
    try {
      if (!token) throw new AuthError("Missing auth token");
      if (!id) throw new BadRequestError("Missing id");

      const url = `${this.CRUD_API}${this.findOpponentEndpoint}/${id}`;
      const { body, statusCode } = await request(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      return (await body.json()) as UserFindOneResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findAll(
    payload: FindAllPayload
  ): Promise<User[] | NormalizedError> {
    try {
      const query = new URLSearchParams({
        page: payload.page.toString(),
        pageSize: payload.pageSize.toString(),
      }).toString();

      const url = `${this.CRUD_API}${this.findAllEndpoint}?${query}`;

      const { body, statusCode } = await request(url, {
        method: "GET",
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      return (await body.json()) as User[] | NormalizedError;
    } catch (error: any) {
      return handleError(error)
    }
  }

  public async deleteOne(
    token: string,
    payload: UserDeleteOnePayload,
  ): Promise<UserDeleteOneResponse | NormalizedError> {
    try {
      if (!validatePassword(payload.currentPassword)) {
        throw new ValidationError("Invalid Password");
      }

      const url = `${this.CRUD_API}${this.userDeleteEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword: payload.currentPassword }),
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      return (await body.json()) as UserDeleteOneResponse | NormalizedError;
    } catch (error) {
      return handleError(error);
    }
  }
}
