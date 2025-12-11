import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game, User } from '../../entities';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('GameService', () => {
  let service: GameService;

  const mockGameRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn()
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a game between two humans', async () => {
    const player1 = uuid();
    const player2 = uuid();

    mockUserRepo.findOne
      .mockResolvedValueOnce({ id: player1 })
      .mockResolvedValueOnce({ id: player2 });

    const game = {
      id: uuid(),
      player_one_id: player1,
      player_two_id: player2,
      is_ai_game: false,
    };

    mockGameRepo.create.mockReturnValue(game);
    mockGameRepo.save.mockResolvedValue(game);

    const result = await service.create(game.player_one_id, game.player_two_id, game.is_ai_game);

    expect(result).toEqual(game);
    expect(mockGameRepo.create).toHaveBeenCalled();
    expect(mockGameRepo.save).toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid UUID', async () => {

    const game = {
      player_one_id: 'invalid',
      player_two_id: uuid(),
      is_ai_game: false
    }

    await expect(
      service.create(game.player_one_id, game.player_two_id, game.is_ai_game),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if player does not exist', async () => {
    const player1 = uuid();
    const player2 = uuid();
    const is_ai_game = false;

    mockUserRepo.findOne.mockResolvedValueOnce(null);

    await expect(
      service.create(player1, player2, is_ai_game),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create a game vs AI', async () => {
    const player1 = uuid();

    mockUserRepo.findOne.mockResolvedValueOnce({ id: player1 });

    const game = {
      id: uuid(),
      player_one_id: player1,
      player_two_id: null,
      is_ai_game: true,
    };

    mockGameRepo.create.mockReturnValue(game);
    mockGameRepo.save.mockResolvedValue(game);

    const result = await service.create(player1, null, true);

    expect(result).toEqual(game);
  });

  it('should return a game', async () => {
    const id = uuid();
    const game = { id };

    mockGameRepo.findOne.mockResolvedValue(game);

    const result = await service.findOne(id);
    expect(result).toEqual(game);
  });

  it('should remove a game', async () => {
    const id = uuid();
    const game = { id };

    mockGameRepo.findOne.mockResolvedValue(game);
    mockGameRepo.remove.mockResolvedValue(game);

    const result = await service.remove(id);

    expect(result).toEqual({ deleted: true });
  });
});
