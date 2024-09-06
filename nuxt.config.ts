// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  pages: true,

  // ssr: true,

  modules: ["@nuxtjs/tailwindcss", "nuxt-lodash"],

  css: ["~/assets/css/global.css", "~/assets/css/tailwind.css"],

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectURL: process.env.SPOTIFY_REDIRECT_URI,
    },
  },

  devServer: {
    port: 3000,
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
    },
  },
});
