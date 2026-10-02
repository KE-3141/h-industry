// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
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
            '平山工業株式会社｜躯体構築一式工事・土木工事の専門企業。関東全域対応、50年超の実績。',
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
        name: 'BIZ UDPGothic',
        provider: 'google',
        weights: [400, 700],
      },
      {
        name: 'Shippori Mincho',
        provider: 'google',
        weights: [400, 700, 800],
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

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})
