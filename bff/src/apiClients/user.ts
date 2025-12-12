import axios from "axios";
import { isUUID } from "../validators/index.js";
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
  ): Promise<UserRegistrationResponse | undefined> {
    try {
      const url = `${this.CRUD_API}${this.registrationEndpoint}`;
      const response = await axios.post<UserRegistrationResponse>(url, payload);
      return response.data;
    } catch (error) {
      handleError(error)
      if(!error) throw new Error('handler contains error')
    }
  }

  public async login(payload: UserLoginPayload): Promise<UserLoginResponse> {
    try {
      const url = `${this.CRUD_API}${this.loginEndpoint}`;
      const response = await axios.post<UserLoginResponse>(url, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) throw error;
      if (error instanceof Error) throw error;
      throw new Error("Unexpected Error in CURD API - Login");
    }
  }

  public async update(payload: UserUpdatePayload): Promise<UserUpdatePayload> {
    try {
      const url = `${this.CRUD_API}${this.updateEndpoint}`;
      const response = await axios.put<UserUpdateResponse>(url, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) throw error;
      if (error instanceof Error) throw error;
      throw new Error("Unexpected Error in CRUD API - Update");
    }
  }

  public async findOne(
    payload: UserFindOnePayload
  ): Promise<UserFindOneResponse> {
    try {
      if (!isUUID(payload.id)) {
        throw new Error("Invalid ID format. Expected UUID");
      }

      const url = `${this.CRUD_API}${this.findOneEndpoint}${payload.id}`;
      const response = await axios.get<UserFindOneResponse>(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) throw error;
      if (error instanceof Error) throw error;
      throw new Error("Unexpected Error in CRUD API - FindOne");
    }
  }

  public async findAll(): Promise<UserFindAllResponse> {
    try {
      const url = `${this.CRUD_API}${this.findAllEndpoint}`;
      const response = await axios.get<UserFindAllResponse>(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) throw error;
      if (error instanceof Error) throw error;
      throw new Error("Unexpected Error in CRUD API - FindAll");
    }
  }

  public async findByName(
    payload: UserFindByNamePayload
  ): Promise<UserFindByNameResponse> {
    try {
      const url = `${this.CRUD_API}${this.findByNameEndpoint}${payload.name}`;
      const response = await axios.get<UserFindByNameResponse>(url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) throw error;
      if (error instanceof Error) throw error;
      throw new Error("Unexpected Error in CRUD API - FindByName");
    }
  }

  public async deleteOne(
    payload: UserDeleteOnePayload
  ): Promise<UserDeleteOneResponse> {
    try {
      const url = `${this.CRUD_API}${this.userDeleteEndpoint}`;
      const response = await axios.delete<UserDeleteOneResponse>(url, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) throw error;
      if (error instanceof Error) throw error;
      throw new Error("Unexpected Error in CRUD API - DeleteOne");
    }
  }
}
