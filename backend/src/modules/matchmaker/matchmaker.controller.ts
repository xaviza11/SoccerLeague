import { Controller } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MatchmakerService } from "./matchmaker.service";
import { Post, Delete, Get } from "@nestjs/common";

@Controller("matchmaker")
export class MatchmakerController {
  constructor(private readonly matchMaker: MatchmakerService) {}

  private readonly isTestMode = process.env.MODE === "test";

  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async handleCreateGamesCron() {
    return await this.matchMaker.create();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  async handleResolveGames() {}

  @Cron(CronExpression.EVERY_DAY_AT_2PM)
  async handleDeleteGamesCron() {}

  @Post("manual/create")
  async manualTrigger() {
    if (!this.isTestMode) return { message: "Disabled in production" };
    const result = await this.matchMaker.create();
    return {
      message: "Process completed manually",
      data: result,
    };
  }

  @Delete("manual/delete")
  async manualDeleteGames() {
    if (!this.isTestMode) return { message: "Disabled in production" };
    const result = await this.matchMaker.deleteGames();
    return {
      message: "Process completed manually",
      data: result,
    };
  }

  @Get("manual/resolve")
  async manualResolveGames() {
    if (!this.isTestMode) return { message: "Disabled in production" };
    const result = await this.matchMaker.resolveMatches();
    return {
      message: "Process completed manually",
      data: result,
    };
  }
}
