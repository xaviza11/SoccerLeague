import { Test, TestingModule } from "@nestjs/testing";
import { MarketAurasController } from "./market_auras.controller";
import { MarketAurasService } from "./market_auras.service";
import { v4 as uuid } from "uuid";
import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";

describe("MarketAurasController", () => {
  let controller: MarketAurasController;
  let service: MarketAurasService;

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
      controllers: [MarketAurasController],
      providers: [{ provide: MarketAurasService, useValue: mockService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<MarketAurasController>(MarketAurasController);
    service = module.get<MarketAurasService>(MarketAurasService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should call service.create and return result", async () => {
      const req = { user: { id: uuid() } };
      const dto = { aura_id: uuid(), price: 100 };
      const result = { id: uuid(), ...dto, seller_id: req.user.id };
      mockService.create.mockResolvedValue(result);

      expect(await controller.create(req as any, dto)).toBe(result);
      expect(mockService.create).toHaveBeenCalledWith({
        ...dto,
        seller_id: req.user.id,
      });
    });

    it("should throw BadRequestException if missing fields", () => {
      const req = { user: { id: uuid() } };
      const dto = { aura_id: uuid() } as any;

      expect(() => controller.create(req as any, dto)).toThrow(BadRequestException);
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
      const id = uuid();
      const price = 150;
      const record = { id, price };
      mockService.updatePrice.mockResolvedValue(record);

      const result = await controller.updatePrice(id, price, req as any);
      expect(result).toBe(record);
      expect(mockService.updatePrice).toHaveBeenCalledWith(id, price, req.user.id);
    });

    it("should throw BadRequestException if price undefined", () => {
      const req = { user: { id: uuid() } };
      expect(() => controller.updatePrice(uuid(), undefined as any, req as any)).toThrow(
        BadRequestException,
      );
    });
  });

  describe("remove", () => {
    it("should call service.remove", async () => {
      const req = { user: { id: uuid() } };
      const id = uuid();
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(mockService.remove).toHaveBeenCalledWith(id);
    });
  });
});
