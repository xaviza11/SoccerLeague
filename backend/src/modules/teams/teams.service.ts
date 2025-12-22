import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, Storage, User } from '../../entities';

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

  async create(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const storage = this.storageRepo.create();
    await this.storageRepo.save(storage);

    const team = this.teamsRepo.create({
      name: `YourTeam`,
      storage,
      players: [],
      bench_players: [],
      auras: [],
    });

    return await this.teamsRepo.save(team);
  }

  async find() {
    return this.teamsRepo.find({
      relations: ['players', 'bench_players', 'auras', 'storage'],
    });
  }

  async findOne(id: string) {
    const team = await this.teamsRepo.findOne({
      where: { id },
      relations: ['players', 'bench_players', 'auras', 'storage'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(id: string, dto: Partial<Team>, userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const team = await this.teamsRepo.findOne({
      where: { id },
      relations: ['players', 'bench_players', 'auras', 'storage'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (dto.name !== undefined) team.name = dto.name;
    if (dto.players !== undefined) team.players = dto.players;
    if (dto.bench_players !== undefined) team.bench_players = dto.bench_players;
    if (dto.auras !== undefined) team.auras = dto.auras;

    return this.teamsRepo.save(team);
  }

  async delete(id: string, userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const team = await this.findOne(id);
    await this.teamsRepo.remove(team);

    return { message: 'Team deleted successfully' };
  }
}

