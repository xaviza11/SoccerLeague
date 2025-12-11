import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { AuthGuard } from '../../guards/auth.guard';

describe('TeamsController', () => {
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
    user: {
      teamId: 'team-123',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create() on createTeam', async () => {
    mockTeamsService.create.mockResolvedValue({ id: 'team-1' });

    const result = await controller.createTeam();

    expect(service.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'team-1' });
  });

  it('should return all teams on findAllTeams', async () => {
    const teams = [{ id: 't1' }, { id: 't2' }];
    mockTeamsService.find.mockResolvedValue(teams);

    const result = await controller.findAllTeams();

    expect(service.find).toHaveBeenCalled();
    expect(result).toEqual(teams);
  });

  it('should return one team on findOneTeam', async () => {
    const team = { id: 't1' };

    mockTeamsService.findOne.mockResolvedValue(team);

    const result = await controller.findOneTeam('t1');

    expect(service.findOne).toHaveBeenCalledWith('t1');
    expect(result).toEqual(team);
  });

  it('should update the logged user team on updateMyTeam', async () => {
    const body = { name: 'New Team Name' };
    const updated = { id: 'team-123', ...body };

    mockTeamsService.update.mockResolvedValue(updated);

    const result = await controller.updateMyTeam(mockUserReq, body);

    expect(service.update).toHaveBeenCalledWith('team-123', body);
    expect(result).toEqual(updated);
  });

  it('should delete a team by id on deleteTeamById', async () => {
    const deleted = { message: 'Team deleted successfully' };

    mockTeamsService.delete.mockResolvedValue(deleted);

    const result = await controller.deleteTeamById('t1');

    expect(service.delete).toHaveBeenCalledWith('t1');
    expect(result).toEqual(deleted);
  });
});
