import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game, User } from "../../entities";
import { validate as isUUID } from "uuid";
import { Logger } from "@nestjs/common";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  private readonly logger = new Logger(GameService.name);

  async create(playerOneId: string, playerTwoId: string | null, isAiGame: boolean, player_one_elo: number, player_two_elo: number | null) {
    this.logger.log(
      `Creating game: playerOneId=${playerOneId}, playerTwoId=${playerTwoId}, isAiGame=${isAiGame}`,
    );
    if (!isUUID(playerOneId)) {
      this.logger.log(`Invalid playerOneId: ${playerOneId}`);
      throw new BadRequestException("Invalid playerOneId");
    }

    if (!isAiGame) {
      if (!isUUID(playerTwoId)) {
        this.logger.log(`Invalid playerTwoId: ${playerTwoId}`);
        throw new BadRequestException("Invalid playerTwoId");
      }
    }

    const player1 = await this.usersRepo.findOne({
      where: { id: playerOneId },
    });

    if (!player1) {
      this.logger.log(`Player 1 not found with id: ${playerOneId}`);
      throw new NotFoundException("Player 1 not found");
    }

    if (!isAiGame && playerTwoId !== null) {
      const player2 = await this.usersRepo.findOne({
        where: { id: playerTwoId },
      });
      if (!player2) {
        this.logger.log(`Player 2 not found with id: ${playerTwoId}`);
        throw new NotFoundException("Player 2 not found");
      }
    }

    const game = this.gameRepo.create({
      player_one_id: playerOneId,
      player_two_id: isAiGame ? null : playerTwoId,
      is_ai_game: !!isAiGame,
      player_one_elo,
      player_two_elo
    });

    const response = await this.gameRepo.save(game);
    this.logger.log(`Game created successfully with ID: ${response.id}`);
    return response;
  }

  async findAll() {
    this.logger.log("Fetching all games");
    const response = await this.gameRepo.find();
    this.logger.log(`Found ${response.length} games`);
    return response;
  }

  async findAllByUser(userId: string) {
    this.logger.log(`Fetching all games for user with id: ${userId}`);
    if (!isUUID(userId)) {
      this.logger.log(`Invalid userId: ${userId}`);
      throw new BadRequestException("Invalid userId");
    }

    const response = await this.gameRepo.find({
      where: [{ player_one_id: userId }, { player_two_id: userId }],
    });
    this.logger.log(`Found ${response.length} games for user with id: ${userId}`);
    return response;
  }

  async findOne(id: string) {
    this.logger.log(`Fetching game with id: ${id}`);
    const game = await this.gameRepo.findOne({ where: { id } });
    if (!game) {
      this.logger.log(`Game not found with id: ${id}`);
      throw new NotFoundException("Game not found");
    }
    return game;
  }

  async remove(id: string) {
    this.logger.log(`Removing game with id: ${id}`);
    const game = await this.gameRepo.findOne({ where: { id } });

    if (game === null) {
      this.logger.log(`Game not found with id: ${id}`);
      throw new NotFoundException("Game not found");
    }
    await this.gameRepo.delete(game.id);
    return { deleted: true };
  }
}
