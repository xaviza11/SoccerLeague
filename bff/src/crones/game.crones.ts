// src/cron/createMatches.cron.ts
import cron from "node-cron";
import { GameService } from "../services/game.services.js";
import type { FastifyInstance } from "fastify";

function create(fastify: FastifyInstance) {
  const gameService = new GameService();

  cron.schedule(
    "0 3 * * *",
    async () => {
      try {
        fastify.log.info("[CRON] creating matches...");
        await gameService.create();
        fastify.log.info("[CRON] Matches has been created.");
      } catch (err) {
        console.error("[CRON] Failed  to create games.", err);
      }
    },
    {
      timezone: "UTC",
    },
  );
}

export { create };
