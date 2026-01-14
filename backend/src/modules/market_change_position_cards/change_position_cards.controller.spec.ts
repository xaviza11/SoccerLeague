import { Test, TestingModule } from "@nestjs/testing";
import { MarketPositionChangeCardsController } from "./change_position_cards.controller";
import { MarketPositionChangeCardsService } from "./change_position_cards.service";
import { v4 as uuid } from "uuid";
import { BadRequestException, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";

describe("MarketPositionChangeCardsController", () => {
  let controller: MarketPositionChangeCardsController;
  let service: MarketPositionChangeCardsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySeller: jest.fn(),
    updatePrice: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketPositionChangeCardsController],
      providers: [{ provide: MarketPositionChangeCardsService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<MarketPositionChangeCardsController>(
      MarketPositionChangeCardsController,
    );
    service = module.get<MarketPositionChangeCardsService>(MarketPositionChangeCardsService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should call service.create and return result", async () => {
      const req = { user: { id: uuid() } };
      const dto = { position_change_card_id: uuid(), price: 100 };
      const result = { id: uuid(), ...dto, seller_id: req.user.id };
      mockService.create.mockResolvedValue(result);

      expect(await controller.create(req.user.id, dto)).toBe(result);
      expect(mockService.create).toHaveBeenCalledWith({
        ...dto,
        seller_id: req.user.id,
      });
    });

    it("should throw BadRequestException if missing fields", () => {
      const req = { user: { id: uuid() } };
      const dto = { position_change_card_id: uuid() } as any;
      expect(() => controller.create(req.user.id, dto)).toThrow(BadRequestException);
    });
  });

  describe("findAll", () => {
    it("should call service.findAll and return result", async () => {
      const records = [{ id: uuid() }, { id: uuid() }];
      mockService.findAll.mockResolvedValue(records);

      const result = await controller.findAll();
      expect(result).toBe(records);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should call service.findOne and return result", async () => {
      const id = uuid();
      const record = { id };
      mockService.findOne.mockResolvedValue(record);

      const result = await controller.findOne(id);
      expect(result).toBe(record);
      expect(mockService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe("findBySeller", () => {
    it("should call service.findBySeller and return result", async () => {
      const sellerId = uuid();
      const records = [{ id: uuid(), seller_id: sellerId }];
      mockService.findBySeller.mockResolvedValue(records);

      const result = await controller.findBySeller(sellerId);
      expect(result).toBe(records);
      expect(mockService.findBySeller).toHaveBeenCalledWith(sellerId);
    });
  });

  describe("updatePrice", () => {
    it("should call service.updatePrice and return result", async () => {
      const req = { user: { id: uuid() } };
      const price = 200;
      const id = uuid();
      const mockResult = { id, price };

      mockService.updatePrice.mockResolvedValue(mockResult);

      const result = await controller.updatePrice(req.user.id, id, price);
      expect(result).toEqual(mockResult);
      expect(mockService.updatePrice).toHaveBeenCalledWith(id, price, req.user.id);
    });
  });

  describe("remove", () => {
    it("should call service.remove with userId", async () => {
      const id = uuid();
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(id);
      expect(mockService.remove).toHaveBeenCalledWith(id);
    });
  });
});
