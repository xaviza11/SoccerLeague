import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketAura, Aura, User } from '../../entities';

@Injectable()
export class MarketAurasService {
  constructor(
    @InjectRepository(MarketAura)
    private readonly marketAurasRepo: Repository<MarketAura>,

    @InjectRepository(Aura)
    private readonly aurasRepo: Repository<Aura>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(payload: {
    aura_id: string;
    seller_id: string;
    price: number;
  }): Promise<MarketAura> {
    const { aura_id, seller_id, price } = payload;

    if (price < 0) throw new BadRequestException('Price must be positive');

    const aura = await this.aurasRepo.findOne({ where: { id: aura_id } });
    if (!aura) throw new NotFoundException('Aura not found');

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) throw new NotFoundException('Seller not found');

    const marketAura = this.marketAurasRepo.create({
      aura_id,
      seller_id,
      price,
    });

    return this.marketAurasRepo.save(marketAura);
  }

  async findAll(): Promise<MarketAura[]> {
    return this.marketAurasRepo.find({
      relations: ['aura'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MarketAura> {
    const record = await this.marketAurasRepo.findOne({
      where: { id },
      relations: ['aura'],
    });

    if (!record) throw new NotFoundException('MarketAura not found');
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketAura[]> {
    return this.marketAurasRepo.find({
      where: { seller_id },
      relations: ['aura'],
    });
  }

  async updatePrice(id: string, price: number, userId: string): Promise<MarketAura> {
    if (price < 0) throw new BadRequestException('Price must be positive');

    const record = await this.findOne(id);
    if (record.seller_id !== userId) throw new BadRequestException('You can only update your own listings');

    record.price = price;
    return this.marketAurasRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.marketAurasRepo.remove(record);
  }
}
