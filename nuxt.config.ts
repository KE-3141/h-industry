// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      siteUrl: 'https://www.hirayama-industry.jp',
    },
  },

  // @nuxtjs/sitemap（nuxt-site-config）用
  site: {
    url: 'https://www.hirayama-industry.jp',
    name: '平山工業株式会社',
    trailingSlash: true,
  },

  css: ['~/assets/css/app.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/images/simple_logo.svg' },
      ],
      meta: [
        {
          name: 'description',
          content:
            '平山工業株式会社｜躯体構築一式工事の専門集団。関東全域対応、50年超の実績。',
        },
        // モバイルブラウザのUI色（primary-950）
        { name: 'theme-color', content: '#070f1e' },
        // OGP デフォルト
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'ja_JP' },
        { property: 'og:site_name', content: '平山工業株式会社' },
        { name: 'twitter:card', content: 'summary' },
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
      // Amplify では preset が aws-amplify になり、リンクをたどる設定が切れるので明示する
      crawlLinks: true,
    },
  },
})
