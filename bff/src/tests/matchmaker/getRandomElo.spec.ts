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
});
