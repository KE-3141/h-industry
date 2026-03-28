// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ['~/assets/css/app.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      meta: [
        {
          name: 'description',
          content:
            '平山工業株式会社｜鉄筋工事・溶接工事の専門企業。関東全域対応、50年超の実績。',
        },
      ],
    },
  },

  // アトミックデザイン用: サブディレクトリのプレフィックスなしでコンポーネントを参照する
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  fonts: {
    families: [
      {
        name: 'Noto Sans JP',
        provider: 'google',
        weights: [400, 700, 900],
      },
    ],
  },

  image: {
    quality: 85,
    format: ['webp', 'jpg'],
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
})
