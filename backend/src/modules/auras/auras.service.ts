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

  private createRandomAuraName(): Auras {
    const values = Object.values(Auras);
    return values[Math.floor(Math.random() * values.length)] as Auras;
  }

  async create(userId: string): Promise<Aura> {
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['storage'],
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.storage) throw new NotFoundException('User storage not found');

    const newAura = this.auraRepo.create({
      name: this.createRandomAuraName(),
      storage_id: user.storage.id, 
    });

    return await this.auraRepo.save(newAura);
  }

  async findOne(auraId: string, userId: string): Promise<Aura> {
    if (!isUUID(auraId)) throw new BadRequestException('Invalid aura ID');
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const aura = await this.auraRepo.findOne({
      where: {
        id: auraId,
        storage: { user: { id: userId } },
      },
      relations: ['storage', 'storage.user'],
    });

    if (!aura) {
      throw new NotFoundException(
        'Aura not found or does not belong to this user',
      );
    }

    return aura;
  }

  async findAll(): Promise<Aura[]> {
    return this.auraRepo.find({ relations: ['storage'] });
  }

  async findAllByUser(userId: string): Promise<Aura[]> {
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['storage'],
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.storage) throw new NotFoundException('User storage not found');

    return this.auraRepo.find({
      where: { storage_id: user.storage.id },
      relations: ['storage'],
    });
  }

  async delete(auraId: string): Promise<{ message: string }> {
    if (!isUUID(auraId)) throw new BadRequestException('Invalid aura ID');

    const aura = await this.auraRepo.findOne({
      where: { id: auraId },
      relations: ['storage', 'storage.user'],
    });

    if (!aura) {
      throw new NotFoundException(
        'Aura not found or does not belong to this user',
      );
    }

    await this.auraRepo.delete(auraId);

    return { message: 'Aura deleted successfully' };
  }
}
