# コーディングルール — 平山工業コーポレートサイト

## 1. コンポーネント設計：アトミックデザイン

`components/` はアトミックデザインで構成する。

```
components/
  atoms/        最小単位のUI（ボタン・アイコンなど）
  molecules/    atoms の組み合わせ（カード・見出しブロック・ページヒーローなど）
  organisms/    セクション・ヘッダー・フッターなどの複合コンポーネント
pages/          Nuxt の pages/ ディレクトリ
```

`nuxt.config.ts` で `pathPrefix: false` を設定しているため、
サブディレクトリに関わらずファイル名のみで参照できる。

```vue
<!-- OK: ディレクトリ名なしで使用 -->
<AppButton />         <!-- components/atoms/AppButton.vue -->
<SectionHeading />    <!-- components/molecules/SectionHeading.vue -->
<PageHero />          <!-- components/molecules/PageHero.vue -->
<CtaSection />        <!-- components/organisms/CtaSection.vue -->
```

新しいコンポーネントを追加する際は、適切な階層に配置すること。

---

## 2. コンポーネントの共通化（DRYルール）

**同じ見た目のマークアップを繰り返さない。** 同一パターンが2箇所以上に出現したら共通コンポーネントに切り出す。

### 抽出の判断基準

| 状況 | 対応 |
|---|---|
| 同じマークアップが2ファイル以上に出現する | 即座に共通コンポーネントへ |
| 1ファイル内に同パターンが2回以上出現する | `v-for` + データ配列に統一する |
| ページ末尾の CTA ブロック | `<CtaSection />` を使う（直書き禁止） |
| 内部ページのヒーローヘッダー | `<PageHero />` を使う（直書き禁止） |
| セクション見出し（英語ラベル + h2） | `<SectionHeading />` を使う（直書き禁止） |
| コンテンツ内の別ページ誘導リンク | `<SlideLink />` を使う（`NuxtLink` + `IconArrow` 直書き禁止） |

### 既存の共通コンポーネント

| コンポーネント | 用途 |
|---|---|
| `AppButton` | リンク・ボタン（`to` / `href` / なし で自動切替） |
| `SlideLink` | コンテンツ内の別ページ誘導テキストリンク（ホバーで右スライド） |
| `IconArrow` | 右矢印アイコン |
| `IconPhone` | 電話アイコン |
| `SectionHeading` | セクション見出し（英語ラベル + h2） |
| `FeatureCard` | アイコン付き特長カード |
| `BusinessCard` | 事業紹介カード（画像・タイトル・説明・リンク） |
| `PageHero` | 内部ページ共通ヒーロー（ダーク背景 + h1 + 説明文） |
| `CtaSection` | ページ末尾 CTA（電話番号 + お問い合わせボタン） |
| `AppHeader` | グローバルヘッダー |
| `AppFooter` | グローバルフッター |

### `SlideLink` の使い方

コンテンツ内で別ページへ誘導するテキストリンク（「〜をくわしく見る」「詳しく見る」など）は必ず `SlideLink` を使う。ホバー時に右スライドするアニメーションと矢印アイコンが自動で付く。

```vue
<!-- ライト背景（primary カラー） -->
<SlideLink to="/company/" class="inline-flex items-center text-primary-600 font-semibold hover:text-primary-800 transition-colors">
  会社概要をくわしく見る
</SlideLink>

<!-- ダーク背景（白） -->
<SlideLink to="/about/" class="inline-flex items-center text-white font-semibold text-sm">
  強みをくわしく見る
</SlideLink>
```

- `to` prop: リンク先（必須）
- テキストカラー・フォント・余白は `class` 属性で指定（`inheritAttrs` により root に付与される）
- `#prefix` スロット: スライドせず固定したい要素（番号など）を配置できる
- `AppButton` との使い分け: `AppButton` はアクション（お問い合わせ・採用情報など）、`SlideLink` はコンテンツ内の参照誘導に使う

---

## 3. 固定値の管理

**コード内にデータを直接書かない。** 全ての共有データは composable に集約する。

| データ種別 | ファイル |
|---|---|
| 会社情報（社名・住所・電話番号など） | `composables/useSiteContent.ts` |
| ナビゲーション項目 | `composables/useSiteContent.ts` |
| 施工実績・強み・取引先などのコンテンツ一覧 | `composables/useSiteContent.ts` |

```vue
<script setup lang="ts">
const { company, navItems } = useSiteContent()
</script>

<template>
  <a :href="`tel:${company.telRaw}`">{{ company.tel }}</a>
</template>
```

### NG パターン

```vue
<!-- NG: 電話番号がコンポーネントにハードコードされている -->
<a href="tel:0336467450">03-3646-7450</a>

<!-- OK: composable から参照する -->
<a :href="`tel:${company.telRaw}`">{{ company.tel }}</a>
```

固定値の変更は `composables/useSiteContent.ts` 1ファイルで完結させる。

> **注意**: `useSiteConfig` という名前は `@nuxtjs/sitemap` が依存する
> `nuxt-site-config` パッケージと衝突する。このプロジェクトでは
> `useSiteContent` を使う。

---

## 4. TypeScript

- 全コンポーネントで `<script setup lang="ts">` を使用する
- Props は `interface` で型定義し `defineProps<Props>()` で宣言する
- オプションの Props には `withDefaults` でデフォルト値を設定する
- `any` は使わない。型が不明な場合は `unknown` を使う

```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
})
</script>
```

---

## 5. スタイリング

- **Tailwind CSS ユーティリティクラスのみ**使用する
- `style=""` 属性は Tailwind で表現できない場合のみ許容する
  （グリッドテンプレート・複雑な `background-image` など）
- カラートークンは `assets/css/app.css` の `@theme` に定義済みのものを使う
  - `primary-*` : ネイビーブルー（信頼・誠実）
  - `accent-*`  : スチールオレンジ（建設業・行動喚起）
  - `neutral-*` : スチールグレー（テキスト・ボーダー）
- **マジックナンバー禁止**（`px-[37px]` のような任意値は原則不可。Tailwind のスケールに合わせる）
- レスポンシブは `md:` / `lg:` のブレークポイントで対応し、モバイルファーストで書く

---

## 6. 画像の扱い

- `public/images/` に配置し、`usePublicUrl` composable 経由で参照する
- **ヒーロー画像**（LCP対象）: `fetchpriority="high"` + `loading="eager"`
- **それ以外の画像**: `loading="lazy"`
- `alt` 属性は必ず記述する（装飾のみの画像は `alt=""`）
- 大容量 PNG は `@nuxt/image`（IPX）を経由せず直接 `<img>` タグで配信する
  （dev 環境でのメモリ不足・IPC切断を防ぐため）

```vue
<script setup lang="ts">
const imageUrl = usePublicUrl('/images/rebar_work.png')
</script>

<template>
  <!-- ヒーロー（LCP） -->
  <img :src="heroUrl" alt="施工現場" fetchpriority="high" loading="eager" />

  <!-- それ以外 -->
  <img :src="imageUrl" alt="鉄筋工事の施工現場" loading="lazy" />
</template>
```

---

## 7. SEO / Head の管理

各ページで `useHead` または `useSeoMeta` を呼び、ページ固有のタイトルと
description を設定する。

```vue
<script setup lang="ts">
useHead({ title: '平山工業の強み | 平山工業株式会社' })
useSeoMeta({
  description: '創業50年超の実績が培った安全・品質・対応力。平山工業の3つのこだわりをご紹介します。',
})
</script>
```

- タイトル形式: `ページ名 | 平山工業株式会社`
- トップページのみ: `平山工業株式会社 | 鉄筋工事・溶接工事の専門企業`

---

## 8. アクセシビリティ

- セマンティックな HTML 要素を使う（`section`, `nav`, `article`, `header`, `footer` など）
- 各ページの `<h1>` は1つだけ（`PageHero` が `h1` を出力するため、
  それ以降は `h2` 以下を使う）
- アイコンのみのボタン・リンクには `aria-label` を付ける
- SVG アイコンには `aria-hidden="true"` を付けて読み上げから除外する

```vue
<!-- NG: aria-label なしのアイコンボタン -->
<a href="tel:0336467450"><IconPhone /></a>

<!-- OK -->
<a href="tel:0336467450" :aria-label="`電話する ${company.tel}`">
  <IconPhone aria-hidden="true" />
</a>
```

---

## 9. ファイル・命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `AppButton.vue`, `SectionHeading.vue` |
| Composable | camelCase, `use` プレフィックス | `useSiteContent.ts`, `usePublicUrl.ts` |
| ページ | kebab-case（Nuxt 規約） | `index.vue`, `about.vue` |
| 画像ファイル | snake_case | `hero_1.png`, `rebar_work.png` |

---

## 10. ディレクトリ構成（参考）

```
h-industry/
  assets/css/app.css            カラートークン・フォント設定（@theme）
  composables/
    useSiteContent.ts           共有データ（会社情報・ナビ・コンテンツ）
    usePublicUrl.ts             public/ 画像 URL の解決
  components/
    atoms/
      AppButton.vue             ボタン（variant: primary / secondary / ghost）
      IconArrow.vue             右矢印アイコン
      IconPhone.vue             電話アイコン
    molecules/
      SectionHeading.vue        セクション見出し（英語ラベル + h2）
      FeatureCard.vue           特長カード（アイコン + タイトル + 説明）
      PageHero.vue              内部ページ共通ヒーロー
    organisms/
      AppHeader.vue             グローバルヘッダー
      AppFooter.vue             グローバルフッター
      CtaSection.vue            ページ末尾 CTA（電話番号 + お問い合わせボタン）
  pages/                        各ページ（index / about / business / ...）
  public/images/                静的画像ファイル
  docs/                         設計ドキュメント
```
