import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionChangeCard, Storage, User } from '../../entities';
import { Positions } from '../../enums';
import { Logger } from '@nestjs/common';


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

  private readonly logger = new Logger(PositionChangeCardsService.name)

  async create(storage: string, userId: string) {
    this.logger.log(`Creating position change card for user ID: ${userId} with storage ID: ${storage}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`Failed to create position change card: User not found with ID: ${userId}`);
      throw new NotFoundException('User not found');
    } 

    if (!storage) {
      this.logger.log(`Failed to create position change card: Storage ID is required`);
      throw new BadRequestException('Storage is required');
    }

    const newCard = this.positionChangeCardRepo.create({
      new_position: getRandomPosition(),
      storage_id: storage,
    });

    this.logger.log(`Position change card created successfully for user ID: ${userId}`);
    await this.positionChangeCardRepo.save(newCard);
    return newCard;
  }

  async findAll() {
    this.logger.log(`Fetching all position change cards`);
    const response = await this.positionChangeCardRepo.find();
    this.logger.log(`Position change cards retrieved successfully`);
    return response;
  }

  async findOne(id: string, userId: string) {
    this.logger.log(`Fetching position change card with ID: ${id} for user ID: ${userId}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`Failed to fetch position change card: User not found with ID: ${userId}`);
      throw new NotFoundException('User not found');
    } 

    const card = await this.positionChangeCardRepo.findOne({
      where: {
        id,
        storage: { user: { id: userId } },
      },
      relations: ['storage', 'storage.user'],
    });

    if (!card) {
      this.logger.log(`Position change card not found with ID: ${id} for user ID: ${userId}`);
      throw new NotFoundException(
        'Card not found or does not belong to this user',
      );
    }

    this.logger.log(`Position change card retrieved successfully with ID: ${id} for user ID: ${userId}`);
    return card;
  }

  async findAllByUser(userId: string) {
    this.logger.log(`Fetching all position change cards for user ID: ${userId}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`Failed to fetch position change cards: User not found with ID: ${userId}`);
      throw new NotFoundException('User not found');
    } 

    const response = await this.positionChangeCardRepo.find({
      where: {
        storage: { user: { id: userId } },
      },
      relations: ['storage'],
    });
    this.logger.log(`Position change cards retrieved successfully for user ID: ${userId}`);
    return response;
  }

  async deleteOne(id: string) {
    this.logger.log(`Deleting position change card with ID: ${id}`);
    const card = await this.positionChangeCardRepo.findOne({
      where: {
        id,
      },
      relations: ['storage', 'storage.user'],
    });

    if (!card) {
      this.logger.log(`Position change card not found with ID: ${id}`);
      throw new NotFoundException(
        'Card not found or does not belong to this user',
      );
    }

    await this.positionChangeCardRepo.delete(id);

    this.logger.log(`Position change card deleted successfully with ID: ${id}`);
    return { message: 'Card deleted successfully' };
  }
}
