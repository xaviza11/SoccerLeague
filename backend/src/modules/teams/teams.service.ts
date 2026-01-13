import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team, Storage, User } from "../../entities";
import { Logger } from "@nestjs/common";

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Team)
    private readonly teamsRepo: Repository<Team>,

    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  private readonly logger = new Logger(TeamsService.name);

  async create(userId: string) {
    this.logger.log(`Creating team for user ID: ${userId}`);
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ["storage"],
    });

    if (!user) {
      this.logger.log(`Failed to create team: User not found with ID: ${userId}`);
      throw new NotFoundException("User not found");
    }

    if (!user.storage) {
      this.logger.log(`Failed to create team: User storage not found for user ID: ${userId}`);
      throw new NotFoundException("User storage not found");
    }

    const team = this.teamsRepo.create({
      name: "YourTeam",
      storage: user.storage,
      players: [],
      bench_players: [],
      auras: [],
    });

    const savedTeam = await this.teamsRepo.save(team);
    this.logger.log(`Team created successfully for user ID: ${userId}, team ID: ${savedTeam.id}`);

    return savedTeam;
  }

  async find() {
    this.logger.log(`Fetching all teams`);
    const response = await this.teamsRepo.find({
      relations: ["players", "bench_players", "auras", "storage"],
    });
    this.logger.log(`Teams retrieved successfully`);
    return response;
  }

  async findOne(id: string) {
    this.logger.log(`Fetching team with ID: ${id}`);
    const team = await this.teamsRepo.findOne({
      where: { id },
      relations: ["players", "bench_players", "auras", "storage"],
    });

    if (!team) {
      this.logger.log(`Team not found with ID: ${id}`);
      throw new NotFoundException("Team not found");
    }

    this.logger.log(`Team retrieved successfully with ID: ${id}`);
    return team;
  }

  async update(id: string, dto: Partial<Team>, userId: string) {
    this.logger.log(`Updating team with ID: ${id} for user ID: ${userId}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`Failed to update team: User not found with ID: ${userId}`);
      throw new NotFoundException("User not found");
    }

    this.logger.log(`User found with ID: ${userId}, proceeding to update team with ID: ${id}`);
    const team = await this.teamsRepo.findOne({
      where: { id },
      relations: ["players", "bench_players", "auras", "storage"],
    });

    if (!team) {
      this.logger.log(`Failed to update team: Team not found with ID: ${id}`);
      throw new NotFoundException("Team not found");
    }

    if (dto.name !== undefined) team.name = dto.name;
    if (dto.players !== undefined) team.players = dto.players;
    if (dto.bench_players !== undefined) team.bench_players = dto.bench_players;
    if (dto.auras !== undefined) team.auras = dto.auras;

    const response = await this.teamsRepo.save(team);
    this.logger.log(`Team updated successfully with ID: ${id}`);
    return response;
  }

  async delete(id: string, userId: string) {
    this.logger.log(`Deleting team with ID: ${id} for user ID: ${userId}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`Failed to delete team: User not found with ID: ${userId}`);
      throw new NotFoundException("User not found");
    }

    const team = await this.findOne(id);
    await this.teamsRepo.remove(team);

    this.logger.log(`Team deleted successfully with ID: ${id}`);
    return { message: "Team deleted successfully" };
  }
}
