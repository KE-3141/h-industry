/**
 * v-reveal ディレクティブ。
 * 使い方: v-reveal / v-reveal="'from-left'" / v-reveal="{ dir: 'from-right', delay: 150 }"
 */
type Direction = 'from-bottom' | 'from-left' | 'from-right'
type RevealBinding =
  | Direction
  | { dir?: Direction; delay?: number }
  | undefined

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, RevealBinding>('reveal', {
    mounted(el, binding) {
      const dir: Direction =
        typeof binding.value === 'string'
          ? binding.value
          : binding.value?.dir ?? 'from-bottom'
      const delay: number =
        typeof binding.value === 'object' && binding.value !== null
          ? (binding.value.delay ?? 0)
          : 0

      el.classList.add('reveal', dir)
      if (delay) el.style.transitionDelay = `${delay}ms`

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            observer.disconnect()
          }
        },
        { threshold: 0.15 },
      )
      observer.observe(el)
    },
  })
})
