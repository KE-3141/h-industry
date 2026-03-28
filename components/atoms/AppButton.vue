<script setup lang="ts">
/**
 * サイト共通ボタン。
 * - to   → NuxtLink としてレンダリング
 * - href → <a> としてレンダリング
 * - それ以外 → <button> としてレンダリング
 */
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-xs px-4 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-8 py-4',
}

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-accent-500 hover:bg-accent-400 text-white',
  secondary:
    'bg-white hover:bg-neutral-50 text-primary-600 border border-primary-600',
  ghost: 'bg-white/10 hover:bg-white/20 text-white border border-white/25',
}
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :to="props.to"
    :class="[
      'inline-flex items-center justify-center gap-2 font-bold rounded',
      'transition-colors duration-150 whitespace-nowrap cursor-pointer',
      sizeClass[props.size],
      variantClass[props.variant],
    ]"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="props.href"
    :href="props.href"
    :class="[
      'inline-flex items-center justify-center gap-2 font-bold rounded',
      'transition-colors duration-150 whitespace-nowrap cursor-pointer',
      sizeClass[props.size],
      variantClass[props.variant],
    ]"
  >
    <slot />
  </a>
  <button
    v-else
    type="button"
    :class="[
      'inline-flex items-center justify-center gap-2 font-bold rounded',
      'transition-colors duration-150 whitespace-nowrap cursor-pointer',
      sizeClass[props.size],
      variantClass[props.variant],
    ]"
  >
    <slot />
  </button>
</template>
