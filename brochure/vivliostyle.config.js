// @ts-check
import { patternNames } from './scripts/patterns.mjs'

// PRESS=1 のときは入稿用（press-ready でプリフライト）を output/<パターン>-press.pdf に書き出す
const press = Boolean(process.env.PRESS)

/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
export default patternNames.map(name => ({
  title: '平山工業株式会社 会社案内',
  language: 'ja',
  entry: [`build/${name}/index.html`],
  output: `output/${name}${press ? '-press' : ''}.pdf`,
  pdfPostprocess: {
    // CSS の device-cmyk() をそのまま CMYK で書き出す（写真は RGB のまま）
    cmyk: true,
    ...(press ? { preflight: 'press-ready' } : {}),
  },
}))
