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

/** 縮小後の長辺（px）。表紙の写真で 120dpi 程度（コンビニのコピー機なら十分） */
const maxPixels = 1000
const imagesDir = resolve(root, 'build/netprint-images')

/**
 * public/images の写真を縮小して imagesDir に置き、HTML から参照するパスを返す（作成済みならそのまま使う）。
 * 透過のない PNG（写真）は JPEG にする（PNG のままだと容量が大きい）
 */
const shrink = (path) => {
  const src = resolve(repo, 'public', path)
  const [width, height, alpha] = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', '-g', 'hasAlpha', src], { encoding: 'utf8' })
    .match(/\S+$/gm).slice(1)
  const toJpeg = /\.png$/i.test(path) && alpha === 'no'
  const outPath = toJpeg ? `${path}.jpg` : path
  const dest = resolve(imagesDir, outPath.replace(/^images\//, ''))
  if (existsSync(dest)) return outPath
  mkdirSync(dirname(dest), { recursive: true })
  const args = Math.max(Number(width), Number(height)) > maxPixels ? ['-Z', String(maxPixels)] : []
  if (toJpeg) args.push('-s', 'format', 'jpeg')
  execFileSync('sips', [...args, '-s', 'formatOptions', '60', src, '--out', dest], { stdio: 'ignore' })
  return outPath
}

// 1. 縮小した写真を参照する HTML を build/<パターン>-netprint/ に作る
for (const name of patternNames) {
  const html = readFileSync(resolve(root, `build/${name}/index.html`), 'utf8')
    .replace(/src="(images\/[^"]+)"/g, (_, src) => `src="${encodeURI(shrink(decodeURI(src)))}"`)

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
