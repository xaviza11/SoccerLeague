import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Player, Team } from '../../entities';
import { Logger } from '@nestjs/common';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Player)
    private readonly playersRepo: Repository<Player>,
    @InjectRepository(Team)
    private readonly teamsRepo: Repository<Team>,
  ) {}

  private readonly logger = new Logger(PlayerService.name);

  async create(data: Partial<Player>): Promise<Player> {
    this.logger.log(`Creating player for user ID: ${data.id}`);
    const user = await this.usersRepo.findOne({ where: { id: data.id } });
    if (!user) {
      this.logger.log(
        `Failed to create player: User not found with ID: ${data.id}`,
      );
      throw new NotFoundException('User not found');
    }

    if (!data.team || !data.team.id) {
      this.logger.log(`Failed to create player: Team information is required`);
      throw new NotFoundException('Team information is required');
    }

    const team = await this.teamsRepo.findOne({ where: { id: data.team.id } });
    if (!team) {
      this.logger.log(
        `Failed to create player: Team not found with ID: ${data.team.id}`,
      );
      throw new NotFoundException('Team not found');
    }

    const player = this.playersRepo.create({
      ...data,
      skills: data.skills || {},
      stats: data.stats || {},
      instructions: data.instructions || {},
      status: data.status || { age: 18, retirement_age: 40, is_active: true },
    });

    const response = await this.playersRepo.save(player);
    this.logger.log(`Player created successfully for user ID: ${data.id}`);
    return response;
  }

  async findOne(id: string): Promise<Player> {
    this.logger.log(`Fetching player with ID: ${id}`);
    const player = await this.playersRepo.findOne({
      where: { id },
      relations: ['card'],
    });
    if (!player) {
      this.logger.log(`Player not found with ID: ${id}`);
      throw new NotFoundException('Player not found');
    }

    this.logger.log(`Player retrieved successfully with ID: ${id}`);
    return player;
  }

  async findAll(): Promise<Player[]> {
    this.logger.log(`Fetching all players`);
    const response = await this.playersRepo.find({ relations: ['card'] });
    this.logger.log(`Players retrieved successfully`);
    return response;
  }

  async update(id: string, data: Partial<Player>): Promise<Player> {
    this.logger.log(`Updating player with ID: ${id}`);
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      this.logger.log(`Failed to update player: User not found with ID: ${id}`);
      throw new NotFoundException('User not found');
    }

    const player = await this.findOne(id);
    
    Object.assign(player, data);

    this.logger.log(`Player updated successfully with ID: ${id}`);
    const response = await this.playersRepo.save(player);
    return response;
  }

  async findAllPlayersByUser(userId: string): Promise<Player[]> {
    this.logger.log(`Fetching all players for user ID: ${userId}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(
        `Failed to fetch players: User not found with ID: ${userId}`,
      );
      throw new NotFoundException('User not found');
    }

    const players = await this.playersRepo.find({
      relations: ['team', 'team.storage', 'team.storage.user'],
      where: { team: { storage: { user: { id: userId } } } },
    });

    this.logger.log(`Players retrieved successfully for user ID: ${userId}`);
    return players;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting player with ID: ${id}`);
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      this.logger.log(`Failed to delete player: User not found with ID: ${id}`);
      throw new NotFoundException('User not found');
    }

    const player = await this.findOne(id);
    this.logger.log(`Player deleted successfully with ID: ${id}`);
    await this.playersRepo.remove(player);
  }
}
