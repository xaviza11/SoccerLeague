// tests/pages/login.spec.ts
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { flushPromises } from "@vue/test-utils";
//@ts-expect-error
import Login from "../../app/pages/login.vue";

describe("Login Page", () => {
  it("renders and displays main content", async () => {
    const wrapper = await mountSuspended(Login);

    expect(wrapper.exists()).toBe(true);

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

  it("test if should send the form", async () => {
    const wrapper = await mountSuspended(Login);

    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    await emailInput.setValue("testexamplecom");
    await passwordInput.setValue("password123");

    const form = wrapper.find("form");
    await form.trigger("submit");

    await flushPromises();
    await nextTick();

    expect(wrapper.text()).not.toContain("error");
  });
});
