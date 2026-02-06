import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, Game, Team } from "../../entities";
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
    const resultGames = await this.gameRepo.delete({});
    //TODO: const resultPlayedGames = await this.playerGamesRepo.delete({});

    return {
      deletedCount: resultGames.affected,
      //TODO: deletedPlayedGamesCount: resultPlayedGames
    };
  }

  public async resolveMatches() {
    let page = 0;
    const pageSize = 5000;
    const savePromises = [];
    let totalUsers = 0;
    let totalMatches = 0;

    this.logger.log("🚀 Starting playing games...");

    try {
      while (true) {
        const batch = await this.gameRepo.find({
          skip: page * pageSize,
          take: pageSize,
        });

        if (!batch || batch.length === 0) break;

        const playerOneTeamId = await this.getTeamByPlayerId(
          batch[0].playerOneId,
        );
        const playerTwoTeamId = await this.getTeamByPlayerId(
          batch[0].playerTwoId!,
        );

        const payload = {
          teams: [
            {
              name: playerOneTeamId?.name || "",
              player_name: playerOneTeamId?.storage.user.name || "",
              aura: ["None", "None", "None"],
              bench_players:
                playerOneTeamId?.players.filter((p) => p.isBench) ?? [],
              players: playerOneTeamId?.players.filter((p) => !p.isBench) ?? [],
            },
            {
              name: playerTwoTeamId?.name || "",
              player_name: playerTwoTeamId?.storage.user.name || "",
              aura: ["None", "None", "None"],
              bench_players:
                playerTwoTeamId?.players.filter((p) => p.isBench) ?? [],
              players: playerTwoTeamId?.players.filter((p) => !p.isBench) ?? [],
            },
          ],
        }; // 32kb more or less

        const simulationResult =
          await this.simulatorClient.simulateGame(payload);

        const result = simulationResult.game_result.score;

        const eloChange = Matchmaker.eloAdjustmentCalculator(
          result[0],
          result[1],
          batch[0].playerOneElo,
          batch[0].playerTwoElo || batch[0].playerOneElo,
        );

        // update player elo
        const newEloPlayerOne = batch[0].playerOneElo + eloChange[0];
        const newEloPlayerTwo = (batch[0].playerTwoElo || batch[0].playerOneElo) - eloChange[0];

        // 1. Actualizar el Elo de los usuarios en la DB
        // save the match in a new entity

        return { result, eloChange };

        /*totalUsers += batch.length;

        const task = this.limit(async () => {
          // Usamos .map para crear un pool de promesas en lugar de un for secuencial
          await Promise.all(batch.map(async (game) => {
            if (game.isAiGame === false) {

              const playerOne = this.userRepo.findOneById(game.playerOneId)
              const playerTwo = this.userRepo.findOneById(game.playerTwoId!)
              
              // retrieve both users and teams. => 1-2ms
              // format data => split players into players and bench_players, 1-2ms
              // auras ["None", "None", "None"] 
              
              // create apiClient for call to generate game 
              // each body have 54kb more or less.
              // 1-2ms for each team and 52kb response.
              // save the response to played_games entity (new)

            } else {
              // create new service on simulator for handle the ai games, now doesn't work
            }
          }));
        });

        savePromises.push(task as never);
        
        if (batch.length < pageSize) break;
        page++;*/
      }

      /*await Promise.all(savePromises);
      this.logger.log("✅ Finished processing all batches.");*/
    } catch (error) {
      this.logger.error("❌ Error during resolveMatch:", error);
    }
  }

  private async getTeamByPlayerId(playerId: string) {
    return await this.teamRepo.findOne({
      where: {
        storage: {
          user: { id: playerId },
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
            stats: {
              elo: true,
            },
          },
        },
      },
    });
  }
}
