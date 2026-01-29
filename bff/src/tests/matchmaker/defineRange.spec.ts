import { describe, it, expect } from "vitest";
import Matchmaker from "../../modules/common/utils/Matchmaker.js"

describe("defineRange", () => {
  it("returns correct ranges based on array length", () => {
    expect(Matchmaker.defineRange(50)).toBe(1000);
    expect(Matchmaker.defineRange(500)).toBe(100);
    expect(Matchmaker.defineRange(50_000)).toBe(10);
  });

  it("returns undefined for very large arrays", () => {
    expect(Matchmaker.defineRange(2_000_000)).toBeUndefined();
  });
});
