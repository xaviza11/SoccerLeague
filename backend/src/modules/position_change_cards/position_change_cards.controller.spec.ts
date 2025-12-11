import { Test, TestingModule } from '@nestjs/testing';
import { PositionChangeCardsController } from './position_change_cards.controller';
import { PositionChangeCardsService } from './position_change_cards.service';
import { AuthGuard } from '../../guards/auth.guard';

describe('PositionChangeCardsController', () => {
  let controller: PositionChangeCardsController;
  let service: PositionChangeCardsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionChangeCardsController],
      providers: [
        {
          provide: PositionChangeCardsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PositionChangeCardsController>(PositionChangeCardsController);
    service = module.get<PositionChangeCardsService>(PositionChangeCardsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with storage', async () => {
      const req = { user: { id: 'user123' } };
      const storage = 'storage-id';
      mockService.create.mockResolvedValueOnce(storage);

      const result = await controller.create(storage, req);

      expect(mockService.create).toHaveBeenCalledWith(storage, req.user.id);
      expect(result).toEqual(storage);
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const cards = [{ id: 1 }, { id: 2 }];
      mockService.findAll.mockResolvedValue(cards);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual(cards);
    });
  });

  describe('findAllByUser', () => {
    it('should return user-specific cards', async () => {
      const req = { user: { id: 'user123' } };
      const cards = [{ id: 1 }];
      mockService.findAllByUser.mockResolvedValue(cards);

      const result = await controller.findAllByUser(req);

      expect(mockService.findAllByUser).toHaveBeenCalledWith('user123');
      expect(result).toEqual(cards);
    });
  });

  describe('findOne', () => {
    it('should return a single card', async () => {
      const card = { id: 'card123' };
      const req = { user: { id: 'user123' } };

      mockService.findOne.mockResolvedValue(card);

      const result = await controller.findOne('card123', req);

      expect(mockService.findOne).toHaveBeenCalledWith('card123', 'user123');
      expect(result).toEqual(card);
    });
  });

  describe('deleteOne', () => {
    it('should delete a card', async () => {
      const message = { message: 'Card deleted successfully' };

      mockService.deleteOne.mockResolvedValue(message);

      const result = await controller.deleteOne('card123');

      expect(mockService.deleteOne).toHaveBeenCalledWith('card123');
      expect(result).toEqual(message);
    });
  });
});
