import { Test, TestingModule } from '@nestjs/testing';
import { UsersGameStatsService } from './users_game_stats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserStats, User } from '../../entities';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MoreThan } from 'typeorm';

describe('UsersGameStatsService (unit)', () => {
  let service: UsersGameStatsService;

  let mockUserStatsRepo: any;
  let mockUsersRepo: any;

  beforeEach(async () => {
    mockUserStatsRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
    };

    mockUsersRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersGameStatsService,
        { provide: getRepositoryToken(UserStats), useValue: mockUserStatsRepo },
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
      ],
    }).compile();

    service = module.get<UsersGameStatsService>(UsersGameStatsService);

    jest.clearAllMocks();
  });

  function createFakeUser(id?: string): User {
    return { id: id || uuid(), name: 'Alice' } as User;
  }

  function createFakeStats(user: User): UserStats {
    return {
      id: uuid(),
      user,
      elo: 10000,
      money: 100000,
      total_games: 0,
    } as UserStats;
  }

  it('should create user game stats', async () => {
    const user = createFakeUser();
    const stats = createFakeStats(user);

    mockUsersRepo.findOne.mockResolvedValue(user);
    mockUserStatsRepo.create.mockReturnValue(stats);
    mockUserStatsRepo.save.mockResolvedValue(stats);

    const result = await service.create(user.id);

    expect(result).toEqual({
      id: stats.id,
      elo: stats.elo,
      money: stats.money,
      total_games: stats.total_games,
    });
    expect(mockUserStatsRepo.create).toHaveBeenCalledWith({
      user,
      elo: 10000,
      money: 100000,
      total_games: 0,
    });
    expect(mockUserStatsRepo.save).toHaveBeenCalledWith(stats);
  });

  it('should throw if user not found when creating stats', async () => {
    mockUsersRepo.findOne.mockResolvedValue(null);
    await expect(service.create(uuid())).rejects.toThrow(NotFoundException);
  });

  it('should find one stats by id', async () => {
    const stats = createFakeStats(createFakeUser());
    mockUserStatsRepo.findOne.mockResolvedValue(stats);

    const result = await service.findOne(stats.id);

    expect(mockUserStatsRepo.findOne).toHaveBeenCalledWith({
      where: { id: stats.id },
      relations: ['user'],
    });
    expect(result).toEqual(stats);
  });

  it('should throw if stats not found by id', async () => {
    mockUserStatsRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it('should update stats by user', async () => {
    const user = createFakeUser();
    const stats = createFakeStats(user);

    mockUserStatsRepo.findOne.mockResolvedValue(stats);
    mockUserStatsRepo.save.mockResolvedValue({
      ...stats,
      elo: 12000,
      money: 500,
    });

    const updated = await service.update(user.id, {
      elo: 12000,
      money: 500,
    });

    expect(updated.elo).toBe(12000);
    expect(updated.money).toBe(500);
    expect(mockUserStatsRepo.save).toHaveBeenCalled();
  });

  it('should throw if updating stats and user has no stats', async () => {
    mockUserStatsRepo.findOne.mockResolvedValue(null);
    await expect(
      service.update(uuid(), { elo: 12000 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete stats by user', async () => {
    const user = createFakeUser();
    const stats = createFakeStats(user);

    mockUserStatsRepo.findOne.mockResolvedValue(stats);
    mockUserStatsRepo.remove.mockResolvedValue(stats);

    await expect(service.delete(user.id)).resolves.not.toThrow();
    expect(mockUserStatsRepo.remove).toHaveBeenCalledWith(stats);
  });

  it('should throw if deleting stats and user has no stats', async () => {
    mockUserStatsRepo.findOne.mockResolvedValue(null);
    await expect(service.delete(uuid())).rejects.toThrow(NotFoundException);
  });

  it('should get top N users', async () => {
    const stats = createFakeStats(createFakeUser());
    mockUserStatsRepo.find.mockResolvedValue([stats]);

    const top = await service.getTop(1);

    expect(mockUserStatsRepo.find).toHaveBeenCalledWith({
      relations: ['user'],
      order: { elo: 'DESC' },
      take: 1,
    });
    expect(top).toEqual([stats]);
  });

  it('should get leaderboard paginated', async () => {
    const stats = createFakeStats(createFakeUser());
    mockUserStatsRepo.find.mockResolvedValue([stats]);

    const leaderboard = await service.getLeaderboard(2, 10);

    expect(mockUserStatsRepo.find).toHaveBeenCalledWith({
      relations: ['user'],
      order: { elo: 'DESC' },
      skip: 10,
      take: 10,
    });
    expect(leaderboard).toEqual([stats]);
  });

  it('should return correct user rank', async () => {
    const user = createFakeUser();
    const stats = createFakeStats(user);
    stats.elo = 10000;

    mockUserStatsRepo.findOne.mockResolvedValue(stats);
    mockUserStatsRepo.count.mockResolvedValue(5);

    const rank = await service.getUserRank(user.id);

    expect(mockUserStatsRepo.count).toHaveBeenCalledWith({
      where: { elo: MoreThan(stats.elo) },
    });
    expect(rank).toBe(6);
  });

  it('should return null when user has no stats for rank', async () => {
    mockUserStatsRepo.findOne.mockResolvedValue(null);

    const rank = await service.getUserRank(uuid());

    expect(rank).toBeNull();
  });
});
