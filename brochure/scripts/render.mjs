/**
 * パンフレットの HTML をパターンごとに build/<パターン>/index.html へ書き出す。
 * 中面のページはパターン共通で、表紙のマークアップは patterns/<パターン>/cover.mjs、
 * スタイルは patterns/<パターン>/brochure.css に分けている。PDF 化は vivliostyle.config.js が行う。
 * 1ページ = 1つの <section class="page">。
 */
import { existsSync, mkdirSync, symlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { brochure, company, esc, heading, img, logo, qr, root, site } from './lib.mjs'
import { patternNames } from './patterns.mjs'

// ─────────────────────────────────────────
// 中面の各ページ（パターン共通）
// ─────────────────────────────────────────

/**
 * 代表挨拶の地紋にする方眼。CSS グラデーションは CMYK 変換の対象外になるため、線を要素で並べる
 * （単位は mm、塗り足しぶんも含めて描く）
 */
const gridDeco = ({ width = 216, height = 303, step = 12 } = {}) => {
  const lines = []
  for (let x = 0; x <= width; x += step) lines.push(`<i class="grid-deco__v" style="left:${x}mm"></i>`)
  for (let y = 0; y <= height; y += step) lines.push(`<i class="grid-deco__h" style="top:${y}mm"></i>`)
  return `<div class="grid-deco" style="height:${height}mm">${lines.join('')}</div>`
}

const greeting = () => `
  <div class="content">
    ${heading('Message', site.greeting.title)}
    <div class="greeting__body">
      ${site.greeting.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
    </div>
    <div class="greeting__sign">
      <img class="greeting__face" src="${img(brochure.greeting.faceImage)}" alt="">
      <div>
        <p class="greeting__role">代表取締役社長</p>
        <img class="greeting__signature" src="${img(brochure.greeting.signImage)}" alt="${esc(company.ceo)}">
      </div>
    </div>
  </div>
  <div class="bleed-bottom stats">
    ${site.stats.map(s => `
      <div class="stats__item">
        <p class="stats__value">${esc(s.value)}<span>${esc(s.unit)}</span></p>
        <p class="stats__label">${esc(s.label)}</p>
      </div>`).join('')}
  </div>`

const history = () => `
  <div class="content">
    ${heading('History', '会社沿革')}
    <ol class="timeline">
      ${site.history.map(h => `
        <li class="timeline__item">
          <p class="timeline__year">${esc(h.step)}</p>
          <div class="timeline__body">
            <h3 class="timeline__title">${esc(h.title)}</h3>
            <p class="timeline__desc">${esc(h.description)}</p>
          </div>
        </li>`).join('')}
    </ol>
  </div>`

/** 写真の組（先頭を大きく、残りを右に縦積み）。事業内容と施工実績ピックアップで使う */
const photoSet = images => `
  <div class="photo-set">
    ${images.map(src => `<figure><img src="${img(src)}" alt=""></figure>`).join('')}
  </div>`

const business = () => {
  const [biz] = site.businesses
  const primary = biz.services.filter(s => s.primary)
  const others = biz.services.filter(s => !s.primary)
  return `
  <div class="content">
    ${heading('Business', '事業内容')}
    ${photoSet(brochure.business.images)}
    <article class="biz">
      <h3 class="biz__title">${esc(biz.title)}</h3>
      <p class="biz__desc">${esc(biz.description)}</p>
      <ul class="chips">${primary.map(s => `<li class="chip chip--primary">${esc(s.name)}</li>`).join('')}</ul>
      ${others.length ? `<p class="biz__others">その他：${others.map(s => esc(s.name)).join('・')}</p>` : ''}
    </article>
    <div class="worktypes">
      <p class="worktypes__title">対応工種・施工実績</p>
      <ul class="worktypes__list">${site.workTypes.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
    </div>
  </div>`
}

const strengths = () => `
  <div class="content">
    ${heading('Strength', '平山工業の3つの強み')}
    <p class="lead">${esc(brochure.strengths.lead)}</p>
    <ol class="strengths">
      ${site.strengths.map((s, i) => `
        <li class="strength">
          <div class="strength__head">
            <span class="strength__num">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="strength__title">${esc(s.title)}</h3>
          </div>
          <p class="strength__desc">${esc(s.description)}</p>
          <ul class="checklist">${s.highlights.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
        </li>`).join('')}
    </ol>
  </div>`

const workMeta = p => `
  <dl class="work__meta">
    <dt>所在地</dt><dd>${esc(p.location)}</dd>
    <dt>元請</dt><dd>${esc(p.client)}</dd>
  </dl>
  <ul class="tags">${p.businessTypes.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`

/** 施工実績のタイトル。content.ts の nameLines の区切りごとに折り返さない塊にする */
const projectName = p => (brochure.nameLines[p.key] ?? [p.name]).map(s => `<span>${esc(s.trimEnd())}</span>${s.endsWith(' ') ? ' ' : ''}`).join('')

/** 大きく見せる施工実績（メイン写真 + サブ写真2枚 + 紹介文） */
const pickup = ({ coverImage }) => `
  <div class="content">
    ${heading('Works', '施工実績')}
    ${pickupProjects(coverImage).map((p, i) => `
      <article class="pickup">
        ${photoSet(p.images)}
        <div class="pickup__text">
          <p class="pickup__num">PICK UP ${String(i + 1).padStart(2, '0')}</p>
          <h3 class="pickup__name">${projectName(p)}</h3>
          ${workMeta(p)}
          <p class="pickup__comment">${esc(p.comment)}</p>
        </div>
      </article>`).join('')}
  </div>`

const works = items => `
  <div class="content">
    <div class="works works--${items.length}">
      ${items.map(p => `
        <article class="work">
          <figure class="work__photo"><img src="${img(p.image)}" alt=""${p.focus ? ` style="object-position:${p.focus}"` : ''}></figure>
          <h3 class="work__name">${projectName(p)}</h3>
          ${workMeta(p)}
        </article>`).join('')}
    </div>
  </div>`

const companyProfile = () => {
  const rows = [
    ['社名', `${esc(company.name)}<br><span class="en">${esc(company.nameEn)}</span>`],
    ['代表取締役社長', esc(company.ceo)],
    ['専務取締役', esc(company.executive)],
    ['設立', company.established], // <br> を含む HTML
    ['資本金', esc(company.capital)],
    ['従業員数', `${esc(company.employees)}名`],
    ['所在地（本社）', `〒${esc(company.postalCode)}<br>${esc(company.address)}`],
    ['営業エリア', esc(company.areaLabel)],
    ['事業内容', esc(company.businessTypes)],
    ['建設業許可', esc(company.license)],
  ]
  return `
  <div class="content">
    ${heading('Company', '会社概要')}
    <table class="profile">
      ${rows.map(([th, td]) => `<tr><th>${th}</th><td>${td}</td></tr>`).join('')}
    </table>
    <div class="clients">
      <h3 class="clients__title">主要取引先<span>（順不同・敬称略）</span></h3>
      <ul class="clients__list">${site.clients.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
    </div>
  </div>`
}

/** 裏表紙（連絡先だけを全面に） */
const backCover = () => `
  <div class="bleed contact contact--back">
    <p class="contact__tagline">${esc(company.tagline)}</p>
    ${logo}
    <p class="contact__address">${esc(company.addressFull)}</p>
    <p class="contact__tel"><span>TEL</span>${esc(company.tel)}</p>
    <p class="contact__sub">FAX ${esc(company.fax)} ／ ${esc(company.hoursLabel)}</p>
    <div class="contact__qr">${qr}</div>
    ${brochure.siteUrl ? `<p class="contact__url">${esc(brochure.siteUrl.replace(/^https?:\/\/|\/$/g, ''))}</p>` : ''}
  </div>`

// ─────────────────────────────────────────
// ページ割り付け（施工実績の一覧ページは残り枠に自動で割り付ける）
// ─────────────────────────────────────────

const findProject = key => {
  const p = site.projects.find(x => x.key === key)
  if (!p) throw new Error(`content.ts: 施工実績 "${key}" が useSiteContent.ts にありません`)
  return p
}

/** 表紙に使った写真はピックアップから外す */
const pickupProjects = coverImage => brochure.pickupProjects.map(({ key, images, comment }) => {
  const p = findProject(key)
  return { ...p, comment, images: images.map(n => p.images[n]).filter(src => src && img(src) !== img(coverImage)) }
})

/** ピックアップ以外の実績をすべて一覧に出す */
const pickupKeys = new Set(brochure.pickupProjects.map(p => p.key))
for (const key of Object.keys(brochure.projectPhotos)) findProject(key)
for (const [key, lines] of Object.entries(brochure.nameLines)) {
  if (lines.join('') !== findProject(key).name) {
    throw new Error(`content.ts: nameLines "${key}" をつなげてもサイトのタイトル「${findProject(key).name}」と一致しません`)
  }
}
const projects = site.projects.filter(p => !pickupKeys.has(p.key)).map((p) => {
  const { image = 0, focus } = brochure.projectPhotos[p.key] ?? {}
  return { ...p, image: p.images[image] ?? p.images[0], focus }
})

const before = [greeting, history, business, strengths, pickup] // 表紙の後ろ
const after = [companyProfile, backCover]
const { totalPages, projectsPerPage } = brochure
const worksPageCount = totalPages - 1 - before.length - after.length

if (totalPages % 4 !== 0) {
  throw new Error(`totalPages は4の倍数にしてください（中綴じ）。現在: ${totalPages}`)
}
if (worksPageCount < 1 || projects.length > worksPageCount * projectsPerPage) {
  throw new Error(
    `施工実績 ${projects.length}件 が ${worksPageCount}ページ（最大 ${worksPageCount * projectsPerPage}件）に収まりません。`
    + ' content.ts の totalPages を4ページ増やすか、projectsPerPage を増やしてください。',
  )
}

// 件数がページ間でなるべく均等になるように分ける
const worksChunks = Array.from({ length: worksPageCount }, (_, i) => {
  const start = Math.round((projects.length * i) / worksPageCount)
  const end = Math.round((projects.length * (i + 1)) / worksPageCount)
  return projects.slice(start, end)
})

// ─────────────────────────────────────────
// パターンごとに書き出す
// ─────────────────────────────────────────

const render = async (patternName) => {
  const pattern = await import(`../patterns/${patternName}/cover.mjs`)
  const pages = [
    { name: 'cover', html: pattern.cover() },
    ...before.map(fn => ({ name: fn.name, html: fn(pattern) })),
    ...worksChunks.map(items => ({ name: 'works', html: works(items) })),
    ...after.map(fn => ({ name: fn.name, html: fn(pattern) })),
  ]

  // 小口側に縦書きで入れるセクション名。見出しのないページは直前のページのものを引き継ぐ
  let sideLabel = ''
  const body = pages.map(({ name, html }, i) => {
    const num = i + 1
    const isFrontCover = num === 1
    const isBackCover = num === totalPages
    // 中綴じ（左綴じ）: 偶数ページが見開きの左、奇数ページが右
    const side = num % 2 === 0 ? 'left' : 'right'
    sideLabel = html.match(/data-side-label="([^"]+)"/)?.[1] ?? sideLabel
    // 方眼の地紋は代表挨拶だけ
    const ground = name === 'greeting' ? gridDeco() : ''
    const deco = isFrontCover || isBackCover ? '' : `${ground}<p class="side-label">${esc(sideLabel)}</p>`
    const nombre = isFrontCover || isBackCover ? '' : `<p class="nombre">${String(num).padStart(2, '0')}</p>`
    return `<section class="page page--${name} page--${side}">${deco}${html}${nombre}</section>`
  }).join('\n')

  const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${esc(company.name)} 会社案内</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&family=Shippori+Mincho:wght@500;700;800&display=block">
<link rel="stylesheet" href="../../patterns/${patternName}/brochure.css">
</head>
<body>
${body}
</body>
</html>
`

  const dir = resolve(root, 'build', patternName)
  mkdirSync(dir, { recursive: true })
  const imagesLink = resolve(dir, 'images')
  if (!existsSync(imagesLink)) symlinkSync('../../../public/images', imagesLink)
  writeFileSync(resolve(dir, 'index.html'), html)
  console.log(`build/${patternName}/index.html: ${pages.length}ページ（施工実績 ${projects.length}件 / ${worksPageCount}ページ）`)
}

for (const name of patternNames) await render(name)
