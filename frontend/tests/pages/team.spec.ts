import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";
// @ts-expect-error
import Team from "../../app/pages/team.vue";

describe("Team page", () => {
  it("renders without crashing", async () => {
    const wrapper = await mountSuspended(Team);

    expect(wrapper.exists()).toBe(true);
  });

  it("renders some content", async () => {
    const wrapper = await mountSuspended(Team);
    expect(wrapper.text().length).toBeGreaterThan(0);
  });
});
