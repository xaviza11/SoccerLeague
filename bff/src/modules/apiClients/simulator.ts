import { request } from "undici";
import { configService } from "../../envConfig.js";
import { handleError } from "../common/helpers/index.js";
import type {
  GeneratePlayerPayload,
  SimulateMatchPayload,
} from "../models/dto/payloads/simulator/index.js";
import type {
  GeneratePlayerResponse,
  GenerateGameResponse,
} from "../models/dto/responses/simulator/index.js";
import type { NormalizedError } from "../models/dto/errors/index.js";
import type Position from "../models/enums/positions.js";

export class SimulatorClient {
  private readonly simulatePlayerEndpoint = "/player/generate";
  private readonly simulateGameEndpoint = "/game/simulate";

  private SIMULATOR_API: string;

  constructor() {
    this.SIMULATOR_API = configService.SIMULATOR_API || "error";
  }

  public async generatePlayer(
    payload: GeneratePlayerPayload,
  ): Promise<GeneratePlayerResponse | NormalizedError> {
    try {
      const query = new URLSearchParams({
        position: payload.position,
        target_avr: payload.target_avr.toString(),
      }).toString();

      const url = `${this.SIMULATOR_API}${this.simulatePlayerEndpoint}?${query}`;
      
      const { body, statusCode } = await request(url, {
        method: "GET",
      });

      if (statusCode >= 400) {
        throw new Error(`HTTP Error: ${statusCode}`);
      }

      return (await body.json()) as GeneratePlayerResponse;
    } catch (err: any) {
      console.error("Undici request error:", err.message);
      return handleError(err);
    }
  }

  public async simulateGame(
    payload: SimulateMatchPayload,
  ): Promise<GenerateGameResponse | NormalizedError> {
    try {
      const url = `${this.SIMULATOR_API}${this.simulateGameEndpoint}`;
      
      const { body, statusCode } = await request(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (statusCode >= 400) {
        throw new Error(`HTTP Error: ${statusCode}`);
      }

      return (await body.json()) as GenerateGameResponse;
    } catch (error) {
      return handleError(error);
    }
  }

  public async generateTeam(target_avr: number = 55): Promise<{
    players: GeneratePlayerResponse[];
    bench_players: GeneratePlayerResponse[];
  }> {
    const formation = [
      { position: "Goalkeeper", count: 2 },
      { position: "Defender", count: 4 },
      { position: "Left_Back", count: 2 },
      { position: "Right_Back", count: 2 },
      { position: "Defensive_Midfield", count: 2 },
      { position: "Midfielder", count: 4 },
      { position: "Left_Wing", count: 2 },
      { position: "Right_Wing", count: 2 },
      { position: "Striker", count: 2 },
    ];

    const allPlayers: GeneratePlayerResponse[] = [];

    for (const pos of formation) {
      for (let i = 0; i < pos.count; i++) {
        const payload: GeneratePlayerPayload = {
          position: pos.position as Position,
          target_avr,
        };

        const player = await this.generatePlayer(payload);

        if ("error" in (player as object)) {
          throw new Error(`Error generating player for ${pos.position}: ${(player as NormalizedError).error}`);
        }

        allPlayers.push(player as GeneratePlayerResponse);
      }
    }

    const players = allPlayers.filter((_, index) => index % 2 === 0);
    const bench_players = allPlayers.filter((_, index) => index % 2 !== 0);

    return { players, bench_players };
  }
}