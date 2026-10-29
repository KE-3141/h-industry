# サイトの内容を更新する手順 — 平山工業コーポレートサイト

施工実績の写真の差し替え・追加、現場（施工実績）の追加、会社情報の変更など、**コードの形を変えない内容の更新**を、毎回同じ流れでするための手順書です。担当のエージェントは `hirayama-web`（`$CLAUDE_TOOLS_HOME/agents/hirayama-web.md`）。

> **状態:** 2026-10-29 作成。館山電源室新設建築その他工事の写真の差し替え（4枚）でやったことから書いた。本番のブランチ・ドメイン・写真をドライブにも置くことは、同じ日に瀬野さんに確かめた。

ページ・部品・見た目を変える直し（新しいページ・レイアウト・コンポーネント）は、この手順の外。コーディングの決まりは [CLAUDE.md](../CLAUDE.md)、仕組みを変えるなら開発のエージェント（dev-architect）に回す。

## 最初に読むもの（Claude 向け）

1. この手順書。
2. [CLAUDE.md](../CLAUDE.md)：コーディングの決まり（データは `composables/useSiteContent.ts` に集める・画像の扱い・命名）。
3. 頼みの材料（受け取った写真・平山工業からの依頼の文）。

## どこに何があるか（正本）

| もの | 正本 | メモ |
|---|---|---|
| 施工実績の一覧 | `composables/useSiteContent.ts` の `projects` | 1件 = `key`（英小文字・変えない）・`name`（工事名）・`location`・`client`・`businessTypes`・`images`。`images` の1枚目が一覧のサムネイル、全部がライトボックスで順に出る（`pages/achievements.vue`）。ページは `#<key>` で1件を開ける |
| トップに出す施工実績 | 同じファイルの `featuredProjectKeys` | `key` の並び。この順でトップに出る |
| 会社情報・数字・沿革・求人など | 同じファイルの `company`・`stats`・`history`・`jobs` など | ページには値を書かない（CLAUDE.md の 3.） |
| 施工実績の写真 | `public/images/projects/<工事名>_<番号>.JPG` | `<工事名>` は `projects` の `name` と同じ文字。番号は 1 から |
| パンフレット | `brochure/content.ts` | 共有データは `useSiteContent.ts` から読むが、表紙などに写真のパスを直接書いているところがある（例 `館山電源室新設建築その他工事_1.JPG`）。写真の名前を変える・消すときは、ここも grep する |
| もとの写真・依頼の材料 | 平山工業 の共有ドライブ `$CLAUDE_TOOLS_HOME/../平山工業/平山工業_共有フォルダ/` | `現場写真一覧/【<元請け>】<現場>/`（もとの写真）・`施工実績データ`（スプレッドシート）・`平山工業株式会社ウェブサイトに関する共有情報`。ドライブの `サイト制作について` もある |
| 会社情報のメモ | `docs/company-info.md` | 制作のときに前のサイトから集めた内部資料。サイトの値の正本ではない（正本は `useSiteContent.ts`） |
| 公開の設定 | `amplify.yml` | `npm ci` → `npm run build`。ただし Amplify の上では Nitro の preset が `aws-amplify` に自動で切りかわり、実際に公開されるのは `.amplify-hosting/static`（`.output/public` ではない）。下の 3. で同じ形でも組み立てて確かめる |
| ブランチと環境 | AWS Amplify | `main` = 本番（https://www.hirayama-industry.jp/）。`staging` = 平山工業が確認するための別の環境。**どちらも、プッシュすると外から見える**（staging は平山工業が見る） |

## 流れ

```
1. そろえる（fetch・staging を main にそろえる）
2. 置く・直す（写真・useSiteContent.ts）
3. 組み立てる（npm run build）と確かめる。Amplify と同じ形（NITRO_PRESET=aws-amplify）でも組み立てて確かめる
4. 人に見てもらう（ローカルのページ）
5. staging にコミット（ローカルだけ。プッシュしない）・ドライブにも写真を置く
   ── ここで人の OK ──
6. staging にプッシュ → 平山工業の確認の環境に出る
   ── ここで人の OK（平山工業に見てもらうかどうかも人が決める）──
7. main にマージ・プッシュ → Amplify が本番に公開
8. 本番で見え方を確かめる
```

### 1. そろえる

```bash
cd ~/dev/h-industry
git fetch origin
git status --short          # 関係ない未コミットの変更があれば、メモしておく（混ぜない・消さない）
git switch staging
git merge --ff-only origin/main
```

- `--ff-only` で止まったら（staging に main にないコミットがある）、進めずに人に聞く。
- 関係ない未コミットの変更（例 `tools/illustkit/README.md`）は、そのまま残す。stash・checkout で消さない。

### 2. 置く・直す

**写真の差し替え**
- 受け取った写真を、ファイル名の番号順（例 `h-1.JPG`〜`h-4.JPG`）に `<工事名>_1.JPG`、`_2.JPG` … として `public/images/projects/` に置く（上書き）。並びの指示が頼みにあれば、それにしたがう。
- 枚数が前と同じなら、`useSiteContent.ts` は変えなくてよい。枚数が変わるときは `images` の配列をそろえる（減るときは、使わなくなったファイルを `git rm` するかを人に聞く）。

**写真の追加**
- 今ある番号のつづきで置き、`images` の終わりに足す。サムネイル（1枚目）を変えるかは頼みにしたがう。決まっていなければ変えない。

**現場の追加**
- `projects` に1件足す。`key` は英小文字の短い名前（今あるものと重ならない。あとで変えない）、`name` は工事名、`location`・`client`・`businessTypes` は依頼か `施工実績データ` から。`businessTypes` の名前は今ある項目の言い方にそろえる。
- 並べる位置・トップに出すか（`featuredProjectKeys`）は頼みにしたがう。決まっていなければ人に聞く。

**会社情報の変更**
- `useSiteContent.ts` の該当する値だけを直す。電話番号は `tel`（表示）と `telRaw`（リンク）のように、組になっている値をそろえる。
- 値をページやパンフレットに直接書いていないかを grep する（あれば CLAUDE.md の決まりやぶりとして報告する。勝手に作り直さない）。

**写真のきまり**
- 形は JPEG。今の写真は 1477x1108 前後（受け取ったものをそのまま置いた）。大きく違うとき（縦長・数 MB を超える）は、縮めるか・切るかを人に聞く。確かめは `sips -g pixelWidth -g pixelHeight <ファイル>`。
- 拡張子は `.JPG` にそろえる（`三島ダム洪水吐改修工事_2.jpg` だけ小文字のまま残っている。名前を変えるなら別の直しとして人に聞く）。
- 新しい写真は、平山工業のドライブにも置く（下の 5.）。

### 3. 組み立てる・確かめる

```bash
npm run build                # nuxt generate。出力は .output/public
```

- 組み立てのとちゅうでエラーが出たら、止めて報告する（`getSSRProps` のエラーは直してあるので、出たら戻っていないかを見る。下の「知っておくこと」）。
- 施工実績の HTML（`achievements/index.html`）には、一覧のサムネイル（`images` の1枚目）だけが入る。2枚目からはライトボックスで出るので、データ（JS）のほうで確かめる。

```bash
ls .output/public/images/projects/ | grep '<工事名>'                       # 写真が出力に入っている
grep -o '<工事名>_[0-9]*\.JPG' .output/public/achievements/index.html       # サムネイル（1枚目）が HTML に入っている
grep -rl '<工事名>_<番号>' .output/public/_nuxt/ | head                     # データ（JS）に写真のパスが入っている
```

**Amplify と同じ形でも組み立てる（毎回）**

手元の `npm run build` と Amplify の上の組み立ては形がちがう（上の「どこに何があるか」の公開の設定）。手元で通っても本番でページがなくなることがあったので（2026-10-29 まで、トップ以外が 404 だった）、同じ形でも組み立てて、全ページが作られているかを見る。

```bash
NITRO_PRESET=aws-amplify npm run build
grep -E 'Prerendered|getSSRProps' <ログ>     # 「Prerendered 12 routes」前後。5 前後なら、ページが作られていない
for p in about achievements business company contact privacy recruitment; do
  printf "%-13s footer:%s\n" $p $(grep -c '</footer>' .amplify-hosting/static/$p/index.html)
done                                           # 7ページとも footer:1 になる
rm -rf .amplify-hosting                        # 終わったら消す（git の対象外になっていないので、残すとコミットに混ざる）
```

- ページが足りない・`footer:0` があるときは、進めずに報告する（`nuxt.config.ts` の `nitro.prerender.crawlLinks` が消えていないか、`getSSRProps` のエラーが戻っていないかを見る）。
- 4. で人に見せるのは、ふだんの `npm run build` の `.output/public`。順番は「Amplify の形で確かめる → 消す → ふだんの形で組み立てなおす → 4.」にする。

### 4. 人に見てもらう

```bash
npx serve .output/public -l 4173
```

http://localhost:4173/achievements/ を人に開いてもらい、一覧のサムネイル・ライトボックスの順番・枚数を見てもらう（`#<key>` を付けるとその現場が開く）。会社情報なら、その値が出るページ（`/company/`・トップ・フッターなど）。見終わったらサーバーを止める。

### 5. staging にコミット

```bash
git add public/images/projects/<工事名>_*.JPG composables/useSiteContent.ts   # この更新のファイルだけ
git status --short          # 関係ない変更が入っていないか
git commit -m "施工実績：<工事名>の写真を差し替え（<枚数>枚に）"
```

- `git add -A`・`git add .` は使わない。
- コミットの文は、これまでの形（`施工実績：…`）にそろえる。
- ここで止めて、人の OK を待つ。**staging にもプッシュしない**（staging は平山工業が見る環境に出るため）。

**ドライブにも写真を置く**
- サイトに置いた写真を、平山工業のドライブの `$CLAUDE_TOOLS_HOME/../平山工業/平山工業_共有フォルダ/現場写真一覧/【<発注者>】<現場>/` にも置く。発注者は `projects` の `client`。
- 置き方は、その現場のフォルダの中に `<日付>_サイト掲載/` のフォルダを作り、`サイト掲載_<番号>.JPG`（番号はサイトの `_<番号>` と同じ）として写す（2026-10-29 の館山がこの形）。もとの写真（`IMG_xxxx.JPG` など）は上書きしない・動かさない。
- 現場のフォルダが見つからない・1つに決まらないとき（新しい現場など）は、フォルダを作らずに人に聞く。

### 6. staging にプッシュ（人の OK のあと）

```bash
git push origin staging
```

- 平山工業の確認の環境に出る。平山工業に見てもらうか・知らせるかは人が決める（知らせのメールが要るときは mail-writer）。

### 7. 本番に公開（人の OK のあと）

```bash
git switch main
git merge --ff-only origin/main
git merge staging            # これまでは "Merge branch staging into main" の形
git push origin main
git switch staging
```

- main へのプッシュで AWS Amplify（`amplify.yml`）が組み立てて本番に公開する。

### 8. 本番で確かめる

https://www.hirayama-industry.jp/achievements/ をブラウザで開き、一覧と写真を見る（キャッシュがあるので、強めの再読み込み）。

## わかっていないこと

- staging の確認の環境の URL（Amplify のコンソールで分かる）。分かったら上の「どこに何があるか」に足す。

前のサイトのドメイン `http://h-industry.co.jp/` は `docs/company-info.md` にあるが、いまの本番は https://www.hirayama-industry.jp/（`brochure/content.ts` の `siteUrl` と同じ）。

## 知っておくこと

- **`getSSRProps` のエラー（2026-10-29 に直した）：** もとは `v-reveal` のディレクティブ（`plugins/reveal.client.ts`）がクライアント専用で、サーバー側の組み立てで止まり、多くのページの HTML が空になっていた。`plugins/reveal.ts` にして `getSSRProps` を足したので、いまは施工実績の一覧もプリレンダーの HTML に入る。組み立てのときにこのエラーがまた出たら、直したところが戻っていないかを見る。
- **本番でトップ以外が 404 になっていた（2026-10-29 に直した）：** Amplify では preset が `aws-amplify` になり、リンクをたどってページを作る設定（`crawlLinks`）が切れていた。そのため `/` しか作られなかった。`nuxt.config.ts` の `nitro.prerender` に `crawlLinks: true` を書いて直した。消さない。
- **`invalid or damaged lockfile detected` の警告（2026-10-29 に直した）：** `package-lock.json` に、版も入手先もない中身のない項目（`@emnapi/*`・`tslib`・`magicast` など。tailwind の `oxide-wasm32-wasi` が同梱している部品）が残っていて、`npm ci` のたびに出ていた。消して `npm install --package-lock-only` で書きなおした（部品の版は変わっていない）。また出たら、`package-lock.json` に `version` のない項目がないかを見る。`package-lock.json` を消して一から作りなおすのは、npm がエラー（`reading 'edgesOut'`）で止まるのでしない。
- `projects` は最後に `usePublicUrl` を通して `images` のパスを組み立てている。パスは `/images/projects/...` の形で書く。

## これまでの更新

| 日付 | 内容 | コミット |
|---|---|---|
| 2026-10-29 | 館山電源室新設建築その他工事（株式会社トーヨー冨士工）の写真を、受け取った `h-1`〜`h-4.JPG` に差し替え（4枚に）。もとの写真はドライブの `現場写真一覧/【株式会社トーヨー冨士工】館山/`（IMG_1376・1379・1381 など）。サイトに置いた4枚を同じフォルダの `2026-10-29_サイト掲載/` にも置いた | `225083f` |
