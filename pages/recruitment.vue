<script setup lang="ts">
useHead({ title: '求人情報 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業株式会社の求人情報。鉄筋工・溶接工を随時募集中。未経験者歓迎・資格取得支援・単身用寮完備。関東全域の建設現場で技術を磨きませんか。',
})

const { company, jobs, benefits, applicationSteps, recruitmentPoints } = useSiteContent()
const rebarWorkUrl = usePublicUrl('/images/rebar_work.png')
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Recruitment"
      title="求人情報"
      description="「良い製品は良い人がつくる」鉄筋工・溶接工を随時募集しています。未経験者歓迎。あなたの成長を全力でサポートします。"
    />

    <!-- ===== 2. 採用コンセプト ===== -->
    <SplitListSection
      label="Message"
      title="一生モノの技術を、ここで身につけよう。"
      description="未経験から一人前の職人へ。平山工業が全力でサポートします。"
      :theme="'light'"
      link-to="/contact/"
      link-text="お気軽にお問い合わせください"
      :items="recruitmentPoints"
    />


    <!-- ===== 3. 募集職種 ===== -->
    <section class="py-20 md:py-28 bg-primary-900">
      <div class="max-w-6xl mx-auto px-6">
        <SectionHeading
          label="Open Positions"
          title="募集職種"
          title-class="text-white"
          class="mb-14"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BusinessCard
            v-for="job in jobs"
            :key="job.key"
            :label="job.titleEn"
            :title="job.title"
            :description="job.description"
            :items="job.requirements"
            :image-src="rebarWorkUrl"
            image-alt="鉄筋工事の施工現場"
          />
        </div>
      </div>
    </section>

    <!-- ===== 4. 福利厚生 ===== -->
    <section class="py-20 md:py-28 bg-neutral-50">
      <div class="max-w-6xl mx-auto px-6">
        <SectionHeading label="Benefits" title="福利厚生・待遇" class="mb-14" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            v-for="benefit in benefits"
            :key="benefit.title"
            :title="benefit.title"
            :description="benefit.description"
          >
            <template #icon>
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="benefit.iconPath" />
              </svg>
            </template>
          </FeatureCard>
        </div>
      </div>
    </section>

    <!-- ===== 5. 応募〜入社の流れ ===== -->
    <StepsSection
      label="Process"
      title="応募から入社の流れ"
      :steps="applicationSteps"
    />

    <!-- ===== 6. 応募CTA ===== -->
    <section class="py-16 md:py-20 bg-primary-800 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="md:flex items-center justify-between gap-8">
          <div class="mb-8 md:mb-0">
            <p class="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase mb-2">
              Apply Now
            </p>
            <h2 class="text-2xl md:text-3xl font-black mb-3">
              まずはお気軽にご連絡ください
            </h2>
            <p class="text-neutral-300 text-sm md:text-base leading-relaxed max-w-xl">
              電話・フォームどちらからでも応募できます。<br>
              「話を聞いてみたい」という段階のご連絡も歓迎します。
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              :href="`tel:${company.telRaw}`"
              :aria-label="`電話する ${company.tel}`"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm
                     bg-white text-primary-900 font-bold text-sm
                     hover:bg-neutral-100 transition-colors duration-150"
            >
              <IconPhone aria-hidden="true" class="w-4 h-4" />
              {{ company.tel }}
            </a>
            <AppButton to="/contact/" size="lg">
              フォームで応募する
              <IconArrow />
            </AppButton>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 7. CTA ===== -->
    <CtaSection />
  </main>
</template>
