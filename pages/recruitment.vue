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

    <!-- ===== 2. 採用メッセージ ===== -->
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="md:grid md:grid-cols-2 md:gap-16 md:items-center">
          <div class="mb-12 md:mb-0">
            <SectionHeading
              label="Message"
              title="一生モノの技術を、ここで身につけよう。"
              title-class="text-primary-800"
              align="left"
              class="mb-6"
            />
            <SlideLink
              to="/contact/"
              class="inline-flex items-center font-semibold text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              お気軽にお問い合わせください
            </SlideLink>
          </div>
          <div>
            <p class="text-neutral-700 leading-relaxed">
              平山工業は、経験・未経験を問わず採用しています。大切にしているのは「一緒に現場をつくれるか」という一点です。鉄筋工事の技術はゼロから身につけられます。先輩職人が丁寧に指導しますので、まずは「やってみたい」という気持ちがあれば十分です。
            </p>
            <p class="text-neutral-700 leading-relaxed mt-4">
              資格取得支援・単身用寮・社会保険完備など、長く安心して働ける環境も整えています。「話を聞いてみたい」という段階でもお気軽にご連絡ください。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 3. 求める人物像 ===== -->
    <SplitListSection
      label="Looking For"
      title="求める人物像"
      description="経験・未経験は問いません。まずは一緒に現場に立てる方を求めています。"
      :theme="'light'"
      :items="recruitmentPoints"
    />


    <!-- ===== 4. 募集職種 ===== -->
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
