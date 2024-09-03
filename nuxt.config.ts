// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  pages: true,

  ssr: true,

  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/css/global.css", "~/assets/css/tailwind.css"],

  runtimeConfig: {
    public: {},
  },

  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/images/favicon.svg",
        },
      ],
      script: [],
    },
  },
});
