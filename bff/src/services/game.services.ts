import {
  UserClient,
  UsersStorageClient,
  TeamsClient,
  PlayerClient,
  GameClient,
} from "../modules/apiClients/index.js";
import type { ServiceRetrieveGameDataPayload } from "../modules/models/dto/servicePayloads/gameData/index.js";
import { TokenCrypto } from "../modules/common/helpers/index.js";
import {
  AuthError,
  ServiceUnavailableError,
  UnprocessableEntityError,
  ForbiddenError,
} from "../modules/common/errors/index.js";
import type { NormalizedError } from "../modules/models/dto/errors/index.js";
import { validateSquad } from "../modules/common/validators/team/index.js";
import type { CreateGamePayload } from "../modules/models/dto/payloads/game/index.js";
import Matchmaker from "../modules/common/utils/Matchmaker.js";
import type User from "../modules/models/interfaces/user.js";

export class GameService {
  private gameClient = new GameClient();
  private userClient = new UserClient();

  //** This service find all the users, then use Matchmaker utility for create games */
  public async create() {
    const users: any = (await this.userClient.findAll()) as User[];

    if (!Array.isArray(users)) {
      return;
    }

    if (users.length === 0) {
      return;
    }

    //this step creates one game when there is only one player
    const matches = [];

    //this is max number of the users sended to the CRUD API for create the matches
    const BATCH_SIZE = 100;

    //this is the array for the batches
    let batches = [];

    if (users.length === 1) {
      const randomPick = Math.floor(Math.random() * users.length);
      const lonelyPlayer = users[randomPick];
      matches.push({
        player1: lonelyPlayer.id,
        player2: null,
        is_ai_game: true,
      });
      return matches;
    }

    //this step uses Matchmaker for create all the games
    const maxElo = users[0].stats.elo;
    const minElo = users[users.length - 1].stats.elo;
    const averageElo = Math.round(maxElo + minElo / 2);

    if (users.length % 2 !== 0) {
      const randomPick = Math.floor(Math.random() * users.length);
      const lonelyPlayer = users[randomPick];
      matches.push({
        player1: lonelyPlayer.id,
        player2: null,
        is_ai_game: true,
      });
      users.splice(randomPick, 1);
    }

    while (users.length > 1) {
      const basePlayer = users.shift();
      if (!basePlayer) break;

      const targetElo = Matchmaker.getRandomElo(minElo, maxElo, basePlayer.elo);
      const opponent = Matchmaker.findAndRemoveBinary(
        users,
        targetElo,
        averageElo,
      );

      if (!opponent) {
        users.unshift(basePlayer);
        break;
      }

      matches.push({
        player1: basePlayer.id,
        player2: opponent.id,
        is_ai_game: false,
      });
    }

    for (let i = 0; i < matches.length; i += BATCH_SIZE) {
      batches.push(matches.slice(i, i + BATCH_SIZE))
    }

    return matches;

    //!TODO: create one new endPoint in the CRUD api for createMany instead of create each match, then create the apiClient for call this endpoint and
    //!TODO: for finish test the performance using the testing app. update the tests of the BFF;  
  }
}
