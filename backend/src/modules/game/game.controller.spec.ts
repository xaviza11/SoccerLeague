import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { AuthGuard } from '../../guards/auth.guard';
import { v4 as uuid } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { id: uuid() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a human vs human game', async () => {
    const playerTwoId = uuid();
    const playerOneId = uuid();
    const game = {
      id: uuid(),
      player_one_id: playerOneId,
      player_two_id: playerTwoId,
      is_ai_game: false,
    };
    mockService.create.mockResolvedValue(game);

    const result = await controller.create(playerOneId, playerTwoId, false);

    expect(result).toEqual(game);
    expect(mockService.create).toHaveBeenCalledWith(
      playerOneId,
      playerTwoId,
      false,
    );
  });

  it('should create a game vs AI', async () => {
    const playerTwoId = null;
    const playerOneId = uuid();
    const game = {
      id: uuid(),
      player_one_id: playerOneId,
      player_two_id: playerTwoId,
      is_ai_game: true,
    };
    mockService.create.mockResolvedValue(game);

    const result = await controller.create(
      playerOneId,
      playerTwoId,
      game.is_ai_game,
    );

    expect(result).toEqual(game);
    expect(mockService.create).toHaveBeenCalledWith(playerOneId, null, true);
  });

  it('should throw BadRequestException if human game missing player_two_id', async () => {
    const playerOneId = uuid(); // any valid UUID
    const isAiGame = false;

    // Pass no player_two_id
    await expect(
      controller.create(playerOneId, null, isAiGame),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return all games', async () => {
    const games = [{ id: uuid() }, { id: uuid() }];
    mockService.findAll.mockResolvedValue(games);

    const result = await controller.findAll();
    expect(result).toEqual(games);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should return all games of the logged-in user', async () => {
    const games = [{ id: uuid() }];
    mockService.findAllByUser.mockResolvedValue(games);

    const result = await controller.findAllByUser({ user: mockUser });
    expect(result).toEqual(games);
    expect(mockService.findAllByUser).toHaveBeenCalledWith(mockUser.id);
  });

  it('should return a single game', async () => {
    const id = uuid();
    const game = { id };
    mockService.findOne.mockResolvedValue(game);

    const result = await controller.findOne(id);
    expect(result).toEqual(game);
    expect(mockService.findOne).toHaveBeenCalledWith(id);
  });

  it('should delete a game', async () => {
    const id = uuid();
    const response = { deleted: true };

    mockService.remove = jest.fn().mockResolvedValue(response);

    const result = await controller.deleteOne(id);

    expect(result).toEqual(response);
    expect(mockService.remove).toHaveBeenCalledWith(id);
  });
});
