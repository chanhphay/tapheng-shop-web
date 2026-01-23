// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirect: false
  },
  css: ['~/assets/css/fonts.css'],
  app: {
    head: {
      title: 'ຮ້ານຕາແພງ Baby - Tapheng Shop',
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' }
      ]
    }
  },
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
})
