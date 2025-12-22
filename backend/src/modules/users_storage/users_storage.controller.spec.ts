import { Test, TestingModule } from '@nestjs/testing';
import { UsersStorageController } from './users_storage.controller';
import { UsersStorageService } from './users_storage.service';
import { AuthGuard } from '../../guards/auth.guard';
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

  const mockAuthGuard = { canActivate: jest.fn((ctx: ExecutionContext) => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersStorageController],
      providers: [{ provide: UsersStorageService, useValue: mockUsersStorageService }],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersStorageController>(UsersStorageController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create storage', async () => {
    const req = { user: { id: 'user1' } };
    const result = await controller.createStorage(req);
    expect(result).toBe('storage created');
    expect(mockUsersStorageService.createStorage).toHaveBeenCalledWith(req.user.id);
  });

  it('should add a position change card', async () => {
    const req = { user: { id: 'user1' } };
    const card = 'card123'
    const storageId = 'storage1' 
    const result = await controller.addPositionCard(req, card, storageId);
    expect(result).toBe('position card added');
    expect(mockUsersStorageService.addPositionChangeCard).toHaveBeenCalledWith(storageId, card);
  });

  it('should add a card', async () => {
    const req = { user: { id: 'user1' } };
    const card = 'card456' 
    const storageId = 'storage2'
    const result = await controller.addCard(req, card, storageId);
    expect(result).toBe('card added');
    expect(mockUsersStorageService.addCard).toHaveBeenCalledWith(storageId, card);
  });

  it('should add a team', async () => {
    const req = { user: { id: 'user1' } };
    const teamId = 'team789' 
    const storageId = 'storage3'
    const result = await controller.addTeam(req, teamId, storageId);
    expect(result).toBe('team added');
    expect(mockUsersStorageService.addTeam).toHaveBeenCalledWith(req.user.id, teamId, storageId);
  });

  it('should delete storage', async () => {
    const req = { user: { id: 'user1' } };
    const body = 'storage4'
    const result = await controller.deleteStorage(req, body);
    expect(result).toBe('storage deleted');
    expect(mockUsersStorageService.deleteStorage).toHaveBeenCalledWith(req.user.id, body);
  });

  it('should find one storage', async () => {
    const id = 'storage5';
    const result = await controller.findOne(id);
    expect(result).toBe('found one');
    expect(mockUsersStorageService.findOne).toHaveBeenCalledWith(id);
  });

  it('should find all storages', async () => {
    const req = { user: { id: 'user1' } };
    const result = await controller.findAll(req);
    expect(result).toEqual(['all storages']);
    expect(mockUsersStorageService.findAll).toHaveBeenCalled();
  });
});
