import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js";
import type { Match } from "../../modules/models/dto/utils/matchMaker/MatchMaker.js";

describe("Matchmaker Integration Tests", () => {
  const createSortedPlayers = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `player-${i}`,
      stats: { elo: 3000 - i },
      has_game: false,
    })) as any;
  };

  it("should pair all players exactly once (even count)", () => {
    const players = createSortedPlayers(100);
    const matches = [...Matchmaker.generateMatches(players)];
    const filteredMatches = matches.filter(m => !("lastId" in m))

    expect(filteredMatches.length).toBe(50);
    
    filteredMatches.forEach(m => {
      if(("playerOneId" in m)) expect(m.playerOneId).toBeDefined(); 
      if(("playerTwoId") in m) expect(m.playerTwoId).toBeDefined();
      if(("is_ai_game") in m) expect(m.is_ai_game).toBe(false);
      if(("playerOneId" in m) && ("playerTwoId") in m) expect(m.playerOneId).not.toBe(m.playerTwoId);
    });
  });

  it("should create an AI match for the last player (odd count)", () => {
    const players = createSortedPlayers(11);
    const matches = [...Matchmaker.generateMatches(players)];
    const filteredMatches = matches.filter(m => !("lastId" in m))

    expect(filteredMatches.length).toBe(6);
    const aiMatches = filteredMatches.filter(m =>{
      if (("is_ai_game" in m)) return m.is_ai_game
    });
    expect(aiMatches.length).toBe(1);
    if(("playerTwoId" in aiMatches[0]!)) expect(aiMatches[0]!.playerTwoId).toBeNull();
  });

  it("should keep elo difference within reasonable bounds on average", () => {
    const players = createSortedPlayers(200);
    const matches = [...Matchmaker.generateMatches(players)];
    const filteredMatches = matches.filter(m => !("lastId" in m))

    const normalMatches = filteredMatches.filter(m => {
      if(("is_ai_game" in m)) return !m.is_ai_game
    });
  
    let totalDiff = 0;
    normalMatches.forEach(m => {
      const p1 = players.find((p: any) => {
        if(("playerOneId" in m)) return p.id === m.playerOneId
      });
      const p2 = players.find((p: any) => {
        if(("playerTwoId" in m)) return p.id === m.playerTwoId
      });
      totalDiff += Math.abs(p1.stats.elo - p2.stats.elo);
    });

    const averageDiff = totalDiff / normalMatches.length;
    expect(averageDiff).toBeLessThan(400); 
  });

  it("performance test: should process 1,000,000 players in under 2 seconds", () => {
    const players = createSortedPlayers(1_000_000);
    
    const start = performance.now();
    const matches = [...Matchmaker.generateMatches(players)];
    const filteredMatches = matches.filter(p => !("lastId" in p))
    const end = performance.now();

    expect(filteredMatches.length).toBe(500_000);
    expect(end - start).toBeLessThan(2000);
  });

  it("should safely handle empty or single-player arrays", () => {
    expect([...Matchmaker.generateMatches([])]).toEqual([{lastId: "done"}]);
    
    const singlePlayer = createSortedPlayers(1);
    const matches = [...Matchmaker.generateMatches(singlePlayer)];
    const filteredMatches = matches.filter(p => !("lastId" in p))
    expect(filteredMatches.length).toBe(1);
    if(("is_ai_game" in matches[0]!)) expect(matches[0]!.is_ai_game).toBe(true);
  });
});