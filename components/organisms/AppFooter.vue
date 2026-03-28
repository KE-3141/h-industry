<script setup lang="ts">
const { company, footerNavItems } = useSiteContent()
</script>

<template>
  <footer class="bg-primary-950 text-neutral-300">
    <div class="max-w-6xl mx-auto px-6 py-14 md:py-16">
      <!-- メイン行 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <!-- 会社情報 -->
        <div>
          <NuxtLink to="/" class="block mb-4">
            <span class="text-white text-base font-bold tracking-wide">
              {{ company.name }}
            </span>
          </NuxtLink>
          <address class="not-italic text-sm text-neutral-400 leading-relaxed">
            〒{{ company.postalCode }}<br>
            {{ company.address }}
          </address>
          <a
            :href="`tel:${company.telRaw}`"
            class="inline-block mt-4 text-white font-bold text-lg
                   hover:text-accent-400 transition-colors duration-150"
          >
            {{ company.tel }}
          </a>
          <p class="text-xs text-neutral-500 mt-1">
            {{ company.hoursLabel }}
          </p>
        </div>

        <!-- ナビリンク -->
        <nav class="md:col-span-2" aria-label="フッターナビゲーション">
          <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1">
            <li v-for="item in footerNavItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="block text-sm text-neutral-400 hover:text-white py-1.5
                       transition-colors duration-150"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <!-- ボトム行 -->
      <div
        class="border-t border-primary-800 pt-6 flex flex-col sm:flex-row
               justify-between items-center gap-3"
      >
        <NuxtLink
          to="/privacy/"
          class="text-xs text-neutral-500 hover:text-neutral-300
                 transition-colors duration-150"
        >
          プライバシーポリシー
        </NuxtLink>
        <p class="text-xs text-neutral-500">
          © {{ new Date().getFullYear() }} {{ company.name }}
        </p>
      </div>
    </div>
  </footer>
</template>
