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
    "@nuxtjs/i18n",
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
    customRoutes: 'config',
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
    },
  },

  routeRules: {
    "/es/inicio": { swr: 3600 * 8 },
    "/en/home": { swr: 3600 * 8 },
    "/ca/inici": { swr: 3600 * 8 },

    "/es/sobre-nosotros": { prerender: true },
    "/en/about-us": { prerender: true },
    "/ca/sobre-nosaltres": { prerender: true },

    /*  
    // static page
    "/about": { prerender: true },
    // ISR
    "/blog/**": { isr: true },
    // SPA
    "/admin/**": { ssr: false },
    // SSR whit cache 1h
    '/products/**': { swr: 3600 },
    // SSR 
    '/contact': { ssr: true },
    // no index
    '/no-index': { index: false }*/
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
