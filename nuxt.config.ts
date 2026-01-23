// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirect: false
  },
  css: ['~/assets/css/fonts.css'],
  nitro: {
    preset: 'netlify'
  }
})