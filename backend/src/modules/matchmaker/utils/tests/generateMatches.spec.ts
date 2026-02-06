import Matchmaker from "../Matchmaker";

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

    
    matches.forEach(m => {
      if(("playerOneId" in m)) expect(m.playerOneId).toBeDefined(); 
      if(("playerTwoId") in m) expect(m.playerTwoId).toBeDefined();
      if(("isAiGame") in m) expect(m.isAiGame).toBe(false);
      if(("playerOneId" in m) && ("playerTwoId") in m) expect(m.playerOneId).not.toBe(m.playerTwoId);
    });
  });

  it("should create an AI match for the last player (odd count)", () => {
    const players = createSortedPlayers(11);
    const matches = [...Matchmaker.generateMatches(players)];

    expect(matches.length).toBe(6);
    const aiMatches = matches.filter(m =>{
      if (("isAiGame" in m)) return m.isAiGame
    });
    expect(aiMatches.length).toBe(1);
    if(("playerTwoId" in aiMatches[0]!)) expect(aiMatches[0]!.playerTwoId).toBeNull();
  });

  it("should keep elo difference within reasonable bounds on average", () => {
    const players = createSortedPlayers(200);
    const matches = [...Matchmaker.generateMatches(players)];
    const filteredMatches = matches.filter(m => !("lastId" in m))

    const normalMatches = filteredMatches.filter(m => {
      if(("isAiGame" in m)) return !m.isAiGame
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

  it("performance test: should process 100,000 players in under 1 seconds", () => {
    const players = createSortedPlayers(100_000);
    
    const start = performance.now();
    const matches = [...Matchmaker.generateMatches(players)];
    
    const end = performance.now();

    expect(matches.length).toBe(50_000);
    expect(end - start).toBeLessThan(1000);
  });

  it("should safely handle empty or single-player arrays", () => {
    expect([...Matchmaker.generateMatches([])]).toEqual([]);
    
    const singlePlayer = createSortedPlayers(1);
    const matches = [...Matchmaker.generateMatches(singlePlayer)];
    
    expect(matches.length).toBe(1);
    if(("isAiGame" in matches[0]!)) expect(matches[0]!.isAiGame).toBe(true);
  });
});