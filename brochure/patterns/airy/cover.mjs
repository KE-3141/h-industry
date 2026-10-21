/**
 * パターン B「エアリー」の表紙：白地に余白を大きくとり、コピーは縦組みで小さく置く。
 * 丁寧さ・寄り添う感じ・多くを語らない信頼感。
 */
import { brochure, company, esc, img, logo } from '../../scripts/lib.mjs'

export const coverImage = brochure.cover.image.airy

export const cover = () => `
  <figure class="cover__photo"><img src="${img(coverImage)}" alt=""></figure>
  <h1 class="cover__copy">${brochure.cover.catchcopy.map(esc).join('<br>')}</h1>
  <div class="cover__body">
    <p class="cover__label">${esc(brochure.cover.label)}</p>
    <p class="cover__business">${esc(company.businessTypes)}</p>
  </div>
  <div class="cover__foot">
    ${logo}
    <p class="cover__area">創業 1974年 ／ ${esc(company.area)}全域対応</p>
  </div>`
