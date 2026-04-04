<script setup lang="ts">
const { company } = useSiteContent()
const imageUrl = usePublicUrl('/images/under_construction.svg')

useHead({ title: '平山工業株式会社 | 鉄筋工事・溶接工事の専門企業' })
useSeoMeta({
  description: '平山工業株式会社の公式サイトです。ただいまサイトを準備中です。',
})
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-20">
    <img
      :src="imageUrl"
      alt="サイト準備中"
      class="w-full max-w-lg"
      fetchpriority="high"
      loading="eager"
    />
    <h1 class="mt-8 text-xl md:text-2xl font-bold text-primary-900 text-center">
      ただいまサイトの準備中です
    </h1>
    <p class="mt-3 text-neutral-500 text-sm text-center">
      {{ company.name }}
    </p>
    <div class="mt-8 flex items-center gap-2 text-primary-700">
      <IconPhone class="w-5 h-5" aria-hidden="true" />
      <a
        :href="`tel:${company.telRaw}`"
        class="text-lg font-bold tracking-wide hover:text-primary-500 transition-colors"
        :aria-label="`電話する ${company.tel}`"
      >
        {{ company.tel }}
      </a>
    </div>
    <div class="mt-8 flex flex-col sm:flex-row items-center gap-4">
      <AppButton to="/company/" variant="secondary">
        会社概要
      </AppButton>
      <AppButton to="/contact/">
        お問い合わせ
        <IconArrow />
      </AppButton>
    </div>
  </main>
</template>
