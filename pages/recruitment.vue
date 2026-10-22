<script setup lang="ts">
useHead({ title: '求人情報 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業株式会社の求人情報。鳶工・土工・型枠工・鉄筋工・現場管理を随時募集中。未経験者歓迎・資格取得支援・単身用寮完備。関東全域の建設現場で技術を磨きませんか。',
})

const { company, jobs, benefits, applicationSteps, recruitmentPoints, recruitmentMessage } = useSiteContent()
const recruitmentBgUrl = usePublicUrl('/images/recruitment_bg.jpg')
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      title="求人情報"
      description="「誠実な人が、確かな施工をする」鳶工・土工・型枠工・鉄筋工・現場管理を随時募集しています。未経験者歓迎。あなたの成長を全力でサポートします。"
    />

    <!-- ===== 2. 採用メッセージ ===== -->
    <section class="relative py-20 md:py-28 overflow-hidden">
      <!-- 背景画像 -->
      <div class="absolute inset-0">
        <img
          :src="recruitmentBgUrl"
          alt=""
          aria-hidden="true"
          class="w-full h-full object-cover object-[center_20%] md:object-[center_25%]"
          loading="lazy"
        />
      </div>
      <!-- オーバーレイ -->
      <div class="absolute inset-0 bg-primary-950/70" />
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <div class="md:grid md:grid-cols-2 md:gap-16 md:items-center">
          <div class="mb-12 md:mb-0">
            <SectionHeading
              title=""
              title-class="text-white"
              align="left"
              class="mb-6"
            >
              <span
                v-for="line in recruitmentMessage.titleLines"
                :key="line"
                class="inline-block"
              >{{ line }}</span>
            </SectionHeading>
            <SlideLink
              to="/contact/"
              class="inline-flex items-center font-semibold text-sm text-white"
            >
              お気軽にお問い合わせください
            </SlideLink>
          </div>
          <div>
            <p
              v-for="(paragraph, index) in recruitmentMessage.paragraphs"
              :key="index"
              class="text-neutral-200 leading-relaxed"
              :class="{ 'mt-4': index > 0 }"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 3. 求める人物像 ===== -->
    <SplitListSection
      title="求める人物像"
      description="経験・未経験は問いません。まずは一緒に現場に立てる方を求めています。"
      :theme="'light'"
      :items="recruitmentPoints"
    />


    <!-- ===== 4. 募集職種 ===== -->
    <section class="py-20 md:py-28 bg-primary-900">
      <div class="max-w-6xl mx-auto px-6">
        <SectionHeading
          title="募集職種"
          title-class="text-white"
          class="mb-14"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BusinessCard
            v-for="job in jobs"
            :key="job.key"
            :title="job.title"
            :description="job.description"
            :items="job.requirements"
          />
        </div>
      </div>
    </section>

    <!-- ===== 4. 福利厚生 ===== -->
    <section class="py-20 md:py-28 bg-neutral-50">
      <div class="max-w-6xl mx-auto px-6">
        <SectionHeading title="福利厚生・待遇" class="mb-14" />
        <div class="space-y-0 divide-y divide-neutral-200 border-y border-neutral-200">
          <div
            v-for="benefit in benefits"
            :key="benefit.title"
            class="grid grid-cols-[10rem_1fr] gap-6 py-5 items-baseline"
          >
            <p class="text-sm font-bold text-primary-900">{{ benefit.title }}</p>
            <p class="text-sm text-neutral-600 leading-relaxed">{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 5. 応募〜入社の流れ ===== -->
    <StepsSection
      title="応募から入社の流れ"
      :steps="applicationSteps"
    />

    <!-- ===== 6. 応募CTA ===== -->
    <section class="py-16 md:py-20 bg-primary-800 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="md:flex items-center justify-between gap-8">
          <div class="mb-8 md:mb-0">
            <h2 class="text-2xl md:text-3xl font-black mb-3 text-balance">
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
