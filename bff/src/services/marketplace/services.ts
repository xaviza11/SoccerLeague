import { SimulatorClient, TeamsClient } from "../../modules/apiClients/index.js";
import {
  AuthError,
  ServiceUnavailableError,
  UnprocessableEntityError,
  ForbiddenError,
  BadRequestError,
} from "../../modules/common/errors/index.js";
import type { BuyPlayerPayload } from "./payload.js";

export class MarketplaceServices {
  private simulatorClient = new SimulatorClient();
  private teamsClient = new TeamsClient();

  async buyPlayer(token: string, payload: BuyPlayerPayload) {
    const newPlayer = (await this.simulatorClient.generatePlayer({
      position: payload.position,
      target_avr: payload.target_avr,
    }));

    if ("statusCode" in newPlayer){
        if(newPlayer.statusCode >= 500) throw new ServiceUnavailableError("Unexpected Error")
        if(newPlayer.statusCode >= 400) throw new BadRequestError("Error creating player");
    } 

    const updatedTeam = await this.teamsClient.buyPlayer({
      player: newPlayer as any,
      teamId: payload.teamId,
      token: token,
    });

    if ("statusCode" in updatedTeam) {
        if(updatedTeam.statusCode >= 500) throw new ServiceUnavailableError("Unexpected Error")
        if(updatedTeam.statusCode >= 400) throw new BadRequestError("Error updating team");
    } 

    return updatedTeam;
  }
}
