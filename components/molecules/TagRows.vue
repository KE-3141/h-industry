<script setup lang="ts">
interface Props {
  items: readonly string[]
  variant?: 'neutral' | 'primary' | 'ghost'
}

const props = withDefaults(defineProps<Props>(), { variant: 'neutral' })

// タグを2行に均等配分する（7 → 4 + 3 など）
const rows = computed(() => {
  const half = Math.ceil(props.items.length / 2)
  return [props.items.slice(0, half), props.items.slice(half)]
})
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <ul
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="flex flex-wrap justify-center gap-3"
    >
      <li v-for="item in row" :key="item">
        <TagBadge :variant="variant">{{ item }}</TagBadge>
      </li>
    </ul>
  </div>
</template>
