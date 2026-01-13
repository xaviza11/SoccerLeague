import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserStats } from "../../entities";
import { Repository, MoreThan } from "typeorm";
import { validate as isUUID } from "uuid";
import { Logger } from "@nestjs/common";

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

  private readonly logger = new Logger(UsersGameStatsService.name);

  async create(userId: string): Promise<Partial<UserStats>> {
    this.logger.log(`Creating UserStats for User ID: ${userId}`);
    const user = await this.UsersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`User not found`);
      throw new NotFoundException("User not found");
    }

    const stats = this.UserStatsRepo.create({
      elo: 10000,
      total_games: 0,
      money: 100000,
      user,
    });

    const saved = await this.UserStatsRepo.save(stats);

    this.logger.log(`UserStats created successfully for User ID: ${userId}`);

    const { id, elo, money, total_games } = saved;
    return { id, elo, money, total_games };
  }

  async findAll(): Promise<UserStats[]> {
    this.logger.log(`Retrieving all UserStats`);
    const response = await this.UserStatsRepo.find({ relations: ["user"] });
    this.logger.log(`All UserStats retrieved successfully`);
    return response;
  }

  async findOne(id: string): Promise<UserStats> {
    this.logger.log(`Retrieving UserStats ID: ${id}`);
    if (!isUUID(id)) {
      this.logger.log(`Invalid UserStats ID format`);
      throw new NotFoundException("Storage not found");
    }

    const data = await this.UserStatsRepo.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!data) {
      this.logger.log(`UserStats not found`);
      throw new NotFoundException(`UserStats ${id} not found`);
    }

    this.logger.log(`UserStats ID: ${id} retrieved successfully`);
    return data;
  }

  async getTop(limit = 100) {
    this.logger.log(`Retrieving top ${limit} UserStats by ELO`);
    const response = await this.UserStatsRepo.find({
      relations: ["user"],
      order: { elo: "DESC" },
      take: limit,
    });
    this.logger.log(`Top ${limit} UserStats retrieved successfully`);
    return response;
  }

  async getLeaderboard(page = 1, limit = 50) {
    this.logger.log(`Retrieving leaderboard page ${page} with limit ${limit}`);
    const response = await this.UserStatsRepo.find({
      relations: ["user"],
      order: { elo: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    this.logger.log(`Leaderboard page ${page} retrieved successfully`);
    return response;
  }

  async getUserRank(userId: string) {
    this.logger.log(`Calculating rank for User ID: ${userId}`);
    if (!isUUID(userId)) {
      this.logger.log(`Invalid User ID format`);
      throw new NotFoundException("Storage not found");
    }

    const stats = await this.UserStatsRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!stats) {
      this.logger.log(`User stats not found`);
      return null;
    }

    const betterPlayers = await this.UserStatsRepo.count({
      where: { elo: MoreThan(stats.elo) },
    });

    this.logger.log(`User ID: ${userId} has rank ${betterPlayers + 1}`);
    return betterPlayers + 1;
  }

  async update(userId: string, dto: UpdateUserStatsDto): Promise<UserStats> {
    this.logger.log(`Updating UserStats for User ID: ${userId}`);
    const stats = await this.UserStatsRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!stats) {
      this.logger.log(`User stats not found`);
      throw new NotFoundException("User stats not found");
    }

    // Copy the properties from dto to stats
    Object.assign(stats, dto);

    const response = await this.UserStatsRepo.save(stats);
    this.logger.log(`UserStats for User ID: ${userId} updated successfully`);
    return response;
  }

  async delete(userId: string): Promise<void> {
    this.logger.log(`Deleting UserStats for User ID: ${userId}`);
    const stats = await this.UserStatsRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!stats) {
      this.logger.log(`User stats not found`);
      throw new NotFoundException("User stats not found");
    }

    this.logger.log(`UserStats for User ID: ${userId} deleted successfully`);
    await this.UserStatsRepo.remove(stats);
  }
}
