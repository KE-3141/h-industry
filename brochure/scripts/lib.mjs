/**
 * 各パターン共通で使うデータとヘルパー。
 * useSiteContent.ts と content.ts を読み込み、ページの HTML を組み立てる部品を提供する。
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'
import QRCode from 'qrcode'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const repo = resolve(root, '..')

// Nuxt の自動インポートの代わり。画像パスは build/<パターン>/images → public/images のシンボリックリンクで解決する
globalThis.usePublicUrl = path => path.replace(/^\//, '')

const jiti = createJiti(import.meta.url)
const { useSiteContent } = await jiti.import(resolve(repo, 'composables/useSiteContent.ts'))
export const { brochure } = await jiti.import(resolve(root, 'content.ts'))
export const site = useSiteContent()
export const { company } = site

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
export const img = path => encodeURI(path.replace(/^\//, ''))

/** 見出し。英字の label は見出しには出さず、小口の縦書き（side-label）にだけ使う */
export const heading = (label, title, { invert = false } = {}) => `
  <header class="heading${invert ? ' heading--invert' : ''}" data-side-label="${esc(label)}">
    <h2 class="heading__title">${esc(title)}</h2>
  </header>`

/** 色を CSS 側で塗り替えられるよう、ロゴ SVG の固定色をクラスに置き換えて埋め込む */
export const logo = readFileSync(resolve(repo, 'public/images/logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*\?>/, '')
  .replace(/\sid="[^"]*"/, ' class="logo" role="img" aria-label="平山工業株式会社"')
  .replace(/style="fill:#231815;"/g, 'class="logo__text"')
  .replace(/style="fill:none;[^"]*"/g, 'class="logo__mark"')

export const qr = brochure.siteUrl
  ? await QRCode.toString(brochure.siteUrl, { type: 'svg', margin: 0, errorCorrectionLevel: 'M' })
  : '<div class="qr-placeholder">QR<br>（URL確定後）</div>'
