import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class SimulatorApiClient {
  private readonly baseUrl = process.env.SIMULATOR_API;

  public async simulateGame(payload: any) {
    if (!this.baseUrl) {
      throw new InternalServerErrorException("SIMULATOR_API env var is not defined");
    }

    try {
      const response = await fetch(`${this.baseUrl}/game/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Rust Server Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
        return error.message
    }
  }
}

export default SimulatorApiClient;