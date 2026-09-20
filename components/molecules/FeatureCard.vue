<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <article
    v-reveal
    class="bg-white border border-neutral-100 rounded-2xl p-8"
  >
    <div
      class="w-16 h-16 flex items-center justify-center mb-5 mx-auto text-primary-500"
    >
      <slot name="icon" />
    </div>
    <h3 class="text-xl font-bold text-primary-800 mb-3 text-center">{{ title }}</h3>
    <p class="text-neutral-600 text-sm leading-relaxed text-center">{{ description }}</p>
  </article>
</template>
