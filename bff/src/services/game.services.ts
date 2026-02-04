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
import pLimit from "p-limit";

export class GameService {
  private userClient!: UserClient;
  private gameClient!: GameClient;
  private limit = pLimit(10); 

  public async create() {
    this.userClient = new UserClient();
    this.gameClient = new GameClient();

    let page = 0;
    const pageSize = 1000;
    const savePromises = [];
    let totalUsers = 0;
    let totalMatches = 0;

    console.log("🚀 Starting fresh optimized match generation...");

    try {
      while (true) {
        const batch = await this.userClient.findAll(page, pageSize);
        if (!batch || batch.length === 0) break;

        totalUsers += batch.length;

        const task = this.limit(async () => {
          const matches = Matchmaker.generateMatches(batch);
          totalMatches += matches.length; 
          await this.gameClient.createMatches(matches as any);
        });

        savePromises.push(task);
        if (batch.length < pageSize) break;
        page++;
      }

      await Promise.all(savePromises);

    } catch (error) {
      console.error("❌ Error during processing:", error);
      throw error;
    } finally {
      console.log("🔌 Cleaning up connections...");
      await Promise.all([
        this.userClient.close(),
        this.gameClient.close()
      ]);
    }

    return { success: true, processedUsers: totalUsers, createdMatches: totalMatches };
  }
}
