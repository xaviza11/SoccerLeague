import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
//@ts-expect-error
import PlayerCard from "../../app/components/cards/PlayerCard.vue";
import { flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";

const t = (key: string) => key;

vi.mock("@/helpers/gameData", () => ({
  calculatePlayerAverage: vi.fn(() => 80),
}));

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe("PlayerCard.vue", () => {
  let player: any;
  let wrapper: any;

  beforeEach(() => {
    player = {
      name: "John Doe",
      position: "ST",
      country: "Spain",
      status: { age: 24 },
      skills: {
        pace: 80,
        shooting: 75,
        passing: 70,
        dribbling: 78,
        defending: 40,
        physical: 72,
      },
    };

    wrapper = mount(PlayerCard, {
      props: {
        player,
        totalCountryBonus: 5,
      },
      global: {
        mocks: { t },
      },
    });
  });

  it("renders player name and position info", () => {
    expect(wrapper.text()).toContain("John Doe");
    expect(wrapper.text()).toContain("ST");
    expect(wrapper.text()).toContain("Spain");
    expect(wrapper.text()).toContain("components.cards.age");
    expect(wrapper.text()).toContain("components.cards.average");
  });

  it("computes averageWithBonus correctly", () => {
    const averageText = wrapper
      .findAll("p")
      .some((p: any) => p.text().includes("85"));
    expect(averageText).toBe(true);
  });
});
