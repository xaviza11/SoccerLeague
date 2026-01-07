import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../../guards/auth.guard';
import { ExecutionContext, BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue('user created'),
    login: jest.fn().mockResolvedValue('token'),
    findOne: jest.fn().mockResolvedValue('user found'),
    updateUser: jest.fn().mockResolvedValue('user updated'),
    deleteUser: jest.fn().mockResolvedValue('user deleted'),
    searchUsersByName: jest.fn().mockResolvedValue('user found')
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const body = { name: 'John', email: 'john@example.com', password: '1234' };
    const result = await controller.create(body);
    expect(result).toBe('user created');
    expect(mockUsersService.createUser).toHaveBeenCalledWith(
      body.name,
      body.email,
      body.password,
    );
  });

  it('should login a user', async () => {
    const body = { email: 'john@example.com', password: '1234' };
    const result = await controller.login(body);
    expect(result).toBe('token');
    expect(mockUsersService.login).toHaveBeenCalledWith(
      body.email,
      body.password,
    );
  });

  it('should search users by name', async () => {
    const result = await controller.searchByName('john');
    expect(result).toEqual("user found");
    expect(mockUsersService.searchUsersByName).toHaveBeenCalledWith('john');
  });

  it('should update a user', async () => {
    const req = { user: { sub: 'user123' } };
    const body = { name: 'NewName', currentPassword: '1234' };
    const result = await controller.update(req, body);
    expect(result).toBe('user updated');
    expect(mockUsersService.updateUser).toHaveBeenCalledWith('user123', body);
  });

  it('should delete a user', async () => {
    const req = { user: { sub: 'user123' } };
    const body = { currentPassword: '1234' };
    const result = await controller.delete(req, body);
    expect(result).toBe('user deleted');
    expect(mockUsersService.deleteUser).toHaveBeenCalledWith('user123', '1234');
  });
});
