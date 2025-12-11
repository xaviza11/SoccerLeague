import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketCard, Card, User } from '../../entities';

@Injectable()
export class MarketCardsService {
  constructor(
    @InjectRepository(MarketCard)
    private readonly marketCardsRepo: Repository<MarketCard>,

    @InjectRepository(Card)
    private readonly cardsRepo: Repository<Card>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(payload: { card_id: string; price: number; seller_id: string }): Promise<MarketCard> {
    const { card_id, price, seller_id } = payload;

    if (price < 0) throw new BadRequestException('Price must be positive');

    const card = await this.cardsRepo.findOne({ where: { id: card_id } });
    if (!card) throw new NotFoundException('Card not found');

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) throw new NotFoundException('Seller not found');

    const marketCard = this.marketCardsRepo.create({ card_id, seller_id, price });
    return this.marketCardsRepo.save(marketCard);
  }

  async findAll(): Promise<MarketCard[]> {
    return this.marketCardsRepo.find({ relations: ['card'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<MarketCard> {
    const record = await this.marketCardsRepo.findOne({ where: { id }, relations: ['card'] });
    if (!record) throw new NotFoundException('MarketCard not found');
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketCard[]> {
    return this.marketCardsRepo.find({ where: { seller_id }, relations: ['card'] });
  }

  async updatePrice(id: string, price: number, userId: string): Promise<MarketCard> {
    if (price < 0) throw new BadRequestException('Price must be positive');
    const record = await this.findOne(id);
    if (record.seller_id !== userId) throw new BadRequestException('You can only update your own listings');
    record.price = price;
    return this.marketCardsRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.marketCardsRepo.remove(record);
  }
}
