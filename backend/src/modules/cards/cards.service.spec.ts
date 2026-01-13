import { Test, TestingModule } from "@nestjs/testing";
import { CardsService } from "./cards.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Card, User, Storage } from "../../entities";
import { Repository } from "typeorm";
import { Cards } from "../../enums";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { v4 as uuid } from "uuid";

describe("CardsService", () => {
  let service: CardsService;
  let cardRepo: jest.Mocked<Repository<Card>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const mockCardRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const validUserId = uuid();
  const validCardId = uuid();
  const validStorageId = uuid();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        { provide: getRepositoryToken(Card), useValue: mockCardRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Storage), useValue: {} },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    cardRepo = module.get(getRepositoryToken(Card));
    userRepo = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a card for a user with storage", async () => {
      const user = { id: validUserId, storage: { id: validStorageId } };
      const card = { id: validCardId, name: Cards.NONE, storage_id: validStorageId };

      mockUserRepo.findOne.mockResolvedValue(user);
      mockCardRepo.create.mockReturnValue(card);
      mockCardRepo.save.mockResolvedValue(card);

      const result = await service.create(validUserId);

      expect(result).toEqual(card);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: validUserId },
        relations: ["storage"],
      });
      expect(mockCardRepo.create).toHaveBeenCalledWith({
        name: expect.any(String),
        storage_id: validStorageId,
      });
    });

    it("should throw NotFoundException if user not found", async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.create(validUserId)).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException if user storage missing", async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: validUserId, storage: null });
      await expect(service.create(validUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findOne", () => {
    it("should return a card if it exists", async () => {
      const card = { id: validCardId, storage: { user: { id: validUserId } } };

      mockCardRepo.findOne.mockResolvedValue(card);

      const result = await service.findOne(validCardId, validUserId);

      expect(result).toEqual(card);
      expect(mockCardRepo.findOne).toHaveBeenCalledWith({
        where: { id: validCardId },
        relations: ["storage", "storage.user"],
      });
    });

    it("should throw NotFoundException if card not found", async () => {
      mockCardRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(validCardId, validUserId)).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException for invalid UUIDs", async () => {
      await expect(service.findOne("invalid", validUserId)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(validCardId, "invalid")).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAllByUser", () => {
    it("should return all cards for a user", async () => {
      const user = { id: validUserId, storage: { id: validStorageId } };
      const cards = [{ id: uuid() }, { id: uuid() }];

      mockUserRepo.findOne.mockResolvedValue(user);
      mockCardRepo.find.mockResolvedValue(cards);

      const result = await service.findAllByUser(validUserId);

      expect(result).toEqual(cards);
      expect(mockCardRepo.find).toHaveBeenCalledWith({
        where: { storage_id: validStorageId },
        relations: ["storage"],
      });
    });

    it("should throw NotFoundException if user not found", async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.findAllByUser(validUserId)).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException if storage missing", async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: validUserId, storage: null });
      await expect(service.findAllByUser(validUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete", () => {
    it("should delete a card successfully", async () => {
      const card = { id: validCardId, storage: { user: { id: validUserId } } };

      mockCardRepo.findOne.mockResolvedValue(card);
      mockCardRepo.delete.mockResolvedValue({});

      const result = await service.delete(validCardId);

      expect(result).toEqual({ message: "Card deleted successfully" });
      expect(mockCardRepo.delete).toHaveBeenCalledWith(validCardId);
    });

    it("should throw NotFoundException if card not found", async () => {
      mockCardRepo.findOne.mockResolvedValue(null);
      await expect(service.delete(validCardId)).rejects.toThrow(NotFoundException);
    });
  });
});
