import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketAura, Aura, User } from '../../entities';
import { Logger } from '@nestjs/common';

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

  private readonly logger = new Logger(MarketAurasService.name);

  async create(payload: {
    aura_id: string;
    seller_id: string;
    price: number;
  }): Promise<MarketAura> {
    this.logger.log(
      `Creating market aura with payload: ${JSON.stringify(payload)}`,
    );
    const { aura_id, seller_id, price } = payload;

    if (price < 0) {
      this.logger.log(
        `Attempted to create market aura with negative price: ${price}`,
      );
      throw new BadRequestException('Price must be positive');
    }

    const aura = await this.aurasRepo.findOne({ where: { id: aura_id } });
    if (!aura) {
      this.logger.log(`Aura not found with id: ${aura_id}`);
      throw new NotFoundException('Aura not found');
    }

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) {
      this.logger.log(`Seller not found with id: ${seller_id}`);
      throw new NotFoundException('Seller not found');
    }

    const marketAura = this.marketAurasRepo.create({
      aura_id,
      seller_id,
      price,
    });

    const response = await this.marketAurasRepo.save(marketAura);
    this.logger.log(`Market aura created successfully with ID: ${response.id}`);
    return response;
  }

  async findAll(): Promise<MarketAura[]> {
    this.logger.log('Fetching all market auras');
    const response = await this.marketAurasRepo.find({
      relations: ['aura'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log('All market auras fetched successfully');
    return response;
  }

  async findOne(id: string): Promise<MarketAura> {
    this.logger.log(`Fetching market aura with id: ${id}`);
    const record = await this.marketAurasRepo.findOne({
      where: { id },
      relations: ['aura'],
    });

    if (!record) {
      this.logger.log(`MarketAura not found with id: ${id}`);
      throw new NotFoundException('MarketAura not found');
    }
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketAura[]> {
    this.logger.log(`Fetching market auras for seller with id: ${seller_id}`);
    const response = await this.marketAurasRepo.find({
      where: { seller_id },
      relations: ['aura'],
    });
    this.logger.log(`Market auras for seller with id: ${seller_id} retrieved successfully`);
    return response;
  }

  async updatePrice(
    id: string,
    price: number,
    userId: string,
  ): Promise<MarketAura> {
    this.logger.log(
      `Updating price for market aura with id: ${id} to ${price}`,
    );
    if (price < 0) {
      this.logger.log(
        `Attempted to update market aura with negative price: ${price}`,
      );
      throw new BadRequestException('Price must be positive');
    }

    const record = await this.findOne(id);

    if (record.seller_id !== userId) {
      this.logger.log(`User ${userId} attempted to update market aura ${id} not owned by them`)
      throw new BadRequestException('You can only update your own listings');
    }
      
    record.price = price;
    const response = await this.marketAurasRepo.save(record);
    this.logger.log(`Market aura with id: ${id} updated successfully`);
    return response;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing market aura with id: ${id}`);
    const record = await this.findOne(id);
    await this.marketAurasRepo.remove(record);
    this.logger.log(`Market aura with id: ${id} removed successfully`);
  }
}
