/**
 * 確認用の見開き PDF を作る（入稿には output/<パターン>.pdf を使う）。
 * 引数なしなら全パターンの output/<パターン>-spread.pdf を作る。
 * 各ページを仕上がり線（TrimBox）で切り抜き、表紙・裏表紙は単ページ、
 * 中面は左右 2 ページを並べて、製本したときの見え方に近づける。
 */
import { readFile, writeFile } from 'node:fs/promises'
import { PDFDocument } from 'pdf-lib'
import { patternNames } from './patterns.mjs'

const spread = async (src, dest) => {
  const input = await PDFDocument.load(await readFile(src))
  const output = await PDFDocument.create()
  output.setTitle(`${input.getTitle() ?? ''}（見開き確認用）`)

  const pages = input.getPages()
  const trims = pages.map(page => page.getTrimBox())
  const embedded = await output.embedPages(pages, trims.map(({ x, y, width, height }) => ({
    left: x, bottom: y, right: x + width, top: y + height,
  })))

  const { width: w, height: h } = trims[0]
  const last = pages.length - 1

  // 表紙
  output.addPage([w, h]).drawPage(embedded[0])

  // 中面：P2-P3、P4-P5 …（偶数ページが左）
  for (let left = 1; left < last; left += 2) {
    const sheet = output.addPage([w * 2, h])
    sheet.drawPage(embedded[left], { x: 0, y: 0 })
    sheet.drawPage(embedded[left + 1], { x: w, y: 0 })
  }

  // 裏表紙
  output.addPage([w, h]).drawPage(embedded[last])

  await writeFile(dest, await output.save())
  console.log(`${dest}: ${output.getPageCount()}面（表紙・見開き${(last - 1) / 2}・裏表紙）`)
}

const [src, dest] = process.argv.slice(2)
if (src) await spread(src, dest ?? src.replace(/\.pdf$/, '-spread.pdf'))
else for (const name of patternNames) await spread(`output/${name}.pdf`, `output/${name}-spread.pdf`)
