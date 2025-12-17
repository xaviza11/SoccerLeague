import axios from "axios";
import { configService, handleError } from "../helpers/index.js";
import type {
  GeneratePlayerPayload,
  SimulateMatchPayload,
} from "../dto/payloads/simulator/index.js";
import {
  AuthError,
  ValidationError,
  ConflictError,
  NotFoundError,
  ServiceUnavailableError,
} from "../errors/index.js";
import type { GeneratePlayerResponse, GenerateGameResponse  } from "../dto/responses/simulator/index.js"
import type { NormalizedError } from "../dto/errors/index.js";

export class Simulator {
  private readonly simulatePlayerEndpoint = "/player/generate";
  private readonly simulateGameEndpoint = "/game/simulate";

  private SIMULATOR_API: string;

  constructor() {
    this.SIMULATOR_API = configService.SIMULATOR_API || "error";
  }

  public async generatePlayer(payload: GeneratePlayerPayload): Promise<GeneratePlayerResponse | NormalizedError> {
    try {
    const url = `${this.SIMULATOR_API}${this.simulatePlayerEndpoint}`
    const response = await axios.get<GeneratePlayerResponse>(`${url}?position=${payload.position}&target_avr=${payload.target_avr}`)
    return response.data
    } catch(error) {
      return handleError(error)
    }
  }

  public async simulateGame(payload: SimulateMatchPayload): Promise<GenerateGameResponse | NormalizedError> {
    try {
      const url = `${this.SIMULATOR_API}${this.simulateGameEndpoint}`
      const response = await axios.post<SimulateMatchPayload>(url, payload)
      return response.data
    } catch(error) {
      return handleError(error)
    }
  }
}
