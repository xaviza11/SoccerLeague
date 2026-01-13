import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Storage, Card, Team, PositionChangeCard, User } from '../../entities';
import { validate as isUUID } from 'uuid';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersStorageService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,

    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,

    @InjectRepository(PositionChangeCard)
    private readonly pcRepo: Repository<PositionChangeCard>,

    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  private readonly logger = new Logger(UsersStorageService.name);

  async createStorage(userId: string): Promise<Storage> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    this.logger.log(`Creating storage for user ID: ${userId}`);

    if (!user) {
      this.logger.log(`User found on creating storage`);
      throw new NotFoundException('User not found');
    }

    const storage = this.storageRepo.create();
    this.logger.log(`Storage entity created, saving to database`);

    user.storage = storage;
    await this.usersRepo.save(user);

    this.logger.log(`Storage saved successfully for user ID: ${userId}`);
    return storage;
  }

  async addPositionChangeCard(id: string, cardId: string): Promise<Storage> {
    this.logger.log(`Adding PositionChangeCard ID: ${cardId} to Storage ID: ${id}`);
    const storage = await this.findOne(id);

    const card = await this.pcRepo.findOne({ where: { id: cardId } });

    if (!card) {
      this.logger.log(`PositionChangeCard not found`);
      throw new NotFoundException('PositionChangeCard not found');
    }

    card.storage = storage;
    await this.pcRepo.save(card);

    this.logger.log(
      `PositionChangeCard added successfully to Storage ID: ${id}`,
    );

    const response = await this.findOne(id);

    this.logger.log(`Returning updated Storage ID: ${id}`);
    return response
  }

  async addCard(id: string, cardId: string): Promise<Storage> {
    this.logger.log(`Adding Card ID: ${cardId} to Storage ID: ${id}`);
    if (!isUUID(id)) {
      this.logger.log(`Invalid Storage ID format`);
      throw new NotFoundException('Storage not found');
    }

    const storage = await this.findOne(id);
    if (!storage) {
      this.logger.log(`Storage not found`);
      throw new NotFoundException('Storage not found');
    }

    const card = await this.cardRepo.findOne({ where: { id: cardId } });
    if (!card) {
      this.logger.log(`Card not found`);
      throw new NotFoundException('Card not found');
    }

    card.storage = storage;
    await this.cardRepo.save(card);

    const response = await this.findOne(id);
    this.logger.log(`Card added successfully to Storage ID: ${id}`);
    return response;
  }

  async addTeam(userId: string, teamId: string, id: string): Promise<Storage> {
    this.logger.log(
      `Adding Team ID: ${teamId} to Storage ID: ${id} for User ID: ${userId}`,
    );
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`User not found`);
      throw new NotFoundException('User not found');
    }

    const storage = await this.findOne(id);
    if (!storage) {
      this.logger.log(`Storage not found`);
      throw new NotFoundException('Storage not found');
    }

    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      this.logger.log(`Team not found`);
      throw new NotFoundException('Team not found');
    }

    storage.team = team;

    const response = await this.storageRepo.save(storage);

    this.logger.log(`Team added successfully to Storage ID: ${id}`);
    return response
  }

  async deleteStorage(userId: string, id: string): Promise<void> {
    this.logger.log(`Deleting Storage ID: ${id} for User ID: ${userId}`);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.log(`User not found`);
      throw new NotFoundException('User not found');
    }

    if (!isUUID(id)) {
      this.logger.log(`Invalid Storage ID format`);
      throw new NotFoundException('Storage not found');
    }

    const result = await this.storageRepo.delete(id);
    if (result.affected === 0) {
      this.logger.log(`Storage not found on deletion`);
      throw new NotFoundException(`Storage not found`);
    }

    this.logger.log(`Storage ID: ${id} deleted successfully`);
  }

  async findOne(id: string): Promise<Storage> {
    this.logger.log(`Retrieving Storage ID: ${id}`);
    const storage = await this.storageRepo.findOne({
      where: { id },
      relations: {
        cards: true,
        position_change_cards: true,
        team: true,
      },
    });

    if (!storage) {
      this.logger.log(`Storage not found`);
      throw new NotFoundException(`Storage not found`);
    }

    this.logger.log(`Storage ID: ${id} retrieved successfully`);
    return storage;
  }

  async findAll(): Promise<Storage[]> { 
    this.logger.log('Fetching all storages');
    const response = await this.storageRepo.find({
      relations: {
        cards: true,
        position_change_cards: true,
        team: true,
        user: true,
      },
    });
    this.logger.log('All storages fetched successfully');
    return response
  }
}
