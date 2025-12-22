import { Test, TestingModule } from '@nestjs/testing';
import { UsersGameStatsController } from './users_game_stats.controller';
import { UsersGameStatsService } from './users_game_stats.service';
import { AuthGuard } from '../../guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersGameStatsController', () => {
  let controller: UsersGameStatsController;

  const mockUsersGameStatsService = {
    create: jest.fn().mockResolvedValue('created stats'),
    findAll: jest.fn().mockResolvedValue(['all stats']),
    findOne: jest.fn().mockResolvedValue('one stats'),
    getTop: jest.fn().mockResolvedValue(['top stats']),
    getLeaderboard: jest.fn().mockResolvedValue(['leaderboard']),
    getUserRank: jest.fn().mockResolvedValue('rank 1'),
    update: jest.fn().mockResolvedValue('updated stats'),
    delete: jest.fn().mockResolvedValue('deleted stats'),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersGameStatsController],
      providers: [
        {
          provide: UsersGameStatsService,
          useValue: mockUsersGameStatsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersGameStatsController>(UsersGameStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user game stats', async () => {
    const req = { user: { id: 'user123' } };
    const result = await controller.createUserGameStats(req);
    expect(result).toBe('created stats');
    expect(mockUsersGameStatsService.create).toHaveBeenCalledWith('user123');
  });

  it('should find all stats', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(['all stats']);
    expect(mockUsersGameStatsService.findAll).toHaveBeenCalled();
  });

  it('should find one stat', async () => {
    const result = await controller.findOne('stat123');
    expect(result).toBe('one stats');
    expect(mockUsersGameStatsService.findOne).toHaveBeenCalledWith('stat123');
  });

  it('should get top stats', async () => {
    const result = await controller.getTop(10);
    expect(result).toEqual(['top stats']);
    expect(mockUsersGameStatsService.getTop).toHaveBeenCalledWith(10);
  });

  it('should get leaderboard', async () => {
    const result = await controller.getLeaderboard(2, 20);
    expect(result).toEqual(['leaderboard']);
    expect(mockUsersGameStatsService.getLeaderboard).toHaveBeenCalledWith(2, 20);
  });

  it('should get user rank', async () => {
    const result = await controller.getUserRank('user123');
    expect(result).toBe('rank 1');
    expect(mockUsersGameStatsService.getUserRank).toHaveBeenCalledWith('user123');
  });

  it('should update stats', async () => {
    const req = { user: { id: 'user123' } };
    const body = { score: 100 };
    const result = await controller.update(body, req);
    expect(result).toBe('updated stats');
    expect(mockUsersGameStatsService.update).toHaveBeenCalledWith('user123', body);
  });

  it('should delete stats', async () => {
    const req = { user: { id: 'user123' } };
    const result = await controller.remove(req);
    expect(result).toBe('deleted stats');
    expect(mockUsersGameStatsService.delete).toHaveBeenCalledWith('user123');
  });
});
