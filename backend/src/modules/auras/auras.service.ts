import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aura, Storage, User } from '../../entities';
import { validate as isUUID } from 'uuid';
import { Auras } from '../../enums';
import { Logger } from '@nestjs/common';

@Injectable()
export class AurasService {
  constructor(
    @InjectRepository(Aura)
    private readonly auraRepo: Repository<Aura>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  private readonly logger = new Logger(AurasService.name);

  private createRandomAuraName(): Auras {
    const values = Object.values(Auras);
    return values[Math.floor(Math.random() * values.length)] as Auras;
  }

  async create(userId: string): Promise<Aura> {
    this.logger.log(`Creating aura for user with id: ${userId}`);

    if (!isUUID(userId)) {
      this.logger.log(`Invalid user ID: ${userId}`);
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['storage'],
    });

    if (!user) {
      this.logger.log(`User not found with id: ${userId}`);
      throw new NotFoundException('User not found');
    }

    if (!user.storage) {
      this.logger.log(`User storage not found for user id: ${userId}`);
      throw new NotFoundException('User storage not found');
    } 

    const newAura = this.auraRepo.create({
      name: this.createRandomAuraName(),
      storage_id: user.storage.id,
    });

    const response = await this.auraRepo.save(newAura);
    this.logger.log(`Aura created successfully with ID: ${response.id}`);
    return response;
  }

  async findOne(auraId: string, userId: string): Promise<Aura> {
    this.logger.log(`Fetching aura with id: ${auraId} for user with id: ${userId}`);
    if (!isUUID(auraId)) {
      this.logger.log(`Invalid aura ID: ${auraId}`);
      throw new BadRequestException('Invalid aura ID');
    } 
    if (!isUUID(userId)) {
      this.logger.log(`Invalid user ID: ${userId}`);
      throw new BadRequestException('Invalid user ID');
    } 

    const aura = await this.auraRepo.findOne({
      where: {
        id: auraId,
        storage: { user: { id: userId } },
      },
      relations: ['storage', 'storage.user'],
    });

    if (!aura) {
      this.logger.log(`Aura not found with id: ${auraId} for user with id: ${userId}`);
      throw new NotFoundException(
        'Aura not found or does not belong to this user',
      );
    }

    this.logger.log(`Aura found with id: ${auraId} for user with id: ${userId}`);
    return aura;
  }

  async findAll(): Promise<Aura[]> {
    this.logger.log('Fetching all auras');
    const response = await this.auraRepo.find({ relations: ['storage'] });
    this.logger.log(`Found ${response.length} auras`);
    return response;
  }

  async findAllByUser(userId: string): Promise<Aura[]> {
    this.logger.log(`Fetching all auras for user with id: ${userId}`);
    if (!isUUID(userId)) {
      this.logger.log(`Invalid user ID: ${userId}`);
      throw new BadRequestException('Invalid user ID');
    } 

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['storage'],
    });

    if (!user) {
      this.logger.log(`User not found with id: ${userId}`);
      throw new NotFoundException('User not found');
    } 
    if (!user.storage) {
      this.logger.log(`User storage not found for user id: ${userId}`);
      throw new NotFoundException('User storage not found');
    } 

    const response = await this.auraRepo.find({
      where: { storage_id: user.storage.id },
      relations: ['storage'],
    });
    this.logger.log(`Found ${response.length} auras for user with id: ${userId}`);
    return response;
  }

  async delete(auraId: string): Promise<{ message: string }> {
    this.logger.log(`Deleting aura with id: ${auraId}`);
    if (!isUUID(auraId)) {
      this.logger.log(`Invalid aura ID: ${auraId}`);
      throw new BadRequestException('Invalid aura ID');
    } 

    const aura = await this.auraRepo.findOne({
      where: { id: auraId },
      relations: ['storage', 'storage.user'],
    });

    if (!aura) {
      this.logger.log(`Aura not found with id: ${auraId}`);
      throw new NotFoundException(
        'Aura not found or does not belong to this user',
      );
    }

    await this.auraRepo.delete(auraId);
    this.logger.log(`Aura deleted with id: ${auraId}`);
    return { message: 'Aura deleted successfully' };
  }
}
