import { Test, TestingModule } from '@nestjs/testing';
import { UsersStorageService } from './users_storage.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Storage, Team, PositionChangeCard, Card } from '../../entities';
import { v4 as uuid } from 'uuid';
import { NotFoundException } from '@nestjs/common';

describe('UsersStorageService (unit)', () => {
  let service: UsersStorageService;

  const mockStorageRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  const mockTeamRepo = { findOne: jest.fn() };

  const mockCardRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockPositionChangeRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersStorageService,
        { provide: getRepositoryToken(Storage), useValue: mockStorageRepo },
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
        { provide: getRepositoryToken(Card), useValue: mockCardRepo },
        {
          provide: getRepositoryToken(PositionChangeCard),
          useValue: mockPositionChangeRepo,
        },
      ],
    }).compile();

    service = module.get<UsersStorageService>(UsersStorageService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a storage', async () => {
    const fakeStorage = {
      id: uuid(),
      cards: [],
      position_change_cards: [],
      team: null,
    };
    mockStorageRepo.create.mockReturnValue(fakeStorage);
    mockStorageRepo.save.mockResolvedValue(fakeStorage);

    const storage = await service.createStorage();

    expect(storage).toEqual(fakeStorage);
    expect(mockStorageRepo.create).toHaveBeenCalled();
    expect(mockStorageRepo.save).toHaveBeenCalledWith(fakeStorage);
  });

  it('should add a team to storage', async () => {
    const storageId = uuid();
    const teamId = uuid();
    const storage = { id: storageId, team: null };
    const team = { id: teamId };

    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockTeamRepo.findOne.mockResolvedValue(team);
    mockStorageRepo.save.mockImplementation((s) => Promise.resolve(s));

    const updated = await service.addTeam(storageId, teamId);

    expect(updated.team).toBe(team);
    expect(mockStorageRepo.save).toHaveBeenCalled();
  });

  it('should add a card to storage', async () => {
    const storageId = uuid();
    const cardId = uuid();
    const storage = { id: storageId, cards: [] };
    const card = { id: cardId, storage };

    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockCardRepo.findOne.mockResolvedValue(card);

    mockCardRepo.save.mockImplementation((c) => {
      storage.cards.push(c);
      return Promise.resolve(c);
    });
    mockStorageRepo.save.mockImplementation((s) => Promise.resolve(s));

    const updated = await service.addCard(storageId, card.id);

    expect(updated.cards).toContain(card);
    expect(mockCardRepo.save).toHaveBeenCalledWith(card);
  });

  it('should add a position change card', async () => {
    const storageId = uuid();
    const pcId = uuid();
    const storage = { id: storageId, position_change_cards: [] };
    const pcCard = { id: pcId, storage };

    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockPositionChangeRepo.findOne.mockResolvedValue(pcCard);

    mockPositionChangeRepo.save.mockImplementation((c) => {
      storage.position_change_cards.push(c);
      return Promise.resolve(c);
    });
    mockStorageRepo.save.mockImplementation((s) => Promise.resolve(s));

    const updated = await service.addPositionChangeCard(storageId, pcId);

    expect(updated.position_change_cards).toContain(pcCard);
    expect(mockPositionChangeRepo.save).toHaveBeenCalledWith(pcCard);
  });

  it('should find one storage', async () => {
    const storageId = uuid();
    const storage = { id: storageId };
    mockStorageRepo.findOne.mockResolvedValue(storage);

    const found = await service.findOne(storageId);

    expect(found).toBe(storage);
  });

  it('should find all storages', async () => {
    const storages = [{ id: uuid() }, { id: uuid() }];
    mockStorageRepo.find.mockResolvedValue(storages);

    const all = await service.findAll();

    expect(all).toEqual(storages);
  });

  it('should delete storage', async () => {
    const storageId = uuid();
    mockStorageRepo.delete.mockResolvedValue({ affected: 1 });

    await expect(service.deleteStorage(storageId)).resolves.not.toThrow();
    expect(mockStorageRepo.delete).toHaveBeenCalledWith(storageId);
  });

  it('should throw when deleting non-existent storage', async () => {
    const storageId = uuid();
    mockStorageRepo.delete.mockResolvedValue({ affected: 0 });

    await expect(service.deleteStorage(storageId)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockStorageRepo.delete).toHaveBeenCalledWith(storageId);
  });
});
