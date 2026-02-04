import { Pool } from "undici";
import type { Match } from "../models/dto/utils/matchMaker/MatchMaker.js";

export class GameClient {
  private readonly gameEndpoint = "/game/create/many";
  private CRUD_API: string;
  private client: Pool;

  constructor() {
    this.CRUD_API = process.env.CRUD_API || "http://localhost:3000";
    
    // Create persistent pool of connections
    this.client = new Pool(this.CRUD_API, {
      connections: 75, // Number of simultaneous connections
      pipelining: 15,  // Send multiple connections
      keepAliveTimeout: 240000, // Let the connection open
    });
  }

  public async createMatches(games: Match[]): Promise<any> {
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
  }
}