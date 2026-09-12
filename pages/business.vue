<script setup lang="ts">
useHead({ title: '事業内容 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の事業内容。躯体構築工事一式・土木工事全般に対応。鉄筋・型枠・足場など一式対応からスポット工事までご相談ください。',
})

const { businesses } = useSiteContent()
const placeholderImageUrl = usePublicUrl('/images/hero_1.png')
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Business"
      title="事業内容"
      description="躯体構築工事一式と土木工事全般。一式でのご依頼はもちろん、必要な工種だけのスポット対応も可能です。"
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
              <!-- 含まれる工種（躯体構築工事） -->
              <div v-if="biz.services.length" class="mt-6 space-y-3">
                <p class="text-xs font-medium text-neutral-500 tracking-wide">含まれる工種</p>
                <!-- 主要工種 -->
                <div class="flex flex-wrap gap-2">
                  <TagBadge
                    v-for="service in biz.services.filter(s => s.primary)"
                    :key="service.name"
                    variant="primary"
                  >
                    {{ service.name }}
                  </TagBadge>
                </div>
                <!-- その他工種 -->
                <div
                  v-if="biz.services.some(s => !s.primary)"
                  class="flex items-baseline gap-2"
                >
                  <span class="text-xs text-neutral-400 shrink-0">その他</span>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="service in biz.services.filter(s => !s.primary)"
                      :key="service.name"
                      class="text-xs text-neutral-500 border border-neutral-200 rounded-sm px-2 py-0.5"
                    >
                      {{ service.name }}
                    </span>
                  </div>
                </div>
              </div>
              <!-- 施工実績リンク -->
              <SlideLink
                to="/achievements/"
                class="inline-flex items-center mt-8 text-primary-600 font-semibold text-sm hover:text-primary-800 transition-colors"
              >
                施工実績を見る
              </SlideLink>
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
