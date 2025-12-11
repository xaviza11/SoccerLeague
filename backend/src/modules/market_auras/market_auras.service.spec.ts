import { Test, TestingModule } from '@nestjs/testing';
import { MarketAurasService } from './market_auras.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarketAura, Aura, User } from '../../entities';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('MarketAurasService', () => {
  let service: MarketAurasService;
  let marketAurasRepo: Repository<MarketAura>;
  let aurasRepo: Repository<Aura>;
  let usersRepo: Repository<User>;

  const mockMarketAurasRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAurasRepo = {
    findOne: jest.fn(),
  };

  const mockUsersRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketAurasService,
        { provide: getRepositoryToken(MarketAura), useValue: mockMarketAurasRepo },
        { provide: getRepositoryToken(Aura), useValue: mockAurasRepo },
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<MarketAurasService>(MarketAurasService);
    marketAurasRepo = module.get(getRepositoryToken(MarketAura));
    aurasRepo = module.get(getRepositoryToken(Aura));
    usersRepo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a market aura successfully', async () => {
      const auraId = uuid();
      const sellerId = uuid();
      const aura = { id: auraId } as Aura;
      const seller = { id: sellerId } as User;

      mockAurasRepo.findOne.mockResolvedValue(aura);
      mockUsersRepo.findOne.mockResolvedValue(seller);

      const data = { aura_id: auraId, seller_id: sellerId, price: 200 };
      const created = { id: uuid(), ...data } as MarketAura;

      mockMarketAurasRepo.create.mockReturnValue(created);
      mockMarketAurasRepo.save.mockResolvedValue(created);

      const result = await service.create(data);

      expect(result).toBe(created);
      expect(mockMarketAurasRepo.save).toHaveBeenCalledWith(created);
    });

    it('should throw if aura does not exist', async () => {
      mockAurasRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({ aura_id: uuid(), seller_id: uuid(), price: 100 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if seller does not exist', async () => {
      mockAurasRepo.findOne.mockResolvedValue({ id: uuid() });
      mockUsersRepo.findOne.mockResolvedValue(null);
      await expect(
        service.create({ aura_id: uuid(), seller_id: uuid(), price: 100 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if price is negative', async () => {
      await expect(
        service.create({ aura_id: uuid(), seller_id: uuid(), price: -10 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all market auras', async () => {
      const records = [{ id: uuid() }, { id: uuid() }] as MarketAura[];
      mockMarketAurasRepo.find.mockResolvedValue(records);
      const result = await service.findAll();
      expect(result).toBe(records);
      expect(mockMarketAurasRepo.find).toHaveBeenCalledWith({
        relations: ['aura'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return one market aura', async () => {
      const id = uuid();
      const record = { id } as MarketAura;
      mockMarketAurasRepo.findOne.mockResolvedValue(record);

      const result = await service.findOne(id);
      expect(result).toBe(record);
      expect(mockMarketAurasRepo.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['aura'],
      });
    });

    it('should throw if not found', async () => {
      mockMarketAurasRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySeller', () => {
    it('should return all auras by seller', async () => {
      const sellerId = uuid();
      const records = [{ id: uuid(), seller_id: sellerId }] as MarketAura[];
      mockMarketAurasRepo.find.mockResolvedValue(records);

      const result = await service.findBySeller(sellerId);
      expect(result).toBe(records);
      expect(mockMarketAurasRepo.find).toHaveBeenCalledWith({
        where: { seller_id: sellerId },
        relations: ['aura'],
      });
    });
  });

  describe('updatePrice', () => {
    it('should update price if user is seller', async () => {
      const id = uuid();
      const userId = uuid();
      const record = { id, price: 50, seller_id: userId } as MarketAura;
      mockMarketAurasRepo.findOne.mockResolvedValue(record);
      mockMarketAurasRepo.save.mockResolvedValue({ ...record, price: 150 });

      const result = await service.updatePrice(id, 150, userId);
      expect(result.price).toBe(150);
      expect(mockMarketAurasRepo.save).toHaveBeenCalledWith({ ...record, price: 150 });
    });

    it('should throw if user is not seller', async () => {
      const id = uuid();
      const record = { id, price: 50, seller_id: uuid() } as MarketAura;
      mockMarketAurasRepo.findOne.mockResolvedValue(record);

      await expect(service.updatePrice(id, 100, uuid())).rejects.toThrow(BadRequestException);
    });

    it('should throw if price is negative', async () => {
      await expect(service.updatePrice(uuid(), -10, uuid())).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove if user is seller', async () => {
      const id = uuid();
      const userId = uuid();
      const record = { id, seller_id: userId } as MarketAura;
      mockMarketAurasRepo.findOne.mockResolvedValue(record);
      mockMarketAurasRepo.remove.mockResolvedValue(record);

      await service.remove(id);
      expect(mockMarketAurasRepo.remove).toHaveBeenCalledWith(record);
    });
  });
});
