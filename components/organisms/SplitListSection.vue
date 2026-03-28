<script setup lang="ts">
/**
 * 2カラムセクション：左に見出し・説明・リンク、右に番号付き縦積みリスト。
 * theme で明暗を切り替え、imageSrc を渡すと背景画像＋オーバーレイになる。
 */
interface Item {
  key: string
  title: string
  shortDescription: string
  to?: string
}

interface Props {
  label: string
  title: string
  description: string
  items: Item[]
  linkTo?: string
  linkText?: string
  theme?: 'dark' | 'light'
  imageSrc?: string
  imageAlt?: string
}

withDefaults(defineProps<Props>(), {
  theme: 'dark',
})
</script>

<template>
  <section
    class="relative py-20 md:py-28"
    :class="[
      imageSrc ? 'overflow-hidden' : '',
      !imageSrc && theme === 'dark'  ? 'bg-primary-950' : '',
      !imageSrc && theme === 'light' ? 'bg-white'       : '',
    ]"
  >
    <!-- 背景画像（任意） -->
    <template v-if="imageSrc">
      <div class="absolute inset-0">
        <img
          :src="imageSrc"
          :alt="imageAlt ?? ''"
          aria-hidden="true"
          class="w-full h-full object-cover object-[center_35%]"
        />
      </div>
      <div
        class="absolute inset-0"
        :class="theme === 'dark' ? 'bg-primary-950/55' : 'bg-white/80'"
      />
    </template>

    <div class="max-w-6xl mx-auto px-6" :class="imageSrc ? 'relative z-10' : ''">
      <div class="md:grid md:grid-cols-2 md:gap-16 md:items-center">
        <!-- 左：見出し＋説明＋任意リンク -->
        <div class="mb-12 md:mb-0">
          <SectionHeading
            :label="label"
            :title="title"
            :title-class="theme === 'dark' ? 'text-white' : 'text-primary-800'"
            align="left"
            class="mb-6"
          />
          <p
            class="text-sm leading-relaxed max-w-xs mb-8"
            :class="theme === 'dark' ? 'text-white/80' : 'text-neutral-600'"
          >
            {{ description }}
          </p>
          <SlideLink
            v-if="linkTo && linkText"
            :to="linkTo"
            :class="[
              'inline-flex items-center font-semibold text-sm',
              theme === 'dark'
                ? 'text-white'
                : 'text-primary-600 hover:text-primary-800 transition-colors',
            ]"
          >
            {{ linkText }}
          </SlideLink>
        </div>

        <!-- 右：縦積みリスト -->
        <div>
          <template v-for="(item, index) in items" :key="item.key">
            <!-- リンクあり -->
            <SlideLink
              v-if="item.to"
              :to="item.to"
              class="flex w-full items-center gap-5 py-6 border-b last:border-0"
              :class="theme === 'dark' ? 'border-white/40 text-white' : 'border-neutral-200 text-primary-900'"
            >
              <template #prefix>
                <span
                  class="font-black text-xl leading-none w-8 flex-shrink-0 select-none"
                  :class="theme === 'dark' ? 'text-white' : 'text-primary-700'"
                >
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
              </template>
              <div class="flex-1 min-w-0">
                <p
                  class="font-black text-base mb-1"
                  :class="theme === 'dark' ? 'text-white' : 'text-primary-900'"
                >
                  {{ item.title }}
                </p>
                <p
                  class="text-sm leading-relaxed"
                  :class="theme === 'dark' ? 'text-white/80' : 'text-neutral-600'"
                >
                  {{ item.shortDescription }}
                </p>
              </div>
            </SlideLink>
            <!-- リンクなし -->
            <div
              v-else
              class="flex w-full items-center gap-5 py-6 border-b last:border-0"
              :class="theme === 'dark' ? 'border-white/40' : 'border-neutral-200'"
            >
              <span
                class="font-black text-xl leading-none w-8 flex-shrink-0 select-none"
                :class="theme === 'dark' ? 'text-white' : 'text-primary-700'"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <div class="flex-1 min-w-0">
                <p
                  class="font-black text-base mb-1"
                  :class="theme === 'dark' ? 'text-white' : 'text-primary-900'"
                >
                  {{ item.title }}
                </p>
                <p
                  class="text-sm leading-relaxed"
                  :class="theme === 'dark' ? 'text-white/80' : 'text-neutral-600'"
                >
                  {{ item.shortDescription }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
