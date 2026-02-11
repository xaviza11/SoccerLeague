import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { User, Game, Team, GameHistory } from "../../entities";
import { Logger } from "@nestjs/common";
import Matchmaker from "./utils/Matchmaker";
import pLimit from "p-limit";
import SimulatorApiClient from "./utils/SimulatorApiClient";
import { MongoEntityManager } from "typeorm/browser";

@Injectable()
export class MatchmakerService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

    @InjectRepository(GameHistory)
    private readonly gameHistory: Repository<GameHistory>,

    private readonly simulatorClient: SimulatorApiClient,
  ) {}

  private limit = pLimit(10);
  private readonly logger = new Logger(MatchmakerService.name);

  public async create() {
    let page = 0;
    const pageSize = 10000;
    const savePromises = [];
    let totalUsers = 0;
    let totalMatches = 0;

    this.logger.log("🚀 Starting optimized match generation...");

    try {
      while (true) {
        const batch = await this.userRepo.find({
          skip: page * pageSize,
          take: pageSize,
          relations: ["stats"],
        });

        if (!batch || batch.length === 0) break;

        totalUsers += batch.length;

        const task = this.limit(async () => {
          const matches = Matchmaker.generateMatches(batch);
          totalMatches += matches.length;

          await this.gameRepo.save(matches);
        });

        savePromises.push(task as never);
        if (batch.length < pageSize) break;
        page++;
      }

      await Promise.all(savePromises);
    } catch (error) {
      this.logger.error("❌ Error during processing:", error.stack);
      throw error;
    }

    return {
      success: true,
      processedUsers: totalUsers,
      createdMatches: totalMatches,
    };
  }

  async deleteGames() {
    const resultGames = await this.gameRepo.clear();
    const resultGameHistory = await this.gameHistory.clear();

    return { resultGames, resultGameHistory };
  }

  public async resolveMatches() {
    //845s, fails 22 for 100000 games => 0.022% failure rate,
    //TODO: Remaining to create another endpoint in the simulator for the AI games.
    let page = 0;
    const pageSize = 2000;
    let totalMatches = 0;

    this.logger.log("🚀 Starting simulation engine...");

    try {
      while (true) {
        this.logger.log(`📄 Processing page ${page}...`);

        const batch = await this.gameRepo.find({
          skip: page * pageSize,
          take: pageSize,
        });

        if (!batch || batch.length === 0) {
          this.logger.log("🏁 No more games to process");
          break;
        }

        // Filter out games that are not AI-based
        const validGames = batch.filter((game) => !game.isAiGame);

        if (validGames.length === 0) {
          page++;
          continue;
        }

        // 1. Gather all unique player IDs into a single array
        const allPlayerIds = [
          ...new Set(
            validGames.flatMap((game) =>
              [game.playerOneId, game.playerTwoId].filter(Boolean),
            ),
          ),
        ] as string[];

        // 2. Batch fetch all necessary teams
        const allTeams = await this.getTeamsByPlayerIds(allPlayerIds);

        // 3. Create a Map for fast O(1) team lookup by user ID
        const teamMap = new Map(allTeams.map((t) => [t.storage.user.id, t]));

        // 4. Map valid games into simulation payloads
        const payloads = validGames.map((game) => {
          const p1Team = teamMap.get(game.playerOneId);
          const p2Team = game.playerTwoId
            ? teamMap.get(game.playerTwoId)
            : null;

          return {
            teams: [
              {
                name: p1Team?.name || "",
                player_name: p1Team?.storage.user.name || "",
                aura: ["None", "None", "None"],
                bench_players: p1Team?.players.filter((p) => p.isBench) ?? [],
                players: p1Team?.players.filter((p) => !p.isBench) ?? [],
              },
              {
                name: p2Team?.name || "AI",
                player_name: p2Team?.storage.user.name || "AI",
                aura: ["None", "None", "None"],
                bench_players: p2Team?.players.filter((p) => p.isBench) ?? [],
                players: p2Team?.players.filter((p) => !p.isBench) ?? [],
              },
            ],
          };
        });

        this.logger.log(`🎮 Sending ${payloads.length} simulations...`);

        // Map payloads to promises and catch errors individually to prevent Promise.all from failing
        const simulationPromises = payloads.map((p) =>
          this.simulatorClient.simulateGame(p).catch((err) => {
            this.logger.error("❌ Simulation request failed:", err.message);
            return null;
          }),
        );

        const simulationResponses = await Promise.all(simulationPromises);

        const historiesToSave = [];

        simulationResponses.forEach((simResult, index) => {
          // Guard clause: Skip if simulation failed or returned empty results
          if (!simResult || !simResult.game_result) {
            this.logger.warn(
              `⚠️ Skipping game ${index} due to failed simulation`,
            );
            return;
          }

          const scores = simResult.game_result.score;
          const gameInfo = validGames[index];

          const eloChange = Matchmaker.eloAdjustmentCalculator(
            scores[0],
            scores[1],
            gameInfo.playerOneElo,
            gameInfo.playerTwoElo || gameInfo.playerOneElo,
          ) as any;

          const historyEntry = this.gameHistory.create({
            playerOneId: gameInfo.playerOneId,
            playerTwoId: gameInfo.playerTwoId,
            isAiGame: gameInfo.isAiGame,
            eloChange: [eloChange.adjustmentA, eloChange.adjustmentB],
            result: scores,
            logs: simResult.logs,
          } as any);

          historiesToSave.push(historyEntry as never);
        });

        if (historiesToSave.length > 0) {
          await this.gameHistory.save(historiesToSave);
          totalMatches += historiesToSave.length;
          this.logger.log(
            `💾 Saved ${historiesToSave.length} games. Total: ${totalMatches}`,
          );
        }

        // Move to the next page of the batch
        page++;
      }

      return { totalCreated: totalMatches };
    } catch (error) {
      this.logger.error("❌ Fatal error during resolveMatch:", error);
      throw error;
    }
  }

 public async updateElo() {
    //199976 games processed, 68s, fails 0.03%
    this.logger.log("📈 Stating update of Elo and Money (Modo Batch)...");
    const startTime = Date.now();
    const COIN_MULTIPLIER = 10;

    const eloAdjustments = new Map<string, number>();
    const coinAdjustments = new Map<string, number>();

    try {
      let page = 0;
      const pageSize = 5000;
      while (true) {
        const historyBatch = await this.gameHistory.find({
          skip: page * pageSize,
          take: pageSize,
        });

        if (!historyBatch || historyBatch.length === 0) break;

        for (const record of historyBatch) {
          // Player one
          const p1Id = record.playerOneId;
          const p1EloChange = record.eloChange[0];
          eloAdjustments.set(p1Id, (eloAdjustments.get(p1Id) || 0) + p1EloChange);
          coinAdjustments.set(p1Id, (coinAdjustments.get(p1Id) || 0) + (p1EloChange * COIN_MULTIPLIER));

          // Player Two (if exists)
          if (record.playerTwoId) {
            const p2Id = record.playerTwoId;
            const p2EloChange = record.eloChange[1];
            eloAdjustments.set(p2Id, (eloAdjustments.get(p2Id) || 0) + p2EloChange);
            coinAdjustments.set(p2Id, (coinAdjustments.get(p2Id) || 0) + (p2EloChange * COIN_MULTIPLIER));
          }
        }

        if (historyBatch.length < pageSize) break;
        page++;
      }

      const userIds = Array.from(eloAdjustments.keys());
      if (userIds.length === 0) {
        this.logger.warn("⚠️ Not founded data for process.");
        return { success: true, processed: 0 };
      }

      // 2. Load and update
      const updateChunkSize = 1000;
      let totalUpdated = 0;

      for (let i = 0; i < userIds.length; i += updateChunkSize) {
        const chunkIds = userIds.slice(i, i + updateChunkSize);

        const users = await this.userRepo.find({
          where: { id: In(chunkIds) },
          relations: ["stats"],
        });

        const statsToSave = [];

        for (const user of users) {
          if (user.stats) {
            const eloDelta = eloAdjustments.get(user.id) || 0;
            const moneyDelta = coinAdjustments.get(user.id) || 0;

            // Update
            user.stats.elo = Number(user.stats.elo) + eloDelta;
            user.stats.money = Number(user.stats.money) + moneyDelta;
            user.stats.total_games = Number(user.stats.total_games) + 1;

            statsToSave.push(user.stats as never);
          }
        }

        if (statsToSave.length > 0) {
          // Save
          await this.userRepo.manager.save(statsToSave);
          totalUpdated += statsToSave.length;
          this.logger.log(`💾 Updated stats: ${totalUpdated} of ${userIds.length}`);
        }
      }

      const duration = (Date.now() - startTime) / 1000;
      this.logger.log(`🏁 Process completed in: ${duration}s`);

      return {
        success: true,
        usersProcessed: userIds.length,
        totalStatsUpdated: totalUpdated,
        duration: `${duration}s`
      };

    } catch (error) {
      this.logger.error("❌ Error fatal en updateElo:", error.stack);
      throw error;
    }
  }

  // Helper method to fetch teams based on an array of player IDs
  private async getTeamsByPlayerIds(playerIds: string[]) {
    if (!playerIds || playerIds.length === 0) return [];

    return await this.teamRepo.find({
      where: {
        storage: {
          user: {
            id: In(playerIds),
          },
        },
      },
      relations: {
        players: true,
        auras: true,
        storage: {
          user: true,
        },
      },
      select: {
        id: true,
        name: true,
        players: true,
        auras: true,
        storage: {
          id: true,
          user: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
