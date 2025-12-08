import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card, Storage, User } from '../entities';
import { validate as isUUID } from 'uuid';
import { Cards } from '../enums';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardsRepo: Repository<Card>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,

    @InjectRepository(Storage)
    private readonly storageRepo: Repository<Storage>,
  ) {}

  private createRandomCardName(): Cards {
    const values = Object.values(Cards);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex] as Cards;
  }

  async create(userId: string): Promise<Card> {
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['storage'] });
    if (!user) throw new NotFoundException('User not found');
    if (!user.storage) throw new NotFoundException('User storage not found');

    const newCard = this.cardsRepo.create({
      name: this.createRandomCardName(),
      storage: user.storage,
    });

    await this.cardsRepo.save(newCard);
    return newCard;
  }

  async findOne(cardId: string, userId: string): Promise<Card> {
    if (!isUUID(cardId)) throw new BadRequestException('Invalid card ID');
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const card = await this.cardsRepo.findOne({
      where: { id: cardId, storage: { user: { id: userId } } },
      relations: ['storage', 'storage.user'],
    });

    if (!card) throw new NotFoundException('Card not found or does not belong to this user');

    return card;
  }

  async findAll(): Promise<Card[]> {
    return this.cardsRepo.find({ relations: ['storage'] });
  }

  async findAllByUser(userId: string): Promise<Card[]> {
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['storage'] });
    if (!user) throw new NotFoundException('User not found');
    if (!user.storage) throw new NotFoundException('User storage not found');

    return this.cardsRepo.find({
      where: { storage: { id: user.storage.id } },
      relations: ['storage'],
    });
  }

  async delete(cardId: string, userId: string): Promise<{ message: string }> {
    if (!isUUID(cardId)) throw new BadRequestException('Invalid card ID');
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const card = await this.cardsRepo.findOne({
      where: { id: cardId, storage: { user: { id: userId } } },
      relations: ['storage', 'storage.user'],
    });

    if (!card) throw new NotFoundException('Card not found or does not belong to this user');

    await this.cardsRepo.delete(cardId);

    return { message: 'Card deleted successfully' };
  }
}
