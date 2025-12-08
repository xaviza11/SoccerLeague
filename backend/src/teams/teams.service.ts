import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, Storage } from '../entities';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepo: Repository<Team>,

    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  async create() {
    const storage = this.storageRepo.create();
    await this.storageRepo.save(storage);

    const team = this.teamsRepo.create({
      storage,
      players: [],
    });

    return await this.teamsRepo.save(team);
  }

  async find() {
    return this.teamsRepo.find({
      relations: ['players', 'storage'],
    });
  }

  async findOne(id: string) {
    const team = await this.teamsRepo.findOne({
      where: { id },
      relations: ['players', 'storage'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async update(id: string, dto: any) {
    const team = await this.findOne(id);

    Object.assign(team, dto);

    return this.teamsRepo.save(team);
  }

  async delete(id: string) {
    const team = await this.findOne(id);
    await this.teamsRepo.remove(team);

    return { message: 'Team deleted successfully' };
  }
}
