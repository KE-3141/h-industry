<script setup lang="ts">
interface Props {
  label: string
  title: string
  description: string
  to: string
  linkText: string
  imageSrc?: string
  imageAlt?: string
  variant?: 'primary' | 'neutral'
}
withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<template>
  <div
    class="relative text-white rounded-sm overflow-hidden flex flex-col"
    :class="variant === 'primary' ? 'bg-primary-900' : 'bg-neutral-800'"
  >
    <!-- 施工写真（オプション） -->
    <div v-if="imageSrc" class="relative h-72 overflow-hidden flex-shrink-0">
      <img
        :src="imageSrc"
        :alt="imageAlt ?? ''"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-primary-950/35" />
    </div>
    <!-- 背景グラデーション -->
    <div
      class="absolute inset-0 pointer-events-none"
      :class="
        variant === 'primary'
          ? 'bg-gradient-to-br from-primary-800/30 to-primary-950/0'
          : 'bg-gradient-to-br from-neutral-700 to-neutral-900'
      "
    />
    <!-- アクセントライン -->
    <div
      class="pointer-events-none absolute bottom-0 left-0 w-1 h-68 rounded-full bg-accent-500"
    />
    <!-- コンテンツ -->
    <div class="relative p-10 md:p-12 flex flex-col flex-1">
      <p class="text-accent-400 text-xs font-medium tracking-[0.2em] uppercase mb-3">
        {{ label }}
      </p>
      <h3 class="text-2xl font-black mb-4">{{ title }}</h3>
      <p class="text-neutral-300 text-sm leading-relaxed">
        {{ description }}
      </p>
      <SlideLink
        :to="to"
        class="inline-flex items-center text-white font-semibold text-sm mt-auto pt-8"
      >
        {{ linkText }}
      </SlideLink>
    </div>
  </div>
</template>
