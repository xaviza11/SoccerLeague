import { Test, TestingModule } from '@nestjs/testing';
import { UsersGameStatsController } from './users_game_stats.controller';
import { UsersGameStatsService } from './users_game_stats.service';
import { AuthGuard } from '../guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersStorageController', () => {
  let controller: UsersGameStatsController;

  const mockUsersStorageService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersGameStatsController],
      providers: [
        {
          provide: UsersGameStatsService,
          useValue: mockUsersStorageService,
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
});
