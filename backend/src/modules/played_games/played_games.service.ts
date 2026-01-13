import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameHistory, User } from '../../entities';
import { Logger } from '@nestjs/common';

@Injectable()
export class PlayedGamesService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly gameHistoryRepo: Repository<GameHistory>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  private readonly logger = new Logger(PlayedGamesService.name);

  async create(data: {
    player_one_id: string;
    player_two_id?: string | null;
    is_ai_game?: boolean;
    result: [number, number];
    logs?: any[];
  }): Promise<GameHistory> {
    this.logger.log(`Creating game history entry`);
    const { player_one_id, player_two_id } = data;

    const p1 = await this.usersRepo.findOne({ where: { id: player_one_id } });
    if (!p1) {
      this.logger.error(`Player one with ID ${player_one_id} not found`);
      throw new BadRequestException('Player one not found');
    }

    if (player_two_id) {
      const p2 = await this.usersRepo.findOne({ where: { id: player_two_id } });
      if (!p2) {
        this.logger.error(`Player two with ID ${player_two_id} not found`);
        throw new BadRequestException('Player two not found');
      }
    }

    const history = this.gameHistoryRepo.create({
      ...data,
      logs: data.logs ?? [],
      is_ai_game: data.is_ai_game ?? false,
    });

    const response = await this.gameHistoryRepo.save(history);
    this.logger.log(`Game history entry created successfully`);
    return response;
  }

  async findAll(): Promise<GameHistory[]> {
    this.logger.log(`Fetching all game history entries`);
    const response =  await this.gameHistoryRepo.find({
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`All game history entries fetched successfully`);
    return response;
  }

  async findOne(id: string): Promise<GameHistory> {
    this.logger.log(`Fetching game history entry with ID: ${id}`);
    const game = await this.gameHistoryRepo.findOne({ where: { id } });
    if (!game) {
      this.logger.error(`Game history entry with ID ${id} not found`);
      throw new NotFoundException('Game history entry not found');
    }

    this.logger.log(`Game history entry with ID ${id} fetched successfully`);
    return game;
  }

  async update(
    id: string,
    updates: Partial<Omit<GameHistory, 'id' | 'createdAt'>>,
  ): Promise<GameHistory> {
    this.logger.log(`Updating game history entry with ID: ${id}`);
    const game = await this.findOne(id);

    Object.assign(game, updates);

    const response = await this.gameHistoryRepo.save(game);
    this.logger.log(`Game history entry with ID ${id} updated successfully`);
    return response;
  }

  async delete(id: string): Promise<{ message: string }> {
    this.logger.log(`Deleting game history entry with ID: ${id}`);
    const game = await this.findOne(id);
    await this.gameHistoryRepo.remove(game);

    this.logger.log(`Game history entry with ID ${id} deleted successfully`);
    return { message: 'Game history entry deleted successfully' };
  }

  async findByUser(userId: string): Promise<GameHistory[]> {
    this.logger.log(`Fetching game history entries for user ID: ${userId}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User with ID ${userId} not found`);
      throw new NotFoundException('User not found');
    }

    this.logger.log(
      `Game history entries for user ID ${userId} fetched successfully`,
    );
    const response = await this.gameHistoryRepo.find({
      where: [{ player_one_id: userId }, { player_two_id: userId }],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Game history entries for user ID ${userId} retrieved successfully`);
    return response;
  }
}
