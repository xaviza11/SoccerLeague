import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js"

describe("randomGaussian", () => {
  it("returns numbers centered around the mean", () => {
    const mean = 1000;
    const stdDev = 100;
    const samples = Array.from({ length: 10_000 }, () =>
      Matchmaker.randomGaussian(mean, stdDev),
    );

    const avg =
      samples.reduce((sum, v) => sum + v, 0) / samples.length;

    expect(avg).toBeGreaterThan(mean - 10);
    expect(avg).toBeLessThan(mean + 10);
  });
});
