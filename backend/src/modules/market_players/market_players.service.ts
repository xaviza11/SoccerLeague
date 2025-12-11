import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketPlayer, Player, User } from '../../entities';

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

  async create(payload: { player_id: string; price: number; seller_id: string }): Promise<MarketPlayer> {
    const { player_id, price, seller_id } = payload;

    if (price < 0) throw new BadRequestException('Price must be positive');

    const player = await this.playersRepo.findOne({ where: { id: player_id } });
    if (!player) throw new NotFoundException('Player not found');

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) throw new NotFoundException('Seller not found');

    const marketPlayer = this.marketPlayersRepo.create({ player_id, seller_id, price, player });
    return this.marketPlayersRepo.save(marketPlayer);
  }

  async findAll(): Promise<MarketPlayer[]> {
    return this.marketPlayersRepo.find({ relations: ['player'], order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<MarketPlayer> {
    const record = await this.marketPlayersRepo.findOne({ where: { id }, relations: ['player'] });
    if (!record) throw new NotFoundException('MarketPlayer not found');
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketPlayer[]> {
    return this.marketPlayersRepo.find({ where: { seller_id }, relations: ['player'], order: { createdAt: 'DESC' } });
  }

  async updatePrice(id: string, price: number, userId: string): Promise<MarketPlayer> {
    if (price < 0) throw new BadRequestException('Price must be positive');

    const record = await this.findOne(id);
    if (record.seller_id !== userId) throw new ForbiddenException('You can only update your own listings');

    record.price = price;
    return this.marketPlayersRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.marketPlayersRepo.remove(record);
  }
}
