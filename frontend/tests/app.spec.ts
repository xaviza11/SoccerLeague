import { mountSuspended } from "@nuxt/test-utils/runtime"
import { it, expect, describe } from "vitest";
//@ts-ignore
import App from "../app/app.vue";

describe("App", () => {
  it("config is correct", () => {
    expect(true).equals(true);
  });

  it('can mount the component', async () => {
    const component = await mountSuspended(App)
    expect(component.html()).toContain('<h1')
  })
});
