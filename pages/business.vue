<script setup lang="ts">
useHead({ title: '事業紹介 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の事業紹介。鉄筋工事・溶接工事を関東全域で一貫提供。杭頭補強筋の半自動溶接化など独自技術と豊富な施工実績をご紹介します。',
})

const { businesses, workTypes, weldingMethods } = useSiteContent()
const placeholderImageUrl = usePublicUrl('/images/hero_1.png')
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Business"
      title="事業紹介"
      description="鉄筋工事・溶接工事を自社一貫で提供。創業50年超の実績と独自技術で、関東全域の建設現場を支えます。"
    />

    <!-- ===== 2. 事業内容（交互レイアウト） ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="space-y-24 md:space-y-32">
          <div
            v-for="(biz, index) in businesses"
            :key="biz.key"
            class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
            :class="{ 'md:[&>*:first-child]:order-last': index % 2 === 1 }"
          >
            <!-- 画像 -->
            <div class="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                :src="placeholderImageUrl"
                :alt="biz.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <!-- ラベル -->
              <div class="absolute top-5 left-5">
                <span class="bg-primary-900/80 text-accent-400 text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {{ biz.label }}
                </span>
              </div>
            </div>

            <!-- テキスト -->
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-primary-900 mb-5">
                {{ biz.title }}
              </h2>
              <p class="text-neutral-600 leading-relaxed mb-8">
                {{ biz.description }}
              </p>
              <ul class="space-y-3">
                <li
                  v-for="point in biz.highlights"
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
              <!-- 対応工種タグ（鉄筋工事） -->
              <div v-if="biz.key === 'rebar'" class="mt-6 flex flex-wrap gap-2">
                <TagBadge v-for="work in workTypes" :key="work" variant="neutral">
                  {{ work }}
                </TagBadge>
              </div>
              <!-- 対応溶接工法タグ（溶接工事） -->
              <div v-if="biz.key === 'welding'" class="mt-6 flex flex-wrap gap-2">
                <TagBadge v-for="method in weldingMethods" :key="method.key" variant="primary">
                  {{ method.title }}
                </TagBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 4. 主要取引先 ===== -->
    <ClientsSection />

    <!-- ===== 5. CTA ===== -->
    <CtaSection />
  </main>
</template>
