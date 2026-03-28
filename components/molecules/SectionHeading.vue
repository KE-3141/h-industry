<script setup lang="ts">
/**
 * セクション見出しブロック。
 * 英語ラベル（小文字 uppercase）+ 日本語 h2 の組み合わせ。
 */
interface Props {
  label?: string
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
    :class="{
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
    }"
  >
    <p
      v-if="label"
      class="text-accent-500 text-sm font-medium tracking-[0.2em] uppercase mb-3"
    >
      {{ label }}
    </p>
    <h2
      class="text-3xl md:text-4xl font-black leading-tight"
      :class="titleClass"
    >
      <!-- title は slot で上書き可能（改行を含む場合など） -->
      <slot>{{ title }}</slot>
    </h2>
  </div>
</template>
