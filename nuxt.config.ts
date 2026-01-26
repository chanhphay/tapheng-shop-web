// // https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2025-07-15',
//   devtools: { enabled: true },
//   modules: ['@nuxtjs/supabase'],
//   supabase: {
//     redirect: false
//   },
//   css: ['~/assets/css/fonts.css'],
//   app: {
//     head: {
//       title: 'ຮ້ານຕາແພງ Baby - Tapheng Shop',
//       link: [
//         { rel: 'icon', type: 'image/png', href: '/images/logo.png' }
//       ]
//     }
//   },
//   runtimeConfig: {
//     public: {
//       supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
//       supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
//     }
//   },
//   nitro: {
//     preset: 'cloudflare-pages',
//     // prerender: {
//     //   crawlLinks: true,
//     //   routes: ['/']
//     // }
//   }
// })

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
  // หมายเหตุ: Nuxt Supabase จะดึงค่า NUXT_PUBLIC_SUPABASE_URL/KEY ให้อัตโนมัติ 
  // แต่การเขียนซ้ำใน runtimeConfig แบบที่คุณทำก็ไม่ผิดครับ (Correct)
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    }
  },
  nitro: {
    preset: 'cloudflare-pages',
  }
})
