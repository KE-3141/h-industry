# 線画アイコンキット（illustkit・平山工業版）

Magnific（Freepik）で建設系の**線画アイコン**をさがし、ダウンロードして1個ずつの SVG に切り分け、
**サイトのテーマ色にそろえて**サイトとパンフレットに書き出すための道具です。
UKARU の illustkit（`_tools/illustkit`）を元に、このプロジェクト用にアレンジしています（元のキットとライブラリは別）。

## テイストの決まり

- **線画（アウトライン）のアイコン**だけを使う。色面の多いフラット・アイソメトリック・写真風は使わない。
- テイストをそろえるため、**アイコンセット（vector の作品）を中心**にする。採用したセットは `config.json` の `sets` に番号を書く（候補の一覧に「採用セット」と出る）。
- セットにないものだけ、単体のアイコン（`content_type: "icon"`, `shape: "outline"`）で補う。そのときは `ik show` で採用セットのアイコンとならべ、**線の太さ・角の丸さ・密度**が近いものだけを選ぶ（線の太さを自動ではそろえられないため、目で確かめる）。
- 色は登録のときに自動で変える（下の「色」）。元の色で選ばなくてよい。

## ルール

1. **ダウンロードの前に、かならずユーザーに確認する。** 候補の画像（`candidates.png`）を見せ、AskUserQuestion で「どの作品をダウンロードするか」を聞く。OK はそのとき見せた作品にだけ有効。
2. **取得の前に、手持ちで足りないかを確かめる。** `ik find`・`library/catalog/<ジャンル>.png` で、そのまま使えるものをさがす。
3. 登録した SVG（`library/illust/`）と、書き出した SVG（`public/images/illust/`・`assets/illust/`）は直接書きかえない。色は `config.json` の `palette` を変えて `ik export`、形は部品を作りなおして `register --force`。
4. ライセンス：Premium プランの素材として使う（作者表記は不要の想定）。外部に出す前に、念のため Magnific のライセンスを確かめる。

## フォルダの中身

```
tools/illustkit/
  README.md        ← この文書
  ik               ← コマンド（bash tools/illustkit/ik <コマンド>）
  setup.sh         ← 最初に1回だけ: Python と Ghostscript の環境を作る（UKARU のキットと共有）
  config.json      ← 採用セット・色（palette）・書き出し先・ジャンル
  illustkit/       ← Python のパッケージ（recolor.py が色の置きかえ）
  library/
    catalog.json   ← 登録したアイコンの一覧（名前・ジャンル・タグ・出どころ）
    catalog/<ジャンル>.png ← ジャンルごとの一覧（テーマ色にしたもの）
    illust/<ジャンル>/<名前>.svg ← 登録したアイコン（元の色のまま）
    sources/<作品番号>/ ← ダウンロードした作品（original・files・work は git に入れない）

書き出し先（登録・ik export で自動で作られる）:
  public/images/illust/<ジャンル>/<名前>.svg  ← 色を固定（<img>・パンフレット用）
  assets/illust/<ジャンル>/<名前>.svg         ← currentColor（<IllustIcon> 用）
```

## 準備（最初に1回だけ）

```
bash tools/illustkit/setup.sh
```

`~/.local/share/illustkit/env` に Python・Ghostscript・PyMuPDF・Pillow を入れます（UKARU のキットで入れていれば不要）。確認用の画像は Chrome で描くので、Chrome も必要です。

## アイコンを手に入れる流れ

以下、`ik` は `bash tools/illustkit/ik` のことです。

1. **ライブラリをさがす:** `ik find クレーン`（日本語でも英語でもよい）。あれば 8 へ。
2. **Magnific で検索する（無料）:**
   - セット: `stock_search` を `content_type: "vector"`、ことばは `"construction line icons set"` のように。採用セットの作者のほかの作品もさがすとそろいやすい。
   - 単体: `stock_search` を `content_type: "icon"`, `shape: "outline"`。
3. **作者・形式を確かめる（無料）:** `stock_get`（単体は `type: "icon"`）。
4. **候補の一覧を作る:** 作業用の一時フォルダに JSON を書き、`ik candidates <JSON> --out <フォルダ>`。作品ごとに `meta-<番号>.json`（`title`・`author`・`url`・`premium`・`creditCost`）も書いておく。
5. **ユーザーに確認する:** `candidates.png` を見せ、AskUserQuestion で聞く。
6. **ダウンロードして取りこむ:** OK の作品だけ `stock_download`（セットは `type="vector", format="source"`、単体は `type="icon"`）を呼び、すぐに
   ```
   ik fetch <作品番号> --url '<downloadUrl>' --meta <フォルダ>/meta-<番号>.json
   ```
7. **切り分ける:**
   - セット: `ik extract <作品番号>`。`work/*-overview.png` と `work/parts.png` を**かならず目で見て**確かめる。アイコンの下の文字（ラベル）が別の部品になったら登録しない。
   - 単体: `ik extract <作品番号> --whole`（分けずに1つの部品にする）。
8. **登録する:** 使えそうな部品を**全部**登録する（次から使い回すため）。
   ```
   ik register <作品番号> <JSON>
   ```
   ```json
   [{"part": "p03", "genre": "machines", "slug": "tower-crane", "ja": ["クレーン", "タワークレーン", "揚重"],
     "en": ["crane", "tower crane"]}]
   ```
   登録すると、テーマ色にして `public/images/illust/` と `assets/illust/` に書き出し、`library/catalog/<ジャンル>.png` を作りなおす。
9. **使う:** 下の「サイト・パンフレットで使う」。

## 色

`config.json` の `palette` が `assets/css/app.css` の `@theme` と対応しています。

| 元の色 | 役割 | `<img>`・パンフレット | `<IllustIcon>` |
|---|---|---|---|
| 暗い色・灰色（線） | line | primary-700 `#173460` | `currentColor`（`text-*` で指定） |
| 鮮やかな色 | accent | accent-500 `#e85d0a` | `var(--illust-accent)` |
| 明るい色（うすい面） | tint | primary-100 `#d5e0ee` | `var(--illust-tint)` |
| 白（抜き） | paper | 白のまま | `var(--illust-paper)` |

テーマ色を変えたときは `palette` を直して `ik export`（全部を書き出しなおす）。

## サイト・パンフレットで使う

```vue
<!-- ライト背景 -->
<IllustIcon name="machines/tower-crane" class="size-12 text-primary-700" />

<!-- ダーク背景：線を白に、抜きを背景色に -->
<IllustIcon name="machines/tower-crane"
  class="size-12 text-white [--illust-paper:var(--color-primary-800)] [--illust-tint:var(--color-primary-600)]" />

<!-- 意味のあるアイコン（文字の代わり）は label を付ける。装飾なら付けない（aria-hidden になる） -->
<IllustIcon name="safety/helmet" label="安全管理" class="size-10 text-primary-700" />
```

- `name` は `ik find` で出る `<ジャンル>/<名前>`。アイコン名をデータとして持つときは `composables/useSiteContent.ts` に書く。
- 色を固定した版は `usePublicUrl('/images/illust/machines/tower-crane.svg')` で `<img>` にも使える。
- パンフレット（`brochure/`）では `images/illust/<ジャンル>/<名前>.svg`（`build/images` は `public/images` へのリンク）。

## ジャンル・名前・タグ

ジャンルは `config.json` の `genres` から選びます。どれにも合わないものが続けて出てきたら、ユーザーに確認してから足します。

| ジャンル | 入れるもの |
|---|---|
| `machines` | 重機・車両（クレーン・ショベル・ミキサー車など） |
| `structures` | 構造物・建物（橋・ダム・ビル・トンネル・擁壁など） |
| `materials` | 資材・工具（鉄筋・型枠・足場・コンクリート・工具） |
| `safety` | 安全・品質（ヘルメット・標識・点検・チェック） |
| `people` | 人（作業員・技術者・スタッフ） |
| `business` | 業務・会社（図面・契約・会議・電話・書類） |
| `misc` | その他 |

- 名前（slug）は英小文字・数字・ハイフン。ジャンルがちがっても同じ名前は使えない。
- `ja`・`en` のタグには、描いてあるものに加えて**サイトで使いそうな場面のことば**（安全管理・品質・施工・採用 など）も入れる。
- ジャンルを変える: `ik move <名前…> --to <ジャンル>`（サイトで使っている `name` も直す）。外す: `ik remove <名前…>`。

## 切り分けがうまくいかないとき

| こまったこと | なおし方 |
|---|---|
| 2つ以上のものが1つになった | `ik part <番号> --box x0,y0,x1,y1`（全体図の目もりの座標。少し広めに） |
| となりのものも入ってしまう | `--touch` と `--except x0,y0,x1,y1` を組み合わせる |
| 1つのものが分かれた | `ik part <番号> --merge p03,p04`。全体に分かれすぎるときは `ik extract <番号> --gap 4` |
| 全体にくっつきすぎる | `ik extract <番号> --gap 0` |
| 背景の色の面が残る・ものが消えた | `--bg-ratio 0.3`（もっと外す）／`0.9`（外さない） |
| 小さいものが消えた | `--min-size 4`（既定 12pt） |

- `extract` をやりなおすと、`part` で作った部品も消えます（登録したアイコンは残ります）。
- 座標はページの左上が 0,0 の pt。全体図には 50pt ごとに目もりがあります。

## しくみのメモ

- EPS → (Ghostscript, RGB) → PDF → (PyMuPDF) → SVG → 形の位置で分ける。SVG の作品も一度 PDF にしてから同じ流れに乗せる。
- 色は `recolor.py` が `fill`・`stroke`・`stop-color`（属性と style）を、明るさと鮮やかさで line / accent / tint / paper に分けて置きかえる。
- `id` には `il-<ジャンル>-<名前>-` を付けて書き出し、`<IllustIcon>` が置くたびに一意な id に付けかえる（同じアイコンを1ページに何回置いてもぶつからない）。
