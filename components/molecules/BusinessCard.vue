<script setup lang="ts">
interface Props {
  title: string
  description: string
  to?: string
  linkText?: string
  items?: string[]
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
    v-reveal
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
    <!-- コンテンツ -->
    <div class="relative p-10 md:p-12 flex flex-col flex-1">
      <h3 class="text-2xl font-black mb-4">{{ title }}</h3>
      <p class="text-neutral-300 text-sm leading-relaxed">
        {{ description }}
      </p>
      <!-- 箇条書きモード -->
      <ul v-if="items?.length" class="mt-auto pt-8 space-y-2">
        <li
          v-for="item in items"
          :key="item"
          class="py-2 border-b border-white/10 text-sm text-neutral-300"
        >
          {{ item }}
        </li>
      </ul>
      <!-- テキストリンクモード -->
      <SlideLink
        v-else-if="to && linkText"
        :to="to"
        class="inline-flex items-center text-white font-semibold text-sm mt-auto pt-8"
      >
        {{ linkText }}
      </SlideLink>
    </div>
  </div>
</template>
