import Matchmaker from "../Matchmaker";

describe("defineRange", () => {
  it("returns correct ranges based on array length", () => {
    expect(Matchmaker.defineRange(99)).toBe(1000);
    expect(Matchmaker.defineRange(9_999)).toBe(500);
    expect(Matchmaker.defineRange(90_000)).toBe(250);
    expect(Matchmaker.defineRange(900_000)).toBe(125);
  });
});
