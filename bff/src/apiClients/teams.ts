import axios from "axios";

import { isUUID } from "../validators/uuid.js";
import { configService, handleError } from "../helpers/index.js";
import type { CreateTeamResponse } from "../dto/responses/teams/index.js";
import type { NormalizedError } from "../dto/errors/index.js";
import {
  ConflictError,
  AuthError,
  ValidationError,
  NotFoundError,
  ServiceUnavailableError,
} from "../errors/index.js";
import type { UpdateTeamPayload, DeleteTeamPayload } from "../dto/payloads/team/index.js";
import type { UpdateTeamResponse } from "../dto/responses/teams/index.js";

export class TeamsClient {
    private readonly baseEndpoint = "/teams"
    private readonly updateTeamEndpoint = "/teams/update"

    private CRUD_API: string;
    
    constructor() {
        this.CRUD_API = configService.CRUD_API || "error";
    } 

    public async createTeam(
        token: string
    ): Promise<NormalizedError | CreateTeamResponse> {
        try {
            const response = await axios.post<CreateTeamResponse>(
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

   public async updateTeam(
    token: string,
    teamId: string,
    payload: UpdateTeamPayload
  ): Promise<NormalizedError | UpdateTeamResponse> {
    try {
      if (!isUUID(teamId)) {
        throw new ValidationError('Invalid team ID');
      }

      const response = await axios.put<UpdateTeamResponse>(
        `${this.CRUD_API}${this.updateTeamEndpoint}/${teamId}`,
        payload,
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

  public async deleteTeam(
    token: string,
    payload: DeleteTeamPayload
  ): Promise<NormalizedError | void> {
    try {
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
}   