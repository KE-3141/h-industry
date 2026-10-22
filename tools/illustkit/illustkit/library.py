"""キットの場所・設定と、素材ライブラリ（catalog.json）の読み書き。

library/
  catalog.json             ← 登録したイラストの一覧（名前・ジャンル・タグ・出典）
  catalog/<ジャンル>.png    ← ジャンルごとの一覧の画像
  illust/<ジャンル>/<名前>.svg ← 登録したイラスト（元の色のまま）。テーマ色にしたものは export の先に書き出す
  sources/<作品ID>/         ← ダウンロードした作品（もう一度ダウンロードしなくてよいように残す）
    meta.json              ←   作品の情報（タイトル・作者・ライセンス・URL）
    original.*             ←   ダウンロードしたファイルそのもの
    files/                 ←   ZIP から取り出したファイル
    work/                  ←   変換の途中のファイルと確認用の画像
    parts/pNN.svg          ←   切り出したオブジェクト
    parts.json             ←   オブジェクトの一覧（位置と、どの要素からできているか）
"""
import datetime
import json
import os
import re
from pathlib import Path

KIT = Path(__file__).resolve().parent.parent
PROJECT = KIT.parent.parent   # h-industry/
LIB = KIT / "library"
ILLUST = LIB / "illust"
SOURCES = LIB / "sources"
CATALOG = LIB / "catalog.json"
CONFIG = json.loads((KIT / "config.json").read_text(encoding="utf-8"))
ENV = Path(os.path.expanduser(CONFIG["env"]))
GENRES = CONFIG["genres"]   # {ジャンル: 説明}。フォルダの名前になる
PALETTE = CONFIG["palette"]  # {"line", "accent", "tint"}。assets/css/app.css の @theme の色
PUBLIC_OUT = PROJECT / CONFIG["export"]["public"]   # 色を固定した SVG（<img>・パンフレット用）
INLINE_OUT = PROJECT / CONFIG["export"]["inline"]   # currentColor の SVG（<IllustIcon> 用）
SHEETS = LIB / "catalog"
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def gs():
    return ENV / "bin" / "gs"


def today():
    return datetime.date.today().isoformat()


def load_json(path, default):
    path = Path(path)
    if not path.is_file():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path, data):
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def catalog():
    return load_json(CATALOG, {"items": []})


def save_catalog(cat):
    order = list(GENRES)
    cat["items"].sort(key=lambda it: (order.index(it["genre"]) if it.get("genre") in order else len(order), it["slug"]))
    save_json(CATALOG, cat)


def source_dir(stock_id):
    return SOURCES / str(stock_id)


def owned(stock_id):
    """その作品をもうダウンロードしているか。"""
    return (source_dir(stock_id) / "meta.json").is_file()


def source_meta(stock_id):
    return load_json(source_dir(stock_id) / "meta.json", {})


def ref(it):
    """サイトで使うときの名前（"<ジャンル>/<名前>"）。<IllustIcon name="..."> と public/images/illust/ のパスになる。"""
    return f"{it['genre']}/{it['slug']}"


def slug_problem(genre, slug):
    """名前の決まり（英小文字・数字・ハイフン）に合わないときは、その説明を返す（合っていれば None）。"""
    if not SLUG_RE.match(slug):
        return f"名前は英小文字・数字・ハイフンだけにしてください: {slug}"
    return None


def item(name):
    """名前（"tower-crane"）か、サイトでの名前（"machines/tower-crane"）から項目をさがす。"""
    if "/" in name:
        name = name.split("/", 1)[1]
    return next((it for it in catalog()["items"] if it["slug"] == name), None)


def find(words):
    """ことば（日本語・英語）でライブラリをさがす。返り値: [(一致した数, 項目)]。多く一致した順。"""
    words = [w.lower() for w in words if w.strip()]
    out = []
    for it in catalog()["items"]:
        hay = [it["slug"], it.get("genre", ""), it.get("title", "").lower()] + [t.lower() for t in it.get("ja", []) + it.get("en", [])]
        score = sum(1 for w in words if any(w in h for h in hay))
        if score:
            out.append((score, it))
    out.sort(key=lambda x: (-x[0], x[1]["slug"]))
    return out
