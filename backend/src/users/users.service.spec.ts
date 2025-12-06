import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, Storage, UserStats } from '../entities';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

describe('UsersService (unit)', () => {
  let service: UsersService;

  let mockUsersRepo: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUsersRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepo },
        { provide: getRepositoryToken(Storage), useValue: {} },
        { provide: getRepositoryToken(UserStats), useValue: {} },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  function createFakeUser(name: string, email: string, password: string) {
    return { id: uuid(), name, email, password } as User;
  }

  it('should create a user', async () => {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createFakeUser('Alice', 'alice@test.com', hashedPassword);

    mockUsersRepo.create.mockReturnValue(user);
    mockUsersRepo.save.mockResolvedValue(user);

    const result = await service.createUser('Alice', 'alice@test.com', password);
    expect(result).toEqual(user);
    expect(await bcrypt.compare(password, result.password)).toBe(true);
  });

  it('should update user with correct currentPassword', async () => {
    const oldPassword = 'secret';
    const hashedOld = await bcrypt.hash(oldPassword, 10);
    const user = createFakeUser('Bob', 'bob@test.com', hashedOld);

    mockUsersRepo.findOne.mockResolvedValue(user);
    mockUsersRepo.save.mockImplementation(u => Promise.resolve({ ...user, ...u }));

    const updated = await service.updateUser(user.id, {
      name: 'Bob Updated',
      email: 'bob2@test.com',
      password: 'newsecret',
      currentPassword: oldPassword,
    });

    expect(updated.name).toBe('Bob Updated');
    expect(updated.email).toBe('bob2@test.com');
    expect(await bcrypt.compare('newsecret', updated.password)).toBe(true);
  });

  it('should throw if updating with wrong currentPassword', async () => {
    const hashedOld = await bcrypt.hash('secret', 10);
    const user = createFakeUser('Bob2', 'bob2@test.com', hashedOld);

    mockUsersRepo.findOne.mockResolvedValue(user);

    await expect(
      service.updateUser(user.id, { name: 'Fail Update', currentPassword: 'wrongpass' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one user', async () => {
    const user = createFakeUser('Charlie', 'charlie@test.com', 'pass');
    mockUsersRepo.findOne.mockResolvedValue(user);

    const found = await service.findOne(user.id);
    expect(found).toEqual(user);
  });

  it('should throw if user not found', async () => {
    mockUsersRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(uuid())).rejects.toThrow(NotFoundException);
  });

  it('should delete a user with correct password', async () => {
    const hashed = await bcrypt.hash('pass', 10);
    const user = createFakeUser('Dave', 'dave@test.com', hashed);
    mockUsersRepo.findOne.mockResolvedValue(user);
    mockUsersRepo.delete.mockResolvedValue({ affected: 1 });

    await expect(service.deleteUser(user.id, 'pass')).resolves.not.toThrow();
  });

  it('should throw if deleting with wrong password', async () => {
    const hashed = await bcrypt.hash('pass', 10);
    const user = createFakeUser('Eve', 'eve@test.com', hashed);
    mockUsersRepo.findOne.mockResolvedValue(user);

    await expect(service.deleteUser(user.id, 'wrong')).rejects.toThrow(BadRequestException);
  });

  it('should login user with correct credentials', async () => {
    const password = 'mypassword';
    const hashed = await bcrypt.hash(password, 10);
    const user = createFakeUser('Frank', 'frank@test.com', hashed);
    mockUsersRepo.findOne.mockResolvedValue(user);

    const result = await service.login(user.email, password);
    expect(result.accessToken).toBe('token');
    expect(result.name).toBe(user.name);
  });

  it('should throw if login with wrong credentials', async () => {
    const password = 'mypassword';
    const hashed = await bcrypt.hash(password, 10);
    const user = createFakeUser('Grace', 'grace@test.com', hashed);
    mockUsersRepo.findOne.mockResolvedValue(user);

    await expect(service.login(user.email, 'wrongpass')).rejects.toThrow(BadRequestException);
  });
});
