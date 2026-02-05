import Matchmaker from "../Matchmaker";

describe("swapPop", () => {
  it("removes the element at the given position by swapping with last index", () => {
    const arr = [0, 1, 2, 3];
    Matchmaker.swapPop(arr, 1);
    expect(arr.length).toBe(3);
    expect(arr[1]).toBe(3);
  });

  it("works when removing the last element", () => {
    const arr = [0, 1, 2];
    Matchmaker.swapPop(arr, 2);
    expect(arr).toEqual([0, 1]);
  });

  it("works when removing the first element", () => {
    const arr = [0, 1, 2];
    Matchmaker.swapPop(arr, 0);
    expect(arr.length).toBe(2);
    expect(arr[0]).toBe(2);
  });
});
