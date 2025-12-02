import { Test, TestingModule } from '@nestjs/testing';
import { UsersStorageController } from './users_storage.controller';
import { UsersStorageService } from './users_storage.service';
import { AuthGuard } from '../guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersStorageController', () => {
  let controller: UsersStorageController;

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
      controllers: [UsersStorageController],
      providers: [
        {
          provide: UsersStorageService,
          useValue: mockUsersStorageService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersStorageController>(UsersStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
