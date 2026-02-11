import { Controller, Post, Delete, Get, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MatchmakerService } from "./matchmaker.service";

@Controller("matchmaker")
export class MatchmakerController {
  private readonly logger = new Logger(MatchmakerController.name);
  private readonly isTestMode = process.env.MODE === "test";

  constructor(private readonly matchMaker: MatchmakerService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2PM)
  async handleCreateGamesCron() {
    this.logger.log("Cron: Creating Games...");
    return await this.matchMaker.create();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async handleResolveGames() {
    this.logger.log("Cron: Resolving Simulations...");
    return await this.matchMaker.resolveMatches();
  }

  @Cron(CronExpression.EVERY_DAY_AT_4PM)
  async handleUpdateEloCron() {
    this.logger.log("Cron: Updating elo and awards...");
    return await this.matchMaker.updateElo();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  async handleDeleteGamesCron() {
    this.logger.log("Cron: Cleaning Games...");
    return await this.matchMaker.deleteGames();
  }

  @Post("manual/create")
  async manualTrigger() {
    if (!this.isTestMode) return { message: "Disabled in production" };
    return { message: "Create Started", data: await this.matchMaker.create() };
  }

  @Post("manual/resolve")
  async manualResolveGames() {
    if (!this.isTestMode) return { message: "Disabled in production" };
    return { message: "Resolve Started", data: await this.matchMaker.resolveMatches() };
  }

  @Post("manual/update-elo")
  async manualUpdateElo() {
    if (!this.isTestMode) return { message: "Disabled in production" };
    return { message: "Update ELO Started", data: await this.matchMaker.updateElo() };
  }

  @Delete("manual/delete")
  async manualDeleteGames() {
    if (!this.isTestMode) return { message: "Disabled in production" };
    return { message: "Delete iniciado", data: await this.matchMaker.deleteGames() };
  }
}