import { Test, TestingModule } from '@nestjs/testing';
import { UsersGameStatsService } from './users_game_stats.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserStats, User } from '../entities';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('UsersGameStatsService (unit)', () => {
  let service: UsersGameStatsService;
  let usersService: UsersService;

  let mockUserStatsRepo: any;
  let mockUsersRepo: any;

  beforeEach(async () => {
    mockUserStatsRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    mockUsersRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersGameStatsService,
        { provide: UsersService, useValue: {} },
        { provide: getRepositoryToken(UserStats), useValue: mockUserStatsRepo },
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<UsersGameStatsService>(UsersGameStatsService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  function createFakeUser(id?: string) {
    return { id: id || uuid(), name: 'Alice' } as User;
  }

  function createFakeStats(user: User) {
    return {
      id: uuid(),
      user,
      elo: 10000,
      money: 100000,
      total_games: 0,
    } as UserStats;
  }

  it('should create user game data', async () => {
    const user = createFakeUser();
    const stats = createFakeStats(user);

    mockUsersRepo.findOne.mockResolvedValue(user);
    mockUserStatsRepo.create.mockReturnValue(stats);
    mockUserStatsRepo.save.mockResolvedValue(stats);

    const result = await service.create(user.id);

    expect(result).toEqual(stats);
    expect(mockUserStatsRepo.create).toHaveBeenCalledWith({
      user,
      elo: 10000,
      money: 100000,
      total_games: 0,
    });
    expect(mockUserStatsRepo.save).toHaveBeenCalledWith(stats);
  });

  it('should throw if user not found', async () => {
    mockUsersRepo.findOne.mockResolvedValue(null);
    await expect(service.create(uuid())).rejects.toThrow(NotFoundException);
  });

  it('should find one stats', async () => {
    const stats = createFakeStats(createFakeUser());
    mockUserStatsRepo.findOne.mockResolvedValue(stats);

    const result = await service.findOne(stats.id);
    expect(result).toEqual(stats);
  });

  it('should throw if stats not found', async () => {
    mockUserStatsRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it('should update stats', async () => {
    const stats = createFakeStats(createFakeUser());

    mockUserStatsRepo.update.mockResolvedValue({ affected: 1 });
    mockUserStatsRepo.findOne.mockResolvedValue({
      ...stats,
      elo: 12000,
      money: 500,
    });

    const updated = await service.update(stats.id, { elo: 12000, money: 500 });

    expect(updated.elo).toBe(12000);
    expect(updated.money).toBe(500);
    expect(mockUserStatsRepo.update).toHaveBeenCalledWith(stats.id, {
      elo: 12000,
      money: 500,
    });
  });

  it('should delete stats', async () => {
    const stats = createFakeStats(createFakeUser());
    mockUserStatsRepo.findOne.mockResolvedValue(stats);
    mockUserStatsRepo.delete.mockResolvedValue({ affected: 1 });

    await expect(service.delete(stats.id)).resolves.not.toThrow();
  });

  it('should get top N users in correct order', async () => {
    const user = createFakeUser();
    const stats = createFakeStats(user);
    stats.elo = 9000;

    mockUserStatsRepo.find.mockResolvedValue([stats]);

    const top = await service.getTop(1);
    expect(top).toEqual([stats]);
  });

  it('should get leaderboard paginated', async () => {
    const user = createFakeUser();
    const stats = createFakeStats(user);
    stats.elo = 10000;

    mockUserStatsRepo.find.mockResolvedValue([stats]);

    const page = await service.getLeaderboard(1, 2);
    expect(page).toEqual([stats]);
  });

  it('should return null when user has no stats', async () => {
    mockUserStatsRepo.find.mockResolvedValue([]);
    const rank = await service.getUserRank(uuid());
    expect(rank).toBeNull();
  });
});
