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

  async create(player_one_id: string, player_two_id: string | null, is_ai_game: boolean) {
    this.logger.log(
      `Creating game: player_one_id=${player_one_id}, player_two_id=${player_two_id}, is_ai_game=${is_ai_game}`,
    );
    if (!isUUID(player_one_id)) {
      this.logger.log(`Invalid player_one_id: ${player_one_id}`);
      throw new BadRequestException("Invalid player_one_id");
    }

    if (!is_ai_game) {
      if (!isUUID(player_two_id)) {
        this.logger.log(`Invalid player_two_id: ${player_two_id}`);
        throw new BadRequestException("Invalid player_two_id");
      }
    }

    const player1 = await this.usersRepo.findOne({
      where: { id: player_one_id },
    });

    if (!player1) {
      this.logger.log(`Player 1 not found with id: ${player_one_id}`);
      throw new NotFoundException("Player 1 not found");
    }

    if (!is_ai_game && player_two_id !== null) {
      const player2 = await this.usersRepo.findOne({
        where: { id: player_two_id },
      });
      if (!player2) {
        this.logger.log(`Player 2 not found with id: ${player_two_id}`);
        throw new NotFoundException("Player 2 not found");
      }
    }

    const game = this.gameRepo.create({
      player_one_id: player_one_id,
      player_two_id: is_ai_game ? null : player_two_id,
      is_ai_game: !!is_ai_game,
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
