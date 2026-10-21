<script setup lang="ts">
/**
 * 線画アイコン（tools/illustkit で登録し、assets/illust/ に書き出したもの）をインライン SVG で表示する。
 * 線は currentColor なので、色は呼び出し側の text-* で指定する（ライト背景は text-primary-700、ダーク背景は text-white）。
 * 差し色・うすい面・抜きは CSS 変数で変えられる:
 *   --illust-accent（既定 accent-500）/ --illust-tint（既定 primary-100）/ --illust-paper（既定 白）
 */
interface Props {
  /** "<ジャンル>/<名前>"（例 machines/tower-crane）。ik find で出る名前 */
  name: string
  /** 意味のあるアイコンのときだけ指定する。省くと装飾として読み上げから外す */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
})

const loaders = import.meta.glob<string>('../../assets/illust/**/*.svg', {
  query: '?raw',
  import: 'default',
})

const load = loaders[`../../assets/illust/${props.name}.svg`]
if (!load && import.meta.dev) {
  console.warn(`[IllustIcon] アイコンがありません: ${props.name}（bash tools/illustkit/ik find で名前を確かめてください）`)
}
// 同じアイコンを1ページに何回置いても clipPath などの id がぶつからないよう、置くたびに付けなおす
const uid = useId()
const svg = load
  ? (await load()).replaceAll(`il-${props.name.replace('/', '-')}-`, `il-${uid}-`)
  : ''
</script>

<template>
  <span
    class="inline-block *:size-full"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    v-html="svg"
  />
</template>
