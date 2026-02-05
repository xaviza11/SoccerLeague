import { request } from "undici";
import { isUUID } from "../common/validators/index.js";
import { configService, handleError } from "../common/helpers/index.js";
import { ValidationError } from "../common/errors/index.js";
import type { CreateTeamResponse } from "../models/dto/responses/teams/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";
import type {
  UpdateTeamPayload,
  DeleteTeamPayload,
  GetTeamPayload,
} from "../models/dto/payloads/team/index.js";
import type {
  UpdateTeamResponse,
  GetTeamResponse,
} from "../models/dto/responses/teams/index.js";

export interface UpdateLineupPlayer {
  id: string;
  isBench: boolean;
}

export interface UpdateLineupPayload {
  teamId: string;
  players: UpdateLineupPlayer[];
}

export interface UpdateLineupResponse {
  message: string;
}

export class TeamsClient {
  private readonly baseEndpoint = "/teams";
  private readonly updateTeamEndpoint = "/teams/update";
  private CRUD_API: string;

  constructor() {
    this.CRUD_API = configService.CRUD_API || "error";
  }

  public async createTeam(
    token: string,
  ): Promise<NormalizedError | CreateTeamResponse> {
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

      return (await body.json()) as CreateTeamResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async updateTeam(
    token: string,
    teamId: string,
    payload: UpdateTeamPayload,
  ): Promise<NormalizedError | UpdateTeamResponse> {
    try {
      if (!isUUID(teamId)) throw new ValidationError("Invalid team ID");

      const url = `${this.CRUD_API}${this.updateTeamEndpoint}/${teamId}`;
      const { body, statusCode } = await request(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      return (await body.json()) as UpdateTeamResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async getTeam(
    token: string,
    payload: GetTeamPayload,
  ): Promise<NormalizedError | GetTeamResponse> {
    try {
      if (!isUUID(payload.teamId)) throw new ValidationError("Invalid team ID");

      const url = `${this.CRUD_API}${this.baseEndpoint}/${payload.teamId}`;
      const { body, statusCode } = await request(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      return (await body.json()) as GetTeamResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async deleteTeam(
    token: string,
    payload: DeleteTeamPayload,
  ): Promise<NormalizedError | void> {
    try {
      if (!isUUID(payload.teamId)) throw new ValidationError("Invalid team ID");

      const url = `${this.CRUD_API}${this.baseEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId: payload.teamId }),
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);
      
      await body.dump();
    } catch (error) {
      return handleError(error);
    }
  }

  public async updateLineup(
    token: string,
    payload: UpdateLineupPayload,
  ): Promise<UpdateLineupResponse | NormalizedError> {
    try {
      if (!payload.teamId) throw new ValidationError("teamId is required");
      if (!payload.players || !Array.isArray(payload.players) || payload.players.length === 0) {
        throw new ValidationError("players payload must be a non-empty array");
      }

      const url = `${this.CRUD_API}${this.baseEndpoint}`;
      const { body, statusCode } = await request(url, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (statusCode >= 400) throw new Error(`HTTP Error: ${statusCode}`);

      return (await body.json()) as UpdateLineupResponse;
    } catch (error) {
      return handleError(error);
    }
  }
}