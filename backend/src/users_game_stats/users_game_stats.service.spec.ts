import { Test, TestingModule } from '@nestjs/testing';
import { UsersGameStatsService } from './users_game_stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserStats, User, Storage, Team, PositionChangeCard, Card } from '../entities';
import { NotFoundException } from '@nestjs/common';

describe('UsersGameStatsService (integration)', () => {
  let service: UsersGameStatsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [UserStats, User, Storage, Team, PositionChangeCard, Card],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([UserStats]),
      ],
      providers: [UsersGameStatsService],
    }).compile();

    service = module.get<UsersGameStatsService>(UsersGameStatsService);
  });

  it('should create user game data', async () => {
    const created = await service.create();

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.elo).toBe(10000);
    expect(created.money).toBe(100000);
  });

  it('should find all', async () => {
    const s1 = await service.create();
    const s2 = await service.create();

    const all = await service.findAll();

    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.map((s) => s.id)).toContain(s1.id);
    expect(all.map((s) => s.id)).toContain(s2.id);
  });

  it('should find one', async () => {
    const created = await service.create();
    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.elo).toBe(10000);
  });

  it('should throw when finding non-existent', async () => {
    await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
  });

  it('should update game data', async () => {
    const created = await service.create();

    const updated = await service.update(created.id, {
      elo: 1100,
      money: 300,
    });

    expect(updated.elo).toBe(1100);
    expect(updated.money).toBe(300);
  });

  it('should throw when updating non-existent', async () => {
    await expect(service.update('invalid', { elo: 2000 })).rejects.toThrow(NotFoundException);
  });

  it('should delete data', async () => {
    const created = await service.create();

    await service.delete(created.id);

    await expect(service.findOne(created.id)).rejects.toThrow(NotFoundException);
  });

  it('should throw when deleting non-existent', async () => {
    await expect(service.delete('invalid')).rejects.toThrow(NotFoundException);
  });

});
