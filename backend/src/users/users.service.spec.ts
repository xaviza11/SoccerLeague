import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigModule } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('UsersService (integration)', () => {
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({ secret: process.env.JWT_SECRET }),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const password = 'password123';
    const user = await service.createUser('Alice', 'alice@test.com', password);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@test.com');
    expect(await bcrypt.compare(password, user.password)).toBe(true); // verify hashing
  });

  it('should update a user with correct currentPassword', async () => {
    const user = await service.createUser('Bob', 'bob@test.com', 'secret');

    const updated = await service.updateUser(user.id, {
      name: 'Bob Updated',
      email: 'bob2@test.com',
      password: 'newsecret',
      currentPassword: 'secret', // must provide current password
    });

    expect(updated.name).toBe('Bob Updated');
    expect(updated.email).toBe('bob2@test.com');
    expect(await bcrypt.compare('newsecret', updated.password)).toBe(true);
  });

  it('should throw error if updating with wrong currentPassword', async () => {
    const user = await service.createUser('Bob2', 'bob2@test.com', 'secret');

    await expect(
      service.updateUser(user.id, {
        name: 'Fail Update',
        currentPassword: 'wrongpassword',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find one user', async () => {
    const user = await service.createUser(
      'Charlie',
      'charlie@test.com',
      'pass',
    );
    const found = await service.findOne(user.id);

    expect(found.id).toBe(user.id);
    expect(found.email).toBe(user.email);
  });

  it('should delete a user with correct currentPassword', async () => {
    const user = await service.createUser('Dave', 'dave@test.com', 'pass');
    await service.deleteUser(user.id, 'pass'); // must provide current password

    await expect(service.findOne(user.id)).rejects.toThrow();
  });

  it('should throw error if deleting with wrong currentPassword', async () => {
    const user = await service.createUser('Eve', 'eve@test.com', 'pass');

    await expect(service.deleteUser(user.id, 'wrongpass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should login user', async () => {
    const password = 'mypassword';
    const user = await service.createUser('Frank', 'frank@test.com', password);

    const result = await service.login('frank@test.com', password);

    expect(result.accessToken).toBeDefined();
    expect(result.name).toBe('Frank');
  });

  afterEach(async () => {
    await service['usersRepo'].clear();
  });
});
