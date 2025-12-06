import { Test, TestingModule } from '@nestjs/testing';
import { UsersStorageController } from './users_storage.controller';
import { UsersStorageService } from './users_storage.service';
import { AuthGuard } from '../guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UsersStorageController', () => {
  let controller: UsersStorageController;

  const mockUsersStorageService = {
    createStorage: jest.fn().mockResolvedValue('storage created'),
    addPositionChangeCard: jest.fn().mockResolvedValue('position card added'),
    addCard: jest.fn().mockResolvedValue('card added'),
    addTeam: jest.fn().mockResolvedValue('team added'),
    deleteStorage: jest.fn().mockResolvedValue('storage deleted'),
    findOne: jest.fn().mockResolvedValue('found one'),
    findAll: jest.fn().mockResolvedValue(['all storages']),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
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

  it('should create storage', async () => {
    const result = await controller.createStorage({ user: { id: '1' } });
    expect(result).toBe('storage created');
    expect(mockUsersStorageService.createStorage).toHaveBeenCalled();
  });

  it('should add a position change card', async () => {
    const card = 'card123';
    const req = { user: { id: '1' } };
    const result = await controller.addPositionCard(req, card);
    expect(result).toBe('position card added');
    expect(mockUsersStorageService.addPositionChangeCard).toHaveBeenCalledWith('1', card);
  });

  it('should add a card', async () => {
    const card = 'card456';
    const req = { user: { id: '1' } };
    const result = await controller.addCard(req, card);
    expect(result).toBe('card added');
    expect(mockUsersStorageService.addCard).toHaveBeenCalledWith('1', card);
  });

  it('should add a team', async () => {
    const teamId = 'team789';
    const req = { user: { id: '1' } };
    const result = await controller.addTeam(req, teamId);
    expect(result).toBe('team added');
    expect(mockUsersStorageService.addTeam).toHaveBeenCalledWith('1', teamId);
  });

  it('should delete storage', async () => {
    const req = { user: { id: '1' } };
    const result = await controller.deleteStorage(req);
    expect(result).toBe('storage deleted');
    expect(mockUsersStorageService.deleteStorage).toHaveBeenCalledWith('1');
  });

  it('should find one storage', async () => {
    const result = await controller.findOne('1');
    expect(result).toBe('found one');
    expect(mockUsersStorageService.findOne).toHaveBeenCalledWith('1');
  });

  it('should find all storages', async () => {
    const req = { user: { id: '1' } };
    const result = await controller.findAll(req);
    expect(result).toEqual(['all storages']);
    expect(mockUsersStorageService.findAll).toHaveBeenCalled();
  });
});
