<script setup lang="ts">
/**
 * 縦積みステップリストセクション。
 * 番号付き丸アイコン＋縦ライン＋タイトル・説明のレイアウト。
 */
interface Step {
  step: string | number
  title: string
  description: string
}

interface Props {
  label: string
  title: string
  steps: Step[]
}

defineProps<Props>()
</script>

<template>
  <section class="py-20 md:py-28 bg-white">
    <div class="max-w-3xl mx-auto px-6">
      <SectionHeading :label="label" :title="title" class="mb-14" />
      <ol class="relative space-y-0">
        <!-- 縦ライン -->
        <div
          class="absolute left-[1.75rem] top-10 bottom-10 w-px bg-neutral-200"
          aria-hidden="true"
        />
        <li
          v-for="step in steps"
          :key="step.step"
          class="relative flex gap-8 pb-10 last:pb-0"
        >
          <!-- ステップ番号 -->
          <div
            class="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-primary-800
                   flex items-center justify-center"
          >
            <span class="text-white text-xs font-bold leading-none text-center">{{ step.step }}</span>
          </div>
          <!-- 内容 -->
          <div class="pt-3 pb-2">
            <h3 class="text-lg font-black text-primary-900 mb-2">{{ step.title }}</h3>
            <p class="text-neutral-600 text-sm leading-relaxed">{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
