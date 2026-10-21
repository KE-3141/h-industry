"""候補の一覧 → ダウンロード → オブジェクトの切り出し → 登録。"""
import shutil
import subprocess
import sys
import urllib.request
import zipfile
from pathlib import Path

import pymupdf
from PIL import Image

from . import library as L
from . import recolor, render
from .svgsplit import Page

VECTOR_EXT = {".pdf": 0, ".ai": 1, ".eps": 2, ".svg": 3}   # 同じ名前のファイルが複数あれば、数が小さいほうを使う
KEEP_EXT = set(VECTOR_EXT) | {".jpg", ".jpeg", ".png", ".txt"}


def die(msg):
    sys.exit(f"エラー: {msg}")


# ---- 候補の一覧 --------------------------------------------------------------------

def candidates(items, out_dir):
    """検索結果の候補を、番号つきの1枚の画像にする。ダウンロードはしない（クレジットを使わない）。

    items: [{"id", "title", "previewUrl", "premium", "creditCost", "author"(なくてよい), "url"(なくてよい)}]
    """
    out_dir = Path(out_dir)
    (out_dir / "previews").mkdir(parents=True, exist_ok=True)
    authors = {a.lower() for a in L.CONFIG.get("authors", [])}
    cells, rows = [], []
    for n, it in enumerate(items, 1):
        sid = it["id"]
        im = None
        if it.get("previewUrl"):
            try:
                im, data = render.url_image(it["previewUrl"])
                (out_dir / "previews" / f"{sid}.jpg").write_bytes(data)
            except Exception as e:  # プレビューが取れなくても一覧は作る
                print(f"  #{n} プレビューを取れませんでした: {e}")
        lic = "PREMIUM" if it.get("premium") else "FREE"
        cost = it.get("creditCost")
        author = it.get("author") or "?"
        flags = []
        if L.owned(sid):
            flags.append("取得済み")
        if int(sid) in L.CONFIG.get("sets", []):
            flags.append("採用セット")
        if authors and author != "?" and author.lower() not in authors:
            flags.append("作者ちがい")
        head = f"#{n}  {lic} {cost}cr" + (f"  [{' / '.join(flags)}]" if flags else "")
        cells.append((im, [head, f"{author} · {sid}", it.get("title", "")]))
        rows.append((n, sid, lic, cost, author, flags, it.get("title", "")))
    out = render.sheet(cells, out_dir / "candidates.png", cols=3, cell=420, text_lines=3,
                       title=f"候補 {len(items)} 件（まだダウンロードしていません）")
    aw = max((len(r[4]) for r in rows), default=0)
    for n, sid, lic, cost, author, flags, title in rows:
        note = f"  [{'/'.join(flags)}]" if flags else ""
        print(f"#{n:<2} {sid:<10} {lic:<7} {str(cost) + 'cr':<6} {author:<{aw}}  {title[:70]}{note}")
    print(f"\n一覧の画像: {out}")


# ---- ダウンロード ------------------------------------------------------------------

def _kind(head):
    if head.startswith(b"PK"):
        return ".zip"
    if head.startswith(b"%PDF"):
        return ".pdf"
    if head.startswith(b"%!PS") or head.startswith(b"\xc5\xd0\xd3\xc6"):
        return ".eps"
    if b"<svg" in head[:2048]:
        return ".svg"
    if head.startswith(b"\xff\xd8"):
        return ".jpg"
    return ".bin"


def fetch(stock_id, url, meta, force=False):
    """stock_download で得た URL からファイルを取り、sources/<作品ID>/ にしまう。"""
    d = L.source_dir(stock_id)
    if L.owned(stock_id) and not force:
        die(f"作品 {stock_id} はもうダウンロードしています（{d}）。")
    d.mkdir(parents=True, exist_ok=True)
    tmp = d / "download.tmp"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (illustkit)"})
    with urllib.request.urlopen(req, timeout=300) as r, open(tmp, "wb") as f:
        shutil.copyfileobj(r, f)
    ext = _kind(tmp.read_bytes()[:4096])
    for old in d.glob("original.*"):
        old.unlink()
    orig = d / f"original{ext}"
    tmp.rename(orig)

    files = d / "files"
    if files.exists():
        shutil.rmtree(files)
    files.mkdir()
    names = []
    if ext == ".zip":
        with zipfile.ZipFile(orig) as z:
            for info in z.infolist():
                name = Path(info.filename).name   # フォルダの階層は捨てる（ZIP の外に書き出さないため）
                if info.is_dir() or not name or name.startswith(".") or "__MACOSX" in info.filename:
                    continue
                if Path(name).suffix.lower() not in KEEP_EXT:
                    continue
                target = files / name
                k = 2
                while target.exists():
                    target = files / f"{Path(name).stem}-{k}{Path(name).suffix}"
                    k += 1
                with z.open(info) as src, open(target, "wb") as dst:
                    shutil.copyfileobj(src, dst)
                names.append(target.name)
    else:
        shutil.copy(orig, files / f"{stock_id}{ext}")
        names.append(f"{stock_id}{ext}")

    meta = dict(meta or {})
    meta.update({"id": int(stock_id), "downloaded": L.today(), "original": orig.name, "files": sorted(names)})
    meta.setdefault("license", "premium" if meta.get("premium") else "free")
    L.save_json(d / "meta.json", meta)
    print(f"保存しました: {d}")
    for n in sorted(names):
        print(f"  files/{n}")


# ---- 切り出し ----------------------------------------------------------------------

def _vector_files(files):
    best = {}
    for p in sorted(files.iterdir()):
        ext = p.suffix.lower()
        if ext not in VECTOR_EXT:
            continue
        key = p.stem.lower()
        if key not in best or VECTOR_EXT[ext] < VECTOR_EXT[best[key].suffix.lower()]:
            best[key] = p
    return sorted(best.values())


def _to_pdf(src, work):
    ext = src.suffix.lower()
    out = work / f"{src.stem}.pdf"
    if ext == ".eps":
        cmd = [str(L.gs()), "-q", "-dSAFER", "-dBATCH", "-dNOPAUSE", "-dEPSCrop", "-sDEVICE=pdfwrite",
               "-sColorConversionStrategy=RGB", "-sProcessColorModel=DeviceRGB",
               f"-sOutputFile={out}", str(src)]
        subprocess.run(cmd, check=True, timeout=900)
        return out
    if ext in (".pdf", ".ai"):
        try:
            pymupdf.open(src, filetype="pdf").close()
            return src
        except Exception:
            return None   # PDF 互換でない .ai は使えない（同じ名前の .eps があればそちらを使う）
    if ext == ".svg":
        doc = pymupdf.open(src)
        out.write_bytes(doc.convert_to_pdf())
        return out
    return None


def _sheets(d):
    """作品の各ページ: [(名前, PDF のパス, ページ番号)]。"""
    work = d / "work"
    work.mkdir(exist_ok=True)
    out = []
    for src in _vector_files(d / "files"):
        pdf = _to_pdf(src, work)
        if pdf is None:
            print(f"  使えないファイルなので飛ばします: {src.name}")
            continue
        with pymupdf.open(pdf) as doc:
            n = len(doc)
        for pno in range(n):
            out.append((src.stem + (f"-{pno + 1}" if n > 1 else ""), pdf, pno))
    if not out:
        die(f"ベクターのファイル（{', '.join(VECTOR_EXT)}）が見つかりません: {d / 'files'}")
    return out


def _page(d, sheet):
    return Page((d / "work" / f"{sheet}.svg").read_text(encoding="utf-8"))


def extract(stock_id, gap=2.0, min_size=12.0, bg_ratio=0.5, whole=False):
    """作品をオブジェクトに分けて parts/pNN.svg を書き、確認用の画像を作る。
    whole=True のときは分けずに、ページ全体を1つの部品にする（単体のアイコン用）。"""
    d = L.source_dir(stock_id)
    if not L.owned(stock_id):
        die(f"作品 {stock_id} はまだダウンロードしていません。")
    used = [it for it in L.catalog()["items"] if it.get("source") == int(stock_id)]
    if used:
        print(f"注意: この作品からは {len(used)} 個を登録済みです。部品の番号が変わることがありますが、"
              "登録済みの SVG（library/illust）はそのままです。")
    parts_dir = d / "parts"
    if parts_dir.exists():
        shutil.rmtree(parts_dir)
    parts_dir.mkdir()
    info = {"settings": {"gap": gap, "min_size": min_size, "bg_ratio": bg_ratio, "whole": whole}, "sheets": {}, "parts": {}}
    n = 0
    small = 0
    for sheet, pdf, pno in _sheets(d):
        with pymupdf.open(pdf) as doc:
            page = doc[pno]
            svg = page.get_svg_image(text_as_path=True)
            (d / "work" / f"{sheet}.svg").write_text(svg, encoding="utf-8")
            P = Page(svg)
            bg = P.background(bg_ratio)
            boxes = []
            if whole:
                members = [i for i in range(len(P.leaves)) if i not in bg]
                groups = [(members, P.bbox_of(members))] if members else []
            else:
                groups = P.clusters(gap, bg)
            for members, box in groups:
                if max(box[2] - box[0], box[3] - box[1]) < min_size:
                    small += 1
                    continue
                n += 1
                pid = f"p{n:02d}"
                (parts_dir / f"{pid}.svg").write_text(P.emit(members), encoding="utf-8")
                info["parts"][pid] = {"sheet": sheet, "bbox": [round(v, 2) for v in box], "elements": members}
                boxes.append((pid, box))
            info["sheets"][sheet] = {"size": [round(page.rect.width, 2), round(page.rect.height, 2)],
                                     "elements": len(P.leaves), "background": sorted(bg)}
            render.overview(page, boxes, d / "work" / f"{sheet}-overview.png")
    L.save_json(d / "parts.json", info)
    sheet_png = _parts_sheet(d, info)
    print(f"{n} 個のオブジェクトに分けました（小さすぎて外したもの {small} 個、背景として外した要素 "
          f"{sum(len(s['background']) for s in info['sheets'].values())} 個）。")
    for s in info["sheets"]:
        print(f"全体図: {d / 'work' / f'{s}-overview.png'}")
    print(f"部品の一覧: {sheet_png}")


def _parts_sheet(d, info, only=None):
    pids = [pid for pid in info["parts"] if not only or pid in only]
    ims = render.svg_images([(d / "parts" / f"{pid}.svg").read_text(encoding="utf-8") for pid in pids], 400)
    cells = []
    for pid, im in zip(pids, ims):
        p = info["parts"][pid]
        b = p["bbox"]
        cells.append((im, [pid, f"{b[2] - b[0]:.0f}×{b[3] - b[1]:.0f}pt  {p['sheet']}"]))
    out = d / "work" / "parts.png"
    return render.sheet(cells, out, cols=5, cell=260, text_lines=1, title=f"作品 {d.name} の部品")


def add_part(stock_id, box=None, touch=False, merge=None, sheet=None, without=None):
    """自動で分けたものとは別に、部品を足す。

    box:   全体図の目もりの座標 (x0, y0, x1, y1) の中に入る要素を集める（touch=True なら、かかる要素も）
    merge: いくつかの部品（"p03" など）を1つにまとめる
    without: [範囲, ...]。どれかにすっぽり入る要素を外す（重なった別のオブジェクトを取りのぞく）
    """
    d = L.source_dir(stock_id)
    info = L.load_json(d / "parts.json", None)
    if info is None:
        die("先に extract を実行してください。")
    if merge:
        missing = [p for p in merge if p not in info["parts"]]
        if missing:
            die(f"部品がありません: {', '.join(missing)}")
        sheets = {info["parts"][p]["sheet"] for p in merge}
        if len(sheets) > 1:
            die("ちがうページの部品はまとめられません。")
        sheet = sheets.pop()
        members = sorted({i for p in merge for i in info["parts"][p]["elements"]})
        P = _page(d, sheet)
    else:
        if sheet is None:
            if len(info["sheets"]) > 1:
                die(f"ページを --sheet で指定してください: {', '.join(info['sheets'])}")
            sheet = next(iter(info["sheets"]))
        P = _page(d, sheet)
        members = P.inside(box, touch, exclude=set(info["sheets"][sheet]["background"]))
        if not members:
            die("その範囲に要素がありません。範囲を広げるか --touch を付けてください。")
    if without:
        drop = {i for w in without for i in P.inside(w)}
        members = [i for i in members if i not in drop]
        if not members:
            die("--except で全部の要素が外れました。")
    nums = [int(p[1:]) for p in info["parts"]]
    pid = f"p{max(nums, default=0) + 1:02d}"
    bbox = P.bbox_of(members)
    (d / "parts" / f"{pid}.svg").write_text(P.emit(members), encoding="utf-8")
    info["parts"][pid] = {"sheet": sheet, "bbox": [round(v, 2) for v in bbox], "elements": members,
                          "made_by": (f"merge {','.join(merge)}" if merge else f"box {box}" + (" touch" if touch else ""))
                          + (f" except {without}" if without else "")}
    L.save_json(d / "parts.json", info)
    out = d / "work" / f"{pid}.png"
    render.svg_image((d / "parts" / f"{pid}.svg").read_text(encoding="utf-8"), 600).save(out)
    print(f"部品 {pid} を作りました（要素 {len(members)} 個、{bbox[2] - bbox[0]:.0f}×{bbox[3] - bbox[1]:.0f}pt）: {out}")


# ---- 登録 ----------------------------------------------------------------------------

def _genre_ok(genre):
    if genre not in L.GENRES:
        die(f"ジャンル {genre!r} はありません。使えるもの: " + "、".join(f"{g}（{d}）" for g, d in L.GENRES.items())
            + "\n新しいジャンルが必要なら config.json の genres に足してください。")


def register(stock_id, entries, force=False):
    """部品に名前・ジャンル・タグを付けて library/illust/<ジャンル>/<名前>.svg にし、catalog.json に載せる。

    entries: [{"part": "p03", "genre": "food", "slug": "coffee-cup", "ja": ["コーヒー", "カップ"], "en": ["coffee", "cup"]}]
    """
    d = L.source_dir(stock_id)
    info = L.load_json(d / "parts.json", None)
    if info is None:
        die("先に extract を実行してください。")
    meta = L.source_meta(stock_id)
    cat = L.catalog()
    by_slug = {it["slug"]: it for it in cat["items"]}
    for e in entries:
        if e["part"] not in info["parts"]:
            die(f"部品がありません: {e['part']}")
        if not e.get("genre"):
            die(f"{e['slug']} のジャンル（genre）を指定してください。")
        _genre_ok(e["genre"])
        if problem := L.slug_problem(e["genre"], e["slug"]):
            die(problem)
        old = by_slug.get(e["slug"])
        if old and not force and (old.get("source"), old.get("part")) != (int(stock_id), e["part"]):
            die(f"名前 {e['slug']} はもう使われています（{L.ref(old)}、作品 {old.get('source')} の {old.get('part')}）。"
                "別の名前にするか --force を付けてください。")
    changed = set()
    for e in entries:
        changed |= _put(by_slug, e, d / "parts" / f"{e['part']}.svg")
        item = by_slug[e["slug"]]
        item.update({
            "source": int(stock_id),
            "part": e["part"],
            "title": meta.get("title", ""),
            "author": meta.get("author", ""),
            "license": meta.get("license", ""),
            "url": meta.get("url", ""),
        })
        export(item)
        print(f"登録: {L.ref(item)}  ← 作品 {stock_id} の {e['part']}  {' '.join(item['ja'])}")
    _save(cat, by_slug, changed)


def _put(by_slug, e, src):
    """SVG を library/illust/<ジャンル>/<名前>.svg に置き、by_slug に基本の項目を入れる。
    変わったジャンルの組を返す。"""
    changed = {e["genre"]}
    old = by_slug.get(e["slug"])
    if old:
        _unexport(old)   # ジャンルが変わったときに古いファイルを残さない
        (L.LIB / old["file"]).unlink(missing_ok=True)
        changed.add(old.get("genre"))
    dest = L.ILLUST / e["genre"] / f"{e['slug']}.svg"
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(src, dest)
    by_slug[e["slug"]] = {
        "slug": e["slug"],
        "genre": e["genre"],
        "file": f"illust/{e['genre']}/{e['slug']}.svg",
        "ja": e.get("ja", []),
        "en": e.get("en", []),
        "note": e.get("note", ""),
        "added": L.today(),
    }
    return changed


def _save(cat, by_slug, changed):
    cat["items"] = list(by_slug.values())
    L.save_catalog(cat)
    _drop_empty_dirs()
    for p in catalog_sheet(changed):
        print(f"一覧の画像: {p}")


def _drop_empty_dirs():
    for top in (L.ILLUST, L.PUBLIC_OUT, L.INLINE_OUT):
        if not top.is_dir():
            continue
        for d in sorted(top.rglob("*"), key=lambda p: -len(p.parts)):
            if d.is_dir() and not any(d.iterdir()):
                d.rmdir()


# ---- サイトへの書き出し --------------------------------------------------------------

def _outputs(it):
    rel = f"{it['genre']}/{it['slug']}.svg"
    return L.PUBLIC_OUT / rel, L.INLINE_OUT / rel


def export(it):
    """登録したイラストを、テーマ色にしてサイトに書き出す。
    public/images/illust/ … 色を固定（<img>・パンフレット）
    assets/illust/        … currentColor と CSS 変数（<IllustIcon>）"""
    svg = (L.LIB / it["file"]).read_text(encoding="utf-8")
    prefix = f"il-{it['genre']}-{it['slug']}"
    for (out, mode) in zip(_outputs(it), ("fixed", "inline")):
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(recolor.theme(svg, mode, prefix) + "\n", encoding="utf-8")


def _unexport(it):
    for out in _outputs(it):
        out.unlink(missing_ok=True)


def export_all():
    """全部を書き出しなおす（config.json の palette を変えたあとなど）。"""
    items = L.catalog()["items"]
    for it in items:
        export(it)
    catalog_sheet()
    print(f"{len(items)} 点を書き出しました: {L.PUBLIC_OUT} / {L.INLINE_OUT}")


def add(file, genre, slug, ja=(), en=(), note="", origin="", force=False):
    """作品からではない SVG（自分で作ったものなど）を登録する。origin は出どころの説明。"""
    file = Path(file)
    if not file.is_file() or file.suffix.lower() != ".svg":
        die(f"SVG のファイルがありません: {file}")
    _genre_ok(genre)
    if problem := L.slug_problem(genre, slug):
        die(problem)
    cat = L.catalog()
    by_slug = {it["slug"]: it for it in cat["items"]}
    if slug in by_slug and not force:
        die(f"名前 {slug} はもう使われています（{L.ref(by_slug[slug])}）。別の名前にするか --force を付けてください。")
    changed = _put(by_slug, {"genre": genre, "slug": slug, "ja": list(ja), "en": list(en), "note": note}, file)
    item = by_slug[slug]
    item["source"] = origin or "local"
    export(item)
    print(f"登録: {L.ref(item)}  ← {file.name}  {' '.join(item['ja'])}")
    _save(cat, by_slug, changed)


def _images(paths, max_side):
    """SVG と PNG がまざったファイルを、確認用の画像にする。"""
    svgs = [p for p in paths if p.suffix.lower() == ".svg"]
    out = dict(zip(svgs, render.svg_images([p.read_text(encoding="utf-8") for p in svgs], max_side)))
    for p in paths:
        if p not in out:
            im = Image.open(p).convert("RGBA")
            im.thumbnail((max_side, max_side))
            out[p] = im
    return [out[p] for p in paths]


def move(slugs, genre):
    """登録したイラストを別のジャンルに移す。"""
    _genre_ok(genre)
    cat = L.catalog()
    by_slug = {it["slug"]: it for it in cat["items"]}
    missing = [s for s in slugs if s not in by_slug]
    if missing:
        die(f"登録されていません: {', '.join(missing)}")
    for s in slugs:
        if problem := L.slug_problem(genre, s):
            die(problem)
    changed = {genre}
    for s in slugs:
        it = by_slug[s]
        if it.get("genre") == genre:
            continue
        dest = L.ILLUST / genre / f"{s}.svg"
        dest.parent.mkdir(parents=True, exist_ok=True)
        (L.LIB / it["file"]).replace(dest)
        _unexport(it)
        changed.add(it.get("genre"))
        before = L.ref(it)
        it["genre"], it["file"] = genre, f"illust/{genre}/{s}.svg"
        export(it)
        print(f"移動: {before} → {L.ref(it)}")
    _save(cat, by_slug, changed)
    print("サイト・パンフレットで古い名前を使っているところがあれば、直してください（grep で名前をさがす）。")


def remove(slugs):
    """登録したイラストをライブラリから外す（作品と部品は残るので、あとで登録しなおせる）。"""
    cat = L.catalog()
    by_slug = {it["slug"]: it for it in cat["items"]}
    missing = [s for s in slugs if s not in by_slug]
    if missing:
        die(f"登録されていません: {', '.join(missing)}")
    changed = set()
    for s in slugs:
        it = by_slug.pop(s)
        (L.LIB / it["file"]).unlink(missing_ok=True)
        _unexport(it)
        changed.add(it.get("genre"))
        print(f"外しました: {L.ref(it)}")
    _save(cat, by_slug, changed)


def catalog_sheet(genres=None):
    """ジャンルごとの一覧の画像 library/catalog/<ジャンル>.png を作り直す（genres を省くと全部）。"""
    items = L.catalog()["items"]
    genres = set(L.GENRES) if genres is None else {g for g in genres if g}
    L.SHEETS.mkdir(parents=True, exist_ok=True)
    out = []
    for g in [g for g in L.GENRES if g in genres]:
        its = [it for it in items if it.get("genre") == g]
        png = L.SHEETS / f"{g}.png"
        if not its:
            png.unlink(missing_ok=True)
            continue
        files = [_outputs(it)[0] for it in its]
        ok = [p for p in files if p.is_file()]
        ims = dict(zip(ok, _images(ok, 300)))
        cells = [(ims.get(p), [it["slug"], " ".join(it.get("ja", []))]) for it, p in zip(its, files)]
        out.append(render.sheet(cells, png, cols=6, cell=200, text_lines=2,
                                title=f"illust/{g}  {L.GENRES[g]}（{len(cells)} 点）"))
    return out


def show(names, out):
    """登録したイラスト（名前）や SVG・PNG のファイルを、1枚の画像にならべる。"""
    paths = []
    for name in names:
        p = Path(name)
        if not p.is_file():
            it = L.item(name)
            p = _outputs(it)[0] if it else p
        if not p.is_file():
            die(f"見つかりません: {name}")
        paths.append(p)
    ims = _images(paths, 600)
    cells = [(im, [n if not Path(n).is_file() else p.stem]) for n, p, im in zip(names, paths, ims)]
    print(render.sheet(cells, out, cols=min(len(cells), 3), cell=420, text_lines=0))
