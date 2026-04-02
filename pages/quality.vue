<script setup lang="ts">
useHead({ title: '品質と安全 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の品質・安全への取り組み。職長による配筋自主検査、作業前のヒヤリハット確認、全現場事故0の目標など、品質と安全を一体的に追求しています。',
})

const { qualityItems, safetyItems } = useSiteContent()
const placeholderImageUrl = usePublicUrl('/images/hero_1.png')
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Quality & Safety"
      title="品質と安全"
      description="鉄筋工事の品質は、構造物の安全性・耐久性に直接影響します。平山工業は品質管理と安全管理を切り離さず、一体的に追求しています。"
    />

    <!-- ===== 2. 全現場事故0 コミットメント ===== -->
    <section class="py-16 md:py-20 bg-primary-950 text-white">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <p class="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase mb-6">
          Our Commitment
        </p>
        <p class="text-5xl md:text-7xl font-black text-white leading-none mb-6">
          全現場<span class="text-accent-400">事故0</span>
        </p>
        <p class="text-neutral-300 text-lg leading-relaxed max-w-2xl mx-auto">
          これは掛け声ではなく、平山工業が経営目標として掲げる数値です。<br class="hidden md:block" />
          品質と安全を妥協なく追求する姿勢が、取引先からの信頼につながっています。
        </p>
      </div>
    </section>

    <!-- ===== 3. 品質管理 ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-20">
          <!-- 画像 -->
          <div class="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              :src="placeholderImageUrl"
              alt="配筋自主検査の様子"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <!-- テキスト -->
          <div>
            <SectionHeading label="Quality" title="品質管理" align="left" class="mb-6" />
            <p class="text-neutral-600 leading-relaxed">
              鉄筋工事の品質は、建物・構造物の耐久性と安全性に直結します。設計図への忠実な施工と、職長による工程ごとの自主検査を組み合わせることで、一切の妥協なく品質を担保します。
            </p>
          </div>
        </div>

        <!-- 品質管理の取り組み FeatureCard -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard
            v-for="item in qualityItems"
            :key="item.key"
            :title="item.title"
            :description="item.description"
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
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.iconPath" />
              </svg>
            </template>
          </FeatureCard>
        </div>
      </div>
    </section>

    <!-- ===== 4. 安全管理 ===== -->
    <section class="py-20 md:py-28 bg-neutral-50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-20">
          <!-- テキスト -->
          <div>
            <SectionHeading label="Safety" title="安全管理" align="left" class="mb-6" />
            <p class="text-neutral-600 leading-relaxed">
              現場の安全は、毎日の小さな行動の積み重ねから生まれます。作業前のKY活動から現場ルールの共有・即時報告の義務化まで、組織全体で安全文化を育てています。
            </p>
          </div>
          <!-- 画像 -->
          <div class="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img
              :src="placeholderImageUrl"
              alt="安全管理の取り組み"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- 安全管理の取り組み FeatureCard -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard
            v-for="item in safetyItems"
            :key="item.key"
            :title="item.title"
            :description="item.description"
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
                <path stroke-linecap="round" stroke-linejoin="round" :d="item.iconPath" />
              </svg>
            </template>
          </FeatureCard>
        </div>
      </div>
    </section>

    <!-- ===== 5. CTA ===== -->
    <CtaSection />
  </main>
</template>
