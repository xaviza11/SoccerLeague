export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@nuxt/hints",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@pinia/nuxt",
    "nuxt-security",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxt/test-utils/module",
    "@nuxtjs/i18n",
    "pinia-plugin-persistedstate",
  ],

  site: {
    url: process.env.CLIENT_URL,
    name: "SoccerLeague Fantasy",
  },

  sitemap: {
    zeroRuntime: true,
    includeAppSources: true,
  },

  css: ["./app/assets/styles/global.css"],

  robots: {
    allow: [],
    disallow: [],
    sitemap: "/sitemap.xml",
  },

  runtimeConfig: {
    public: {
      CLIENT_URL: process.env.CLIENT_URL,
      API_BFF: process.env.API_BFF,
    },
  },

  i18n: {
    langDir: "locales",
    strategy: "prefix",
    defaultLocale: "es",
    customRoutes: "config",
    locales: [
      { code: "es", iso: "es-ES", file: "es.json", dir: "ltr" },
      { code: "en", iso: "en-US", file: "en.json", dir: "ltr" },
      { code: "ca", iso: "ca-ES", file: "ca.json", dir: "ltr" },
    ],
    pages: {
      index: {
        es: "/inicio",
        en: "/home",
        ca: "/inici",
      },
      about: {
        es: "/sobre-nosotros",
        en: "/about-us",
        ca: "/sobre-nosaltres",
      },
      login: {
        es: "/iniciar-sesion",
        en: "/login",
        ca: "/iniciar-sessio",
      },
      register: {
        es: "/registro",
        en: "/register",
        ca: "/registre",
      },
    },
  },

  routeRules: {
    "/es/inicio": { ssr: true },
    "/en/home": { ssr: true },
    "/ca/inici": { ssr: true },

    "/es/sobre-nosotros": { prerender: true },
    "/en/about-us": { prerender: true },
    "/ca/sobre-nosaltres": { prerender: true },

    "es/iniciar-sesion": { prerender: true },
    "/en/login": { prerender: true },
    "/ca/iniciar-sessio": { prerender: true },

    "/es/registro": { prerender: true },
    "/en/register": { prerender: true },
    "/ca/registre": { prerender: true },

    /*
    // static page
    "/about": { prerender: true }, ==> ssg
    // ISR
    "/blog/**": { isr: true }, ==> ISR
    // SPA
    "/admin/**": { ssr: false }, ==> SPA
    // SSR whit cache 1h
    '/products/**': { swr: 3600 }, ==> SWR
    // SSR 
    '/contact': { ssr: true }, ==> SSR
    // no index
    '/no-index': { index: false } ==> no index*/
  },

  fonts: {
    families: [
      { name: "Pacifico", provider: "google" },
      { name: "Kanit", provider: "google", weights: [600, 800] },
      { name: "Inter", provider: "google", weights: [400, 500] },
    ],
  },

  security: {
    nonce: true,
    headers: {
      contentSecurityPolicy: {
        "style-src": ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        "font-src": ["'self'", "https:", "data:", "fonts.gstatic.com"],
        "img-src": ["'self'", "data:", "https:"],
        "script-src": ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'"],
        "base-uri": ["'self'"],
      },
      crossOriginResourcePolicy: "cross-origin",
    },
  },
});
