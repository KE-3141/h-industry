"""SVG の色を、サイトのテーマ色（config.json の palette）にそろえる。

元の色を明るさと鮮やかさで3つに分ける:
  line   … 暗い色・灰色（線画の線）         → primary-700
  accent … 鮮やかな色（元の絵の差し色）     → accent-500
  tint   … 明るい色（うすい面）             → primary-100
  paper  … 白に近い色（線画の「抜き」）        → fixed では白のまま
"none" やグラデーションの参照はそのまま残す。fill を書いていない形（既定の黒）は line とみなす。

mode="fixed"  … 色をそのまま書き込む（<img>・パンフレット用）
mode="inline" … line は currentColor、ほかは CSS 変数にする（<IllustIcon> 用。text-* で線の色を変えられ、
                ダーク背景では --illust-paper を背景色にして「抜き」をなじませる）
"""
import colorsys
import re
import xml.etree.ElementTree as ET

from . import library as L
from .svgsplit import HREF, URL_RE

COLOR_ATTRS = ("fill", "stroke", "stop-color")
HEX_RE = re.compile(r"^#([0-9a-f]{3}|[0-9a-f]{6})$", re.I)
RGB_RE = re.compile(r"^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$", re.I)
NAMED = {"black": (0, 0, 0), "white": (255, 255, 255)}
INLINE = {"line": "currentColor", "accent": "var(--illust-accent, {accent})", "tint": "var(--illust-tint, {tint})",
          "paper": "var(--illust-paper, #ffffff)"}


def _rgb(value):
    v = value.strip().lower()
    if v in NAMED:
        return NAMED[v]
    if m := HEX_RE.match(v):
        h = m.group(1)
        if len(h) == 3:
            h = "".join(c * 2 for c in h)
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    if m := RGB_RE.match(v):
        return tuple(int(x) for x in m.groups())
    return None


def role(value):
    """色の役割（"line" / "accent" / "tint" / "paper"）。そのまま残す色は None。"""
    rgb = _rgb(value)
    if rgb is None:
        return None
    h, s, v = colorsys.rgb_to_hsv(*(c / 255 for c in rgb))
    lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
    if lum >= 0.95:
        return "paper"
    if s >= 0.35 and v >= 0.35:
        return "accent"
    if lum >= 0.7:
        return "tint"
    return "line"


def _replace(value, mode):
    r = role(value)
    if r is None:
        return value
    if mode == "fixed":
        return value if r == "paper" else L.PALETTE[r]
    return INLINE[r].format(**L.PALETTE)


def theme(svg, mode, prefix):
    """SVG の文字列の色をテーマ色にし、id に prefix を付けた文字列を返す。

    prefix: 1つのページに同じ SVG を何回インラインで置いても id がぶつからないように付ける（例 "machines-tower-crane"）
    """
    root = ET.fromstring(svg)
    for e in root.iter():
        styles = _styles(e.get("style", ""))
        for name in COLOR_ATTRS:
            if name in styles:
                styles[name] = _replace(styles[name], mode)
            if name in e.attrib:
                new = _replace(e.attrib[name], mode)
                if new.startswith("var("):   # CSS 変数は属性では効かないので style に移す
                    del e.attrib[name]
                    styles[name] = new
                else:
                    e.set(name, new)
        if styles:
            e.set("style", ";".join(f"{k}:{v}" for k, v in styles.items()))

        # id と、その参照（url(#x)・href="#x"）に prefix を付ける
        if e.get("id"):
            e.set("id", f"{prefix}-{e.get('id')}")
        for k, v in list(e.attrib.items()):
            if "url(#" in v:
                e.set(k, URL_RE.sub(lambda m: f"url(#{prefix}-{m.group(1)})", v))
            elif k in (HREF, "href") and v.startswith("#"):
                e.set(k, f"#{prefix}-{v[1:]}")

    # fill を書いていない形は既定の黒（= 線）になるので、ルートに線の色を置いて継がせる
    styles = _styles(root.get("style", ""))
    if "fill" not in styles and "fill" not in root.attrib:
        styles["fill"] = _replace("#000000", mode)
        root.set("style", ";".join(f"{k}:{v}" for k, v in styles.items()))

    if mode == "inline":
        # 大きさは class で決めるので、ルートの width / height を外す（viewBox は残す）
        root.attrib.pop("width", None)
        root.attrib.pop("height", None)
    return ET.tostring(root, encoding="unicode", xml_declaration=False)


def _styles(s):
    out = {}
    for decl in s.split(";"):
        if ":" in decl:
            k, v = decl.split(":", 1)
            out[k.strip()] = v.strip()
    return out
