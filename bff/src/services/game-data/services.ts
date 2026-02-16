import {
  UsersClient,
  UsersStorageClient,
  TeamsClient,
  PlayersClient,
  UsersGameStatsClient,
  GamesClient,
} from "../../modules/apiClients/index.js";
import type { ServiceRetrieveGameDataPayload } from "../../modules/models/dto/servicePayloads/gameData/index.js";
import { TokenCrypto } from "../../modules/common/helpers/index.js";
import {
  AuthError,
  ServiceUnavailableError,
  UnprocessableEntityError,
  ForbiddenError,
} from "../../modules/common/errors/index.js";
import type {
  RetrieveOpponentTeamPayload,
  UpdateTeamServicePayload,
  RetrieveUserGamePayload
} from "./payloads.js";
import type { NormalizedError } from "../../modules/models/dto/errors/index.js";
import { validateSquad } from "../../modules/common/validators/team/index.js";
import type Player from "../../modules/models/interfaces/player.js";

export class GameDataServices {
  private usersClient = new UsersClient();
  private usersStorageClient = new UsersStorageClient();
  private teamsClient = new TeamsClient();
  private gamesClient = new GamesClient();

  public async retrieveGameData(payload: ServiceRetrieveGameDataPayload) {
    const decryptedToken = TokenCrypto.decrypt(payload.token);

    const me = await this.usersClient.findMe(decryptedToken);

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

    const me = await this.usersClient.findMe(decryptedToken);

    if (!("storage" in me)) {
      throw new AuthError("Invalid token");
    }

    if (
      !payload.players ||
      !Array.isArray(payload.players) ||
      payload.players.length === 0
    ) {
      throw new UnprocessableEntityError(
        "Players payload is missing or invalid",
      );
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

    if (!("players" in team) || !Array.isArray(team.players)) {
      throw new UnprocessableEntityError("Team players are invalid");
    }

    const teamPlayerIds = team.players.map((p: Player) => p.id);
    for (const p of payload.players) {
      if (!p?.id) {
        throw new UnprocessableEntityError("Payload player id is missing");
      }
      if (!teamPlayerIds.includes(p.id)) {
        throw new ForbiddenError(`Error updating lineup`);
      }
    }

    const updatedPlayers: Player[] = team.players.map((tp: Player) => {
      const payloadPlayer = payload.players.find((pp) => pp.id === tp.id);
      return payloadPlayer ? { ...tp, isBench: payloadPlayer.isBench } : tp;
    });

    const isValidTeam = validateSquad(updatedPlayers);

    if (!isValidTeam.isValid) {
      throw new UnprocessableEntityError(isValidTeam.message);
    }

    const r = await this.teamsClient.updateLineup(decryptedToken, {
      teamId: team.id,
      players: updatedPlayers.map((p) => ({ id: p.id, isBench: p.isBench })),
    });

    return { message: "success" };
  }

  public async retrieveUserGame(payload: RetrieveUserGamePayload) {
    const decryptedToken = TokenCrypto.decrypt(payload.token);

    const me = await this.usersClient.findMe(decryptedToken);

    if (!("storage" in me)) {
      throw new AuthError("Invalid token");
    }

    const game = await this.gamesClient.retrieveUserGame(decryptedToken);
    return game;
  }

  public async retrieveOpponentTeam(payload: RetrieveOpponentTeamPayload) {
    const decryptedToken = TokenCrypto.decrypt(payload.token);

    const opponent = await this.usersClient.findOpponent(
      payload.id,
      decryptedToken,
    );

    if (!("storage" in opponent)) {
      throw new AuthError("Invalid token");
    }

    const storage = await this.usersStorageClient.findOne(decryptedToken, {
      storageId: opponent.storage.id,
    });

    if (!("team" in storage)) {
      throw new ServiceUnavailableError("Unexpected Error");
    }

    const team = await this.teamsClient.getTeam(decryptedToken, {
      teamId: storage.team.id,
    });

    return team;
  }
}
