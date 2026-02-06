import Matchmaker from "../Matchmaker";

describe("sanitizeArr", () => {
  it("returns an AI match when players length is odd", () => {
    const players = [
      { id: "1", has_game: false, stats: { elo: 1 } },
    ];

    const indexArr = [0, 1, 2];

    const result = Matchmaker.sanitizeArr(players, indexArr);

    expect(result!.isAiGame).toBe(true);

    expect(players[0]?.has_game).toBe(true);
    expect(indexArr).not.toContain(0);
  });

  it("returns undefined when players length is even", () => {
    const players = [
      { id: "1", has_game: false, stats: { elo: 1 } },
      { id: "2", has_game: false, stats: { elo: 1 } },
    ];

    const indexArr = [0, 1];

    const result = Matchmaker.sanitizeArr(players, indexArr);

    expect(result).toBeUndefined();
  });
});
