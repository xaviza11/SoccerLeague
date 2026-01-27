import axios from "axios";

import { isUUID } from "../common/validators/index.js";
import { configService, handleError } from "../common/helpers/index.js";
import type { CreateTeamResponse } from "../models/dto/responses/teams/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";
import { ValidationError } from "../common/errors/index.js";
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
      const response = await axios.post<CreateTeamResponse>(
        `${this.CRUD_API}${this.baseEndpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
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
      if (!isUUID(teamId)) {
        throw new ValidationError("Invalid team ID");
      }

      const response = await axios.put<UpdateTeamResponse>(
        `${this.CRUD_API}${this.updateTeamEndpoint}/${teamId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async getTeam(
    token: string,
    payload: GetTeamPayload,
  ): Promise<NormalizedError | GetTeamResponse> {
    try {
      if (!isUUID(payload.teamId)) {
        throw new ValidationError("Invalid team ID");
      }

      const response = await axios.get<GetTeamResponse>(
        `${this.CRUD_API}${this.baseEndpoint}/${payload.teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  public async deleteTeam(
    token: string,
    payload: DeleteTeamPayload,
  ): Promise<NormalizedError | void> {
    try {
      if (!isUUID(payload.teamId)) {
        throw new ValidationError("Invalid team ID");
      }

      await axios.delete(`${this.CRUD_API}${this.baseEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { teamId: payload.teamId },
      });
    } catch (error) {
      return handleError(error);
    }
  }

  public async updateLineup(
    token: string,
    payload: UpdateLineupPayload,
  ): Promise<UpdateLineupResponse | NormalizedError> {
    try {
      if (!payload.teamId) {
        throw new ValidationError("teamId is required");
      }

      if (
        !payload.players ||
        !Array.isArray(payload.players) ||
        payload.players.length === 0
      ) {
        throw new ValidationError("players payload must be a non-empty array");
      }

      const url = `${this.CRUD_API}${this.baseEndpoint}`;
      const response = await axios.put<UpdateLineupResponse>(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
}
