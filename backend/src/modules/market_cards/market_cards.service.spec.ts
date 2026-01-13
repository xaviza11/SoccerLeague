import { Test, TestingModule } from "@nestjs/testing";
import { MarketCardsService } from "./market_cards.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MarketCard, Card, User } from "../../entities";
import { Repository } from "typeorm";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { v4 as uuid } from "uuid";

describe("MarketCardsService", () => {
  let service: MarketCardsService;
  let marketCardsRepo: Repository<MarketCard>;
  let cardsRepo: Repository<Card>;
  let usersRepo: Repository<User>;

  const mockMarketCardsRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCardsRepo = { findOne: jest.fn() };
  const mockUsersRepo = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketCardsService,
        { provide: getRepositoryToken(MarketCard), useValue: mockMarketCardsRepo },
        { provide: getRepositoryToken(Card), useValue: mockCardsRepo },
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<MarketCardsService>(MarketCardsService);
    marketCardsRepo = module.get(getRepositoryToken(MarketCard));
    cardsRepo = module.get(getRepositoryToken(Card));
    usersRepo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a market card successfully", async () => {
      const cardId = uuid();
      const sellerId = uuid();
      const card = { id: cardId } as Card;
      const seller = { id: sellerId } as User;
      const data = { card_id: cardId, price: 100, seller_id: sellerId };
      const created = { id: uuid(), ...data } as MarketCard;

      mockCardsRepo.findOne.mockResolvedValue(card);
      mockUsersRepo.findOne.mockResolvedValue(seller);
      mockMarketCardsRepo.create.mockReturnValue(created);
      mockMarketCardsRepo.save.mockResolvedValue(created);

      const result = await service.create(data);

      expect(result).toBe(created);
      expect(mockMarketCardsRepo.save).toHaveBeenCalledWith(created);
    });

    it("should throw if card does not exist", async () => {
      mockCardsRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({ card_id: uuid(), price: 100, seller_id: uuid() }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw if seller does not exist", async () => {
      mockCardsRepo.findOne.mockResolvedValue({ id: uuid() });
      mockUsersRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({ card_id: uuid(), price: 100, seller_id: uuid() }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw if price is negative", async () => {
      await expect(
        service.create({ card_id: uuid(), price: -10, seller_id: uuid() }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("should return all market cards", async () => {
      const records = [{ id: uuid() }, { id: uuid() }] as MarketCard[];
      mockMarketCardsRepo.find.mockResolvedValue(records);

      const result = await service.findAll();
      expect(result).toBe(records);
      expect(mockMarketCardsRepo.find).toHaveBeenCalledWith({
        relations: ["card"],
        order: { createdAt: "DESC" },
      });
    });
  });

  describe("findOne", () => {
    it("should return one market card", async () => {
      const id = uuid();
      const record = { id } as MarketCard;
      mockMarketCardsRepo.findOne.mockResolvedValue(record);

      const result = await service.findOne(id);
      expect(result).toBe(record);
      expect(mockMarketCardsRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ["card"],
      });
    });

    it("should throw if not found", async () => {
      mockMarketCardsRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
    });
  });

  describe("findBySeller", () => {
    it("should return all cards by seller", async () => {
      const sellerId = uuid();
      const records = [{ id: uuid(), seller_id: sellerId }] as MarketCard[];
      mockMarketCardsRepo.find.mockResolvedValue(records);

      const result = await service.findBySeller(sellerId);
      expect(result).toBe(records);
      expect(mockMarketCardsRepo.find).toHaveBeenCalledWith({
        where: { seller_id: sellerId },
        relations: ["card"],
      });
    });
  });

  describe("updatePrice", () => {
    it("should update price if user is seller", async () => {
      const id = uuid();
      const userId = uuid();
      const record = { id, price: 50, seller_id: userId } as MarketCard;
      mockMarketCardsRepo.findOne.mockResolvedValue(record);
      mockMarketCardsRepo.save.mockResolvedValue({ ...record, price: 150 });

      const result = await service.updatePrice(id, 150, userId);
      expect(result.price).toBe(150);
      expect(mockMarketCardsRepo.save).toHaveBeenCalledWith({ ...record, price: 150 });
    });

    it("should throw if user is not seller", async () => {
      const id = uuid();
      const record = { id, price: 50, seller_id: uuid() } as MarketCard;
      mockMarketCardsRepo.findOne.mockResolvedValue(record);
      await expect(service.updatePrice(id, 100, uuid())).rejects.toThrow(BadRequestException);
    });

    it("should throw if price is negative", async () => {
      await expect(service.updatePrice(uuid(), -10, uuid())).rejects.toThrow(BadRequestException);
    });
  });

  describe("remove", () => {
    it("should remove if user is seller", async () => {
      const id = uuid();
      const userId = uuid();
      const record = { id, seller_id: userId } as MarketCard;
      mockMarketCardsRepo.findOne.mockResolvedValue(record);
      mockMarketCardsRepo.remove.mockResolvedValue(record);

      await service.remove(id);
      expect(mockMarketCardsRepo.remove).toHaveBeenCalledWith(record);
    });
  });
});
