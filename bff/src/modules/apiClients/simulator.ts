import axios from "axios";
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
      const url = `${this.SIMULATOR_API}${this.simulatePlayerEndpoint}`;
      const response = await axios.get<GeneratePlayerResponse>(
        `${url}?position=${payload.position}&target_avr=${payload.target_avr}`,
      );
      return response.data;
    } catch (err: any) {
      console.error("Axios error:", {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });

      return handleError(err);
    }
  }

  public async simulateGame(
    payload: SimulateMatchPayload,
  ): Promise<GenerateGameResponse | NormalizedError> {
    try {
      const url = `${this.SIMULATOR_API}${this.simulateGameEndpoint}`;
      const response = await axios.post<SimulateMatchPayload>(url, payload);
      return response.data;
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

        if ("error" in player) {
          throw new Error(`Error generating player for ${pos.position}: ${player.error}`);
        }

        allPlayers.push(player);
      }
    }

    const players = allPlayers.filter((_, index) => index % 2 === 0);
    const bench_players = allPlayers.filter((_, index) => index % 2 !== 0);

    return { players, bench_players };
  }
}
