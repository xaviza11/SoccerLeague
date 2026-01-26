import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
//@ts-expect-error
import MiniPlayerCard from "../../app/components/cards/MiniPlayerCard.vue";

vi.mock("@/helpers/gameData", () => ({
  calculatePlayerAverage: vi.fn(() => 80),
}));

const IconStub = { template: "<span />" };

describe("MiniCard.vue", () => {
  let player: any;
  let wrapper: any;

  beforeEach(() => {
    player = {
      name: "John Doe",
      position: "ST",
      country: "Spain",
      skills: {
        pace: 80,
        shooting: 75,
      },
    };

    wrapper = mount(MiniPlayerCard, {
      props: {
        player,
        totalCountryBonus: 5,
      },
      global: {
        stubs: { Icon: IconStub },
      },
    });
  });

  it("renders player averageWithBonus", () => {
    expect(wrapper.text()).toContain("85");
  });

  it("emits 'select' event when clicked", async () => {
    await wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("select");
    expect(wrapper.emitted("select")?.[0]).toEqual([player]);
  });

  it("applies correct gradient and border based on averageWithBonus", () => {
    // averageWithBonus = 85 => gold gradient, default border
    expect(wrapper.vm.cardGradient).toBe("var(--gold-gradient)");
    expect(wrapper.vm.cardBorder).toBe("2px solid var(--border)");
  });
});
