import { Test, TestingModule } from "@nestjs/testing";
import { PlayedGamesController } from "./played_games.controller";
import { PlayedGamesService } from "./played_games.service";
import { BadRequestException } from "@nestjs/common";
import { v4 as uuid } from "uuid";

describe("PlayedGamesController", () => {
  let controller: PlayedGamesController;
  let service: PlayedGamesService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayedGamesController],
      providers: [
        {
          provide: PlayedGamesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PlayedGamesController>(PlayedGamesController);
    service = module.get<PlayedGamesService>(PlayedGamesService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a game history entry", async () => {
      const dto = {
        player_one_id: uuid(),
        player_two_id: uuid(),
        result: [10, 8] as [number, number],
        logs: [],
      };

      const saved = { id: uuid(), ...dto };
      mockService.create.mockResolvedValue(saved);

      const result = await controller.create(dto);

      expect(result).toEqual(saved);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });

    it("should throw BadRequestException if required fields missing", async () => {
      const badDto = {
        player_one_id: null,
        result: null,
      } as any;

      await expect(controller.create(badDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("should return all game histories", async () => {
      const records = [{ id: uuid() }, { id: uuid() }];

      mockService.findAll.mockResolvedValue(records);

      const result = await controller.findAll();

      expect(result).toEqual(records);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a game history record", async () => {
      const id = uuid();
      const record = { id };

      mockService.findOne.mockResolvedValue(record);

      const result = await controller.findOne(id);

      expect(result).toEqual(record);
      expect(mockService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe("update", () => {
    it("should update a game history entry", async () => {
      const id = uuid();
      const updates = { result: [15, 2] as [number, number] };

      const updated = { id, ...updates };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update(id, updates);

      expect(result).toEqual(updated);
      expect(mockService.update).toHaveBeenCalledWith(id, updates);
    });
  });

  describe("delete", () => {
    it("should delete a game history record", async () => {
      const id = uuid();
      const deleted = { message: "Game history entry deleted successfully" };

      mockService.delete.mockResolvedValue(deleted);

      const result = await controller.delete(id);

      expect(result).toEqual(deleted);
      expect(mockService.delete).toHaveBeenCalledWith(id);
    });
  });

  describe("findByUser", () => {
    it("should return game histories for a specific user", async () => {
      const userId = uuid();
      const records = [{ id: uuid() }];

      mockService.findByUser.mockResolvedValue(records);

      const result = await controller.findByUser(userId);

      expect(result).toEqual(records);
      expect(mockService.findByUser).toHaveBeenCalledWith(userId);
    });
  });
});
