import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MarketCard, Card, User } from "../../entities";
import { Logger } from "@nestjs/common";

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

  private readonly logger = new Logger(MarketCardsService.name);

  async create(payload: {
    card_id: string;
    price: number;
    seller_id: string;
  }): Promise<MarketCard> {
    this.logger.log(`Creating market card with payload: ${JSON.stringify(payload)}`);
    const { card_id, price, seller_id } = payload;

    if (price < 0) {
      this.logger.log(`Attempted to create market card with negative price: ${price}`);
      throw new BadRequestException("Price must be positive");
    }

    const card = await this.cardsRepo.findOne({ where: { id: card_id } });
    if (!card) {
      this.logger.log(`Card not found with id: ${card_id}`);
      throw new NotFoundException("Card not found");
    }

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) {
      this.logger.log(`Seller not found with id: ${seller_id}`);
      throw new NotFoundException("Seller not found");
    }

    const marketCard = this.marketCardsRepo.create({ card_id, seller_id, price });
    const response = await this.marketCardsRepo.save(marketCard);
    this.logger.log(`Market card created successfully with ID: ${response.id}`);
    return response;
  }

  async findAll(): Promise<MarketCard[]> {
    this.logger.log("Fetching all market cards");
    const response = await this.marketCardsRepo.find({
      relations: ["card"],
      order: { createdAt: "DESC" },
    });
    this.logger.log("All market cards fetched successfully");
    return response;
  }

  async findOne(id: string): Promise<MarketCard> {
    this.logger.log(`Fetching market card with id: ${id}`);
    const record = await this.marketCardsRepo.findOne({ where: { id }, relations: ["card"] });
    if (!record) {
      this.logger.log(`MarketCard not found with id: ${id}`);
      throw new NotFoundException("MarketCard not found");
    }
    this.logger.log(`MarketCard found`);
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketCard[]> {
    this.logger.log(`Fetching market cards for seller with id: ${seller_id}`);
    const response = await this.marketCardsRepo.find({ where: { seller_id }, relations: ["card"] });
    this.logger.log(`Market cards for seller with id: ${seller_id} retrieved successfully`);
    return response;
  }

  async updatePrice(id: string, price: number, userId: string): Promise<MarketCard> {
    this.logger.log(`Updating price for market card with id: ${id} to ${price}`);
    if (price < 0) {
      this.logger.log(`Attempted to update market card with negative price: ${price}`);
      throw new BadRequestException("Price must be positive");
    }
    const record = await this.findOne(id);
    if (record.seller_id !== userId) {
      this.logger.log(`User ${userId} attempted to update market card ${id} not owned by them`);
      throw new BadRequestException("You can only update your own listings");
    }
    record.price = price;
    const response = await this.marketCardsRepo.save(record);
    this.logger.log(`Market card with id: ${id} updated successfully`);
    return response;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing market card with id: ${id}`);
    const record = await this.findOne(id);
    await this.marketCardsRepo.remove(record);
    this.logger.log(`Market card with id: ${id} removed successfully`);
  }
}
