# パンフレット（会社案内）— 平山工業

平山工業の会社案内（A4・12ページの冊子）を、サイトのデータから組み立てる仕組みと、**サイトの写真・内容を変えたあとに作り直す手順**です。担当のエージェントは `hirayama-web`（`$CLAUDE_TOOLS_HOME/agents/hirayama-web.md`）。サイトの内容の更新の手順は [docs/content-update.md](../docs/content-update.md)。

> **状態:** 2026-10-29 作成。館山電源室新設建築その他工事の写真の差し替えのあとに作り直したときのやり方から書いた（このとき、ネットプリント用の縮小写真のキャッシュで古い写真が入ったこと、事業内容ページに「undefined」が出ていたことがわかって直した）。

この手順で変えるのは、**写真の指定と、サイトのデータの変更をパンフレットに入れること**だけ。デザイン（`patterns/` の CSS・表紙・ページの組み方・`scripts/`）は変えない。変えるなら開発のエージェント（dev-architect）に回す。

## 最初に読むもの（Claude 向け）

1. このファイル。
2. [docs/content-update.md](../docs/content-update.md)：サイトのデータの正本（`composables/useSiteContent.ts`・`public/images/`）とブランチ（main = 本番・staging = 平山工業の確認の環境）。
3. `content.ts`（パンフレットにしかない文言と写真の指定。中のコメントに決まりが書いてある）。

## 仕組み（どこに何があるか）

| もの | 場所 | メモ |
|---|---|---|
| 組み立て | Vivliostyle（`vivliostyle.config.js`・`vivliostyle.netprint.config.js`・`scripts/`） | CLAUDE_TOOLS のキット（pdfkit など）は使っていない |
| 会社情報・代表挨拶・強み・施工実績 | `../composables/useSiteContent.ts` | サイトと同じデータを読む。サイトを直せばパンフレットにも入る |
| 写真 | `../public/images/` | サイトと同じファイルを読む。サイトの写真を差し替えればパンフレットにも入る |
| パンフレットにしかない文言・写真の指定 | `content.ts` | `cover.image`（表紙の写真。パターンごと）・`business.images`（事業内容ページの写真。パスを直接書く）・`pickupProjects`（大きく見せる2件と使う写真）・`projectPhotos`（一覧で使う写真と `focus`）・`nameLines`（工事名の改行） |
| デザイン | `patterns/classic`（A・紺の表紙）・`patterns/airy`（B・白の表紙） | この手順では変えない |
| 出力 | `output/`（git の対象外） | 下の「できるもの」 |
| 途中のファイル | `build/`（git の対象外） | `build/<パターン>/index.html`・`build/netprint-images/`（ネットプリント用の縮小写真のキャッシュ） |

**写真の番号のずれに気をつける：** `pickupProjects[].images` と `projectPhotos[].image` は、`useSiteContent.ts` の `images` の**0 から数える番号**。ファイル名の `_1.JPG` は 0、`_2.JPG` は 1。`cover.image` と `business.images` は番号ではなくパスを書く。

### できるもの（`output/`）

| ファイル | 中身 | 作るコマンド |
|---|---|---|
| `<パターン>.pdf` | 1ページずつ（入稿のもとにもなる） | `npm run build` |
| `<パターン>-spread.pdf` | 見開きで見る確認用 | `npm run build` |
| `<パターン>-netprint.pdf` | セブンイレブンのネットプリントで試すもの（A3 横・両面に面付け・写真を縮小。**10MB まで**） | `npm run netprint` |
| `<パターン>-press.pdf` | 印刷所に入稿するもの（press-ready で確かめたもの） | `npm run build:press` |

`<パターン>` は `classic` と `airy`。

## 作り直す手順

### 0. 人に確かめる（頼みに書いてなければ、止めて聞く）

- **どのブランチで作るか**：ふつうは `staging`（本番の main より先に新しい写真が入っていることがある）。main で作るかは人が決める。
- 作るもの（ふだん・ネットプリント・入稿用のどれまでか）。
- 変わった写真をパンフレットのどこに使うか（下の 2. で決まらないとき）。

### 1. ブランチをそろえる

```bash
cd ~/dev/h-industry
git fetch origin
git status -sb              # 決めたブランチにいるか・origin とずれていないか。関係ない未コミットの変更はメモする（混ぜない・消さない）
```

### 2. 変わった写真がパンフレットで使われているかを見る

```bash
grep -n '<工事名>\|<key>' brochure/content.ts
```

- `cover.image`・`business.images` に直接書いてあるか、`pickupProjects`・`projectPhotos` で番号を指していないか（番号は 0 から。上の「写真の番号のずれ」）。
- 写真を開いて見て（`sips -g pixelWidth -g pixelHeight <ファイル>` で大きさも）、使う番号と `focus`（トリミングの中心。縦長の写真など）を決める。今の指定で見え方がよければ `content.ts` は変えない。
- 枚数が減って、指している番号がなくなっていないかも見る（なくなると先頭の写真になる）。
- 同じ写真が2か所に出ないようにする（`content.ts` のコメントにある、表紙・事業内容・ピックアップの重なり）。

### 3. 前回の出力を残す

```bash
mkdir -p <スクラッチのフォルダ>/prev-output
cp brochure/output/*.pdf <スクラッチのフォルダ>/prev-output/
```

下の 6. でくらべるため。`output/` は git の対象外なので、上書きするともどせない。

### 4. ネットプリント用の縮小写真のキャッシュを消す（毎回）

```bash
rm -rf brochure/build/netprint-images
```

`npm run netprint` は、縮小した写真が `build/netprint-images/` にあれば作り直さずに使う。**同じファイル名で写真を差し替えると、古い写真のままネットプリント用の PDF に入る**（2026-10-29 にこれで古い写真が入った）。

### 5. 組み立てる

```bash
cd brochure
npm run build           # <パターン>.pdf と見開き（-spread）
npm run netprint        # ネットプリント用。最後に出る「（○○MB）」が 10MB 以下か確かめる
npm run build:press     # 入稿用。ログに「Ghostscript: Done without error」が出るか確かめる
```

- `build:press` は、はじめて動かすときに Docker の press-ready のイメージをダウンロードするので、10分以上かかる。Docker Desktop が動いていないと止まる。
- エラーが出たら、止めて報告する。

### 6. 目で確かめる

ページを画像にして見る（この Mac には `pdftoppm` などがないので、macOS の PDFKit を使うスクリプトを置いてある）。

```bash
swift scripts/pages-to-jpeg.swift output/classic.pdf <スクラッチのフォルダ>/new-classic 4,6
swift scripts/pages-to-jpeg.swift <スクラッチのフォルダ>/prev-output/classic.pdf <スクラッチのフォルダ>/prev-classic 4,6
# ページ番号を省くと全ページ。airy も同じ
```

- 変わった写真のページを、前回の PDF とくらべる（新しい写真に変わっているか・トリミングが変でないか）。ネットプリント用も同じように見る（キャッシュの古い写真が入っていないか）。
- 全ページをざっと見て、「undefined」などのおかしな文字が出ていないかを見る（2026-10-29、サイトの事業内容ページのリード文を消したあと、パンフレットの事業内容ページに「undefined」が出ていた）。文字はこれでも確かめられる：

```bash
grep -c 'undefined\|>null<\|NaN' build/classic/index.html build/airy/index.html    # どちらも 0
```

### 7. 直したらコミット（プッシュは人の OK のあと）

`content.ts` などを直したときだけ。今いるブランチ（ふつうは staging）に、ファイルを指定してコミットする。

```bash
git add brochure/content.ts      # 直したファイルだけ。git add -A・git add . は使わない
git status --short
git commit -m "パンフレット：<何をどう変えたか>"
```

プッシュは、docs/content-update.md の 6.・7. と同じく人の OK のあと。

### 8. PDF を渡す

PDF（`output/`）の置き場所・渡し方（ドライブに置く・メールで送る・印刷所に入稿する）は人が決める。報告には、作った PDF のパスと大きさ、確かめたページを書く。

## これまでの作り直し

| 日付 | ブランチ | 内容 | コミット |
|---|---|---|---|
| 2026-10-29 | staging | 館山電源室新設建築その他工事の写真の差し替え（サイト `225083f`）を入れて作り直した。`business.images` が `館山…_1.JPG`、`projectPhotos` の tateyama が番号 1（`_2.JPG`）を使う。ネットプリント用はキャッシュを消して作り直した。事業内容ページの「undefined」を直した | `40daebf` |
| 2026-10-29 | staging | B（airy）のデザインを直した（人の指示）：オレンジの線を紺に、会社沿革の印を紺の菱形に、工種のタグをサイトと同じグレーに。A（classic）は変えていない | `26a6a4e` |
| 2026-10-29 | staging | B（airy）の青（見出しの英字・沿革の菱形・罫線など）をロゴの青に。ページ上部の見出しと横の縦書きの英字の線をなくした | `b1a98dc` |
