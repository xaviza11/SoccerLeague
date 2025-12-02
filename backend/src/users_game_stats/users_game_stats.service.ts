import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStats } from '../entities';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

export class UpdateUserStatsDto {
  elo?: number;
  games?: string[];
  money?: number;
  team_id?: string | null;
}

@Injectable()
export class UsersGameStatsService {
  constructor(
    @InjectRepository(UserStats)
    private readonly UserStatsRepo: Repository<UserStats>,
  ) {}

  async create(): Promise<UserStats> {
    const UserStats = this.UserStatsRepo.create({
      elo: 10000,
      total_games: 0,
      money: 100000,
      team_id: null,
    });

    return this.UserStatsRepo.save(UserStats);
  }

  async findAll(): Promise<UserStats[]> {
    return this.UserStatsRepo.find();
  }

  async findOne(id: string): Promise<UserStats> {
    if (!isUUID(id)) {
      throw new NotFoundException('Storage not found');
    }

    const data = await this.UserStatsRepo.findOne({ where: { id } });

    if (!data) throw new NotFoundException(`UserStats ${id} not found`);
    return data;
  }

  async update(id: string, dto: UpdateUserStatsDto): Promise<UserStats> {
    if (!isUUID(id)) {
      throw new NotFoundException('Storage not found');
    }
    const data = await this.findOne(id);
    Object.assign(data, dto);
    return this.UserStatsRepo.save(data);
  }

  async delete(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new NotFoundException('Storage not found');
    }
    const result = await this.UserStatsRepo.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`UserStats ${id} not found`);
  }
}
