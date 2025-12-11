import { Test, TestingModule } from '@nestjs/testing';
import { AurasController } from './auras.controller';
import { AurasService } from './auras.service';
import { AuthGuard } from '../../guards/auth.guard';

describe('AurasController', () => {
  let controller: AurasController;
  let service: AurasService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AurasController],
      providers: [
        {
          provide: AurasService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AurasController>(AurasController);
    service = module.get<AurasService>(AurasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with userId', async () => {
      const req = { user: { id: 'user123' } };
      const aura = { id: 'aura123' };
      mockService.create.mockResolvedValueOnce(aura);

      const result = await controller.create(req);

      expect(mockService.create).toHaveBeenCalledWith('user123');
      expect(result).toEqual(aura);
    });
  });

  describe('findAll', () => {
    it('should return all auras', async () => {
      const auras = [{ id: '1' }, { id: '2' }];
      mockService.findAll.mockResolvedValue(auras);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual(auras);
    });
  });

  describe('findAllByUser', () => {
    it('should return user-specific auras', async () => {
      const req = { user: { id: 'user123' } };
      const auras = [{ id: '1' }];
      mockService.findAllByUser.mockResolvedValue(auras);

      const result = await controller.findAllByUser(req);

      expect(mockService.findAllByUser).toHaveBeenCalledWith('user123');
      expect(result).toEqual(auras);
    });
  });

  describe('findOne', () => {
    it('should return a single aura', async () => {
      const aura = { id: 'aura123' };
      const req = { user: { id: 'user123' } };

      mockService.findOne.mockResolvedValue(aura);

      const result = await controller.findOne('aura123', req);

      expect(mockService.findOne).toHaveBeenCalledWith('aura123', 'user123');
      expect(result).toEqual(aura);
    });
  });

  describe('deleteOne', () => {
    it('should delete an aura', async () => {
      const req = { user: { id: 'user123' } };
      const message = { message: 'Aura deleted successfully' };

      mockService.delete.mockResolvedValue(message);

      const result = await controller.deleteOne('aura123');

      expect(mockService.delete).toHaveBeenCalledWith('aura123');
      expect(result).toEqual(message);
    });
  });
});
