import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js";

describe("Matchmaker Full Integration", () => {
  const createUsers = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `user-${i}`,
      stats: { elo: 100000 - i },
    }));
  };

  it("should match 100000 users without infinite loops or duplicates", () => {
    const userCount = 100000;
    const users = createUsers(userCount);
    
    const start = performance.now();
    const matches = Matchmaker.generateMatches(users);
    const end = performance.now();

    expect(matches.length).toBe(userCount / 2);

    const usedIds = new Set();
    for (const match of matches) {
      expect(usedIds.has(match.player1)).toBe(false);
      usedIds.add(match.player1);
      
      if (match.player2) {
        expect(usedIds.has(match.player2)).toBe(false);
        usedIds.add(match.player2);
      }
    }

    expect(usedIds.size).toBe(userCount);

    console.log(`Matchmaking time for ${userCount} users: ${end - start}ms`);
    expect(end - start).toBeLessThan(1000); 
  });

  it("should handle odd number of players by creating one AI match", () => {
    const userCount = 101;
    const users = createUsers(userCount);
    const matches = Matchmaker.generateMatches(users);

    expect(matches.length).toBe(51);
    const aiMatches = matches.filter(m => m.is_ai_game);
    expect(aiMatches.length).toBe(1);
    expect(aiMatches[0].player2).toBeNull();
  });

  it("should handle edge case: 0 and 1 players", () => {
    expect(Matchmaker.generateMatches([])).toEqual([]);
    
    const singleUser = createUsers(1);
    const matches = Matchmaker.generateMatches(singleUser);
    expect(matches.length).toBe(1);
    expect(matches[0].is_ai_game).toBe(true);
  });
});