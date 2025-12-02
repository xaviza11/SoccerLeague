import {
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage, Card, Team, PositionChangeCard } from '../entities';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UsersStorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,

    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,

    @InjectRepository(PositionChangeCard)
    private readonly pcRepo: Repository<PositionChangeCard>,

    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async createStorage(): Promise<Storage> {
    const storage = this.storageRepo.create();
    return this.storageRepo.save(storage);
  }

  async addPositionChangeCard(id: string, cardId: string): Promise<Storage> {
    const storage = await this.findOne(id);

    const card = await this.pcRepo.findOne({ where: { id: cardId } });
    if (!card) throw new NotFoundException('PositionChangeCard not found');

    card.storage = storage;
    await this.pcRepo.save(card);

    return this.findOne(id);
  }

  async addCard(id: string, cardId: string): Promise<Storage> {
    if (!isUUID(id)) {
      throw new NotFoundException('Storage not found');
    }

    const storage = await this.findOne(id);

    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    card.storage = storage;
    await this.cardRepo.save(card);

    return this.findOne(id);
  }

  async addTeam(id: string, teamId: string): Promise<Storage> {
    const storage = await this.findOne(id);

    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');

    storage.team = team;
    return this.storageRepo.save(storage);
  }

  async deleteStorage(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new NotFoundException('Storage not found');
    }

    const result = await this.storageRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }
  }

  async findOne(id: string): Promise<Storage> {
    const storage = await this.storageRepo.findOne({
      where: { id },
      relations: {
        cards: true,
        position_change_cards: true,
        team: true,
        user: true,
      },
    });

    if (!storage) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }

    return storage;
  }

  async findAll(): Promise<Storage[]> {
    return this.storageRepo.find({
      relations: {
        cards: true,
        position_change_cards: true,
        team: true,
        user: true,
      },
    });
  }
}
