import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketPositionChangeCard, PositionChangeCard, User } from '../../entities';

@Injectable()
export class MarketPositionChangeCardsService {
  constructor(
    @InjectRepository(MarketPositionChangeCard)
    private readonly marketCardsRepo: Repository<MarketPositionChangeCard>,

    @InjectRepository(PositionChangeCard)
    private readonly cardsRepo: Repository<PositionChangeCard>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(payload: { position_change_card_id: string; price: number; seller_id: string }): Promise<MarketPositionChangeCard> {
    const { position_change_card_id, price, seller_id } = payload;

    if (price < 0) throw new BadRequestException('Price must be positive');

    const card = await this.cardsRepo.findOne({ where: { id: position_change_card_id } });
    if (!card) throw new NotFoundException('PositionChangeCard not found');

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) throw new NotFoundException('Seller not found');

    const marketCard = this.marketCardsRepo.create({ position_change_card_id, seller_id, price, positionChangeCard: card });
    return this.marketCardsRepo.save(marketCard);
  }

  async findAll(): Promise<MarketPositionChangeCard[]> {
    return this.marketCardsRepo.find({ relations: ['positionChangeCard'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<MarketPositionChangeCard> {
    const record = await this.marketCardsRepo.findOne({ where: { id }, relations: ['positionChangeCard'] });
    if (!record) throw new NotFoundException('MarketPositionChangeCard not found');
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketPositionChangeCard[]> {
    return this.marketCardsRepo.find({ where: { seller_id }, relations: ['positionChangeCard'], order: { createdAt: 'DESC' } });
  }

  async updatePrice(id: string, price: number, userId: string): Promise<MarketPositionChangeCard> {
    if (price < 0) throw new BadRequestException('Price must be positive');

    const record = await this.findOne(id);
    if (record.seller_id !== userId) throw new ForbiddenException('You can only update your own listings');

    record.price = price;
    return this.marketCardsRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.marketCardsRepo.remove(record);
  }
}
