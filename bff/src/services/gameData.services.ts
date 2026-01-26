import {
  UserClient,
  UsersStorageClient,
  TeamsClient,
  PlayerClient,
} from "../modules/apiClients/index.js";
import type { ServiceRetrieveGameDataPayload } from "../modules/models/dto/servicePayloads/gameData/index.js";
import { TokenCrypto } from "../modules/common/helpers/index.js";
import {
  AuthError,
  ServiceUnavailableError,
  UnprocessableEntityError,
  ForbiddenError,
} from "../modules/common/errors/index.js";
import type { UpdateTeamServicePayload } from "../modules/models/dto/servicePayloads/team/index.js";
import type { UserFindOneResponse } from "../modules/models/dto/responses/user/index.js";
import type { NormalizedError } from "../modules/models/dto/errors/index.js";
import { validateSquad } from "../modules/common/validators/team/index.js";
import type Player from "../modules/models/interfaces/player.js";

export class GameDataService {
  private userClient = new UserClient();
  private usersStorageClient = new UsersStorageClient();
  private teamsClient = new TeamsClient();
  private playersClient = new PlayerClient();

  public async retrieveGameData(payload: ServiceRetrieveGameDataPayload) {
    const decryptedToken = TokenCrypto.decrypt(payload.token);

    const me = await this.userClient.findMe(decryptedToken);

    if (!("storage" in me)) throw new AuthError("Invalid token");

    const storage = await this.usersStorageClient.findOne(decryptedToken, {
      storageId: me.storage.id,
    });

    if (!("team" in storage))
      throw new ServiceUnavailableError("Error on retrieve game data - 001");

    const team = await this.teamsClient.getTeam(decryptedToken, {
      teamId: storage.team.id,
    });

    return {
      position_change_cards: storage.position_change_cards,
      cards: storage.cards,
      team,
    };
  }

  public async updateTeamBench(payload: UpdateTeamServicePayload) {
    const decryptedToken = TokenCrypto.decrypt(payload.token);

    const me: UserFindOneResponse | NormalizedError =
      await this.userClient.findMe(decryptedToken);

    if (!("storage" in me)) {
      throw new AuthError("Invalid token");
    }

    if (!payload.players || !Array.isArray(payload.players)) {
      throw new UnprocessableEntityError(
        "Players payload is missing or invalid",
      );
    }

    const isValidTeam = validateSquad(payload.players);

    if (!isValidTeam.isValid) {
      throw new UnprocessableEntityError(isValidTeam.message);
    }

    const storage = await this.usersStorageClient.findOne(decryptedToken, {
      storageId: me.storage.id,
    });

    if (!("team" in storage) || !storage.team?.id) {
      throw new UnprocessableEntityError("User has no team");
    }

    const team = await this.teamsClient.getTeam(decryptedToken, {
      teamId: storage.team.id,
    });

    if (!("players" in team)) {
      throw new UnprocessableEntityError("Error returning the player");
    }

    if (!Array.isArray(team.players)) {
      throw new UnprocessableEntityError("Team players are invalid");
    }

    for (const payloadPlayer of payload.players) {
      if (!payloadPlayer?.id) {
        throw new UnprocessableEntityError("Payload player id is missing");
      }

      const player = await this.playersClient.findOnePlayer({
        id: payloadPlayer.id,
      });

      if (!player) {
        throw new UnprocessableEntityError(
          `Player ${payloadPlayer.id} does not exist`,
        );
      }

      const storedPlayer = team.players.find(
        (p: Player) => p.id === payloadPlayer.id,
      );

      if (!storedPlayer) {
        throw new ForbiddenError(`Error updating player`);
      }

      await this.playersClient.updateIsBench({
        id: payloadPlayer.id,
        isBench: payloadPlayer.isBench,
      });
    }

    return { message: "success" };
  }
}
