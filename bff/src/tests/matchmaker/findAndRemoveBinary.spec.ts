import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js"

describe("findAndRemoveBinary", () => {
  const makePlayer = (elo: number) => ({
    stats: { elo },
  });

  it("finds and removes a player within range", () => {
    const players = [
      makePlayer(2000),
      makePlayer(1800),
      makePlayer(1600),
      makePlayer(1400),
    ];

    const result = Matchmaker.findAndRemoveBinary(players, 1700, 200);

    expect(result).toBeDefined();
    expect(players.length).toBe(3);
    expect(Math.abs(result.stats.elo - 1700)).toBeLessThanOrEqual(200);
  });

  it("returns and removes a random player if no match is found", () => {
    const players = [
      makePlayer(3000),
      makePlayer(2900),
      makePlayer(2800),
    ];

    const result = Matchmaker.findAndRemoveBinary(players, 1000, 50);

    expect(result).toBeDefined();
    expect(players.length).toBe(2);
  });

  it("returns null if players array is empty", () => {
    const result = Matchmaker.findAndRemoveBinary([], 1000, 100);
    expect(result).toBeNull();
  });
});
