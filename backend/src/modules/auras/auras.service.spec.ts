import { Test, TestingModule } from '@nestjs/testing';
import { AurasService } from './auras.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Aura, User, Storage } from '../../entities';
import { Repository } from 'typeorm';
import { Auras } from '../../enums';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('AurasService', () => {
  let service: AurasService;
  let auraRepo: jest.Mocked<Repository<Aura>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const mockAuraRepo = {
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
  const validAuraId = uuid();
  const validStorageId = uuid();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AurasService,
        { provide: getRepositoryToken(Aura), useValue: mockAuraRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Storage), useValue: {} },
      ],
    }).compile();

    service = module.get<AurasService>(AurasService);
    auraRepo = module.get(getRepositoryToken(Aura));
    userRepo = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an aura for a user with storage', async () => {
      const user = { id: validUserId, storage: { id: validStorageId } };
      const aura = {
        id: validAuraId,
        name: Auras.NONE,
        storage_id: validStorageId,
      };

      mockUserRepo.findOne.mockResolvedValue(user);
      mockAuraRepo.create.mockReturnValue(aura);
      mockAuraRepo.save.mockResolvedValue(aura);

      const result = await service.create(validUserId);

      expect(result).toEqual(aura);
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { id: validUserId },
        relations: ['storage'],
      });
      expect(mockAuraRepo.create).toHaveBeenCalledWith({
        name: expect.any(String),
        storage_id: validStorageId,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.create(validUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user storage missing', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: validUserId,
        storage: null,
      });
      await expect(service.create(validUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return an aura if it exists and belongs to the user', async () => {
      const aura = {
        id: validAuraId,
        storage: { user: { id: validUserId } },
      };

      mockAuraRepo.findOne.mockResolvedValue(aura);

      const result = await service.findOne(validAuraId, validUserId);

      expect(result).toEqual(aura);
      expect(mockAuraRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: validAuraId,
          storage: { user: { id: validUserId } },
        },
        relations: ['storage', 'storage.user'],
      });
    });

    it('should throw NotFoundException if aura not found', async () => {
      mockAuraRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(validAuraId, validUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid UUIDs', async () => {
      await expect(service.findOne('invalid', validUserId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne(validAuraId, 'invalid')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllByUser', () => {
    it('should return all auras for a user', async () => {
      const user = { id: validUserId, storage: { id: validStorageId } };
      const auras = [{ id: uuid() }, { id: uuid() }];

      mockUserRepo.findOne.mockResolvedValue(user);
      mockAuraRepo.find.mockResolvedValue(auras);

      const result = await service.findAllByUser(validUserId);

      expect(result).toEqual(auras);
      expect(mockAuraRepo.find).toHaveBeenCalledWith({
        where: { storage_id: validStorageId },
        relations: ['storage'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.findAllByUser(validUserId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user has no storage', async () => {
      mockUserRepo.findOne.mockResolvedValue({
        id: validUserId,
        storage: null,
      });
      await expect(service.findAllByUser(validUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an aura successfully', async () => {
      const aura = { id: validAuraId, storage: { user: { id: validUserId } } };

      mockAuraRepo.findOne.mockResolvedValue(aura);
      mockAuraRepo.delete.mockResolvedValue({});

      const result = await service.delete(validAuraId);

      expect(result).toEqual({ message: 'Aura deleted successfully' });
      expect(mockAuraRepo.delete).toHaveBeenCalledWith(validAuraId);
    });

    it('should throw NotFoundException if aura not found', async () => {
      mockAuraRepo.findOne.mockResolvedValue(null);
      await expect(service.delete(validAuraId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
