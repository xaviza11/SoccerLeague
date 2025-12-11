import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { AuthGuard } from '../../guards/auth.guard';
import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { Player } from '../../entities';

describe('PlayerController', () => {
  let controller: PlayerController;

  const mockPlayerService = {
    create: jest.fn().mockResolvedValue('player created'),
    findAll: jest.fn().mockResolvedValue(['all players']),
    findOne: jest.fn().mockResolvedValue('one player'),
    update: jest.fn().mockResolvedValue('player updated'),
    delete: jest.fn().mockResolvedValue('player deleted'),
    findAllPlayersByUser: jest.fn().mockResolvedValue(['user players']),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        { provide: PlayerService, useValue: mockPlayerService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a player', async () => {
    const req = { user: { id: 'user1' } };
    const body: Partial<Player> = { name: 'Player1', team: 'Team1' };
    const result = await controller.create(req, body);
    expect(result).toBe('player created');
    expect(mockPlayerService.create).toHaveBeenCalledWith(body);
  });

  it('should throw BadRequestException if name or team is missing', async () => {
    const req = { user: { id: 'user1' } };
    const body: Partial<Player> = { name: 'Player1' }; // missing team
    await expect(controller.create(req, body)).rejects.toThrow(BadRequestException);
  });

  it('should find all players', async () => {
    const result = await controller.findAll();
    expect(result).toEqual(['all players']);
    expect(mockPlayerService.findAll).toHaveBeenCalled();
  });

  it('should find one player', async () => {
    const result = await controller.findOne('player1');
    expect(result).toBe('one player');
    expect(mockPlayerService.findOne).toHaveBeenCalledWith('player1');
  });

  it('should update a player', async () => {
    const body: Partial<Player> = { name: 'UpdatedName' };
    const result = await controller.update('player1', body);
    expect(result).toBe('player updated');
    expect(mockPlayerService.update).toHaveBeenCalledWith('player1', body);
  });

  it('should delete a player', async () => {
    const result = await controller.delete('player1');
    expect(result).toBe('player deleted');
    expect(mockPlayerService.delete).toHaveBeenCalledWith('player1');
  });

  it('should find all players by user', async () => {
    const result = await controller.findAllByUser('user1');
    expect(result).toEqual(['user players']);
    expect(mockPlayerService.findAllPlayersByUser).toHaveBeenCalledWith('user1');
  });
});
