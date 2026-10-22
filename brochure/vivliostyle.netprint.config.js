// @ts-check
// ネットプリント試作用（scripts/netprint.mjs から呼ぶ）。写真を縮小した HTML を RGB のまま PDF にする
import { patternNames } from './scripts/patterns.mjs'

/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
export default patternNames.map(name => ({
  title: '平山工業株式会社 会社案内',
  language: 'ja',
  entry: [`build/${name}-netprint/index.html`],
  output: `build/${name}-netprint.pdf`,
}))
