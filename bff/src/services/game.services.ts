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
  private gameClient = new GameClient();

  //** This service find all the users, then use Matchmaker utility for create games */
  public async create() {
    const allUsers: User[] = [];
    let lastId: string = "x";

    // 1. get all users
    while (true) {
      const batch = (await this.userClient.findAll(lastId)) as User[];
      if (!Array.isArray(batch) || batch.length === 0) break;

      allUsers.push(...batch);
      if (batch.length < 100000) break;

      lastId = batch[batch.length - 1]?.id || "error";
      if (lastId === "error") throw new Error("Fatal error fetching users");
    }

    if (allUsers.length === 0) return { processed: 0 };

    // 2. Generate all the matches
    const matchGenerator = Matchmaker.generateMatches(allUsers);

    // 3. Send the games to the string
    try {
      const response = await this.gameClient.sendStream(matchGenerator as any);
      return response; 
    } catch (error) {
      throw error;
    }
  }
}
