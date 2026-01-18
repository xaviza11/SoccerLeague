import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
//@ts-expect-error
import Register from "../../app/pages/register.vue";

describe("Register Page", () => {
  it("renders and displays main content", async () => {
    const wrapper = await mountSuspended(Register);

    expect(wrapper).toBeTruthy();
    expect(wrapper.text()).toContain("pageName");
    expect(wrapper.text()).toContain("pages.register.email");
    expect(wrapper.text()).toContain("pages.register.password");
    expect(wrapper.text()).toContain("pages.register.repeatPassword");
    expect(wrapper.text()).toContain("pages.register.register");
    expect(wrapper.text()).toContain("pages.register.goLogin");
    expect(wrapper.text()).toContain("pages.register.goHome");

    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

   it("test if should send the form", async () => {
    const wrapper = await mountSuspended(Register);

    const nameInput = wrapper.find('input[type="name"]')
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInputs = wrapper.findAll('input[type="password"]');

    await nameInput.setValue("username")
    await emailInput.setValue("testexamplecom");
    await passwordInputs[0].setValue("password123");
    await passwordInputs[1].setValue("password123");

    const form = wrapper.find('form');
    await form.trigger('submit');

    await flushPromises();
    await nextTick();

    expect(wrapper.text()).not.toContain("error");
  });
});
