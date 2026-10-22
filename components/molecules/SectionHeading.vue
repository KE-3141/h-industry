<script setup lang="ts">
interface Props {
  title: string
  align?: 'left' | 'center' | 'right'
  titleClass?: string
}

withDefaults(defineProps<Props>(), {
  align: 'center',
  titleClass: 'text-primary-800',
})
</script>

<template>
  <div
    v-reveal
    :class="{
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
    }"
  >
    <h2
      class="text-3xl md:text-4xl font-black leading-tight text-balance"
      :class="titleClass"
    >
      <!-- title は slot で上書き可能（改行を含む場合など） -->
      <slot>{{ title }}</slot>
    </h2>
  </div>
</template>
