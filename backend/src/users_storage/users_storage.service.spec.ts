import { Test, TestingModule } from '@nestjs/testing';
import { UsersStorageService } from './users_storage.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  Storage,
  Team,
  PositionChangeCard,
  Card,
  User,
  UserStats,
} from '../entities';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersStorageService (integration)', () => {
  let service: UsersStorageService;
  let moduleRef: TestingModule;

  let pcRepo: Repository<PositionChangeCard>;
  let cardRepo: Repository<Card>;
  let teamRepo: Repository<Team>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [
              Storage,
              Team,
              PositionChangeCard,
              Card,
              User,
              UserStats,
            ],
            synchronize: true,
          }),
        }),
        TypeOrmModule.forFeature([Storage, Card, PositionChangeCard, Team]),
      ],
      providers: [UsersStorageService],
    }).compile();

    service = moduleRef.get<UsersStorageService>(UsersStorageService);

    pcRepo = moduleRef.get(getRepositoryToken(PositionChangeCard));
    cardRepo = moduleRef.get(getRepositoryToken(Card));
    teamRepo = moduleRef.get(getRepositoryToken(Team));
  });

  it('should create a storage', async () => {
    const created = await service.createStorage();

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.position_change_cards).toEqual(undefined);
    expect(created.cards).toEqual(undefined);
    expect(created.team).toEqual(undefined);
  });

  it('should add a position change card', async () => {
    const storage = await service.createStorage();
    const card = await pcRepo.save(pcRepo.create({}));
    const updated = await service.addPositionChangeCard(storage.id, card.id);
    expect(updated.position_change_cards.map((c) => c.id)).toContain(card.id);
  });

  it('should add a card', async () => {
    const storage = await service.createStorage();

    const card = await cardRepo.save(cardRepo.create({}));

    const updated = await service.addCard(storage.id, card.id);

    expect(updated.cards.map((c) => c.id)).toContain(card.id);
  });

  it('should add a team', async () => {
    const storage = await service.createStorage();

    const team = await teamRepo.save(teamRepo.create({}));

    const updated = await service.addTeam(storage.id, team.id);

    expect(updated.team.id).toBe(team.id);
  });

  it('should find one', async () => {
    const storage = await service.createStorage();
    const found = await service.findOne(storage.id);

    expect(found.id).toBe(storage.id);
  });

  it('should find all', async () => {
    const s1 = await service.createStorage();
    const s2 = await service.createStorage();

    const all = await service.findAll();

    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(all.map((s) => s.id)).toContain(s1.id);
    expect(all.map((s) => s.id)).toContain(s2.id);
  });

  it('should delete storage', async () => {
    const storage = await service.createStorage();

    await service.deleteStorage(storage.id);

    await expect(service.findOne(storage.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if deleting non-existent storage', async () => {
    await expect(service.deleteStorage('no-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw when adding card to non-existent storage', async () => {
    await expect(service.addCard('invalid', 'CARD')).rejects.toThrow(
      NotFoundException,
    );
  });

  afterEach(async () => {
    await pcRepo.createQueryBuilder().delete().execute();
    await cardRepo.createQueryBuilder().delete().execute();
    await teamRepo.createQueryBuilder().delete().execute();
    await moduleRef
      .get(getRepositoryToken(Storage))
      .createQueryBuilder()
      .delete()
      .execute();
  });
});
