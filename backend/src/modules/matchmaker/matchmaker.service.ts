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

 public async resolveMatches() { //845s, fails 22 for 100000 games => 0.022% failure rate,
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
          const p2Team = game.playerTwoId ? teamMap.get(game.playerTwoId) : null;

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

  //! 1 - get teams instead of team use one array
  private async getTeamsByPlayerIds(playerIds: string[]) {
    // Si el array está vacío, evitamos la consulta y devolvemos un array vacío
    if (!playerIds || playerIds.length === 0) return [];

    return await this.teamRepo.find({
      where: {
        storage: {
          user: {
            id: In(playerIds), // El operador In permite buscar coincidencias en un array
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
