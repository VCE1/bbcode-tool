import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false,
    },
  },
  css: ["~/assets/css/main.css"],

  modules: ["@nuxtjs/i18n"],

  i18n: {
    strategy: "prefix",
    lazy: true,
    vueI18n: "./i18n.config.ts",
    langDir: "locales/",
    locales: [
      {
        code: "en",
        language: "en-US",
        file: "en.json",
      },
      {
        code: "zh-CN",
        language: "zh-CN",
        file: "zh-CN.json",
      },
      {
        code: "zh-TW",
        language: "zh-TW",
        file: "zh-TW.json",
      },
    ],
    defaultLocale: "en",
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
});
