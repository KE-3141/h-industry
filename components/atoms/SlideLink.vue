<script setup lang="ts">
import { computed, mergeProps, useAttrs, useSlots } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  to: string
}
defineProps<Props>()

const attrs = useAttrs()
const slots = useSlots()

const nuxtLinkBindings = computed(() =>
  mergeProps(attrs, {
    class: ['group', 'text-inherit'],
  }),
)

/** prefix ありの行は幅いっぱいに伸ばす。単体リンクでは flex-1 を付けない（inline-flex との相性対策） */
const slidingSpanClass = computed(() => [
  'inline-flex min-w-0 items-center gap-3 transition-transform duration-300 ease-out',
  'motion-reduce:transition-none motion-reduce:group-hover:translate-x-0',
  'group-hover:translate-x-2 md:group-hover:translate-x-3',
  slots.prefix ? 'min-w-0 flex-1' : '',
])
</script>

<template>
  <NuxtLink :to="to" v-bind="nuxtLinkBindings">
    <slot name="prefix" />
    <span :class="slidingSpanClass">
      <slot />
      <IconArrow class="shrink-0 text-inherit" aria-hidden="true" />
    </span>
  </NuxtLink>
</template>
