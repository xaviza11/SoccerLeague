import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Card, Storage, User } from "../../entities";
import { validate as isUUID } from "uuid";
import { Cards } from "../../enums";
import { Logger } from "@nestjs/common";

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

  private readonly logger = new Logger(CardsService.name);

  private createRandomCardName(): Cards {
    this.logger.log("Creating random card name");
    const values = Object.values(Cards);
    return values[Math.floor(Math.random() * values.length)] as Cards;
  }

  async create(userId: string): Promise<Card> {
    this.logger.log(`Creating card for user with id: ${userId}`);
    if (!isUUID(userId)) {
      this.logger.log(`Invalid user ID: ${userId}`);
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ["storage"],
    });

    if (!user) {
      this.logger.log(`User not found with id: ${userId}`);
      throw new NotFoundException("User not found");
    }

    if (!user.storage) {
      this.logger.log(`User storage not found for user id: ${userId}`);
      throw new NotFoundException("User storage not found");
    }

    const newCard = this.cardsRepo.create({
      name: this.createRandomCardName(),
      storage_id: user.storage.id,
    });

    const response = await this.cardsRepo.save(newCard);
    this.logger.log(`Card created successfully with ID: ${response.id}`);
    return response;
  }

  async findOne(cardId: string, userId: string): Promise<Card> {
    this.logger.log(`Fetching card with id: ${cardId} for user with id: ${userId}`);

    if (!isUUID(cardId)) {
      this.logger.log(`Invalid card ID: ${cardId}`);
      throw new BadRequestException("Invalid card ID");
    }

    if (!isUUID(userId)) {
      this.logger.log(`Invalid user ID: ${userId}`);
      throw new BadRequestException("Invalid user ID");
    }

    const card = await this.cardsRepo.findOne({
      where: { id: cardId },
      relations: ["storage", "storage.user"],
    });

    if (!card) {
      this.logger.log(`Card not found with id: ${cardId}`);
      throw new NotFoundException("Card not found");
    }

    if (card.storage.user.id !== userId) {
      this.logger.log(`Card with id: ${cardId} does not belong to user with id: ${userId}`);
      throw new NotFoundException("Card does not belong to this user");
    }

    return card;
  }

  async findAll(): Promise<Card[]> {
    this.logger.log("Fetching all cards");
    const response = await this.cardsRepo.find({ relations: ["storage"] });
    this.logger.log(`Found ${response.length} cards`);
    return response;
  }

  async findAllByUser(userId: string): Promise<Card[]> {
    this.logger.log(`Fetching all cards for user with id: ${userId}`);
    if (!isUUID(userId)) {
      this.logger.log(`Invalid user ID: ${userId}`);
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ["storage"],
    });

    if (!user) {
      this.logger.log(`User not found with id: ${userId}`);
      throw new NotFoundException("User not found");
    }

    if (!user.storage) {
      this.logger.log(`User storage not found for user id: ${userId}`);
      throw new NotFoundException("User storage not found");
    }

    const response = await this.cardsRepo.find({
      where: { storage_id: user.storage.id },
      relations: ["storage"],
    });
    this.logger.log(`Found ${response.length} cards for user with id: ${userId}`);
    return response;
  }

  async delete(cardId: string): Promise<{ message: string }> {
    this.logger.log(`Deleting card with id: ${cardId}`);
    if (!isUUID(cardId)) {
      this.logger.log(`Invalid card ID: ${cardId}`);
      throw new BadRequestException("Invalid card ID");
    }

    const card = await this.cardsRepo.findOne({
      where: { id: cardId },
      relations: ["storage", "storage.user"],
    });

    if (!card) {
      this.logger.log(`Card not found with id: ${cardId}`);
      throw new NotFoundException("Card not found");
    }

    await this.cardsRepo.delete(cardId);
    this.logger.log(`Card with id: ${cardId} deleted successfully`);
    return { message: "Card deleted successfully" };
  }
}
