import { mountSuspended } from "@nuxt/test-utils/runtime"
import { describe, it, expect, vi } from "vitest"
//@ts-ignore
import Register from "../../app/pages/register.vue"

describe("Register Page", () => {
  it("renders and displays main content", async () => {
    const wrapper = await mountSuspended(Register, {
      global: {
        plugins: [
          {
            install(app: any) {
              app.config.globalProperties.$t = (key: string) => key
              app.provide("t", (key: string) => key)
              app.provide("setLocale", (locale: string) => {})
              app.provide("localePath", (name: string) => `/${name}`)
            },
          },
        ],
      },
    })

    expect(wrapper).toBeTruthy()
    expect(wrapper.text()).toContain("pageName")
    expect(wrapper.text()).toContain("pages.register.email")
    expect(wrapper.text()).toContain("pages.register.password")
    expect(wrapper.text()).toContain("pages.register.repeatPassword")
    expect(wrapper.text()).toContain("pages.register.register")
    expect(wrapper.text()).toContain("pages.register.goLogin")
    expect(wrapper.text()).toContain("pages.register.goHome")

    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })
})
