import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, User } from '../entities';
import { validate as isUUID } from 'uuid';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(
    player_one_id: string,
    player_two_id: string | null,
    is_ai_game: boolean,
  ) {
    if (!isUUID(player_one_id)) {
      throw new BadRequestException('Invalid player_one_id');
    }

    if (!is_ai_game) {
      if (!isUUID(player_two_id)) {
        throw new BadRequestException('Invalid player_two_id');
      }
    }

    const player1 = await this.usersRepo.findOne({
      where: { id: player_one_id },
    });
    if (!player1) throw new NotFoundException('Player 1 not found');

    if (!is_ai_game && player_two_id !== null) {
      const player2 = await this.usersRepo.findOne({
        where: { id: player_two_id },
      });
      if (!player2) throw new NotFoundException('Player 2 not found');
    }

    const game = this.gameRepo.create({
      player_one_id: player_one_id,
      player_two_id: is_ai_game ? null : player_two_id,
      is_ai_game: !!is_ai_game,
    });

    return await this.gameRepo.save(game);
  }

  async findAll() {
    return this.gameRepo.find();
  }

  async findAllByUser(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    return this.gameRepo.find({
      where: [{ player_one_id: userId }, { player_two_id: userId }],
    });
  }

  async findOne(id: string) {
    const game = await this.gameRepo.findOne({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async remove(id: string) {
    const game = await this.gameRepo.findOne({ where: { id } });

    if (game === null) return new NotFoundException('Game not found');

    await this.gameRepo.delete(game.id);
    return { deleted: true };
  }
}
