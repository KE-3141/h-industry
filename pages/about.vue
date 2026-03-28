<script setup lang="ts">
const { strengths, stats, clients, workTypes } = useSiteContent()
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Our Strengths"
      title="平山工業の強み"
      description="創業50年超の実績が培った技術力・現場対応力・品質安全管理。平山工業が現場で大切にする3つの強みをご紹介します。"
    />

    <!-- ===== 2. 3つのこだわり（詳細） ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="space-y-20 md:space-y-28">
          <div
            v-for="(strength, index) in strengths"
            :key="strength.key"
            :id="strength.key"
            class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center scroll-mt-20"
            :class="{ 'md:[&>*:first-child]:order-last': index % 2 === 1 }"
          >
            <!-- アイコン＋番号パネル -->
            <div
              class="relative bg-primary-950 rounded-sm overflow-hidden
                     flex flex-col items-center justify-center py-16 px-8 text-center"
            >
              <!-- 背景装飾 -->
              <div
                class="absolute inset-0 opacity-[0.06] pointer-events-none"
                style="background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px); background-size: 48px 48px;"
              />
              <div
                class="absolute top-0 left-0 w-1 h-full bg-accent-500"
              />
              <div class="relative">
                <p class="text-accent-500 text-6xl font-black leading-none mb-6 select-none">
                  0{{ index + 1 }}
                </p>
                <div
                  class="w-14 h-14 rounded-full bg-accent-500/15 flex items-center justify-center
                         mx-auto mb-4"
                >
                  <svg
                    class="w-7 h-7 text-accent-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" :d="strength.iconPath" />
                  </svg>
                </div>
                <h2 class="text-white text-xl font-black">{{ strength.title }}</h2>
              </div>
            </div>

            <!-- テキスト -->
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-primary-900 mb-5">
                {{ strength.title }}
              </h2>
              <p class="text-neutral-600 leading-relaxed mb-8">
                {{ strength.detail }}
              </p>
              <ul class="space-y-3">
                <li
                  v-for="point in strength.highlights"
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
      </div>
    </section>

    <!-- ===== 3. 実績数値 ===== -->
    <section class="py-16 md:py-20 bg-primary-950 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <p class="text-center text-accent-400 text-xs font-medium tracking-[0.2em] uppercase mb-10">
          Numbers
        </p>
        <dl class="grid grid-cols-2 md:grid-cols-4 gap-8">
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
    <section class="py-16 md:py-20 bg-neutral-50">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <SectionHeading label="Clients" title="主要取引先" class="mb-10" />
        <ul class="flex flex-wrap justify-center gap-3">
          <li
            v-for="client in clients"
            :key="client"
            class="bg-white border border-neutral-200 rounded-sm px-5 py-3
                   text-sm text-neutral-700 font-medium
                   shadow-[0_1px_3px_0_rgb(0_0_0_/0.05)]"
          >
            {{ client }}
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== 5. 対応工種 ===== -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <SectionHeading label="Work Types" title="対応工種・施工実績" class="mb-10" />
        <div class="flex flex-wrap justify-center gap-3">
          <span
            v-for="work in workTypes"
            :key="work"
            class="bg-primary-50 border border-primary-100 rounded-sm px-4 py-2
                   text-sm text-primary-700 font-medium"
          >
            {{ work }}
          </span>
        </div>
        <div class="mt-12">
          <AppButton to="/business/" size="lg" variant="secondary">
            事業紹介を見る
            <IconArrow />
          </AppButton>
        </div>
      </div>
    </section>

    <!-- ===== 6. CTA ===== -->
    <CtaSection />
  </main>
</template>
