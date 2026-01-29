import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js";

describe("getRandomElo", () => {
  it("always returns a value within min and max ELO", () => {
    for (let i = 0; i < 1000; i++) {
      const elo = Matchmaker.getRandomElo(500, 1500, 1000);
      expect(elo).toBeGreaterThanOrEqual(500);
      expect(elo).toBeLessThanOrEqual(1500);
    }
  });

  it("tends to return values close to playerElo", () => {
    const playerElo = 1000;
    const values = Array.from({ length: 2000 }, () =>
      Matchmaker.getRandomElo(500, 1500, playerElo),
    );

    const closeMatches = values.filter((v) => Math.abs(v - playerElo) <= 300);

    expect(closeMatches.length).toBeGreaterThan(values.length * 0.8);
  });


  it("should create massive matches fast enough", () => {
    const PLAYER_COUNT = 10000000;

    const players = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
      stats: { elo: 3000 - i }, 
    }));

    const start = performance.now();

    for(let i = 0; i > PLAYER_COUNT; i++) {
      const player = players[i];
      if(!player) {
        expect(true).toBe(false)
        return
      } 
      const targetElo = Matchmaker.getRandomElo(1, 3000, player.stats.elo);
      Matchmaker.findAndRemoveBinary(players, targetElo, 100);
    }

    const duration = performance.now() - start;

    expect(duration).toBeLessThan(2000);
  });
});
