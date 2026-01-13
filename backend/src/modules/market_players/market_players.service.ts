import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketPlayer, Player, User } from '../../entities';
import { Logger } from '@nestjs/common';

@Injectable()
export class MarketPlayersService {
  constructor(
    @InjectRepository(MarketPlayer)
    private readonly marketPlayersRepo: Repository<MarketPlayer>,

    @InjectRepository(Player)
    private readonly playersRepo: Repository<Player>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  private readonly logger = new Logger(MarketPlayersService.name);

  async create(payload: {
    player_id: string;
    price: number;
    seller_id: string;
  }): Promise<MarketPlayer> {
    this.logger.log(`Creating market player entry`);
    const { player_id, price, seller_id } = payload;

    if (price < 0) {
      this.logger.error(`Price must be positive: ${price}`);
      throw new BadRequestException('Price must be positive');
    }

    const player = await this.playersRepo.findOne({ where: { id: player_id } });
    if (!player) {
      this.logger.error(`Player with ID ${player_id} not found`);
      throw new NotFoundException('Player not found');
    }

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) {
      this.logger.error(`Seller with ID ${seller_id} not found`);
      throw new NotFoundException('Seller not found');
    }

    const marketPlayer = this.marketPlayersRepo.create({
      player_id,
      seller_id,
      price,
      player,
    });
    const response = await this.marketPlayersRepo.save(marketPlayer);
    this.logger.log(`Market player entry created successfully`);
    return response;
  }

  async findAll(): Promise<MarketPlayer[]> {
    this.logger.log(`Fetching all market player entries`);
    const response = await this.marketPlayersRepo.find({
      relations: ['player'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`All market player entries fetched successfully`);
    return response;
  }

  async findOne(id: string): Promise<MarketPlayer> {
    this.logger.log(`Fetching market player entry with ID: ${id}`);
    const record = await this.marketPlayersRepo.findOne({
      where: { id },
      relations: ['player'],
    });
    if (!record) {
      this.logger.error(`MarketPlayer with ID ${id} not found`);
      throw new NotFoundException('MarketPlayer not found');
    }
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketPlayer[]> {
    this.logger.log(
      `Fetching market player entries for seller ID: ${seller_id}`,
    );
    const response = await this.marketPlayersRepo.find({
      where: { seller_id },
      relations: ['player'],
      order: { createdAt: 'DESC' },
    });
    this.logger.log(
      `Market player entries for seller ID ${seller_id} retrieved successfully`,
    );
    return response;
  }

  async updatePrice(
    id: string,
    price: number,
    userId: string,
  ): Promise<MarketPlayer> {
    this.logger.log(`Updating price for market player entry with ID: ${id}`);
    if (price < 0) {
      this.logger.error(`Price must be positive: ${price}`);
      throw new BadRequestException('Price must be positive');
    }

    const record = await this.findOne(id);
    if (record.seller_id !== userId) {
      this.logger.error(
        `User with ID ${userId} is not the seller of market player entry with ID ${id}`,
      );
      throw new ForbiddenException('You can only update your own listings');
    }

    record.price = price;
    const response = await this.marketPlayersRepo.save(record);

    this.logger.log(
      `Price for market player entry with ID ${id} updated successfully`,
    );
    return response;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing market player entry with ID: ${id}`);
    const record = await this.findOne(id);
    await this.marketPlayersRepo.remove(record);
    this.logger.log(`Market player entry with ID ${id} removed successfully`);
  }
}
