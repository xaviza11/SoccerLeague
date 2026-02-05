import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, Game } from "../../entities";
import { Logger } from "@nestjs/common";
import Matchmaker from "./utils/Matchmaker";
import pLimit from "p-limit";

@Injectable()
export class MatchmakerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
  ) {}

  private limit = pLimit(10);
  private readonly logger = new Logger(MatchmakerService.name);

  public async create() {
    let page = 0;
    const pageSize = 10000;
    const savePromises = [];
    let totalUsers = 0;
    let totalMatches = 0;

    this.logger.log("🚀 Starting optimized match generation...");

    try {
      while (true) {
        const batch = await this.userRepo.find({
          skip: page * pageSize,
          take: pageSize,
          relations: ['stats'],
        });

        if (!batch || batch.length === 0) break;

        totalUsers += batch.length;

        const task = this.limit(async () => {
          const matches = Matchmaker.generateMatches(batch);
          totalMatches += matches.length;

          await this.gameRepo.save(matches);
        });

        savePromises.push(task as never);
        if (batch.length < pageSize) break;
        page++;
      }

      await Promise.all(savePromises);
    } catch (error) {
      this.logger.error("❌ Error during processing:", error.stack);
      throw error;
    }

    return {
      success: true,
      processedUsers: totalUsers,
      createdMatches: totalMatches,
    };
  }
}
