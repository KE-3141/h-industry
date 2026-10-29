/**
 * パターン A「クラシック」の表紙：写真を上半分に大きく、下は紺地に白抜きの大きなコピー。
 * サイトのデザインに沿った、力強い表紙。
 */
import { brochure, company, esc, img, logo } from '../../scripts/lib.mjs'

export const coverImage = brochure.cover.image.classic

export const cover = () => `
  <figure class="bleed cover__photo"><img src="${img(coverImage)}" alt=""></figure>
  <div class="cover__body">
    <h1 class="cover__copy">${brochure.cover.catchcopy.map(esc).join('<br>')}</h1>
    <p class="cover__business">${esc(company.businessTypes)}</p>
  </div>
  <div class="cover__foot">
    ${logo}
    <p class="cover__area">創業 1974年 ／ ${esc(company.area)}全域対応</p>
  </div>`
