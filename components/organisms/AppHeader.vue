<script setup lang="ts">
const logoUrl = usePublicUrl('/images/logo.svg')
const { company, navItems } = useSiteContent()

const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 20)
const isMenuOpen = ref(false)

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-50 bg-white transition-shadow duration-200',
      isScrolled
        ? 'shadow-[0_2px_12px_0_rgb(0_0_0_/0.10)]'
        : 'border-b border-neutral-100',
    ]"
  >
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-center h-16 gap-4">
        <!-- ロゴ -->
        <NuxtLink to="/" class="flex-shrink-0" @click="closeMenu">
          <img
            :src="logoUrl"
            :alt="company.name"
            class="h-7 md:h-8 w-auto"
          />
        </NuxtLink>

        <!-- デスクトップナビ -->
        <nav class="hidden lg:flex items-center gap-0.5 ml-4 flex-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="relative px-3 py-2 text-sm font-medium text-neutral-700 whitespace-nowrap
                   transition-colors duration-150
                   hover:text-primary-600
                   [&.router-link-active]:text-primary-600
                   after:content-[''] after:pointer-events-none after:absolute after:bottom-1.5
                   after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary-500
                   after:origin-left after:scale-x-0 after:transition-transform after:duration-300
                   after:ease-out
                   hover:after:scale-x-100
                   [&.router-link-active]:after:scale-x-100"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- デスクトップ右：電話 + CTA -->
        <div class="hidden lg:flex items-center gap-5 ml-auto flex-shrink-0">
          <a
            :href="`tel:${company.telRaw}`"
            class="flex items-center gap-1.5 text-primary-700 hover:text-primary-500
                   transition-colors duration-150"
          >
            <IconPhone class="w-4 h-4" />
            <span class="text-sm font-bold tracking-wide">{{ company.tel }}</span>
          </a>
          <AppButton to="/contact/" size="md">
            お問い合わせ
          </AppButton>
        </div>

        <!-- モバイル：電話アイコン + ハンバーガー -->
        <div class="flex items-center gap-2 ml-auto lg:hidden">
          <a
            :href="`tel:${company.telRaw}`"
            class="p-2 text-primary-700 hover:text-primary-500 transition-colors"
            :aria-label="`電話する ${company.tel}`"
          >
            <IconPhone class="w-5 h-5" />
          </a>
          <button
            class="p-2 text-neutral-700 hover:text-primary-600 transition-colors"
            :aria-expanded="isMenuOpen"
            aria-label="メニューを開く"
            @click="isMenuOpen = !isMenuOpen"
          >
            <!-- ハンバーガー / クローズ -->
            <svg
              v-if="!isMenuOpen"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              v-else
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- モバイルメニュー -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <nav
        v-show="isMenuOpen"
        class="lg:hidden border-t border-neutral-100 bg-white shadow-lg"
      >
        <div class="max-w-6xl mx-auto px-6 py-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center py-3.5 text-sm font-medium text-neutral-700
                   border-b border-neutral-50 last:border-0
                   hover:text-primary-600 transition-colors duration-150"
            @click="closeMenu"
          >
            {{ item.label }}
          </NuxtLink>
          <div class="py-4">
            <AppButton
              to="/contact/"
              size="md"
              class="w-full py-3.5"
              @click="closeMenu"
            >
              お問い合わせ
            </AppButton>
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>
