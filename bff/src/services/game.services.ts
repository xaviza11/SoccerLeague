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
  private userClient = new UserClient();

  //** This service find all the users, then use Matchmaker utility for create games */
  public async create() {

    // Currently returns objects with 700B of data.
    // This can be optimized by deleting unused fields.
    // As the user base grows, this must be converted to streaming or batch processing with polling.
    // TODO: Create the new endpoint returning only the required fields whit pagination.
    // TODO: Manage the response of this new endpoint here
    const users = (await this.userClient.findAll()) as User[];

    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }

    const allMatches = Matchmaker.generateMatches(users);

    const BATCH_SIZE = 100;
    const batches = [];

    for (let i = 0; i < allMatches.length; i += BATCH_SIZE) {
      const batch = allMatches.slice(i, i + BATCH_SIZE);
      batches.push(batch);

      // TODO: Send batch to the CRUD
    }

    return allMatches;
  }
}
