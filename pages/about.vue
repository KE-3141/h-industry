<script setup lang="ts">
const { strengths, stats, workTypes } = useSiteContent()

</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      title="平山工業の強み"
      description="創業50年超の実績が培った技術力・現場対応力・品質安全管理。平山工業が現場で大切にする3つの強みをご紹介します。"
    />

    <!-- ===== 2. 3つのこだわり（詳細） ===== -->
    <section class="py-20 md:py-28 bg-neutral-50">
      <div class="max-w-6xl mx-auto px-6">
        <div class="space-y-20 md:space-y-28">
          <div
            v-for="(strength, index) in strengths"
            :key="strength.key"
            :id="strength.key"
            class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-20"
            :class="{ 'md:[&>*:first-child]:order-last': index % 2 === 1 }"
          >
            <!-- 画像 -->
            <div
              v-reveal="index % 2 === 0 ? 'from-left' : 'from-right'"
              class="relative rounded-sm overflow-hidden aspect-[4/3]"
            >
              <img
                :src="strength.imageSrc"
                :alt="strength.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <!-- テキスト -->
            <div v-reveal="index % 2 === 0 ? 'from-right' : 'from-left'">
              <h2 class="text-2xl md:text-3xl font-black text-primary-900 mb-5 text-balance">
                {{ strength.title }}
              </h2>
              <p class="text-neutral-600 leading-relaxed mb-8">
                {{ strength.detail }}
              </p>
              <ul class="space-y-0 border-t border-neutral-200">
                <li
                  v-for="point in strength.highlights"
                  :key="point"
                  class="py-3 border-b border-neutral-200 text-sm text-neutral-700"
                >
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 3. 実績数値 ===== -->
    <section class="py-16 md:py-20 bg-primary-950 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <dl v-reveal class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <dd class="text-4xl md:text-5xl font-black text-white leading-none mb-1">
              {{ stat.value }}<span class="text-xl md:text-2xl ml-0.5">{{ stat.unit }}</span>
            </dd>
            <dt class="text-neutral-400 text-xs mt-2">{{ stat.label }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- ===== 4. 主要取引先 ===== -->
    <ClientsSection />

    <!-- ===== 5. 対応工種 ===== -->
    <section class="py-16 md:py-20 bg-neutral-50">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <SectionHeading title="対応工種・施工実績" class="mb-10" />
        <TagRows :items="workTypes" variant="neutral" />
        <div class="mt-12">
          <AppButton to="/business/" size="lg" variant="secondary">
            事業内容を見る
            <IconArrow />
          </AppButton>
        </div>
      </div>
    </section>

    <!-- ===== 6. CTA ===== -->
    <CtaSection />
  </main>
</template>
