import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";
//@ts-expect-error
import Login from "../../app/pages/login.vue";

describe("Login Page", () => {
  it("renders and displays main content", async () => {
    const wrapper = await mountSuspended(Login, {
      global: {
        plugins: [
          {
            install(app: any) {
              app.config.globalProperties.$t = (key: string) => key;
              app.provide("t", (key: string) => key);
              app.provide("setLocale", () => {});
              app.provide("localePath", (name: string) => `/${name}`);
            },
          },
        ],
      },
    });

    expect(wrapper).toBeTruthy();
    expect(wrapper.text()).toContain("pageName");
    expect(wrapper.text()).toContain("pages.login.email");
    expect(wrapper.text()).toContain("pages.login.password");
    expect(wrapper.text()).toContain("pages.login.login");
    expect(wrapper.text()).toContain("pages.login.goRegister");
    expect(wrapper.text()).toContain("pages.login.goHome");

    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });
});
