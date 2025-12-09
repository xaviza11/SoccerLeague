import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameHistory, User } from '../entities';

@Injectable()
export class PlayedGamesService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly gameHistoryRepo: Repository<GameHistory>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}
  
  async create(data: {
    player_one_id: string;
    player_two_id?: string | null;
    is_ai_game?: boolean;
    result: [number, number];
    logs?: any[];
  }): Promise<GameHistory> {
    const { player_one_id, player_two_id } = data;

    const p1 = await this.usersRepo.findOne({ where: { id: player_one_id } });
    if (!p1) throw new BadRequestException('Player one not found');

    if (player_two_id) {
      const p2 = await this.usersRepo.findOne({ where: { id: player_two_id } });
      if (!p2) throw new BadRequestException('Player two not found');
    }

    const history = this.gameHistoryRepo.create({
      ...data,
      logs: data.logs ?? [],
      is_ai_game: data.is_ai_game ?? false,
    });

    return await this.gameHistoryRepo.save(history);
  }

  async findAll(): Promise<GameHistory[]> {
    return await this.gameHistoryRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<GameHistory> {
    const game = await this.gameHistoryRepo.findOne({ where: { id } });
    if (!game) throw new NotFoundException('Game history entry not found');
    return game;
  }

  async update(
    id: string,
    updates: Partial<Omit<GameHistory, 'id' | 'createdAt'>>
  ): Promise<GameHistory> {
    const game = await this.findOne(id);

    Object.assign(game, updates);

    return await this.gameHistoryRepo.save(game);
  }

  async delete(id: string): Promise<{ message: string }> {
    const game = await this.findOne(id);
    await this.gameHistoryRepo.remove(game);

    return { message: 'Game history entry deleted successfully' };
  }

  async findByUser(userId: string): Promise<GameHistory[]> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return await this.gameHistoryRepo.find({
      where: [
        { player_one_id: userId },
        { player_two_id: userId },
      ],
      order: { createdAt: 'DESC' },
    });
  }
}
