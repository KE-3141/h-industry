<script setup lang="ts">
interface Props {
  label: string
  title: string
  description?: string
}
defineProps<Props>()
</script>

<template>
  <section class="bg-primary-950 text-white py-16 md:py-20">
    <div class="max-w-6xl mx-auto px-6">
      <p class="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase mb-3">
        {{ label }}
      </p>
      <h1 class="text-3xl md:text-4xl font-black mb-4">{{ title }}</h1>
      <p v-if="description" class="text-neutral-300 text-base max-w-2xl leading-relaxed">
        {{ description }}
      </p>
    </div>
  </section>
</template>
