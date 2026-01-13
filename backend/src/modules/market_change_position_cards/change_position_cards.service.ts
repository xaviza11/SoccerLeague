import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MarketPositionChangeCard, PositionChangeCard, User } from "../../entities";
import { Logger } from "@nestjs/common";

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

  private readonly logger = new Logger(MarketPositionChangeCardsService.name);

  async create(payload: {
    position_change_card_id: string;
    price: number;
    seller_id: string;
  }): Promise<MarketPositionChangeCard> {
    this.logger.log(`Creating market position change card entry`);
    const { position_change_card_id, price, seller_id } = payload;

    if (price < 0) {
      this.logger.error(`Price must be positive: ${price}`);
      throw new BadRequestException("Price must be positive");
    }

    const card = await this.cardsRepo.findOne({ where: { id: position_change_card_id } });
    if (!card) {
      this.logger.error(`PositionChangeCard with ID ${position_change_card_id} not found`);
      throw new NotFoundException("PositionChangeCard not found");
    }

    const seller = await this.usersRepo.findOne({ where: { id: seller_id } });
    if (!seller) {
      this.logger.error(`Seller with ID ${seller_id} not found`);
      throw new NotFoundException("Seller not found");
    }

    const marketCard = this.marketCardsRepo.create({
      position_change_card_id,
      seller_id,
      price,
      positionChangeCard: card,
    });
    const response = await this.marketCardsRepo.save(marketCard);
    this.logger.log(
      `Market position change card entry created successfully with ID: ${response.id}`,
    );
    return response;
  }

  async findAll(): Promise<MarketPositionChangeCard[]> {
    this.logger.log(`Fetching all market position change card entries`);
    const response = await this.marketCardsRepo.find({
      relations: ["positionChangeCard"],
      order: { createdAt: "DESC" },
    });
    this.logger.log(`All market position change card entries fetched successfully`);
    return response;
  }

  async findOne(id: string): Promise<MarketPositionChangeCard> {
    this.logger.log(`Fetching market position change card entry with ID: ${id}`);
    const record = await this.marketCardsRepo.findOne({
      where: { id },
      relations: ["positionChangeCard"],
    });
    if (!record) {
      this.logger.error(`MarketPositionChangeCard with ID ${id} not found`);
      throw new NotFoundException("MarketPositionChangeCard not found");
    }
    this.logger.log(`Market position change card entry with ID: ${id} fetched successfully`);
    return record;
  }

  async findBySeller(seller_id: string): Promise<MarketPositionChangeCard[]> {
    this.logger.log(`Fetching market position change card entries for seller ID: ${seller_id}`);
    const response = await this.marketCardsRepo.find({
      where: { seller_id },
      relations: ["positionChangeCard"],
      order: { createdAt: "DESC" },
    });
    this.logger.log(
      `Market position change card entries for seller ID ${seller_id} retrieved successfully`,
    );
    return response;
  }

  async updatePrice(id: string, price: number, userId: string): Promise<MarketPositionChangeCard> {
    this.logger.log(`Updating price for market position change card entry with ID: ${id}`);
    if (price < 0) {
      this.logger.error(`Price must be positive: ${price}`);
      throw new BadRequestException("Price must be positive");
    }

    const record = await this.findOne(id);
    if (record.seller_id !== userId) {
      this.logger.error(
        `User with ID ${userId} is not the seller of market position change card entry with ID ${id}`,
      );
      throw new ForbiddenException("You can only update your own listings");
    }

    record.price = price;
    const response = await this.marketCardsRepo.save(record);
    this.logger.log(`Market position change card entry with ID: ${id} updated successfully`);
    return response;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing market position change card entry with ID: ${id}`);
    const record = await this.findOne(id);
    await this.marketCardsRepo.remove(record);
    this.logger.log(`Market position change card entry with ID: ${id} removed successfully`);
  }
}
