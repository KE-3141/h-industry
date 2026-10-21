/**
 * セブンイレブンのネットプリントで試作するための PDF を作る（npm run netprint）。
 * A3 横・両面に面付けし、重ねて二つ折りにすると A4 の冊子になる。
 *   1. 写真を縮小したコピーで HTML を組み直す（ネットプリントは 1ファイル 10MB まで）
 *   2. vivliostyle.netprint.config.js で RGB の PDF を書き出す（コンビニのコピー機は RGB で十分）
 *   3. 仕上がり線で切り抜いて A3 に面付けし、output/<パターン>-netprint.pdf に書き出す
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync, symlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { PDFDocument } from 'pdf-lib'
import { root, repo } from './lib.mjs'
import { patternNames } from './patterns.mjs'

/** 縮小後の長辺（px）。いちばん大きい表紙の写真でも 180dpi 程度になる */
const maxPixels = 1400
const imagesDir = resolve(root, 'build/netprint-images')

/** public/images の写真を縮小して imagesDir に置く（作成済みならそのまま使う） */
const shrink = (path) => {
  const src = resolve(repo, 'public', path)
  const dest = resolve(imagesDir, path.replace(/^images\//, ''))
  if (existsSync(dest)) return
  mkdirSync(dirname(dest), { recursive: true })
  const [width, height] = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', src], { encoding: 'utf8' })
    .match(/\d+$/gm).map(Number)
  const args = Math.max(width, height) > maxPixels ? ['-Z', String(maxPixels)] : []
  execFileSync('sips', [...args, '-s', 'formatOptions', '70', src, '--out', dest], { stdio: 'ignore' })
}

// 1. 縮小した写真を参照する HTML を build/<パターン>-netprint/ に作る
for (const name of patternNames) {
  const html = readFileSync(resolve(root, `build/${name}/index.html`), 'utf8')
  for (const [, src] of html.matchAll(/src="(images\/[^"]+)"/g)) shrink(decodeURI(src))

  const dir = resolve(root, `build/${name}-netprint`)
  mkdirSync(dir, { recursive: true })
  const imagesLink = resolve(dir, 'images')
  if (!existsSync(imagesLink)) symlinkSync('../netprint-images', imagesLink)
  writeFileSync(resolve(dir, 'index.html'), html)
}

// 2. PDF 化
execFileSync('npx', ['vivliostyle', 'build', '-c', 'vivliostyle.netprint.config.js'], { cwd: root, stdio: 'inherit' })

// 3. 中綴じの面付け。1枚目の表 = [最終ページ | 1]、裏 = [2 | 最終-1] …を外側の紙から順に並べる
for (const name of patternNames) {
  const input = await PDFDocument.load(readFileSync(resolve(root, `build/${name}-netprint.pdf`)))
  const output = await PDFDocument.create()
  output.setTitle(`${input.getTitle() ?? ''}（ネットプリント試作用）`)

  const pages = input.getPages()
  const n = pages.length
  if (n % 4 !== 0) throw new Error(`ページ数が4の倍数ではありません: ${n}`)
  const trims = pages.map(page => page.getTrimBox())
  const embedded = await output.embedPages(pages, trims.map(({ x, y, width, height }) => ({
    left: x, bottom: y, right: x + width, top: y + height,
  })))
  const { width: w, height: h } = trims[0]

  for (let s = 0; s < n / 4; s++) {
    const front = [n - 1 - 2 * s, 2 * s]
    const back = [2 * s + 1, n - 2 - 2 * s]
    for (const [left, right] of [front, back]) {
      const sheet = output.addPage([w * 2, h])
      sheet.drawPage(embedded[left], { x: 0, y: 0 })
      sheet.drawPage(embedded[right], { x: w, y: 0 })
    }
  }

  const dest = resolve(root, `output/${name}-netprint.pdf`)
  writeFileSync(dest, await output.save())
  const mb = (statSync(dest).size / 1024 / 1024).toFixed(1)
  console.log(`output/${name}-netprint.pdf: A3 ${n / 4}枚・両面 ${output.getPageCount()}面（${mb}MB）`)
}
