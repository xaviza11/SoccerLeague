import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js";

describe("Matchmaker Full Integration", () => {
  const createUsers = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `user-${i}`,
      stats: { elo: 100000 - i },
      has_game: false
    })) as any; 
  };

  it("should match 100000 users without infinite loops or duplicates", () => {
    const userCount = 100000;
    const users = createUsers(userCount);
    
    const start = performance.now();
    const matches = [...Matchmaker.generateMatches(users)];
    const filteredMatches = matches.filter(p => !("lastId" in p))
    const end = performance.now();

    expect(filteredMatches.length).toBe(Math.ceil(userCount / 2));

    const usedIds = new Set();
    for (const match of matches) {
      if(("playerOneId" in match)) expect(usedIds.has(match.playerOneId)).toBe(false);
      if(("playerOneId" in match)) usedIds.add(match.playerOneId);
      
      if(("playerTwoId" in match))
      if (match.playerTwoId) {
        expect(usedIds.has(match.playerTwoId)).toBe(false);
        usedIds.add(match.playerTwoId);
      }
    }

    expect(usedIds.size).toBe(userCount);

    console.log(`Matchmaking time for ${userCount} users: ${end - start}ms`);
    expect(end - start).toBeLessThan(1500);
  });

  it("should handle odd number of players by creating one AI match", () => {
    const userCount = 101;
    const users = createUsers(userCount);
    const matches = [...Matchmaker.generateMatches(users)];
    const filteredMatches = matches.filter(m => !("lastId" in m))

    expect(filteredMatches.length).toBe(51);
    const aiMatches = matches.filter(m => ("is_ai_game" in m) && m.is_ai_game);
    
    expect(aiMatches.length).toBe(1);
    if(("playerTwoId" in aiMatches[0]!)) expect(aiMatches[0]!.playerTwoId).toBeNull();
  });

  it("should handle edge case: 0 and 1 players", () => {
    expect([...Matchmaker.generateMatches([])]).toEqual([{lastId: "done"}]);
    
    const singleUser = createUsers(1);
    const matches = [...Matchmaker.generateMatches(singleUser)];
    const filteredMatches = matches.filter(p => !(('lastId' in p)) as never)
    expect(filteredMatches.length).toBe(1);
    if(("is_ai_game" in matches[0]!)) expect(matches[0]!.is_ai_game).toBe(true);
    if(("playerTwoId") in matches[0]!) expect(matches[0]!.playerTwoId).toBeNull();
  });
});