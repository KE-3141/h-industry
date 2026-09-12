<script setup lang="ts">
useHead({ title: '施工実績 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の施工実績。鉄筋工事・型枠工事・溶接工事・圧接工事など、関東全域での豊富な施工実績をご覧ください。',
})

const { projects, stats } = useSiteContent()
const placeholderImageUrl = usePublicUrl('/images/hero_1.png')

// ─── ライトボックス ───────────────────────────
type Project = typeof projects[number]
const lightboxProject = ref<Project | null>(null)

function openLightbox(project: Project) {
  lightboxProject.value = project
}

function closeLightbox() {
  lightboxProject.value = null
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

watch(lightboxProject, val => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})
</script>

<template>
  <main>
    <!-- ===== 1. ページヒーロー ===== -->
    <PageHero
      label="Achievements"
      title="施工実績"
      description="創業50年超にわたり、マンション・インフラ・公共施設・耐震補強工事など関東全域で多様な現場を手がけてきました。"
    />

    <!-- ===== 2. 実績数値 ===== -->
    <section class="py-12 md:py-16 bg-primary-950 text-white">
      <div class="max-w-6xl mx-auto px-6">
        <dl class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <dd class="text-4xl md:text-5xl font-black text-white leading-none mb-1">
              {{ stat.value }}<span class="text-xl md:text-2xl ml-0.5">{{ stat.unit }}</span>
            </dd>
            <dt class="text-neutral-400 text-xs mt-2">{{ stat.label }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- ===== 3. 施工実績グリッド ===== -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <SectionHeading label="Projects" title="施工実績一覧" class="mb-10" />

        <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          <li
            v-for="project in projects"
            :key="project.key"
            class="group"
          >
            <!-- 写真（クリックでライトボックス） -->
            <button
              type="button"
              class="relative overflow-hidden rounded-xl aspect-[4/3] mb-3 bg-neutral-100 w-full block cursor-zoom-in"
              :aria-label="`${project.name}の写真を拡大`"
              @click="openLightbox(project)"
            >
              <img
                :src="placeholderImageUrl"
                :alt="project.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <!-- ズームアイコン（ホバー時） -->
              <div
                class="absolute inset-0 bg-primary-950/0 group-hover:bg-primary-950/25
                       transition-colors duration-300 flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
              </div>
            </button>

            <!-- テキスト -->
            <div class="flex items-baseline justify-between gap-2 mb-0.5">
              <p class="text-sm font-bold text-primary-900 leading-snug">
                {{ project.name }}
              </p>
              <p class="text-xs text-neutral-400 shrink-0">{{ project.location }}</p>
            </div>
            <p class="text-xs text-neutral-400 mb-1.5">{{ project.client }}</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="type in project.businessTypes"
                :key="type"
                class="text-xs font-medium px-2 py-0.5 rounded bg-primary-50 text-primary-700"
              >
                {{ type.replace('工事', '') }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ===== 4. CTA ===== -->
    <CtaSection />

    <!-- ===== ライトボックス ===== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="lightboxProject"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 md:p-10"
          role="dialog"
          :aria-label="`${lightboxProject.name}の拡大写真`"
          aria-modal="true"
          @click.self="closeLightbox"
        >
          <div class="relative w-full max-w-5xl">
            <!-- 閉じるボタン -->
            <button
              type="button"
              class="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white/15
                     hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="閉じる"
              @click="closeLightbox"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- 画像 -->
            <img
              :src="placeholderImageUrl"
              :alt="lightboxProject.name"
              class="w-full max-h-[75vh] object-contain rounded-lg"
            />

            <!-- キャプション -->
            <div class="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-white font-bold text-sm md:text-base">
                  {{ lightboxProject.name }}
                </p>
                <p class="text-white/50 text-xs mt-1">{{ lightboxProject.location }}</p>
                <p class="text-white/50 text-xs">{{ lightboxProject.client }}</p>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="type in lightboxProject.businessTypes"
                  :key="type"
                  class="text-xs font-medium px-2 py-1 rounded bg-white/10 text-white/80"
                >
                  {{ type.replace('工事', '') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>
