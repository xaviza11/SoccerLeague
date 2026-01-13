import { Test, TestingModule } from "@nestjs/testing";
import { MarketPlayersService } from "./market_players.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MarketPlayer, Player, User } from "../../entities";
import { Repository } from "typeorm";
import { NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { v4 as uuid } from "uuid";

describe("MarketPlayersService", () => {
  let service: MarketPlayersService;
  let marketPlayersRepo: Repository<MarketPlayer>;
  let playersRepo: Repository<Player>;
  let usersRepo: Repository<User>;

  const mockMarketPlayersRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockPlayersRepo = { findOne: jest.fn() };
  const mockUsersRepo = { findOne: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketPlayersService,
        { provide: getRepositoryToken(MarketPlayer), useValue: mockMarketPlayersRepo },
        { provide: getRepositoryToken(Player), useValue: mockPlayersRepo },
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<MarketPlayersService>(MarketPlayersService);
    marketPlayersRepo = module.get(getRepositoryToken(MarketPlayer));
    playersRepo = module.get(getRepositoryToken(Player));
    usersRepo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a market player successfully", async () => {
      const playerId = uuid();
      const sellerId = uuid();
      const player = { id: playerId } as Player;
      const seller = { id: sellerId } as User;
      const data = { player_id: playerId, price: 100, seller_id: sellerId };
      const created = { id: uuid(), ...data, player } as MarketPlayer;

      mockPlayersRepo.findOne.mockResolvedValue(player);
      mockUsersRepo.findOne.mockResolvedValue(seller);
      mockMarketPlayersRepo.create.mockReturnValue(created);
      mockMarketPlayersRepo.save.mockResolvedValue(created);

      const result = await service.create(data);

      expect(result).toBe(created);
      expect(mockMarketPlayersRepo.save).toHaveBeenCalledWith(created);
    });

    it("should throw if player does not exist", async () => {
      mockPlayersRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({ player_id: uuid(), price: 100, seller_id: uuid() }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw if seller does not exist", async () => {
      mockPlayersRepo.findOne.mockResolvedValue({ id: uuid() });
      mockUsersRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({ player_id: uuid(), price: 100, seller_id: uuid() }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw if price is negative", async () => {
      await expect(
        service.create({ player_id: uuid(), price: -10, seller_id: uuid() }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("should return all market players", async () => {
      const records = [{ id: uuid() }, { id: uuid() }] as MarketPlayer[];
      mockMarketPlayersRepo.find.mockResolvedValue(records);

      const result = await service.findAll();
      expect(result).toBe(records);
      expect(mockMarketPlayersRepo.find).toHaveBeenCalledWith({
        relations: ["player"],
        order: { createdAt: "DESC" },
      });
    });
  });

  describe("findOne", () => {
    it("should return one market player", async () => {
      const id = uuid();
      const record = { id } as MarketPlayer;
      mockMarketPlayersRepo.findOne.mockResolvedValue(record);

      const result = await service.findOne(id);
      expect(result).toBe(record);
      expect(mockMarketPlayersRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ["player"],
      });
    });

    it("should throw if not found", async () => {
      mockMarketPlayersRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
    });
  });

  describe("findBySeller", () => {
    it("should return all players by seller", async () => {
      const sellerId = uuid();
      const records = [{ id: uuid(), seller_id: sellerId }] as MarketPlayer[];
      mockMarketPlayersRepo.find.mockResolvedValue(records);

      const result = await service.findBySeller(sellerId);
      expect(result).toBe(records);
      expect(mockMarketPlayersRepo.find).toHaveBeenCalledWith({
        where: { seller_id: sellerId },
        relations: ["player"],
        order: { createdAt: "DESC" },
      });
    });
  });

  describe("updatePrice", () => {
    it("should update price if user is seller", async () => {
      const id = uuid();
      const userId = uuid();
      const record = { id, price: 50, seller_id: userId } as MarketPlayer;
      mockMarketPlayersRepo.findOne.mockResolvedValue(record);
      mockMarketPlayersRepo.save.mockResolvedValue({ ...record, price: 150 });

      const result = await service.updatePrice(id, 150, userId);
      expect(result.price).toBe(150);
      expect(mockMarketPlayersRepo.save).toHaveBeenCalledWith({ ...record, price: 150 });
    });

    it("should throw if user is not seller", async () => {
      const id = uuid();
      const record = { id, price: 50, seller_id: uuid() } as MarketPlayer;
      mockMarketPlayersRepo.findOne.mockResolvedValue(record);
      await expect(service.updatePrice(id, 100, uuid())).rejects.toThrow(ForbiddenException);
    });

    it("should throw if price is negative", async () => {
      await expect(service.updatePrice(uuid(), -10, uuid())).rejects.toThrow(BadRequestException);
    });
  });

  describe("remove", () => {
    it("should remove if user is seller", async () => {
      const id = uuid();
      const userId = uuid();
      const record = { id, seller_id: userId } as MarketPlayer;
      mockMarketPlayersRepo.findOne.mockResolvedValue(record);
      mockMarketPlayersRepo.remove.mockResolvedValue(record);

      await service.remove(id);
      expect(mockMarketPlayersRepo.remove).toHaveBeenCalledWith(record);
    });
  });
});
