import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Player } from '../entities';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Player)
    private readonly playersRepo: Repository<Player>,
  ) {}

  async create(data: Partial<Player>): Promise<Player> {

    const user = await this.usersRepo.findOne({ where: { id: data.id } });
    if (!user) throw new NotFoundException('User not found');

    const player = this.playersRepo.create({
      ...data,
      skills: data.skills || {},
      stats: data.stats || {},
      instructions: data.instructions || {},
      status: data.status || { age: 18, retirement_age: 40, is_active: true },
    });
    return this.playersRepo.save(player);
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playersRepo.findOne({
      where: { id },
      relations: ['card'],
    });
    if (!player) throw new NotFoundException('Player not found');
    return player;
  }

  async findAll(): Promise<Player[]> {
    return this.playersRepo.find({ relations: ['card'] });
  }

  async update(id: string, data: Partial<Player>): Promise<Player> {

    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const player = await this.findOne(id);
    Object.assign(player, data);
    return this.playersRepo.save(player);
  }

  async findAllPlayersByUser(userId: string): Promise<Player[]> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const players = await this.playersRepo.find({
      relations: ['team', 'team.storage', 'team.storage.user'],
      where: { team: { storage: { user: { id: userId } } } },
    });

    return players;
  }

  async delete(id: string): Promise<void> {

    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const player = await this.findOne(id);
    await this.playersRepo.remove(player);
  }
}
