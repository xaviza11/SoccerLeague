import {
  UserClient, 
  UsersStorageClient,
  TeamsClient,
} from "../apiClients/index.js";
import type { ServiceRetrieveGameDataPayload } from "../dto/servicePayloads/gameData/index.js";
import { TokenCrypto } from "../helpers/encrypt.js";
import {
  AuthError,
  ConflictError,
  NotFoundError,
  ServiceUnavailableError,
  ValidationError,
} from "../errors/index.js";

export class GameDataService {
  private userClient = new UserClient();
  private usersStorageClient = new UsersStorageClient();
  private teamsClient = new TeamsClient();

  public async retrieveGameData(payload: ServiceRetrieveGameDataPayload) {
    try {
      const decryptedToken = TokenCrypto.decrypt(payload.token);
      const me = await this.userClient.findMe(decryptedToken);

      if (!("storage" in me))
        throw new ServiceUnavailableError("Error on retrieve game data - 001");

      const storage = await this.usersStorageClient.findOne(decryptedToken, {
        storageId: me.storage.id,
      });

      if (!("team" in storage))
        throw new ServiceUnavailableError("Error on retrieve game data - 002");

      const team = await this.teamsClient.getTeam(decryptedToken, {
        teamId: storage.team.id,
      });

      return {
        position_change_cards: storage.position_change_cards,
        cards: storage.cards,
        team,
      };
    } catch (error) {
      throw error;
    }
  }
}
