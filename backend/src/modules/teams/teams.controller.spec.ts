import { Test, TestingModule } from "@nestjs/testing";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { AuthGuard } from "../../guards/auth.guard";
import { BadRequestException } from "@nestjs/common";

describe("TeamsController", () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeamsService = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserReq = {
    user: { id: "user-123" },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [{ provide: TeamsService, useValue: mockTeamsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a team", async () => {
    const team = { id: "team-1" };
    mockTeamsService.create.mockResolvedValue(team);

    const result = await controller.createTeam(mockUserReq.user.id);

    expect(service.create).toHaveBeenCalledWith(mockUserReq.user.id);
    expect(result).toEqual(team);
  });

  it("should return all teams", async () => {
    const teams = [{ id: "t1" }, { id: "t2" }];
    mockTeamsService.find.mockResolvedValue(teams);

    const result = await controller.findAllTeams();

    expect(service.find).toHaveBeenCalled();
    expect(result).toEqual(teams);
  });

  it("should return one team by id", async () => {
    const team = { id: "t1" };
    mockTeamsService.findOne.mockResolvedValue(team);

    const result = await controller.findOneTeam("t1");

    expect(service.findOne).toHaveBeenCalledWith("t1");
    expect(result).toEqual(team);
  });

  it("should update the logged user team", async () => {
    const body = { teamId: "team-123", name: "New Team Name" };
    const updated = { id: "team-123", ...body };

    mockTeamsService.update.mockResolvedValue(updated);

    const result = await controller.updateMyTeam(mockUserReq.user.id, body);

    expect(service.update).toHaveBeenCalledWith(
      "team-123",
      { name: "New Team Name" },
      mockUserReq.user.id,
    );
    expect(result).toEqual(updated);
  });

  it("should throw BadRequestException if teamId is missing in update", async () => {
    const body = { name: "New Team Name" };

    await expect(controller.updateMyTeam(mockUserReq.user.id, body)).rejects.toThrow(BadRequestException);
  });

  it("should delete a team", async () => {
    const deleted = { message: "Team deleted successfully" };
    const teamId = "team-123";

    mockTeamsService.delete.mockResolvedValue(deleted);

    const req = { user: { id: "user-123" } };
    const result = await controller.deleteMyTeam(req.user.id, teamId);

    expect(service.delete).toHaveBeenCalledWith(teamId, req.user.id);
    expect(result).toEqual(deleted);
  });
});
