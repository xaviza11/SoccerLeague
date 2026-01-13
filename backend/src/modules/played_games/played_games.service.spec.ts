import { Test, TestingModule } from "@nestjs/testing";
import { PlayedGamesService } from "./played_games.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { GameHistory, User } from "../../entities";
import { Repository } from "typeorm";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { v4 as uuid } from "uuid";

describe("PlayedGamesService", () => {
  let service: PlayedGamesService;
  let gameHistoryRepo: Repository<GameHistory>;
  let usersRepo: Repository<User>;

  const mockGameHistoryRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsersRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayedGamesService,
        {
          provide: getRepositoryToken(GameHistory),
          useValue: mockGameHistoryRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepo,
        },
      ],
    }).compile();

    service = module.get<PlayedGamesService>(PlayedGamesService);
    gameHistoryRepo = module.get(getRepositoryToken(GameHistory));
    usersRepo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a game history successfully", async () => {
      const p1 = { id: uuid() } as User;
      const p2 = { id: uuid() } as User;

      mockUsersRepo.findOne.mockResolvedValueOnce(p1);
      mockUsersRepo.findOne.mockResolvedValueOnce(p2);

      const data = {
        player_one_id: p1.id,
        player_two_id: p2.id,
        result: [10, 5] as [number, number],
        logs: [],
      };

      mockGameHistoryRepo.create.mockReturnValue(data);
      mockGameHistoryRepo.save.mockResolvedValue({ id: uuid(), ...data });

      const result = await service.create(data);

      expect(result).toHaveProperty("id");
      expect(mockGameHistoryRepo.save).toHaveBeenCalled();
    });

    it("should throw if player one does not exist", async () => {
      mockUsersRepo.findOne.mockResolvedValueOnce(null);

      await expect(
        service.create({
          player_one_id: uuid(),
          result: [1, 0],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findOne", () => {
    it("should return one game history", async () => {
      const id = uuid();
      const record = { id } as GameHistory;

      mockGameHistoryRepo.findOne.mockResolvedValue(record);

      const result = await service.findOne(id);

      expect(result).toBe(record);
    });

    it("should throw if game not found", async () => {
      mockGameHistoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    it("should return all game history records", async () => {
      const records = [{ id: uuid() }, { id: uuid() }] as GameHistory[];

      mockGameHistoryRepo.find.mockResolvedValue(records);

      expect(await service.findAll()).toBe(records);
    });
  });

  describe("update", () => {
    it("should update a record", async () => {
      const id = uuid();
      const existing = { id, result: [0, 0] } as GameHistory;

      mockGameHistoryRepo.findOne.mockResolvedValue(existing);
      mockGameHistoryRepo.save.mockResolvedValue({
        ...existing,
        result: [5, 7],
      });

      const result = await service.update(id, { result: [5, 7] });

      expect(result.result).toEqual([5, 7]);
      expect(mockGameHistoryRepo.save).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete a record", async () => {
      const id = uuid();
      const record = { id } as GameHistory;

      mockGameHistoryRepo.findOne.mockResolvedValue(record);
      mockGameHistoryRepo.remove.mockResolvedValue(record);

      const result = await service.delete(id);

      expect(result.message).toBe("Game history entry deleted successfully");
    });
  });

  describe("findByUser", () => {
    it("should return all games of a user", async () => {
      const userId = uuid();
      const user = { id: userId } as User;

      mockUsersRepo.findOne.mockResolvedValue(user);
      const games = [{ id: uuid() }, { id: uuid() }] as GameHistory[];

      mockGameHistoryRepo.find.mockResolvedValue(games);

      const result = await service.findByUser(userId);

      expect(result).toBe(games);
    });

    it("should throw if user not found", async () => {
      mockUsersRepo.findOne.mockResolvedValue(null);

      await expect(service.findByUser(uuid())).rejects.toThrow(NotFoundException);
    });
  });
});
