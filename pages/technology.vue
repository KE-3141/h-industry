<script setup lang="ts">
useHead({ title: '技術紹介 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の技術紹介。杭頭補強筋の半自動溶接化をはじめ、フレア溶接・J-BAR溶接・エンクローズ溶接など多彩な工法に対応。鉄筋工事と溶接工事を自社一貫で提供します。',
})

const { weldingMethods } = useSiteContent()
const placeholderImageUrl = usePublicUrl('/images/hero_1.png')
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Technology"
      title="技術紹介"
      description="平山工業が半世紀にわたって培ってきた溶接・鉄筋技術をご紹介します。業界標準を生み出した独自技術と、多彩な工法への対応力が私たちの強みです。"
    />

    <!-- ===== 2. 独自技術：杭頭補強筋の半自動溶接化 ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <!-- 画像 -->
          <div class="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              :src="placeholderImageUrl"
              alt="杭頭補強筋の半自動溶接作業"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute top-5 left-5">
              <span class="bg-primary-900/80 text-accent-400 text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                Original Technology
              </span>
            </div>
          </div>

          <!-- テキスト -->
          <div>
            <p class="text-accent-500 text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Proprietary Innovation
            </p>
            <h2 class="text-2xl md:text-3xl font-black text-primary-900 mb-5">
              杭頭補強筋溶接の<br />半自動化を業界に先駆けて開発
            </h2>
            <p class="text-neutral-600 leading-relaxed mb-8">
              かつて溶接工専門の技術だった杭頭補強筋の溶接を、平山工業が独自技術で半自動化。現場での施工効率と品質を飛躍的に向上させ、現在では業界標準として広く普及しています。
            </p>
            <ul class="space-y-3">
              <li
                v-for="point in [
                  '溶接工でなければできなかった工程を半自動化',
                  '施工品質の均一化とスピードアップを同時に実現',
                  '現在は業界標準として全国に普及',
                  '継続的な工法改良で精度をさらに向上',
                ]"
                :key="point"
                class="flex items-start gap-3 text-sm text-neutral-700"
              >
                <span
                  class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-accent-500/10
                         flex items-center justify-center"
                >
                  <svg
                    class="w-3 h-3 text-accent-500"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 3. 対応溶接工法 ===== -->
    <section class="py-20 md:py-28 bg-neutral-50">
      <div class="max-w-6xl mx-auto px-6">
        <SectionHeading label="Welding Methods" title="対応溶接工法" class="mb-14" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FeatureCard
            v-for="method in weldingMethods"
            :key="method.key"
            :title="method.title"
            :description="method.description"
          >
            <template #icon>
              <svg
                class="w-9 h-9"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="method.iconPath" />
              </svg>
            </template>
          </FeatureCard>
        </div>
      </div>
    </section>

    <!-- ===== 4. 多能工対応 ===== -->
    <section class="py-20 md:py-28 bg-primary-950 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <!-- テキスト -->
          <div>
            <p class="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Integrated Service
            </p>
            <h2 class="text-2xl md:text-3xl font-black text-white mb-5">
              鉄筋工事と溶接工事を<br />自社で一貫提供
            </h2>
            <p class="text-neutral-300 leading-relaxed mb-8">
              鉄筋の加工・組立から継手溶接工事まで、すべてを自社の多能工が担当。外注コストの削減と工程管理の一元化により、工期短縮とコストの最適化を実現します。
            </p>
            <ul class="space-y-3">
              <li
                v-for="point in [
                  '鉄筋加工・運搬・組立・配筋を自社完結',
                  '溶接工事を同一チームが担当し工程ロスを排除',
                  '元請・施主への一括請負が可能',
                  '1級鉄筋技能士・SA-2V免許保有者が施工',
                ]"
                :key="point"
                class="flex items-start gap-3 text-sm text-neutral-300"
              >
                <span
                  class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-accent-500/20
                         flex items-center justify-center"
                >
                  <svg
                    class="w-3 h-3 text-accent-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {{ point }}
              </li>
            </ul>
          </div>

          <!-- 画像 -->
          <div class="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              :src="placeholderImageUrl"
              alt="鉄筋工事と溶接工事の一貫施工"
              class="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 5. CTA ===== -->
    <CtaSection />
  </main>
</template>
