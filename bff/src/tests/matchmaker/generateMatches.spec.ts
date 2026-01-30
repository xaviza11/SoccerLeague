import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js";

describe("Matchmaker Integration Tests", () => {
  const createSortedPlayers = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `player-${i}`,
      stats: { elo: 3000 - i },
      has_game: false,
    }));
  };

  it("should pair all players exactly once (even count)", () => {
    const players = createSortedPlayers(100);
    const matches = Matchmaker.generateMatches(players);

    expect(matches.length).toBe(50);
    
    matches.forEach(m => {
      expect(m.player1).toBeDefined();
      expect(m.player2).toBeDefined();
      expect(m.is_ai_game).toBe(false);
      expect(m.player1).not.toBe(m.player2);
    });
  });

  it("should create an AI match for the last player (odd count)", () => {
    const players = createSortedPlayers(11);
    const matches = Matchmaker.generateMatches(players);

    expect(matches.length).toBe(6);
    const aiMatches = matches.filter(m => m.is_ai_game);
    expect(aiMatches.length).toBe(1);
    expect(aiMatches[0].player2).toBeNull();
  });

  it("should keep elo difference within reasonable bounds on average", () => {
    const players = createSortedPlayers(200);
    const matches = Matchmaker.generateMatches(players);
    
    const normalMatches = matches.filter(m => !m.is_ai_game);
    
    let totalDiff = 0;
    normalMatches.forEach(m => {
      const p1 = players.find(p => p.id === m.player1);
      const p2 = players.find(p => p.id === m.player2);
      totalDiff += Math.abs(p1!.stats.elo - p2!.stats.elo);
    });

    const averageDiff = totalDiff / normalMatches.length;
    expect(averageDiff).toBeLessThan(400); 
  });

  it("performance test: should process 1,000,000 players in under 2 seconds", () => {
    const players = createSortedPlayers(1_000_000);
    
    const start = performance.now();
    const matches = Matchmaker.generateMatches(players);
    const end = performance.now();

    expect(matches.length).toBe(500_000);
    expect(end - start).toBeLessThan(2000);
  });

  it("should safely handle empty or single-player arrays", () => {
    expect(Matchmaker.generateMatches([])).toEqual([]);
    
    const singlePlayer = createSortedPlayers(1);
    const matches = Matchmaker.generateMatches(singlePlayer);
    expect(matches.length).toBe(1);
    expect(matches[0].is_ai_game).toBe(true);
  });
});
