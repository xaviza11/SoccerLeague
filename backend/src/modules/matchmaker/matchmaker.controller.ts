import { Controller } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MatchmakerService } from "./matchmaker.service";
import { Post } from "@nestjs/common";

@Controller("matchmaker")
export class MatchmakerController {
  constructor(private readonly matchMaker: MatchmakerService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    return await this.matchMaker.create();
  }

  @Post("manual")
  async manualTrigger() {
    const result = await this.matchMaker.create();
    return {
      message: "Process completed manually",
      data: result,
    };
  }
}
