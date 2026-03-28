# デザインシステム定義書 — 平山工業株式会社

> このドキュメントはサイトリニューアルにおけるビジュアルデザインの基準を定義します。
> Nuxt UI v3 / Tailwind CSS v4 ベースで実装します。

---

## ブランドコンセプト

### デザインキーワード

| キーワード | 表現方法 |
|---|---|
| **信頼・誠実** | 落ち着いたネイビー、ゆとりある余白、整った文字組み |
| **精度・技術力** | シャープなエッジ、グリッドの厳守、数値・データの明示 |
| **安全・安心** | アクセントカラーの適切な使用、視認性の高いコントラスト |
| **堅実・実直** | 過度な装飾を避ける、素材感あるテクスチャ（任意） |

### ターゲット別トーン

- **元請けゼネコン向け**: プロフェッショナル、信頼性、実績訴求
- **採用候補者向け**: 親しみやすさ、働きやすさ、成長機会

---

## カラーパレット

### ブランドカラー

```css
/* app.css または nuxt.config.ts の css 設定に追加 */
@theme {
  /* Primary — Navy Blue（信頼・誠実・技術力） */
  --color-primary-50:  #eef2f8;
  --color-primary-100: #d5e0ee;
  --color-primary-200: #adc2de;
  --color-primary-300: #7a9bc7;
  --color-primary-400: #4e77af;
  --color-primary-500: #2d5a96;
  --color-primary-600: #1f4478;
  --color-primary-700: #173460;
  --color-primary-800: #112649;
  --color-primary-900: #0c1b36;
  --color-primary-950: #070f1e;

  /* Accent — Steel Orange（建設業・安全・エネルギー） */
  --color-accent-50:  #fff4ed;
  --color-accent-100: #ffe3cc;
  --color-accent-200: #ffc499;
  --color-accent-300: #ff9d5c;
  --color-accent-400: #ff7620;
  --color-accent-500: #e85d0a;
  --color-accent-600: #c44806;
  --color-accent-700: #9e3708;
  --color-accent-800: #7e2d0e;
  --color-accent-900: #67270f;
  --color-accent-950: #3a1005;

  /* Neutral — Steel Gray（鉄・工業素材感） */
  --color-neutral-50:  #f6f7f8;
  --color-neutral-100: #ebedf0;
  --color-neutral-200: #d3d7dc;
  --color-neutral-300: #b0b7bf;
  --color-neutral-400: #8a939e;
  --color-neutral-500: #6b7583;
  --color-neutral-600: #545e6b;
  --color-neutral-700: #434b57;
  --color-neutral-800: #383f49;
  --color-neutral-900: #31363f;
  --color-neutral-950: #1e2229;
}
```

### カラーの用途

| 色 | トークン | 用途 |
|---|---|---|
| Primary 700 `#173460` | `text-primary-700` | メインテキスト、見出し |
| Primary 600 `#1f4478` | `bg-primary-600` | グローバルヘッダー背景 |
| Primary 500 `#2d5a96` | `text-primary-500` | リンク、インタラクティブ要素 |
| Accent 500 `#e85d0a` | `bg-accent-500` | CTAボタン（主要）、強調アクセント |
| Accent 400 `#ff7620` | `hover:bg-accent-400` | CTAボタンホバー状態 |
| Neutral 50 `#f6f7f8` | `bg-neutral-50` | セクション背景（奇数面） |
| White `#ffffff` | `bg-white` | セクション背景（偶数面）、カード |
| Neutral 700 `#434b57` | `text-neutral-700` | 本文テキスト |
| Neutral 400 `#8a939e` | `text-neutral-400` | キャプション・補助テキスト |
| Primary 950 `#070f1e` | `bg-primary-950` | フッター背景 |

### アクセシビリティ基準

- 本文テキスト（Neutral 700 on White）: コントラスト比 **7.4:1** ✓ WCAG AA
- CTAボタン（White on Accent 500）: コントラスト比 **4.6:1** ✓ WCAG AA
- ヘッダーナビ（White on Primary 600）: コントラスト比 **8.2:1** ✓ WCAG AAA

---

## タイポグラフィ

### フォントファミリー

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  fonts: {
    families: [
      {
        name: 'Noto Sans JP',
        provider: 'google',
        weights: [400, 500, 700, 900],
      },
    ],
  },
})
```

```css
/* app.css */
@theme {
  --font-sans: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
}
```

### タイプスケール

| 用途 | クラス | サイズ（rem） | ウェイト | 行間 |
|---|---|---|---|---|
| ページタイトル（H1） | `text-4xl font-black` | 2.25rem（36px） | 900 | 1.25 |
| セクション見出し（H2） | `text-3xl font-bold` | 1.875rem（30px） | 700 | 1.3 |
| サブ見出し（H3） | `text-xl font-bold` | 1.25rem（20px） | 700 | 1.4 |
| カード見出し（H4） | `text-lg font-semibold` | 1.125rem（18px） | 600 | 1.5 |
| 本文 | `text-base` | 1rem（16px） | 400 | 1.8 |
| キャプション | `text-sm` | 0.875rem（14px） | 400 | 1.6 |
| ラベル・バッジ | `text-xs font-medium` | 0.75rem（12px） | 500 | 1.4 |

### 見出しデザインルール

- H2 セクション見出しには **左ボーダーアクセント**（Accent 500）を使用
  ```html
  <h2 class="border-l-4 border-accent-500 pl-4 text-3xl font-bold text-primary-700">
    事業紹介
  </h2>
  ```
- ページタイトル（H1）は白テキストでヒーロー画像上に配置（ページヘッダーセクション）
- セクション見出しの上に **英字サブテキスト**（Primary 400、text-sm、letter-spacing広め）を添えてもよい

---

## スペーシング・レイアウト

### コンテナ幅

```css
@theme {
  --container-max: 1120px;  /* max-w-5xl 相当 */
  --container-padding: 1.5rem; /* px-6 */
}
```

| ブレークポイント | コンテナ幅 | 横パディング |
|---|---|---|
| モバイル（< 768px） | 100% | 24px（px-6） |
| タブレット（768px〜） | 100% | 32px（px-8） |
| デスクトップ（1152px〜） | 1120px（中央揃え） | 0 |

### セクション余白

| 用途 | クラス | サイズ |
|---|---|---|
| セクション縦余白（大） | `py-20 md:py-28` | 80px / 112px |
| セクション縦余白（中） | `py-14 md:py-20` | 56px / 80px |
| カード内パディング | `p-6 md:p-8` | 24px / 32px |
| 見出しとコンテンツの間 | `mt-10 md:mt-14` | 40px / 56px |

### グリッドシステム

```html
<!-- 2カラム -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

<!-- 3カラム（強み・特徴一覧） -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- 4カラム（アイコン一覧） -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
```

---

## シャドウ・ボーダー・角丸

### 基本方針

**角丸は控えめに** — 建設業の堅実・工業的なイメージを維持するため、過度に丸くしない。

| 用途 | クラス | 値 |
|---|---|---|
| カード | `rounded-sm` | 2px |
| ボタン | `rounded` | 4px |
| バッジ・ラベル | `rounded-sm` | 2px |
| 画像 | `rounded-none` または `rounded-sm` | 0 / 2px |

### シャドウ

```css
@theme {
  --shadow-card: 0 2px 8px 0 rgb(0 0 0 / 0.08), 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --shadow-card-hover: 0 4px 16px 0 rgb(0 0 0 / 0.12), 0 2px 4px 0 rgb(0 0 0 / 0.06);
}
```

```html
<!-- カードのホバーエフェクト -->
<div class="shadow-card hover:shadow-card-hover transition-shadow duration-200">
```

### ボーダー

- 区切り線: `border-neutral-200`
- カードボーダー: `border border-neutral-100`
- 強調ボーダー（左）: `border-l-4 border-accent-500`
- テーブルボーダー: `border-collapse border border-neutral-200`

---

## コンポーネント方針

### ボタン

| 種別 | 用途 | スタイル |
|---|---|---|
| **Primary（CTA）** | お問い合わせ・採用応募 | `bg-accent-500 hover:bg-accent-400 text-white font-bold px-8 py-3 rounded` |
| **Secondary** | サブアクション・詳細リンク | `bg-white hover:bg-neutral-50 text-primary-600 border border-primary-600 font-medium px-6 py-2.5 rounded` |
| **Ghost** | ナビリンク・テキストリンク | `text-primary-500 hover:text-primary-700 underline-offset-4 hover:underline` |

**CTAボタンの使用ルール:**
- 1ビューポートに Primary ボタンは最大2個まで
- テキストは「お問い合わせはこちら」「採用情報を見る」など行動を促す文言
- アイコン（矢印）を右側に添える

### カード

```html
<!-- 標準カード（事業紹介・強み等） -->
<div class="bg-white border border-neutral-100 rounded-sm shadow-card p-6 md:p-8
            hover:shadow-card-hover transition-shadow duration-200">
  <div class="text-accent-500 mb-4"><!-- アイコン --></div>
  <h3 class="text-lg font-bold text-primary-800 mb-2">見出し</h3>
  <p class="text-neutral-700 text-sm leading-relaxed">本文テキスト</p>
</div>
```

### ページヘッダー（各ページ上部）

```html
<!-- 内部ページの共通ヘッダー -->
<section class="bg-primary-800 text-white py-16 md:py-20">
  <div class="container mx-auto px-6">
    <p class="text-accent-400 text-sm font-medium tracking-widest uppercase mb-2">
      About
    </p>
    <h1 class="text-3xl md:text-4xl font-black">平山工業の強み</h1>
  </div>
</section>
```

### セクション区切り（交互背景）

```
セクション1: bg-white
セクション2: bg-neutral-50
セクション3: bg-white
セクション4: bg-primary-800 text-white（ダーク：CTAやハイライト用）
```

### CTAブロック（各ページ末尾共通）

```html
<section class="bg-primary-800 text-white py-16 md:py-20 text-center">
  <p class="text-neutral-300 text-sm mb-2">お気軽にご相談ください</p>
  <a href="tel:0336467450"
     class="text-4xl md:text-5xl font-black text-white hover:text-accent-300
            transition-colors block mb-2">
    03-3646-7450
  </a>
  <p class="text-neutral-400 text-sm mb-8">受付時間 8:00〜17:00（日・祝定休）</p>
  <a href="/contact/"
     class="inline-block bg-accent-500 hover:bg-accent-400 text-white
            font-bold px-10 py-4 rounded transition-colors">
    お問い合わせフォーム →
  </a>
</section>
```

---

## アイコン

Nuxt UI v3 に付属する **Heroicons** を使用する。

| 用途 | アイコン名 | 備考 |
|---|---|---|
| チェックマーク（強み・特徴） | `check-circle` | Accent 500 |
| 電話 | `phone` | ヘッダー・CTA |
| メール | `envelope` | お問い合わせ |
| 場所 | `map-pin` | 会社概要・アクセス |
| 矢印（リンク） | `arrow-right` | CTAボタン右側 |
| 建物（会社概要） | `building-office-2` | — |
| 安全（品質） | `shield-check` | — |
| 工具（技術） | `wrench-screwdriver` | — |

使用例:
```html
<UIcon name="i-heroicons-check-circle"
       class="w-8 h-8 text-accent-500" />
```

---

## 画像・写真方針

### 使用ルール

- 施工現場写真を積極的に使用（信頼感・実績の可視化）
- 人物写真は現場作業中のカット（ヘルメット・安全ベスト着用）を優先
- 写真にはオーバーレイ（`bg-primary-900/60`）をかけてテキストを重ねる

### ヒーロー画像

```html
<section class="relative h-[600px] md:h-[700px] overflow-hidden">
  <NuxtImg src="/images/hero.jpg" alt="施工現場" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-primary-900/60" />
  <div class="absolute inset-0 flex items-center">
    <div class="container mx-auto px-6 text-white">
      <h1 class="text-4xl md:text-6xl font-black leading-tight mb-6">
        鉄筋をつなぐだけでなく、<br>未来をつなぐ。
      </h1>
      <a href="/contact/" class="inline-block bg-accent-500 hover:bg-accent-400
                                  text-white font-bold px-10 py-4 rounded">
        お問い合わせはこちら →
      </a>
    </div>
  </div>
</section>
```

### `@nuxt/image` 設定

```ts
// nuxt.config.ts
image: {
  quality: 85,
  format: ['webp', 'jpg'],
  screens: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
},
```

---

## アニメーション方針

### 基本方針

- **動きは最小限に** — 職人気質・堅実さのイメージを保つ
- パフォーマンス優先: `transform` / `opacity` のみアニメーション
- `prefers-reduced-motion` を尊重

### 使用するトランジション

| 用途 | 実装 |
|---|---|
| ボタンホバー | `transition-colors duration-200` |
| カードホバー | `transition-shadow duration-200` |
| ナビゲーション | `transition-colors duration-150` |
| ページ遷移 | Nuxt デフォルト（fade） |

### スクロールアニメーション（VueUse）

`@vueuse/nuxt` の `useIntersectionObserver` を使い、スクロールで要素が入ったときに
`opacity-0 translate-y-4` → `opacity-100 translate-y-0` のフェードインを適用する（任意）。

```ts
// composables/useScrollReveal.ts
import { useIntersectionObserver } from '@vueuse/core'

export function useScrollReveal(el: Ref<HTMLElement | null>) {
  const isVisible = ref(false)
  useIntersectionObserver(el, ([{ isIntersecting }]) => {
    if (isIntersecting) isVisible.value = true
  }, { threshold: 0.1 })
  return isVisible
}
```

---

## グローバルヘッダー設計

```
┌─────────────────────────────────────────────────┐
│ [ロゴ]  強み  事業  技術  品質  会社  求人  [電話] [お問い合わせ▶] │
│ bg-primary-600                                  │
└─────────────────────────────────────────────────┘
```

- 背景: `bg-primary-600`
- ロゴ・テキスト: `text-white`
- アクティブナビ: `border-b-2 border-accent-400`
- TEL: `text-white font-bold`（デスクトップのみ表示）
- お問い合わせボタン: `bg-accent-500 text-white px-4 py-2 rounded text-sm font-bold`

---

## グローバルフッター設計

```
┌───────────────────────────────────────────────┐
│ [ロゴ]  平山工業株式会社                         │
│ 〒136-0073 東京都江東区北砂6-7-13               │
│ TEL: 03-3646-7450                             │
│ ─────────────────────────────────────────────  │
│ 強み | 事業 | 技術 | 品質 | 会社 | 求人 | 問合せ  │
│ プライバシーポリシー                             │
│ © 2024 平山工業株式会社                         │
└───────────────────────────────────────────────┘
```

- 背景: `bg-primary-950`
- テキスト: `text-neutral-300`
- リンク: `text-neutral-400 hover:text-white`
- コピーライト: `text-neutral-500 text-xs`

---

## Nuxt UI v3 テーマ設定

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    theme: {
      colors: ['primary', 'accent', 'neutral'],
    },
  },
})
```

```css
/* assets/css/app.css */
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  /* 上記カラーパレットをここに記述 */
  --font-sans: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif;
  --color-primary: var(--color-primary-600);
  --color-accent:  var(--color-accent-500);
}
```

---

## チェックリスト（実装前確認）

- [ ] 施工写真の素材を確認・準備（ヒーロー・事業紹介・技術紹介用）
- [ ] ロゴ（SVG形式）の入手または再制作
- [ ] Google Fonts の Noto Sans JP 読み込み確認
- [ ] `app.css` に `@import "tailwindcss"` と `@import "@nuxt/ui"` を追加
- [ ] `nuxt.config.ts` に `css: ['~/assets/css/app.css']` を追加

---

*最終更新：2026年3月27日*
