import { Test, TestingModule } from "@nestjs/testing";
import { TeamsService } from "./teams.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Team, Storage, User } from "../../entities";
import { NotFoundException } from "@nestjs/common";
import { v4 as uuid } from "uuid";

describe("TeamsService", () => {
  let service: TeamsService;
  let mockTeamsRepo: any;
  let mockStorageRepo: any;
  let mockUserRepo: any;

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

    mockUserRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useValue: mockTeamsRepo },
        { provide: getRepositoryToken(Storage), useValue: mockStorageRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  const fakeTeam = () => ({
    id: uuid(),
    name: "YourTeam",
    players: [],
    bench_players: [],
    auras: [],
    storage: { id: uuid() },
  });

  const fakeUser = () => ({ id: uuid() });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a team with storage", async () => {
    const team = fakeTeam();
    const storage = team.storage;
    const user = fakeUser();

    mockUserRepo.findOne.mockResolvedValue(user);
    mockStorageRepo.create.mockReturnValue(storage);
    mockStorageRepo.save.mockResolvedValue(storage);
    mockTeamsRepo.create.mockReturnValue(team);
    mockTeamsRepo.save.mockResolvedValue(team);

    const result = await service.create(user.id);

    expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    expect(mockStorageRepo.create).toHaveBeenCalled();
    expect(mockStorageRepo.save).toHaveBeenCalledWith(storage);
    expect(mockTeamsRepo.create).toHaveBeenCalledWith({
      name: "YourTeam",
      storage,
      players: [],
      bench_players: [],
      auras: [],
    });
    expect(mockTeamsRepo.save).toHaveBeenCalledWith(team);
    expect(result).toEqual(team);
  });

  it("should throw NotFoundException when creating team if user not found", async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    await expect(service.create(uuid())).rejects.toThrow(NotFoundException);
  });

  it("should return all teams with full relations", async () => {
    const teams = [fakeTeam(), fakeTeam()];
    mockTeamsRepo.find.mockResolvedValue(teams);

    const result = await service.find();

    expect(mockTeamsRepo.find).toHaveBeenCalledWith({
      relations: ["players", "bench_players", "auras", "storage"],
    });
    expect(result).toEqual(teams);
  });

  it("should return a team by id with full relations", async () => {
    const team = fakeTeam();
    mockTeamsRepo.findOne.mockResolvedValue(team);

    const result = await service.findOne(team.id);

    expect(mockTeamsRepo.findOne).toHaveBeenCalledWith({
      where: { id: team.id },
      relations: ["players", "bench_players", "auras", "storage"],
    });
    expect(result).toEqual(team);
  });

  it("should throw NotFoundException if team not found", async () => {
    mockTeamsRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it("should update a team", async () => {
    const team = fakeTeam();
    const dto: Partial<Team> = { name: "NewName" };
    const user = fakeUser();

    mockUserRepo.findOne.mockResolvedValue(user);
    mockTeamsRepo.findOne.mockResolvedValue(team);
    mockTeamsRepo.save.mockResolvedValue({ ...team, ...dto });

    const result = await service.update(team.id, dto, user.id);

    expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    expect(mockTeamsRepo.findOne).toHaveBeenCalledWith({
      where: { id: team.id },
      relations: ["players", "bench_players", "auras", "storage"],
    });
    expect(mockTeamsRepo.save).toHaveBeenCalledWith({ ...team, ...dto });
    expect(result).toEqual({ ...team, ...dto });
  });

  it("should throw NotFoundException if updating with non-existent user", async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    await expect(service.update(uuid(), {}, uuid())).rejects.toThrow(NotFoundException);
  });

  it("should throw NotFoundException if updating non-existent team", async () => {
    const user = fakeUser();
    mockUserRepo.findOne.mockResolvedValue(user);
    mockTeamsRepo.findOne.mockResolvedValue(null);

    await expect(service.update(uuid(), {}, user.id)).rejects.toThrow(NotFoundException);
  });

  it("should delete a team", async () => {
    const team = fakeTeam();
    const user = fakeUser();

    mockUserRepo.findOne.mockResolvedValue(user);
    service.findOne = jest.fn().mockResolvedValue(team);
    mockTeamsRepo.remove.mockResolvedValue(undefined);

    const result = await service.delete(team.id, user.id);

    expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    expect(service.findOne).toHaveBeenCalledWith(team.id);
    expect(mockTeamsRepo.remove).toHaveBeenCalledWith(team);
    expect(result).toEqual({ message: "Team deleted successfully" });
  });

  it("should throw NotFoundException if deleting with non-existent user", async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    await expect(service.delete(uuid(), uuid())).rejects.toThrow(NotFoundException);
  });
});
