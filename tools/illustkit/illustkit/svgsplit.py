"""1ページ分の SVG（MuPDF が書き出したもの）を、オブジェクトごとの SVG に分ける。

- 描画する要素（path・image・use など）を文書の順にならべ、1つずつ外接の四角形（bbox）を計算する。
  親の <g> の transform と clip-path も反映する（クリップの外は描かれないので、bbox もそこで切る）。
- 重なる・近い要素をまとめて、1つのオブジェクト（クラスタ）にする。
- 選んだ要素だけを残した SVG を作る。グラデーション・クリップなどの defs は、使うものだけ残す。
"""
import math
import re
import xml.etree.ElementTree as ET

SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", XLINK_NS)

PAINT = {"path", "image", "use", "rect", "circle", "ellipse", "line", "polyline", "polygon", "text"}
GROUP = {"g", "a", "switch"}
HREF = f"{{{XLINK_NS}}}href"
URL_RE = re.compile(r"url\(#([^)]+)\)")
INF = float("inf")


def local(tag):
    return tag.rsplit("}", 1)[-1]


# ---- 行列 -------------------------------------------------------------------

def mul(m, n):
    """m の後に n をかける（SVG の transform="m n" と同じ）。"""
    a, b, c, d, e, f = m
    A, B, C, D, E, F = n
    return (a * A + c * B, b * A + d * B, a * C + c * D, b * C + d * D, a * E + c * F + e, b * E + d * F + f)


IDENT = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)


def parse_transform(s):
    m = IDENT
    if not s:
        return m
    for name, args in re.findall(r"(\w+)\s*\(([^)]*)\)", s):
        v = [float(x) for x in re.split(r"[\s,]+", args.strip()) if x]
        if name == "matrix":
            t = tuple(v)
        elif name == "translate":
            t = (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0)
        elif name == "scale":
            t = (v[0], 0, 0, v[1] if len(v) > 1 else v[0], 0, 0)
        elif name == "rotate":
            r = math.radians(v[0])
            t = (math.cos(r), math.sin(r), -math.sin(r), math.cos(r), 0, 0)
            if len(v) == 3:
                t = mul(mul((1, 0, 0, 1, v[1], v[2]), t), (1, 0, 0, 1, -v[1], -v[2]))
        elif name == "skewX":
            t = (1, 0, math.tan(math.radians(v[0])), 1, 0, 0)
        elif name == "skewY":
            t = (1, math.tan(math.radians(v[0])), 0, 1, 0, 0)
        else:
            continue
        m = mul(m, t)
    return m


def apply_box(m, box):
    """box (x0,y0,x1,y1) を行列で変換した外接の四角形。"""
    if box is None:
        return None
    x0, y0, x1, y1 = box
    a, b, c, d, e, f = m
    xs, ys = [], []
    for x, y in ((x0, y0), (x1, y0), (x0, y1), (x1, y1)):
        xs.append(a * x + c * y + e)
        ys.append(b * x + d * y + f)
    return (min(xs), min(ys), max(xs), max(ys))


def scale_of(m):
    return math.sqrt(abs(m[0] * m[3] - m[1] * m[2])) or 1.0


# ---- 形の bbox ----------------------------------------------------------------

TOKEN = re.compile(r"[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?")
ARGC = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7, "Z": 0}


def path_box(d):
    """パスの点と制御点を囲む四角形（曲線の外接より少し大きいことがあるが、まとめるには十分）。"""
    toks = TOKEN.findall(d or "")
    xs, ys = [], []
    x = y = sx = sy = 0.0
    i, cmd = 0, None
    while i < len(toks):
        t = toks[i]
        if t.isalpha():
            cmd = t
            i += 1
            if cmd in "Zz":
                x, y = sx, sy
                continue
        if cmd is None:
            break
        n = ARGC[cmd.upper()]
        v = [float(s) for s in toks[i:i + n]]
        if len(v) < n:
            break
        i += n
        rel = cmd.islower()
        C = cmd.upper()
        if C == "H":
            x = x + v[0] if rel else v[0]
            pts = [(x, y)]
        elif C == "V":
            y = y + v[0] if rel else v[0]
            pts = [(x, y)]
        elif C == "A":
            nx, ny = (x + v[5], y + v[6]) if rel else (v[5], v[6])
            r = max(abs(v[0]), abs(v[1]))
            pts = [(x, y), (nx, ny), (nx - r, ny - r), (nx + r, ny + r)]
            x, y = nx, ny
        else:
            pts = []
            for k in range(0, n, 2):
                px, py = v[k], v[k + 1]
                if rel:
                    px, py = x + px, y + py
                pts.append((px, py))
            x, y = pts[-1]
        if C == "M":
            sx, sy = x, y
            cmd = "l" if rel else "L"  # M のあとに続く数は L とみなす
        for px, py in pts:
            xs.append(px)
            ys.append(py)
    if not xs:
        return None
    return (min(xs), min(ys), max(xs), max(ys))


def num(e, name, default=0.0):
    v = e.get(name)
    if v is None:
        return default
    try:
        return float(re.sub(r"[a-z%]+$", "", v))
    except ValueError:
        return default


def shape_box(e, ids, depth=0):
    """要素自身の座標系での bbox（transform はかけない）。"""
    t = local(e.tag)
    if t == "path":
        return path_box(e.get("d"))
    if t in ("rect", "image"):
        w, h = num(e, "width"), num(e, "height")
        if t == "image" and (not w or not h):
            return None
        x, y = num(e, "x"), num(e, "y")
        return (x, y, x + w, y + h)
    if t == "circle":
        cx, cy, r = num(e, "cx"), num(e, "cy"), num(e, "r")
        return (cx - r, cy - r, cx + r, cy + r)
    if t == "ellipse":
        cx, cy, rx, ry = num(e, "cx"), num(e, "cy"), num(e, "rx"), num(e, "ry")
        return (cx - rx, cy - ry, cx + rx, cy + ry)
    if t == "line":
        x1, y1, x2, y2 = num(e, "x1"), num(e, "y1"), num(e, "x2"), num(e, "y2")
        return (min(x1, x2), min(y1, y2), max(x1, x2), max(y1, y2))
    if t in ("polyline", "polygon"):
        v = [float(s) for s in re.split(r"[\s,]+", (e.get("points") or "").strip()) if s]
        if len(v) < 2:
            return None
        return (min(v[0::2]), min(v[1::2]), max(v[0::2]), max(v[1::2]))
    if t == "use" and depth < 8:
        ref = (e.get(HREF) or e.get("href") or "").lstrip("#")
        target = ids.get(ref)
        if target is None:
            return None
        box = group_box(target, ids, depth + 1)
        return apply_box((1, 0, 0, 1, num(e, "x"), num(e, "y")), box)
    return None


def group_box(e, ids, depth=0):
    """要素（グループ・symbol なども）の bbox。自分の transform をかけたもの。"""
    t = local(e.tag)
    if t in PAINT:
        box = shape_box(e, ids, depth)
    else:
        box = None
        for ch in e:
            box = union(box, group_box(ch, ids, depth))
    return apply_box(parse_transform(e.get("transform")), box)


def union(a, b):
    if a is None:
        return b
    if b is None:
        return a
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))


def intersect(a, b):
    if a is None or b is None:
        return None
    r = (max(a[0], b[0]), max(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3]))
    return r if r[0] < r[2] and r[1] < r[3] else None


def has_stroke(e, inherited):
    s = e.get("stroke")
    if s is None:
        m = re.search(r"stroke\s*:\s*([^;]+)", e.get("style") or "")
        s = m.group(1).strip() if m else None
    if s is None:
        return inherited
    return s != "none"


# ---- 要素をならべる ----------------------------------------------------------------

class Page:
    """MuPDF の SVG を読み込み、描画する要素を文書の順にならべる。"""

    def __init__(self, svg_text):
        self.root = ET.fromstring(svg_text)
        self.ids = {e.get("id"): e for e in self.root.iter() if e.get("id")}
        vb = [float(v) for v in re.split(r"[\s,]+", self.root.get("viewBox", "").strip()) if v]
        if len(vb) == 4:
            self.box = (vb[0], vb[1], vb[0] + vb[2], vb[1] + vb[3])
        else:
            self.box = (0, 0, num(self.root, "width"), num(self.root, "height"))
        self.leaves = []   # (要素, bbox) 。bbox が None のものは見えない要素
        self._walk(self.root, IDENT, self.box, False)
        self.index = {id(e): i for i, (e, _) in enumerate(self.leaves)}

    def _clip_box(self, e, ctm):
        box = None
        for name in ("clip-path", "mask"):
            m = URL_RE.search(e.get(name) or "")
            if m and m.group(1) in self.ids:
                cb = group_box(self.ids[m.group(1)], self.ids)
                # clipPath の子は、参照した要素の座標系（その要素の transform をかけたあと）で描かれる
                cb = apply_box(ctm, cb)
                box = cb if box is None else intersect(box, cb)
        return box

    def _walk(self, e, ctm, clip, stroke):
        for ch in e:
            t = local(ch.tag)
            if t not in PAINT and t not in GROUP:
                continue  # defs・clipPath・style など
            m = mul(ctm, parse_transform(ch.get("transform")))
            cb = self._clip_box(ch, m)
            c = clip if cb is None else intersect(clip, cb)
            s = has_stroke(ch, stroke)
            if t in GROUP:
                self._walk(ch, m, c, s)
                continue
            box = apply_box(m, shape_box(ch, self.ids))
            if box is not None and s:
                w = num(ch, "stroke-width", 1.0) * scale_of(m) / 2
                box = (box[0] - w, box[1] - w, box[2] + w, box[3] + w)
            self.leaves.append((ch, intersect(box, c)))

    # ---- まとめる ----

    def background(self, ratio):
        """ページの大部分（面積が ratio 以上）をおおう要素の番号。背景として、オブジェクトから外す。"""
        x0, y0, x1, y1 = self.box
        area = (x1 - x0) * (y1 - y0)
        out = set()
        for i, (_, b) in enumerate(self.leaves):
            if b and (b[2] - b[0]) * (b[3] - b[1]) >= ratio * area:
                out.add(i)
        return out

    def clusters(self, gap=2.0, exclude=()):
        """重なる・gap 以内に近い要素をまとめる。返り値: [(要素番号のリスト, bbox)]（上から下、左から右の順）。"""
        idx = [i for i, (_, b) in enumerate(self.leaves) if b and i not in exclude]
        parent = {i: i for i in idx}

        def find(i):
            while parent[i] != i:
                parent[i] = parent[parent[i]]
                i = parent[i]
            return i

        x0, y0, x1, y1 = self.box
        cell = max((x1 - x0), (y1 - y0)) / 60 or 1
        grid = {}
        for i in idx:
            b = self.leaves[i][1]
            for gx in range(int(b[0] // cell), int((b[2] + gap) // cell) + 1):
                for gy in range(int(b[1] // cell), int((b[3] + gap) // cell) + 1):
                    grid.setdefault((gx, gy), []).append(i)
        for members in grid.values():
            for a_pos, a in enumerate(members):
                ba = self.leaves[a][1]
                for b_ in members[a_pos + 1:]:
                    bb = self.leaves[b_][1]
                    if (ba[0] - gap <= bb[2] and bb[0] - gap <= ba[2]
                            and ba[1] - gap <= bb[3] and bb[1] - gap <= ba[3]):
                        ra, rb = find(a), find(b_)
                        if ra != rb:
                            parent[ra] = rb
        groups = {}
        for i in idx:
            groups.setdefault(find(i), []).append(i)
        out = []
        for members in groups.values():
            members.sort()
            box = None
            for i in members:
                box = union(box, self.leaves[i][1])
            out.append((members, box))
        row = (y1 - y0) / 12 or 1
        out.sort(key=lambda g: (round(((g[1][1] + g[1][3]) / 2) / row), g[1][0]))
        return out

    def inside(self, box, touch=False, exclude=()):
        """box の中にある要素の番号（touch=True なら、少しでも重なる要素）。"""
        out = []
        for i, (_, b) in enumerate(self.leaves):
            if not b or i in exclude:
                continue
            if touch:
                ok = intersect(b, box) is not None
            else:
                ok = b[0] >= box[0] and b[1] >= box[1] and b[2] <= box[2] and b[3] <= box[3]
            if ok:
                out.append(i)
        return out

    def bbox_of(self, members):
        box = None
        for i in members:
            box = union(box, self.leaves[i][1])
        return box

    # ---- 書き出す ----

    def emit(self, members, pad=2.0):
        """members（要素番号）だけを描く SVG の文字列。viewBox はその bbox にそろえる。"""
        keep = {id(self.leaves[i][0]) for i in members}
        box = self.bbox_of(members)
        if box is None:
            raise ValueError("描く要素がありません。")
        used = set()

        def refs(e):
            for v in e.attrib.values():
                for r in URL_RE.findall(v):
                    used.add(r)
            h = e.get(HREF) or e.get("href")
            if h and h.startswith("#"):
                used.add(h[1:])

        def copy(e):
            t = local(e.tag)
            if t in PAINT:
                if id(e) not in keep:
                    return None
                n = ET.Element(e.tag, dict(e.attrib))
                n.text = e.text
                for ch in e:
                    n.append(_clone(ch))
                for d in n.iter():
                    refs(d)
                return n
            if t in GROUP:
                kids = [k for k in (copy(ch) for ch in e) if k is not None]
                if not kids:
                    return None
                n = ET.Element(e.tag, dict(e.attrib))
                n.extend(kids)
                refs(n)
                return n
            return None

        body = [k for k in (copy(ch) for ch in self.root if local(ch.tag) not in ("defs",)) if k is not None]

        # defs は、使うものだけ（defs の中から参照しているものも）
        defs = []
        seen = set()
        todo = list(used)
        while todo:
            r = todo.pop()
            if r in seen or r not in self.ids:
                continue
            seen.add(r)
            el = self.ids[r]
            for d in el.iter():
                for v in d.attrib.values():
                    todo.extend(URL_RE.findall(v))
                h = d.get(HREF) or d.get("href")
                if h and h.startswith("#"):
                    todo.append(h[1:])
        for el in self.root.iter():
            if el.get("id") in seen:
                defs.append(_clone(el))
        # 入れ子になった defs を二重に入れない
        inner = {d.get("id") for top in defs for d in list(top.iter())[1:] if d.get("id")}
        defs = [d for d in defs if d.get("id") not in inner]

        x0, y0, x1, y1 = box
        x0, y0, x1, y1 = x0 - pad, y0 - pad, x1 + pad, y1 + pad
        w, h = x1 - x0, y1 - y0
        root = ET.Element(f"{{{SVG_NS}}}svg", {
            "version": "1.1",
            "width": f"{w:.2f}", "height": f"{h:.2f}",
            "viewBox": f"{x0:.2f} {y0:.2f} {w:.2f} {h:.2f}",
        })
        if defs:
            d = ET.SubElement(root, f"{{{SVG_NS}}}defs")
            d.extend(defs)
        root.extend(body)
        return ET.tostring(root, encoding="unicode", xml_declaration=False)


def _clone(e):
    n = ET.Element(e.tag, dict(e.attrib))
    n.text, n.tail = e.text, None
    for ch in e:
        n.append(_clone(ch))
    return n
