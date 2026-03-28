<script setup lang="ts">
/**
 * ページ末尾共通 CTA セクション。
 * 全内部ページの最下部に配置する。
 */
const { company } = useSiteContent()
</script>

<template>
  <section class="py-20 md:py-28 bg-primary-950 text-white text-center">
    <div class="max-w-2xl mx-auto px-6">
      <p class="text-neutral-400 text-sm mb-3">お気軽にご相談ください</p>
      <a
        :href="`tel:${company.telRaw}`"
        class="text-4xl md:text-5xl font-black text-white
               hover:text-accent-300 transition-colors duration-150 block mb-2"
      >
        {{ company.tel }}
      </a>
      <p class="text-neutral-500 text-sm mb-10">{{ company.hoursLabel }}</p>
      <AppButton to="/contact/" size="lg">
        お問い合わせフォームはこちら
        <IconArrow />
      </AppButton>
    </div>
  </section>
</template>
