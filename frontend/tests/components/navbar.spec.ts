import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
// @ts-ignore
import {DefaultNavbar} from '../../app/components/navbars'

describe('Navbar', () => {
  it('renders navbar and toggles dropdown menu', async () => {
    const wrapper = await mountSuspended(DefaultNavbar, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>',
          },
          Icon: {
            template: '<span />',
          },
        },
        plugins: [
          {
            install(app: any) {
              // mock i18n
              app.config.globalProperties.$t = (key: string) => key
              app.provide('t', (key: string) => key)
              app.provide('localePath', (name: string) => `/${name}`)
            },
          },
        ],
      },
    })

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.text()).toContain('pageName')
    const menuButton = wrapper.find('[class*="menuWrapper"]')
    expect(menuButton.exists()).toBe(true)
    expect(wrapper.find('[class*="dropdownMenu"]').exists()).toBe(false)
    await menuButton.trigger('click')
    expect(wrapper.find('[class*="dropdownMenu"]').exists()).toBe(true)
  })
})
