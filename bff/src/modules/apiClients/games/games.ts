import { Pool } from "undici";
import type { Match } from "../../models/dto/utils/matchMaker/MatchMaker.js";
import { handleError } from "../../common/helpers/handleError.js";
import type { NormalizedError } from "../../models/dto/errors/index.js";
import type { RetrieveUserGameResponse } from "./responses.js";

export class GamesClient {
  private readonly gameEndpoint = "/game/create/many";
  private readonly retrieveUserGameEndpoint = "/game/user";

  private CRUD_API: string;
  private client: Pool;

  constructor() {
    this.CRUD_API = process.env.CRUD_API as string;

    // Create persistent pool of connections
    this.client = new Pool(this.CRUD_API, {
      connections: 75, // Number of simultaneous connections
      pipelining: 15, // Send multiple connections
      keepAliveTimeout: 240000, // Let the connection open
    });
  }

  public async retrieveUserGame(accessToken: string): Promise<RetrieveUserGameResponse | NormalizedError | undefined> {
    try {
      const { statusCode, body } = await this.client.request({
        path: this.retrieveUserGameEndpoint,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      const response = await body.json();

      return response as RetrieveUserGameResponse | NormalizedError;
    } catch (error) {
      handleError(error);
    }
  }

  /*public async createMatches(games: Match[]): Promise<any> {
    try {
      const { statusCode, body } = await this.client.request({
        path: this.gameEndpoint,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(games),
      });

      if (statusCode !== 200 && statusCode !== 201) {
        throw new Error(`HTTP ${statusCode}`);
      }

      return await body.json();
    } catch (error: any) {
      console.error(`Error sending ${games.length} games:`, error.message);
      throw error;
    }
  }

  public async close() {
    await this.client.close();
  }*/
}
