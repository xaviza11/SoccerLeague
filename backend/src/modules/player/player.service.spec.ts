import { Test, TestingModule } from "@nestjs/testing";
import { PlayerService } from "./player.service";
import { NotFoundException } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Player, User, Team, Storage } from "../../entities";
import { Countries, Positions } from "../../enums";
import { v4 as uuid } from "uuid";

describe("PlayerService (unit)", () => {
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

  const createFakeUser = () => ({ id: uuid(), name: "User" }) as User;
  const createFakeTeam = () => ({ id: uuid() }) as Team;

  it("should create a player successfully", async () => {
    const user = createFakeUser();
    const team = createFakeTeam();

    mockUserRepo.findOne.mockResolvedValue(user);
    mockTeamRepo.findOne.mockResolvedValue(team);
    mockPlayerRepo.create.mockImplementation((dto) => dto);
    mockPlayerRepo.save.mockImplementation(async (p) => ({
      id: uuid(),
      ...p,
    }));

    const result = await service.create({
      id: user.id,
      name: "Cristiano",
      team: { id: team.id } as any,
      country: Countries.Spain,
      position: Positions.Striker,
      current_position: Positions.Striker,
      original_position: Positions.Striker,
      max_skill_level: 99,
      height_cm: 180,
      number: 7,
    });

    expect(result).toHaveProperty("id");
    expect(result.name).toBe("Cristiano");
    expect(result.team.id).toBe(team.id);
    expect(result.status).toBeDefined();
  });

  it("should throw if user does not exist", async () => {
    mockUserRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        id: uuid(),
        team: { id: uuid() } as any,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it("should throw if team info is missing", async () => {
    const user = createFakeUser();
    mockUserRepo.findOne.mockResolvedValue(user);

    await expect(
      service.create({
        id: user.id,
        name: "Messi",
      }),
    ).rejects.toThrow("Team information is required");
  });

  it("should throw if team does not exist", async () => {
    const user = createFakeUser();
    mockUserRepo.findOne.mockResolvedValue(user);
    mockTeamRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        id: user.id,
        team: { id: uuid() } as any,
      }),
    ).rejects.toThrow("Team not found");
  });

  it("should find one player", async () => {
    const fakePlayer = { id: uuid(), name: "Player" };
    mockPlayerRepo.findOne.mockResolvedValue(fakePlayer);

    const result = await service.findOne(fakePlayer.id);
    expect(result).toEqual(fakePlayer);
  });

  it("should throw if player not found", async () => {
    mockPlayerRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it("should update a player", async () => {
    const playerId = uuid();
    const fakePlayer = { id: playerId, name: "Old Name" };

    mockUserRepo.findOne.mockResolvedValue({ id: playerId });
    mockPlayerRepo.findOne.mockResolvedValue(fakePlayer);
    mockPlayerRepo.save.mockResolvedValue({
      ...fakePlayer,
      name: "New Name",
    });

    const updated = await service.update(playerId, { name: "New Name" });
    expect(updated.name).toBe("New Name");
  });

  it("should delete a player", async () => {
    const fakePlayer = { id: uuid() };

    mockUserRepo.findOne.mockResolvedValue({ id: fakePlayer.id });
    mockPlayerRepo.findOne.mockResolvedValue(fakePlayer);
    mockPlayerRepo.remove.mockResolvedValue(fakePlayer);

    await expect(service.delete(fakePlayer.id)).resolves.not.toThrow();
    expect(mockPlayerRepo.remove).toHaveBeenCalledWith(fakePlayer);
  });

  it("should throw when deleting non-existent player", async () => {
    mockPlayerRepo.findOne.mockResolvedValue(null);
    await expect(service.delete(uuid())).rejects.toThrow(NotFoundException);
  });
});
