// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "@nuxt/icon",
    "@pinia/nuxt",
  ],
  shadcn: {
    /**
     * Prefix for all the imported co mponent
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  components: [
    {
      path: "~/components",
      extensions: [".vue"],
      prefix: "",
    },
    {
      path: "~/components/shared",
      extensions: [".vue"],
      prefix: "",
    },
  ],
  supabase: {
    redirectOptions: {
      login: "/auth",
      callback: "/confirm",
      exclude: ["/"],
    },
  },
  runtimeConfig: {
    geminiKey: "",
    replicateKey: "",
    stripeSecret: "",
    stripeWebhookSecret: "",
    appUrl: "",
    public: {
      publicStripeKey: "",
    },
  },
});
