// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      siteUrl: 'https://h-industry.co.jp',
    },
  },

  css: ['~/assets/css/app.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      link: [
        // ファビコン（SVGはモダンブラウザ対応、ico/pngは別途 public/ に配置が必要）
        { rel: 'icon', type: 'image/svg+xml', href: '/images/simple_logo.svg' },
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        {
          name: 'description',
          content: '平山工業株式会社｜鉄筋工事・溶接工事の専門企業。関東全域対応、50年超の実績。',
        },
        // モバイルブラウザのUI色（primary-950）
        { name: 'theme-color', content: '#070f1e' },
        // OGP デフォルト
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ja_JP' },
        { property: 'og:site_name', content: '平山工業株式会社' },
        // OGP シェア画像（public/og-image.png を 1200×630px で別途用意）
        { property: 'og:image', content: 'https://h-industry.co.jp/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
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
    '@nuxtjs/sitemap',
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

  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
})
