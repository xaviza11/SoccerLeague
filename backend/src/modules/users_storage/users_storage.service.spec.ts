import { Test, TestingModule } from "@nestjs/testing";
import { UsersStorageService } from "./users_storage.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Storage, Team, PositionChangeCard, Card, User } from "../../entities";
import { v4 as uuid } from "uuid";
import { NotFoundException } from "@nestjs/common";

describe("UsersStorageService (unit)", () => {
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
  const mockCardRepo = { findOne: jest.fn(), save: jest.fn(), remove: jest.fn() };
  const mockUserRepo = { findOne: jest.fn() };
  const mockPositionChangeRepo = { findOne: jest.fn(), save: jest.fn(), remove: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersStorageService,
        { provide: getRepositoryToken(Storage), useValue: mockStorageRepo },
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
        { provide: getRepositoryToken(Card), useValue: mockCardRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(PositionChangeCard), useValue: mockPositionChangeRepo },
      ],
    }).compile();

    service = module.get<UsersStorageService>(UsersStorageService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a storage", async () => {
    const fakeStorage = { id: uuid(), cards: [], position_change_cards: [], team: null };
    mockUserRepo.findOne.mockResolvedValue({ id: uuid() });
    mockStorageRepo.create.mockReturnValue(fakeStorage);
    mockStorageRepo.save.mockResolvedValue(fakeStorage);

    const storage = await service.createStorage(uuid());

    expect(storage).toEqual(fakeStorage);
    expect(mockStorageRepo.create).toHaveBeenCalled();
    expect(mockStorageRepo.save).toHaveBeenCalledWith(fakeStorage);
  });

  it("should throw if user not found when creating storage", async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    await expect(service.createStorage(uuid())).rejects.toThrow(NotFoundException);
  });

  it("should add a team to storage", async () => {
    const storageId = uuid();
    const teamId = uuid();
    const storage = { id: storageId, team: null };
    const team = { id: teamId };
    mockUserRepo.findOne.mockResolvedValue({ id: uuid() });
    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockTeamRepo.findOne.mockResolvedValue(team);
    mockStorageRepo.save.mockImplementation((s) => Promise.resolve(s));

    const updated = await service.addTeam(uuid(), teamId, storageId);

    expect(updated.team).toBe(team);
    expect(mockStorageRepo.save).toHaveBeenCalledWith(storage);
  });

  it("should throw if team not found", async () => {
    const storage = { id: uuid(), team: null };
    mockUserRepo.findOne.mockResolvedValue({ id: uuid() });
    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockTeamRepo.findOne.mockResolvedValue(null);

    await expect(service.addTeam(uuid(), uuid(), storage.id)).rejects.toThrow(NotFoundException);
  });

  it("should add a card to storage", async () => {
    const storage = { id: uuid(), cards: [] };
    const card = { id: uuid(), storage };
    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockCardRepo.findOne.mockResolvedValue(card);
    mockCardRepo.save.mockImplementation((c) => {
      storage.cards.push(c as never);
      return Promise.resolve(c);
    });
    mockStorageRepo.save.mockImplementation((s) => Promise.resolve(s));

    const updated = await service.addCard(storage.id, card.id);

    expect(updated.cards).toContain(card);
    expect(mockCardRepo.save).toHaveBeenCalledWith(card);
  });

  it("should throw if card not found", async () => {
    const storage = { id: uuid(), cards: [] };
    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockCardRepo.findOne.mockResolvedValue(null);

    await expect(service.addCard(storage.id, uuid())).rejects.toThrow(NotFoundException);
  });

  it("should add a position change card", async () => {
    const storage = { id: uuid(), position_change_cards: [] };
    const pcCard = { id: uuid(), storage };
    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockPositionChangeRepo.findOne.mockResolvedValue(pcCard);
    mockPositionChangeRepo.save.mockImplementation((c) => {
      storage.position_change_cards.push(c as never);
      return Promise.resolve(c);
    });
    mockStorageRepo.save.mockImplementation((s) => Promise.resolve(s));

    const updated = await service.addPositionChangeCard(storage.id, pcCard.id);

    expect(updated.position_change_cards).toContain(pcCard);
    expect(mockPositionChangeRepo.save).toHaveBeenCalledWith(pcCard);
  });

  it("should throw if position change card not found", async () => {
    const storage = { id: uuid(), position_change_cards: [] };
    mockStorageRepo.findOne.mockResolvedValue(storage);
    mockPositionChangeRepo.findOne.mockResolvedValue(null);

    await expect(service.addPositionChangeCard(storage.id, uuid())).rejects.toThrow(
      NotFoundException,
    );
  });

  it("should find one storage", async () => {
    const storage = { id: uuid() };
    mockStorageRepo.findOne.mockResolvedValue(storage);

    const found = await service.findOne(storage.id);

    expect(found).toBe(storage);
    expect(mockStorageRepo.findOne).toHaveBeenCalledWith({
      where: { id: storage.id },
      relations: { cards: true, position_change_cards: true, team: true },
    });
  });

  it("should throw if storage not found", async () => {
    mockStorageRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it("should find all storages", async () => {
    const storages = [{ id: uuid() }, { id: uuid() }];
    mockStorageRepo.find.mockResolvedValue(storages);

    const all = await service.findAll();

    expect(all).toEqual(storages);
    expect(mockStorageRepo.find).toHaveBeenCalledWith({
      relations: { cards: true, position_change_cards: true, team: true, user: true },
    });
  });

  it("should delete storage", async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: uuid() });
    mockStorageRepo.delete.mockResolvedValue({ affected: 1 });

    await expect(service.deleteStorage(uuid(), uuid())).resolves.not.toThrow();
    expect(mockStorageRepo.delete).toHaveBeenCalled();
  });

  it("should throw when deleting non-existent storage", async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: uuid() });
    mockStorageRepo.delete.mockResolvedValue({ affected: 0 });

    await expect(service.deleteStorage(uuid(), uuid())).rejects.toThrow(NotFoundException);
    expect(mockStorageRepo.delete).toHaveBeenCalled();
  });
});
