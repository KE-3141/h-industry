"""確認用の画像を作る（SVG → PNG、サムネイルを並べた一覧、番号つきの全体図）。"""
import base64
import io
import os
import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path

import pymupdf
from PIL import Image, ImageDraw, ImageFont

FONT_FILES = [
    "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
    "/System/Library/Fonts/Hiragino Sans GB.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
]
COLORS = ["#e6194b", "#3cb44b", "#4363d8", "#f58231", "#911eb4", "#008080", "#9a6324", "#800000", "#000075"]


def font(size):
    for f in FONT_FILES:
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default(size=size)


CHROME_PATHS = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                "/Applications/Chromium.app/Contents/MacOS/Chromium"]


def find_chrome():
    for p in [os.environ.get("CHROME")] + CHROME_PATHS:
        if p and Path(p).is_file():
            return p
    for name in ("google-chrome", "chromium", "chromium-browser"):
        if shutil.which(name):
            return shutil.which(name)
    return None


def svg_images(svg_texts, max_side=400, chunk=16):
    """SVG の文字列をまとめて PIL の画像にする（背景は透明）。

    MuPDF は画像にかかった clip-path を無視する（グラデーションが四角く見える）ので、
    Chrome で描く。Chrome がないときだけ MuPDF で描く。
    """
    chrome = find_chrome()
    if not chrome:
        return [_svg_image_mupdf(t, max_side) for t in svg_texts]
    out = []
    for k in range(0, len(svg_texts), chunk):
        out += _chrome_batch(chrome, svg_texts[k:k + chunk], max_side)
    return out


def _chrome_batch(chrome, texts, side):
    cells = "".join(
        f'<div><img src="data:image/svg+xml;base64,{base64.b64encode(t.encode()).decode()}"></div>' for t in texts)
    html = (f"<!doctype html><html><head><style>html,body{{margin:0;background:transparent}}"
            f"div{{width:{side}px;height:{side}px;display:flex;align-items:center;justify-content:center}}"
            f"img{{max-width:{side}px;max-height:{side}px;width:{side}px;height:{side}px;object-fit:contain}}"
            f"</style></head><body>{cells}</body></html>")
    with tempfile.TemporaryDirectory() as tmp:
        page, shot = Path(tmp) / "p.html", Path(tmp) / "s.png"
        page.write_text(html, encoding="utf-8")
        subprocess.run([chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--default-background-color=00000000", f"--screenshot={shot}",
                        f"--window-size={side},{side * len(texts)}", page.as_uri()],
                       check=True, capture_output=True, timeout=120)
        img = Image.open(shot).convert("RGBA")
        img.load()
    return [_trim(img.crop((0, n * side, side, (n + 1) * side))) for n in range(len(texts))]


def _trim(im):
    box = im.getbbox()
    return im.crop(box) if box else im


def svg_image(svg_text, max_side=400):
    """SVG の文字列を PIL の画像にする（背景は透明）。"""
    return svg_images([svg_text], max_side)[0]


def _svg_image_mupdf(svg_text, max_side):
    doc = pymupdf.open(stream=svg_text.encode("utf-8"), filetype="svg")
    page = doc[0]
    z = max_side / max(page.rect.width, page.rect.height, 1)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), alpha=True)
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")


def url_image(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (illustkit)"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        data = r.read()
    return Image.open(io.BytesIO(data)).convert("RGBA"), data


def _wrap(draw, text, f, width):
    lines, cur = [], ""
    for word in text.split(" "):
        test = f"{cur} {word}".strip()
        if draw.textlength(test, font=f) <= width or not cur:
            cur = test
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def sheet(cells, out, cols=4, cell=280, text_lines=3, title=None):
    """cells: [(画像 or None, [見出し, 説明...])] をならべた1枚の PNG を書く。"""
    f_big, f_small = font(22), font(16)
    pad, text_h = 14, 30 + 21 * text_lines
    rows = (len(cells) + cols - 1) // cols or 1
    top = 50 if title else 0
    W = cols * (cell + pad) + pad
    H = top + rows * (cell + text_h + pad) + pad
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    if title:
        d.text((pad, 12), title, fill="#222", font=font(26))
    for n, (im, lines) in enumerate(cells):
        x = pad + (n % cols) * (cell + pad)
        y = top + pad + (n // cols) * (cell + text_h + pad)
        d.rectangle([x, y, x + cell, y + cell], fill="#f4f4f4")
        # 透明な部分が分かるように、薄い市松模様の上に置く
        for cx in range(0, cell, 20):
            for cy in range(0, cell, 20):
                if (cx + cy) // 20 % 2:
                    d.rectangle([x + cx, y + cy, x + min(cx + 20, cell), y + min(cy + 20, cell)], fill="#ebebeb")
        if im is not None:
            im = im.copy()
            im.thumbnail((cell - 8, cell - 8))
            img.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2), im if im.mode == "RGBA" else None)
        ty = y + cell + 4
        if lines:
            fb, size = f_big, 22
            while size > 11 and d.textlength(lines[0], font=fb) > cell:
                size -= 1
                fb = font(size)  # 長い名前は、となりにはみ出さないよう小さくする
            d.text((x, ty), lines[0], fill="#000", font=fb)
            ty += 28
            rest = []
            for ln in lines[1:]:
                rest += _wrap(d, ln, f_small, cell)
            for ln in rest[:text_lines]:
                d.text((x, ty), ln, fill="#444", font=f_small)
                ty += 21
    img.save(out)
    return out


def overview(page, boxes, out, max_side=2400, grid=50):
    """PDF のページに、オブジェクトの枠と番号、座標の目もり（grid ごと）を重ねた PNG を書く。

    boxes: [(番号, (x0, y0, x1, y1))]。座標は PDF のページの座標（左上が 0,0）。
    """
    z = max_side / max(page.rect.width, page.rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z))
    img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    f_grid, f_label = font(14), font(26)
    w, h = page.rect.width, page.rect.height
    if grid:
        for gx in range(0, int(w) + 1, grid):
            d.line([(gx * z, 0), (gx * z, img.height)], fill=(0, 0, 0, 28))
            d.text((gx * z + 2, 2), str(gx), fill=(0, 0, 0, 140), font=f_grid)
        for gy in range(0, int(h) + 1, grid):
            d.line([(0, gy * z), (img.width, gy * z)], fill=(0, 0, 0, 28))
            d.text((2, gy * z + 2), str(gy), fill=(0, 0, 0, 140), font=f_grid)
    for n, (label, b) in enumerate(boxes):
        c = COLORS[n % len(COLORS)]
        x0, y0, x1, y1 = (v * z for v in b)
        d.rectangle([x0, y0, x1, y1], outline=c, width=3)
        tw = d.textlength(label, font=f_label)
        d.rectangle([x0, y0, x0 + tw + 10, y0 + 32], fill=c)
        d.text((x0 + 5, y0 + 2), label, fill="white", font=f_label)
    img.save(out)
    return out
