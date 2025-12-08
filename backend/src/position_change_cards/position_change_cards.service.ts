import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionChangeCard, Storage, User } from '../entities';
import { Positions } from '../enums/';

function getRandomPosition(): Positions {
  const positionsArray = Object.values(Positions);
  const randomIndex = Math.floor(Math.random() * positionsArray.length);
  return positionsArray[randomIndex] as Positions;
}

@Injectable()
export class PositionChangeCardsService {
  constructor(
    @InjectRepository(PositionChangeCard)
    private readonly positionChangeCardRepo: Repository<PositionChangeCard>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  async create(storage: string, userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (!storage) {
      throw new BadRequestException('Storage is required');
    }

    const newCard = this.positionChangeCardRepo.create({
      new_position: getRandomPosition(),
      storage_id: storage,
    });

    await this.positionChangeCardRepo.save(newCard);
    return newCard;
  }

  async findAll() {
    return this.positionChangeCardRepo.find();
  }

  async findOne(id: string, userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const card = await this.positionChangeCardRepo.findOne({
      where: {
        id,
        storage: { user: { id: userId } },
      },
      relations: ['storage', 'storage.user'],
    });

    if (!card) {
      throw new NotFoundException(
        'Card not found or does not belong to this user',
      );
    }

    return card;
  }

  async findAllByUser(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.positionChangeCardRepo.find({
      where: {
        storage: { user: { id: userId } },
      },
      relations: ['storage'],
    });
  }

  async deleteOne(id: string, userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const card = await this.positionChangeCardRepo.findOne({
      where: {
        id,
        storage: { user: { id: userId } },
      },
      relations: ['storage', 'storage.user'],
    });

    if (!card) {
      throw new NotFoundException(
        'Card not found or does not belong to this user',
      );
    }

    await this.positionChangeCardRepo.delete(id);

    return { message: 'Card deleted successfully' };
  }
}
