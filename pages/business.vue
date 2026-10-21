<script setup lang="ts">
useHead({ title: '事業内容 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の事業内容。躯体構築工事一式に対応。鉄筋・型枠・足場など一式対応からスポット工事までご相談ください。',
})

const { businesses } = useSiteContent()
const placeholderImageUrl = usePublicUrl('/images/hero_1.JPG')

type Service = { name: string; primary: boolean }
const primaryServices = (services: Service[]) => services.filter(s => s.primary)
const otherServices = (services: Service[]) => services.filter(s => !s.primary)
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      title="事業内容"
      description="躯体構築工事を一式で。一式でのご依頼はもちろん、必要な工種だけのスポット対応も可能です。"
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
            <div
              v-reveal="index % 2 === 0 ? 'from-left' : 'from-right'"
              class="relative rounded-sm overflow-hidden aspect-[4/3]"
            >
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
            <div v-reveal="index % 2 === 0 ? 'from-right' : 'from-left'">
              <h2 class="text-2xl md:text-3xl font-black text-primary-900 mb-5 text-balance">
                {{ biz.title }}
              </h2>
              <p class="text-neutral-600 leading-relaxed mb-8">
                {{ biz.description }}
              </p>
              <!-- 含まれる工種 -->
              <div v-if="biz.services.length" class="mt-6">
                <div class="flex flex-wrap gap-3">
                  <TagBadge
                    v-for="service in primaryServices(biz.services)"
                    :key="service.name"
                  >
                    {{ service.name }}
                  </TagBadge>
                </div>
                <p v-if="otherServices(biz.services).length" class="mt-3 text-xs text-neutral-400 leading-relaxed">
                  その他：{{ otherServices(biz.services).map(s => s.name).join('・') }}
                </p>
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
