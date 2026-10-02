<script setup lang="ts">
useHead({ title: '施工実績 | 平山工業株式会社' })
useSeoMeta({
  description: '平山工業の施工実績。鉄筋工事・型枠工事・溶接工事・圧接工事など、関東全域での豊富な施工実績をご覧ください。',
})

const { projects, stats } = useSiteContent()

function tagLabel(type: string) {
  return type.replace('工事', '')
}

// ─── ライトボックス ───────────────────────────
type Project = typeof projects[number]
const lightboxProject = ref<Project | null>(null)
const lightboxIndex = ref(0)
const imageLoading = ref(false)

const lightboxImage = computed(() => {
  const project = lightboxProject.value
  if (!project) return ''
  return project.images[lightboxIndex.value] ?? project.images[0]
})

function openLightbox(project: Project) {
  lightboxIndex.value = 0
  imageLoading.value = false
  lightboxProject.value = project
}

function closeLightbox() {
  lightboxProject.value = null
}

function navigateTo(index: number) {
  imageLoading.value = true
  lightboxIndex.value = index
}

function showPrev() {
  const project = lightboxProject.value
  if (!project || project.images.length < 2) return
  navigateTo((lightboxIndex.value - 1 + project.images.length) % project.images.length)
}

function showNext() {
  const project = lightboxProject.value
  if (!project || project.images.length < 2) return
  navigateTo((lightboxIndex.value + 1) % project.images.length)
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxProject.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    showPrev()
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    showNext()
  }
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
            v-for="(project, i) in projects"
            :key="project.key"
            v-reveal="{ delay: (i % 4) * 80 }"
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
                :src="project.images[0]"
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
            <p class="text-sm font-bold text-primary-900 leading-snug mb-0.5">
              {{ project.name }}
            </p>
            <p class="text-xs text-neutral-400 mb-0.5">{{ project.location }}</p>
            <p class="text-xs text-neutral-400 mb-1.5">{{ project.client }}</p>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="type in project.businessTypes"
                :key="type"
                class="text-[11px] text-neutral-500 border border-neutral-300 rounded px-1.5 py-0.5 leading-none"
              >{{ tagLabel(type) }}</span>
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
            <div class="relative">
              <img
                :src="lightboxImage"
                :alt="`${lightboxProject.name}の施工写真 ${lightboxIndex + 1}`"
                class="w-full max-h-[75vh] object-contain rounded-lg bg-black"
                :class="{ 'opacity-0': imageLoading }"
                @load="imageLoading = false"
              />
              <Transition
                enter-active-class="transition-opacity duration-150"
                enter-from-class="opacity-0"
                leave-active-class="transition-opacity duration-150"
                leave-to-class="opacity-0"
              >
                <div
                  v-if="imageLoading"
                  class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60"
                >
                  <svg
                    class="w-8 h-8 text-white/70 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              </Transition>
            </div>

            <template v-if="lightboxProject.images.length > 1">
              <button
                type="button"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                       bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="前の写真"
                @click="showPrev"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                       bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="次の写真"
                @click="showNext"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </template>

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
                  class="text-[11px] text-white/60 border border-white/25 rounded px-1.5 py-0.5 leading-none"
                >{{ tagLabel(type) }}</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>
