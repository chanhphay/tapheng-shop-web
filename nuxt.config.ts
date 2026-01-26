// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-24',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirect: false,
    // เพิ่มส่วนนี้เพื่อให้โมดูลใช้ค่าจากตัวแปรที่เราตั้งใน Cloudflare โดยตรง
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY
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
  }
})
