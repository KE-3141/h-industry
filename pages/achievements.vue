<script setup lang="ts">
useHead({ title: '施工実績 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の施工実績。マンション・商業施設・高速道路・高架橋・トンネル・浄水場・耐震補強工事など、関東全域での豊富な鉄筋工事・溶接工事の実績をご覧ください。',
})

const { projects, stats } = useSiteContent()
const placeholderImageUrl = usePublicUrl('/images/hero_1.png')
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Achievements"
      title="施工実績"
      description="創業50年超にわたり、マンション・インフラ・公共施設・耐震補強工事など関東全域で多様な現場を手がけてきました。"
    />

    <!-- ===== 2. 実績数値 ===== -->
    <section class="py-12 md:py-16 bg-primary-950 text-white">
      <div class="max-w-6xl mx-auto px-6">
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

    <!-- ===== 3. 施工実績グリッド ===== -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <SectionHeading label="Projects" title="施工実績一覧" class="mb-10" />
        <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          <li
            v-for="project in projects"
            :key="project.key"
            class="group"
          >
            <!-- 写真 -->
            <div class="relative overflow-hidden rounded-xl aspect-[4/3] mb-3 bg-neutral-100">
              <img
                :src="placeholderImageUrl"
                :alt="project.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <!-- カテゴリバッジ -->
              <div class="absolute top-2.5 left-2.5">
                <span class="bg-primary-900/80 text-white text-[10px] font-medium px-2 py-1 rounded-full leading-none">
                  {{ project.category }}
                </span>
              </div>
            </div>
            <!-- テキスト -->
            <p class="text-sm font-bold text-primary-900 leading-snug mb-1">
              {{ project.name }}
            </p>
            <p class="text-xs text-neutral-400">{{ project.period }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== 4. CTA ===== -->
    <CtaSection />
  </main>
</template>
