import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStats } from '../../entities';
import { Repository, MoreThan } from 'typeorm';
import { validate as isUUID } from 'uuid';

export class UpdateUserStatsDto {
  elo?: number;
  total_games?: number;
  money?: number;
}

@Injectable()
export class UsersGameStatsService {
  constructor(
    @InjectRepository(UserStats)
    private readonly UserStatsRepo: Repository<UserStats>,

    @InjectRepository(User)
    private readonly UsersRepo: Repository<User>,
  ) {}

  async create(userId: string): Promise<Partial<UserStats>> {
    const user = await this.UsersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const stats = this.UserStatsRepo.create({
      elo: 10000,
      total_games: 0,
      money: 100000,
      user,
    });

    const saved = await this.UserStatsRepo.save(stats);

    const { id, elo, money, total_games } = saved;
    return { id, elo, money, total_games };
  }

  async findAll(): Promise<UserStats[]> {
    return this.UserStatsRepo.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<UserStats> {
    if (!isUUID(id)) {
      throw new NotFoundException('Storage not found');
    }

    const data = await this.UserStatsRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!data) throw new NotFoundException(`UserStats ${id} not found`);
    return data;
  }

  async getTop(limit = 100) {
    return this.UserStatsRepo.find({
      relations: ['user'],
      order: { elo: 'DESC' },
      take: limit,
    });
  }

  async getLeaderboard(page = 1, limit = 50) {
    return this.UserStatsRepo.find({
      relations: ['user'],
      order: { elo: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getUserRank(userId: string) {
    if (!isUUID(userId)) {
      throw new NotFoundException('Storage not found');
    }

    const stats = await this.UserStatsRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!stats) return null;

    const betterPlayers = await this.UserStatsRepo.count({
      where: { elo: MoreThan(stats.elo) },
    });

    return betterPlayers + 1;
  }

  async update(userId: string, dto: UpdateUserStatsDto): Promise<UserStats> {
    const stats = await this.UserStatsRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!stats) {
      throw new NotFoundException('User stats not found');
    }

    Object.assign(stats, dto);
    return this.UserStatsRepo.save(stats);
  }

  async delete(userId: string): Promise<void> {
    const stats = await this.UserStatsRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!stats) {
      throw new NotFoundException('User stats not found');
    }

    await this.UserStatsRepo.remove(stats);
  }
}
