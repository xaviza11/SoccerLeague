import Matchmaker from "../Matchmaker";

describe("eloAdjustmentCalculator", () => {
  let matchmaker: Matchmaker;

  beforeEach(() => {
    matchmaker = new Matchmaker();
  });

  it("returns 0 for both players when there is a draw and equal elo", async () => {
    const result = await matchmaker.eloAdjustmentCalculator(
      1,
      1,
      1500,
      1500
    );

    expect(result.adjustmentA).toBe(0);
    expect(result.adjustmentB).toBe(0);
  });

  it("gives positive adjustment to the lower elo winner and negative to the loser", async () => {
    const result = await matchmaker.eloAdjustmentCalculator(
      3,
      1,
      1400,
      1600
    );

    expect(result.adjustmentA).toBeGreaterThan(0);
    expect(result.adjustmentB).toBeLessThan(0);
  });

  it("gives negative adjustment to the higher elo loser and positive to the winner", async () => {
    const result = await matchmaker.eloAdjustmentCalculator(
      0,
      2,
      1700,
      1500
    );

    expect(result.adjustmentA).toBeLessThan(0);
    expect(result.adjustmentB).toBeGreaterThan(0);
  });

  it("never exceeds +1000 or -1000 for any player", async () => {
    const result = await matchmaker.eloAdjustmentCalculator(
      1000000,
      0,
      1,
      2000000
    );

    expect(result.adjustmentA).toBeLessThanOrEqual(1000);
    expect(result.adjustmentA).toBeGreaterThanOrEqual(-1000);
    expect(result.adjustmentB).toBeLessThanOrEqual(1000);
    expect(result.adjustmentB).toBeGreaterThanOrEqual(-1000);
  });

  it("is zero-sum: adjustments always cancel each other", async () => {
    const result = await matchmaker.eloAdjustmentCalculator(
      4,
      2,
      1450,
      1550
    );

    expect(result.adjustmentA + result.adjustmentB).toBeCloseTo(0);
  });

  it("a win by more goals produces a larger absolute adjustment", async () => {
    const narrowWin = await matchmaker.eloAdjustmentCalculator(
      2,
      1,
      1500,
      1500
    );

    const bigWin = await matchmaker.eloAdjustmentCalculator(
      5,
      1,
      1500,
      1500
    );

    expect(Math.abs(bigWin.adjustmentA))
      .toBeGreaterThan(Math.abs(narrowWin.adjustmentA));
  });

  it("an upset produces a larger adjustment than an expected result", async () => {
    const expectedWin = await matchmaker.eloAdjustmentCalculator(
      2,
      0,
      1700,
      1400
    );

    const upsetWin = await matchmaker.eloAdjustmentCalculator(
      2,
      0,
      1400,
      1700
    );

    expect(Math.abs(upsetWin.adjustmentA))
      .toBeGreaterThan(Math.abs(expectedWin.adjustmentA));
  });
});
