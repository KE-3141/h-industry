<script setup lang="ts">
interface Props {
  variant?: 'neutral' | 'primary' | 'ghost'
}
withDefaults(defineProps<Props>(), { variant: 'neutral' })
</script>

<template>
  <span
    :class="[
      'inline-block border rounded-sm text-sm font-medium',
      variant === 'neutral' && 'border-neutral-200 text-neutral-700 px-5 py-3',
      variant === 'primary' && 'bg-primary-50 border-primary-100 text-primary-700 px-4 py-2',
      variant === 'ghost'   && 'bg-transparent border-white text-white px-4 py-2',
    ]"
  >
    <slot />
  </span>
</template>
