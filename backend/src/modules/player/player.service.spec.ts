import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player, User, Team, Storage } from '../../entities';
import { Countries, Positions } from '../../enums';
import { v4 as uuid } from 'uuid';

describe('PlayerService (unit)', () => {
  let service: PlayerService;

  let mockPlayerRepo: any;
  let mockUserRepo: any;
  let mockTeamRepo: any;
  let mockStorageRepo: any;

  beforeEach(async () => {
    mockPlayerRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    };

    mockTeamRepo = {
      findOne: jest.fn(),
    };

    mockStorageRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: getRepositoryToken(Player), useValue: mockPlayerRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Team), useValue: mockTeamRepo },
        { provide: getRepositoryToken(Storage), useValue: mockStorageRepo },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  // Helpers to create fake entities
  const createFakeUser = () => ({ id: uuid(), name: 'Alice' }) as User;
  const createFakeStorage = (user: User) => ({ id: uuid(), user }) as Storage;
  const createFakeTeam = (storage: Storage) =>
    ({ id: uuid(), storage }) as Team;
  const createFakePlayer = (team: Team, user: User) =>
    ({
      id: uuid(),
      name: 'Cristiano',
      team,
      user,
      country: 'Spain',
      position: 'Striker',
      current_position: 'Striker',
      original_position: 'Striker',
      max_skill_level: 99,
      height_cm: 180,
      number: 7,
    });

  it('should create a player', async () => {
    const user = createFakeUser();
    const storage = createFakeStorage(user);
    const team = createFakeTeam(storage);

    mockUserRepo.findOne.mockResolvedValue(user);
    mockTeamRepo.findOne.mockResolvedValue(team);
    mockPlayerRepo.create.mockImplementation((dto) => dto);
    mockPlayerRepo.save.mockImplementation(async (p) => ({ id: uuid(), ...p }));

    const player = await service.create({
      name: 'Cristiano',
      team: { id: team.id } as any,
      id: user.id,
      country: 'Spain' as Countries,
      position: 'Striker' as Positions,
      current_position: 'Striker' as Positions,
      original_position: 'Striker' as Positions,
      max_skill_level: 99,
      height_cm: 180,
      number: 7,
    });

    expect(player).toHaveProperty('id');
    expect(player.name).toBe('Cristiano');
    expect(player.team.id).toBe(team.id);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    const fakeUuid = uuid();
    const fakeTeamId = uuid();

    await expect(
      service.create({
        name: 'Messi',
        team: { id: fakeTeamId } as any,
        id: fakeUuid,
        country: 'Argentina' as Countries,
        position: 'Striker' as Positions,
        current_position: 'Striker' as Positions,
        original_position: 'Striker' as Positions,
        max_skill_level: 99,
        height_cm: 170,
        number: 10,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find one player', async () => {
    const fakePlayer = createFakePlayer(
      createFakeTeam(createFakeStorage(createFakeUser())),
      createFakeUser(),
    );
    mockPlayerRepo.findOne.mockResolvedValue(fakePlayer);

    const found = await service.findOne(fakePlayer.id);
    expect(found.id).toBe(fakePlayer.id);
  });

  it('should throw NotFoundException if player not found', async () => {
    mockPlayerRepo.findOne.mockResolvedValue(null);
    const randomId = uuid();
    await expect(service.findOne(randomId)).rejects.toThrow(NotFoundException);
  });

  it('should update a player', async () => {
    const playerId = uuid();
    const user = createFakeUser();
    const fakePlayer = { id: playerId, name: 'Old Name', user };

    mockUserRepo.findOne.mockResolvedValue(user);
    mockPlayerRepo.findOne.mockResolvedValue(fakePlayer);
    mockPlayerRepo.save.mockImplementation(async (p) => ({
      ...fakePlayer,
      ...p,
    }));

    const updated = await service.update(playerId, { name: 'New Name' });
    expect(updated.name).toBe('New Name');
  });

  it('should delete a player', async () => {
    const playerId = uuid();
    const user = createFakeUser();
    const fakePlayer = { id: playerId, user };

    mockUserRepo.findOne.mockResolvedValue(user);
    mockPlayerRepo.findOne.mockResolvedValue(fakePlayer);
    mockPlayerRepo.remove.mockResolvedValue(fakePlayer);

    await expect(service.delete(playerId)).resolves.not.toThrow();
    expect(mockPlayerRepo.remove).toHaveBeenCalledWith(fakePlayer);
  });
  
  it('should throw NotFoundException when deleting non-existent player', async () => {
    mockPlayerRepo.findOne.mockResolvedValue(null);
    const randomId = uuid();
    await expect(service.delete(randomId)).rejects.toThrow(NotFoundException);
  });

  it('should find all players by user', async () => {
    const user = createFakeUser();
    const fakePlayers = [
      createFakePlayer(createFakeTeam(createFakeStorage(user)), user),
      createFakePlayer(createFakeTeam(createFakeStorage(user)), user),
    ];

    mockUserRepo.findOne.mockResolvedValue(user);
    mockPlayerRepo.find.mockResolvedValue(fakePlayers);

    const players = await service.findAllPlayersByUser(user.id);
    expect(players.length).toBe(2);
    expect(players.map((p) => p.user.id)).toEqual(
      expect.arrayContaining([user.id, user.id]),
    );
  });
});
