import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team, Storage } from '../entities';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('TeamsService', () => {
  let service: TeamsService;
  let mockTeamsRepo: any;
  let mockStorageRepo: any;

  beforeEach(async () => {
    mockTeamsRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    mockStorageRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useValue: mockTeamsRepo },
        { provide: getRepositoryToken(Storage), useValue: mockStorageRepo },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  const fakeTeam = () => ({
    id: uuid(),
    players: [],
    storage: { id: uuid() },
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a team with storage', async () => {
    const team = fakeTeam();
    const storage = team.storage;

    mockStorageRepo.create.mockReturnValue(storage);
    mockStorageRepo.save.mockResolvedValue(storage);

    mockTeamsRepo.create.mockReturnValue(team);
    mockTeamsRepo.save.mockResolvedValue(team);

    const result = await service.create();

    expect(mockStorageRepo.create).toHaveBeenCalled();
    expect(mockStorageRepo.save).toHaveBeenCalledWith(storage);
    expect(mockTeamsRepo.create).toHaveBeenCalledWith({ storage, players: [] });
    expect(mockTeamsRepo.save).toHaveBeenCalledWith(team);
    expect(result).toEqual(team);
  });

  it('should return all teams', async () => {
    const teams = [fakeTeam(), fakeTeam()];
    mockTeamsRepo.find.mockResolvedValue(teams);

    const result = await service.find();

    expect(mockTeamsRepo.find).toHaveBeenCalledWith({ relations: ['players', 'storage'] });
    expect(result).toEqual(teams);
  });

  it('should return a team by id', async () => {
    const team = fakeTeam();
    mockTeamsRepo.findOne.mockResolvedValue(team);

    const result = await service.findOne(team.id);

    expect(mockTeamsRepo.findOne).toHaveBeenCalledWith({
      where: { id: team.id },
      relations: ['players', 'storage'],
    });
    expect(result).toEqual(team);
  });

  it('should throw NotFoundException if team not found', async () => {
    mockTeamsRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it('should update a team', async () => {
    const team = fakeTeam();
    const dto = { someField: 'value' };

    service.findOne = jest.fn().mockResolvedValue(team);
    mockTeamsRepo.save.mockResolvedValue({ ...team, ...dto });

    const result = await service.update(team.id, dto);

    expect(service.findOne).toHaveBeenCalledWith(team.id);
    expect(mockTeamsRepo.save).toHaveBeenCalledWith({ ...team, ...dto });
    expect(result).toEqual({ ...team, ...dto });
  });

  it('should delete a team', async () => {
    const team = fakeTeam();
    service.findOne = jest.fn().mockResolvedValue(team);
    mockTeamsRepo.remove.mockResolvedValue(undefined);

    const result = await service.delete(team.id);

    expect(service.findOne).toHaveBeenCalledWith(team.id);
    expect(mockTeamsRepo.remove).toHaveBeenCalledWith(team);
    expect(result).toEqual({ message: 'Team deleted successfully' });
  });
});
