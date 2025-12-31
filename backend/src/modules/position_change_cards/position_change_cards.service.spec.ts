import { Test, TestingModule } from '@nestjs/testing';
import { PositionChangeCardsService } from './position_change_cards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionChangeCard, User, Storage } from '../../entities';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('PositionChangeCardsService', () => {
  let service: PositionChangeCardsService;
  let mockPositionChangeCardRepo: Partial<Record<keyof Repository<PositionChangeCard>, jest.Mock>>;
  let mockUsersRepo: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let mockStorageRepo: Partial<Record<keyof Repository<Storage>, jest.Mock>>;

  beforeEach(async () => {
    mockPositionChangeCardRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    mockUsersRepo = {
      findOne: jest.fn(),
    };
    mockStorageRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionChangeCardsService,
        { provide: getRepositoryToken(PositionChangeCard), useValue: mockPositionChangeCardRepo },
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
        { provide: getRepositoryToken(Storage), useValue: mockStorageRepo },
      ],
    }).compile();

    service = module.get<PositionChangeCardsService>(PositionChangeCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if user not found', async () => {
      mockUsersRepo.findOne!.mockResolvedValue(null);
      await expect(service.create('storage-uuid', 'user-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should throw if storage is not provided', async () => {
      mockUsersRepo.findOne!.mockResolvedValue({ id: 'user-uuid' });
      await expect(service.create('', 'user-uuid')).rejects.toThrow(BadRequestException);
    });

    it('should create and save a new card', async () => {
      const mockUser = { id: 'user-uuid' };
      mockUsersRepo.findOne!.mockResolvedValue(mockUser);

      const createdCard = { new_position: 'DEFENDER', storage_id: 'storage-uuid' };
      mockPositionChangeCardRepo.create!.mockReturnValue(createdCard);
      mockPositionChangeCardRepo.save!.mockResolvedValue(createdCard);

      const result = await service.create('storage-uuid', 'user-uuid');

      expect(mockPositionChangeCardRepo.create).toHaveBeenCalledWith(expect.objectContaining({ storage_id: 'storage-uuid' }));
      expect(mockPositionChangeCardRepo.save).toHaveBeenCalledWith(createdCard);
      expect(result).toEqual(createdCard);
    });
  });

  describe('findAll', () => {
    it('should return all cards', async () => {
      const cards = [{ id: '1' }, { id: '2' }];
      mockPositionChangeCardRepo.find!.mockResolvedValue(cards);

      const result = await service.findAll();
      expect(result).toEqual(cards);
    });
  });

  describe('findOne', () => {
    it('should throw if user not found', async () => {
      mockUsersRepo.findOne!.mockResolvedValue(null);
      await expect(service.findOne('card-uuid', 'user-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should throw if card not found', async () => {
      mockUsersRepo.findOne!.mockResolvedValue({ id: 'user-uuid' });
      mockPositionChangeCardRepo.findOne!.mockResolvedValue(null);

      await expect(service.findOne('card-uuid', 'user-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should return the card if found', async () => {
      const mockCard = { id: 'card-uuid' };
      mockUsersRepo.findOne!.mockResolvedValue({ id: 'user-uuid' });
      mockPositionChangeCardRepo.findOne!.mockResolvedValue(mockCard);

      const result = await service.findOne('card-uuid', 'user-uuid');
      expect(result).toEqual(mockCard);
    });
  });

  describe('findAllByUser', () => {
    it('should throw if user not found', async () => {
      mockUsersRepo.findOne!.mockResolvedValue(null);
      await expect(service.findAllByUser('user-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should return all cards for the user', async () => {
      const cards = [{ id: '1' }];
      mockUsersRepo.findOne!.mockResolvedValue({ id: 'user-uuid' });
      mockPositionChangeCardRepo.find!.mockResolvedValue(cards);

      const result = await service.findAllByUser('user-uuid');
      expect(result).toEqual(cards);
    });
  });

  describe('deleteOne', () => {
    it('should throw if user not found', async () => {
      mockUsersRepo.findOne!.mockResolvedValue(null);
      await expect(service.deleteOne('card-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should throw if card not found', async () => {
      mockUsersRepo.findOne!.mockResolvedValue({ id: 'user-uuid' });
      mockPositionChangeCardRepo.findOne!.mockResolvedValue(null);

      await expect(service.deleteOne('card-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should delete the card and return success message', async () => {
      mockUsersRepo.findOne!.mockResolvedValue({ id: 'user-uuid' });
      mockPositionChangeCardRepo.findOne!.mockResolvedValue({ id: 'card-uuid' });
      mockPositionChangeCardRepo.delete!.mockResolvedValue({ affected: 1 });

      const result = await service.deleteOne('card-uuid');
      expect(result).toEqual({ message: 'Card deleted successfully' });
      expect(mockPositionChangeCardRepo.delete).toHaveBeenCalledWith('card-uuid');
    });
  });
});
