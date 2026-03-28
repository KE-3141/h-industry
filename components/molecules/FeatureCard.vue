<script setup lang="ts">
/**
 * 特長・強みカード。
 * icon スロットにアイコン SVG を渡す。
 */
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <article
    class="bg-white border border-neutral-100 rounded-sm p-8
           shadow-[0_2px_8px_0_rgb(0_0_0_/0.07)]
           hover:shadow-[0_4px_16px_0_rgb(0_0_0_/0.11)]
           transition-shadow duration-200"
  >
    <div
      class="w-12 h-12 rounded-sm bg-accent-50 flex items-center
             justify-center mb-5 text-accent-500"
    >
      <slot name="icon" />
    </div>
    <h3 class="text-xl font-bold text-primary-800 mb-3">{{ title }}</h3>
    <p class="text-neutral-600 text-sm leading-relaxed">{{ description }}</p>
  </article>
</template>
