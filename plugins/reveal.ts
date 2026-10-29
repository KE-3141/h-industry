/**
 * v-reveal ディレクティブ。
 * 使い方: v-reveal / v-reveal="'from-left'" / v-reveal="{ dir: 'from-right', delay: 150 }"
 */
type Direction = 'from-bottom' | 'from-left' | 'from-right'
type RevealBinding =
  | Direction
  | { dir?: Direction; delay?: number }
  | undefined

function toDirection(value: RevealBinding): Direction {
  return typeof value === 'string' ? value : value?.dir ?? 'from-bottom'
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, RevealBinding>('reveal', {
    // サーバー側の組み立てでも同じクラスを付け、ブラウザで動き出したときのちらつきを防ぐ
    getSSRProps(binding) {
      return { class: ['reveal', toDirection(binding.value)] }
    },
    mounted(el, binding) {
      const dir = toDirection(binding.value)
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
