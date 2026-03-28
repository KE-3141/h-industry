<script setup lang="ts">
interface Props {
  label: string
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
      <!-- 箇条書きモード -->
      <ul v-if="items?.length" class="mt-auto pt-8 space-y-3">
        <li
          v-for="item in items"
          :key="item"
          class="flex items-start gap-3 text-sm text-neutral-300"
        >
          <span
            class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-accent-500/20
                   flex items-center justify-center"
          >
            <svg
              class="w-3 h-3 text-accent-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
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
