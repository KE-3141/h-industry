"""illustkit のコマンド。使い方は README を見る。  bash tools/illustkit/ik <コマンド> ..."""
import argparse
import json
import sys

from . import library as L
from . import work


def _box(s):
    v = [float(x) for x in s.replace(" ", "").split(",")]
    if len(v) != 4 or v[0] >= v[2] or v[1] >= v[3]:
        raise argparse.ArgumentTypeError("x0,y0,x1,y1 の形で、x0<x1・y0<y1 にしてください")
    return tuple(v)


def _read_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main(argv=None):
    ap = argparse.ArgumentParser(prog="ik", description="線画アイコンを検索・切り出し・登録し、テーマ色にしてサイトへ書き出す")
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("find", help="ライブラリをことばでさがす（日本語・英語）")
    p.add_argument("words", nargs="+")

    p = sub.add_parser("have", help="作品をもうダウンロードしているか")
    p.add_argument("ids", nargs="+")

    p = sub.add_parser("candidates", help="検索結果の候補を番号つきの画像にする（ダウンロードしない）")
    p.add_argument("json", help='[{"id","title","previewUrl","premium","creditCost","author"}] の JSON')
    p.add_argument("--out", required=True, help="画像を置くフォルダ（作業用の一時フォルダ）")

    p = sub.add_parser("fetch", help="stock_download の URL から作品を取ってきて、ライブラリにしまう")
    p.add_argument("id")
    p.add_argument("--url", required=True)
    p.add_argument("--meta", help="作品の情報の JSON（title, author, url, premium, creditCost）")
    p.add_argument("--force", action="store_true")

    p = sub.add_parser("extract", help="作品をオブジェクトに分ける")
    p.add_argument("id")
    p.add_argument("--gap", type=float, default=2.0, help="この距離（pt）より近い形を同じオブジェクトにする。既定 2")
    p.add_argument("--min-size", type=float, default=12.0, help="これより小さいもの（pt）は捨てる。既定 12")
    p.add_argument("--bg-ratio", type=float, default=0.5, help="ページのこの割合以上をおおう形を背景として外す。既定 0.5")
    p.add_argument("--whole", action="store_true", help="分けずにページ全体を1つの部品にする（単体のアイコン用）")

    p = sub.add_parser("part", help="範囲を指定して、またはいくつかをまとめて、部品を足す")
    p.add_argument("id")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--box", type=_box, help="全体図の目もりの座標 x0,y0,x1,y1")
    g.add_argument("--merge", help="まとめる部品 例 p03,p04")
    p.add_argument("--touch", action="store_true", help="範囲に少しでもかかる要素も入れる")
    p.add_argument("--except", dest="without", type=_box, action="append",
                   help="この範囲 x0,y0,x1,y1 にすっぽり入る要素を外す（重なった別のものを取りのぞく）。何回でも書ける")
    p.add_argument("--sheet", help="ページの名前（作品に複数のページがあるとき）")

    p = sub.add_parser("register", help="部品に名前とタグを付けてライブラリに登録する")
    p.add_argument("id")
    p.add_argument("plan", nargs="?", help='[{"part","genre","slug","ja":[],"en":[]}] の JSON')
    p.add_argument("--part")
    p.add_argument("--genre", help="ジャンル（config.json の genres）")
    p.add_argument("--slug")
    p.add_argument("--ja", default="", help="カンマ区切り")
    p.add_argument("--en", default="", help="カンマ区切り")
    p.add_argument("--force", action="store_true", help="同じ名前があっても上書きする")

    p = sub.add_parser("add", help="作品からではない SVG（自分で作ったものなど）を登録する")
    p.add_argument("file", help="SVG")
    p.add_argument("--genre", required=True)
    p.add_argument("--slug", required=True)
    p.add_argument("--ja", default="", help="カンマ区切り")
    p.add_argument("--en", default="", help="カンマ区切り")
    p.add_argument("--note", default="")
    p.add_argument("--origin", default="", help="出どころ（例「平山工業 オリジナル」）")
    p.add_argument("--force", action="store_true", help="同じ名前があっても上書きする")

    p = sub.add_parser("show", help="イラスト（名前か SVG のパス）をならべた画像を作る（名前はテーマ色の版）")
    p.add_argument("names", nargs="+")
    p.add_argument("--out", required=True)

    p = sub.add_parser("move", help="登録したイラストを別のジャンルに移す")
    p.add_argument("slugs", nargs="+")
    p.add_argument("--to", required=True, help="移す先のジャンル")

    p = sub.add_parser("remove", help="登録したイラストをライブラリから外す")
    p.add_argument("slugs", nargs="+")

    sub.add_parser("genres", help="ジャンルの一覧と、それぞれの数")

    sub.add_parser("sheet", help="library/catalog/<ジャンル>.png（ジャンルごとの一覧）を全部作り直す")

    sub.add_parser("export", help="全部をテーマ色にして public/images/illust/ と assets/illust/ に書き出しなおす")

    a = ap.parse_args(argv)

    if a.cmd == "find":
        hits = L.find(a.words)
        if not hits:
            print("ライブラリにはありません。")
        for score, it in hits:
            print(f"{score}  {L.ref(it):<40} {' '.join(it.get('ja', []))}  /  {' '.join(it.get('en', []))}"
                  f"   （作品 {it.get('source')}）")
    elif a.cmd == "have":
        for i in a.ids:
            m = L.source_meta(i)
            print(f"{i}: " + (f"取得済み（{m.get('downloaded')}）{m.get('title', '')}" if m else "まだ"))
    elif a.cmd == "candidates":
        data = _read_json(a.json)
        work.candidates(data["items"] if isinstance(data, dict) else data, a.out)
    elif a.cmd == "fetch":
        work.fetch(a.id, a.url, _read_json(a.meta) if a.meta else {}, a.force)
    elif a.cmd == "extract":
        work.extract(a.id, a.gap, a.min_size, a.bg_ratio, a.whole)
    elif a.cmd == "part":
        merge = [s.strip() for s in a.merge.split(",")] if a.merge else None
        work.add_part(a.id, a.box, a.touch, merge, a.sheet, a.without)
    elif a.cmd == "register":
        if a.plan:
            entries = _read_json(a.plan)
        elif a.part and a.slug and a.genre:
            split = lambda s: [x.strip() for x in s.split(",") if x.strip()]  # noqa: E731
            entries = [{"part": a.part, "genre": a.genre, "slug": a.slug, "ja": split(a.ja), "en": split(a.en)}]
        else:
            sys.exit("plan の JSON か、--part・--genre・--slug を指定してください。")
        work.register(a.id, entries, a.force)
    elif a.cmd == "add":
        split = lambda s: [x.strip() for x in s.split(",") if x.strip()]  # noqa: E731
        work.add(a.file, a.genre, a.slug, split(a.ja), split(a.en), a.note, a.origin, a.force)
    elif a.cmd == "show":
        work.show(a.names, a.out)
    elif a.cmd == "move":
        work.move(a.slugs, a.to)
    elif a.cmd == "remove":
        work.remove(a.slugs)
    elif a.cmd == "genres":
        items = L.catalog()["items"]
        for g, desc in L.GENRES.items():
            print(f"{g:<10} {sum(it.get('genre') == g for it in items):>4} 点  {desc}")
    elif a.cmd == "sheet":
        for p in work.catalog_sheet():
            print(p)
    elif a.cmd == "export":
        work.export_all()


if __name__ == "__main__":
    main()
