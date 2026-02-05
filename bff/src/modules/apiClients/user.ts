import { request } from "undici";
import { configService, handleError } from "../common/helpers/index.js";
import { validateEmail, validatePassword } from "../common/validators/index.js";
import { AuthError, ValidationError } from "../common/errors/index.js";
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
} from "../models/dto/responses/user/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";
import type { User } from "../models/dto/utils/matchMaker/MatchMaker.js";

export class UserClient {
  private registrationEndpoint = "/users";
  private loginEndpoint = "/users/login";
  private findSelfUser = "/users/me";
  private userDeleteEndpoint = "/users/";
  private findAllEndpoint = "/users/all";
  
  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async create(
    payload: UserRegistrationPayload,
  ): Promise<UserRegistrationResponse | NormalizedError> {
    try {
      if (payload.name.length === 0) throw new ValidationError("Name must have at least one character");
      if (!validateEmail(payload.email)) throw new ValidationError("Invalid Email");
      if (!validatePassword(payload.password)) throw new ValidationError("Invalid Password");

      const url = `${this.CRUD_API}${this.registrationEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (statusCode >= 400) throw new Error(`HTTP ${statusCode}`);
      return (await body.json()) as UserRegistrationResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async login(
    payload: UserLoginPayload,
  ): Promise<UserLoginResponse | NormalizedError> {
    try {
      if (!validateEmail(payload.email)) throw new ValidationError("Invalid Email");
      if (!validatePassword(payload.password)) throw new ValidationError("Invalid Password");

      const url = `${this.CRUD_API}${this.loginEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (statusCode >= 400) throw new Error(`HTTP ${statusCode}`);
      return (await body.json()) as UserLoginResponse;
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

      if (statusCode >= 400) throw new Error(`HTTP ${statusCode}`);
      return (await body.json()) as UserFindOneResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async findAll(
    page: number = 0,
    pageSize: number = 50,
  ): Promise<User[]> {
    try {
      const query = new URLSearchParams({ 
        page: page.toString(), 
        pageSize: pageSize.toString() 
      }).toString();
      
      const url = `${this.CRUD_API}${this.findAllEndpoint}?${query}`;
      
      const { body, statusCode } = await request(url, {
        method: "GET",
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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword: payload.currentPassword }),
      });

      if (statusCode >= 400) throw new Error(`HTTP ${statusCode}`);
      return (await body.json()) as UserDeleteOneResponse;
    } catch (error) {
      return handleError(error);
    }
  }
}