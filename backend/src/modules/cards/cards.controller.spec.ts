import { Test, TestingModule } from "@nestjs/testing";
import { CardsController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { AuthGuard } from "../../guards/auth.guard";

describe("CardsController", () => {
  let controller: CardsController;
  let service: CardsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CardsController>(CardsController);
    service = module.get<CardsService>(CardsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should call service.create with userId", async () => {
      const req = { user: { id: "user123" } };
      const card = { id: "card123" };
      mockService.create.mockResolvedValueOnce(card);

      const result = await controller.create(req.user.id);

      expect(mockService.create).toHaveBeenCalledWith("user123");
      expect(result).toEqual(card);
    });
  });

  describe("findAll", () => {
    it("should return all cards", async () => {
      const cards = [{ id: "1" }, { id: "2" }];
      mockService.findAll.mockResolvedValue(cards);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual(cards);
    });
  });

  describe("findAllByUser", () => {
    it("should return user-specific cards", async () => {
      const req = { user: { id: "user123" } };
      const cards = [{ id: "1" }];
      mockService.findAllByUser.mockResolvedValue(cards);

      const result = await controller.findAllByUser(req.user.id);

      expect(mockService.findAllByUser).toHaveBeenCalledWith("user123");
      expect(result).toEqual(cards);
    });
  });

  describe("findOne", () => {
    it("should return a single card", async () => {
      const card = { id: "card123" };
      const req = { user: { id: "user123" } };

      mockService.findOne.mockResolvedValue(card);

      const result = await controller.findOne("card123", req.user.id);

      expect(mockService.findOne).toHaveBeenCalledWith("card123", "user123");
      expect(result).toEqual(card);
    });
  });

  describe("delete", () => {
    it("should delete a card", async () => {
      const message = { message: "Card deleted successfully" };

      mockService.delete.mockResolvedValue(message);

      const result = await controller.delete("card123");

      expect(mockService.delete).toHaveBeenCalledWith("card123");
      expect(result).toEqual(message);
    });
  });
});
