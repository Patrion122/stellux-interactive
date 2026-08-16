#!/usr/bin/env python3
"""Download and optimize Stellux Interactive media assets.

Run from the repository root:

    python -m pip install Pillow
    python tools/fetch-media.py
"""

from __future__ import annotations

import io
import ssl
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "assets" / "media"
ICONS = ROOT / "assets" / "icons"
LOGO_SRC = ICONS / "stellux-interactive.png"

WEBP_QUALITY = 82
CARD_SIZE = (800, 450)
FULL_SIZE = (1600, 900)

# Source URLs verified from itch.io galleries and Unity Asset Store OG images.
PROJECTS = {
    "trisector": [
        "https://img.itch.zone/aW1hZ2UvMzM5ODkxMC8yMjQzMTk3MC5qcGc=/original/8BuPV%2F.jpg",
        "https://img.itch.zone/aW1hZ2UvMzM5ODkxMC8yMjQzMTk2OS5qcGc=/original/KFLcxd.jpg",
        "https://img.itch.zone/aW1hZ2UvMzM5ODkxMC8yMjQzMTk3My5qcGc=/original/cLXsG5.jpg",
        "https://img.itch.zone/aW1hZ2UvMzM5ODkxMC8yMjQzMTk3MS5qcGc=/original/cvGgBw.jpg",
        "https://img.itch.zone/aW1hZ2UvMzM5ODkxMC8yMjQzMTk3NC5qcGc=/original/qNjTNp.jpg",
        "https://img.itch.zone/aW1hZ2UvMzM5ODkxMC8yMjQzMTk3Mi5qcGc=/original/ZFYSn%2B.jpg",
    ],
    "swiftkill": [
        "https://img.itch.zone/aW1hZ2UvMzc2MjAzOS8yMjM5NTA2NS5wbmc=/original/hz%2BEk6.png",
        "https://img.itch.zone/aW1hZ2UvMzc2MjAzOS8yMjM5NTA3MC5wbmc=/original/X3FDxR.png",
        "https://img.itch.zone/aW1hZ2UvMzc2MjAzOS8yMjM5NTA2MC5wbmc=/original/SBerul.png",
        "https://img.itch.zone/aW1hZ2UvMzc2MjAzOS8yMjM5NTA2Ni5wbmc=/original/boqeJS.png",
        "https://img.itch.zone/aW1hZ2UvMzc2MjAzOS8yMjM5NTA3MS5wbmc=/original/ik3yy7.png",
        "https://img.itch.zone/aW1hZ2UvMzc2MjAzOS8yMjM5NTA2OS5wbmc=/original/j6UFgg.png",
    ],
    "velocity": [
        "https://img.itch.zone/aW1hZ2UvNDM1ODk4My8yNjYwMTk5MC5wbmc=/original/nF89Fl.png",
        "https://img.itch.zone/aW1hZ2UvNDM1ODk4My8yNjYwMTk5Mi5wbmc=/original/uJ7m%2FL.png",
    ],
}

# Feature slides stored locally so fetch-media.py does not overwrite them
# with Asset Store key images.
LOCAL_PROJECTS = {
    "ai-context-builder": ROOT / "tools" / "screenshots" / "ai-context-builder",
    "project-doctor": ROOT / "tools" / "screenshots" / "project-doctor",
}

PROJECT_ICONS = [
    "ai-context-builder.png",
    "project-doctor.png",
    "swiftkill.png",
    "trisector.png",
    "velocity.png",
]

UA = "StelluxInteractiveMediaFetcher/1.0 (+https://stelluxinteractive.com)"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=60) as res:
        return res.read()


def open_image(data: bytes) -> Image.Image:
    img = Image.open(io.BytesIO(data))
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA"):
        return img.convert("RGBA")
    if img.mode == "P" and "transparency" in img.info:
        return img.convert("RGBA")
    return img.convert("RGB")


def cover(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(img, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def save_webp(img: Image.Image, path: Path, *, quality: int = WEBP_QUALITY, lossless: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    out = img.convert("RGB") if img.mode != "RGB" else img
    if lossless:
        out.save(path, "WEBP", lossless=True, method=6)
    else:
        out.save(path, "WEBP", quality=quality, method=6)


def process_local_screenshots() -> None:
    for slug, folder in LOCAL_PROJECTS.items():
        files = sorted(folder.glob("*.png"))
        if not files:
            print(f"  skip {slug}: no local PNGs in {folder}")
            continue
        dest = MEDIA / slug
        dest.mkdir(parents=True, exist_ok=True)
        for i, path in enumerate(files, start=1):
            print(f"  {slug} {i:02d}/{len(files)} (local)")
            img = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
            save_webp(cover(img, CARD_SIZE), dest / f"{i:02d}-card.webp", quality=90)
            save_webp(img, dest / f"{i:02d}-full.webp", lossless=True)


def process_screenshots() -> None:
    for slug, urls in PROJECTS.items():
        dest = MEDIA / slug
        dest.mkdir(parents=True, exist_ok=True)
        for i, url in enumerate(urls, start=1):
            print(f"  {slug} {i:02d}/{len(urls)}")
            img = open_image(fetch(url))
            save_webp(cover(img, CARD_SIZE), dest / f"{i:02d}-card.webp")
            save_webp(cover(img, FULL_SIZE), dest / f"{i:02d}-full.webp")
    process_local_screenshots()


def make_logo_set() -> Image.Image:
    if not LOGO_SRC.exists():
        raise FileNotFoundError(f"Missing logo: {LOGO_SRC}")
    logo = Image.open(LOGO_SRC).convert("RGBA")
    for size, name in ((64, "logo-64.webp"), (128, "logo-128.webp")):
        resized = logo.copy()
        resized.thumbnail((size, size), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        x = (size - resized.width) // 2
        y = (size - resized.height) // 2
        canvas.paste(resized, (x, y), resized)
        canvas.save(ICONS / name, "WEBP", quality=90, method=6)

    apple = Image.new("RGBA", (180, 180), (6, 6, 15, 255))
    fitted = logo.copy()
    fitted.thumbnail((156, 156), Image.Resampling.LANCZOS)
    ax = (180 - fitted.width) // 2
    ay = (180 - fitted.height) // 2
    apple.paste(fitted, (ax, ay), fitted)
    apple.convert("RGB").save(ROOT / "apple-touch-icon.png", "PNG", optimize=True)

    ico_images = []
    for size in (16, 32):
        frame = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        icon = logo.copy()
        icon.thumbnail((size, size), Image.Resampling.LANCZOS)
        fx = (size - icon.width) // 2
        fy = (size - icon.height) // 2
        frame.paste(icon, (fx, fy), icon)
        ico_images.append(frame)
    ico_images[1].save(
        ROOT / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32)],
        append_images=[ico_images[0]],
    )
    return logo


def make_og(logo: Image.Image) -> None:
    w, h = 1200, 630
    canvas = Image.new("RGB", (w, h), (6, 6, 15))
    draw = ImageDraw.Draw(canvas)

    glow = Image.new("L", (w, h), 0)
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((220, -80, 980, 520), fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    overlay = Image.new("RGB", (w, h), (124, 108, 240))
    canvas.paste(overlay, (0, 0), glow)

    mark = logo.copy()
    mark.thumbnail((280, 280), Image.Resampling.LANCZOS)
    mx = (w - mark.width) // 2
    my = (h - mark.height) // 2 - 24
    if mark.mode == "RGBA":
        canvas.paste(mark, (mx, my), mark)
    else:
        canvas.paste(mark, (mx, my))

    canvas.save(ROOT / "assets" / "og.png", "PNG", optimize=True)


def shrink_project_icons() -> None:
    for name in PROJECT_ICONS:
        src = ICONS / name
        if not src.exists():
            continue
        img = Image.open(src).convert("RGBA")
        img.thumbnail((192, 192), Image.Resampling.LANCZOS)
        webp_name = src.with_suffix(".webp").name.replace(".png.webp", ".webp")
        img.save(ICONS / webp_name.replace(src.stem + ".webp", src.stem + "-96.webp"), "WEBP", quality=88, method=6)


def main() -> int:
    print("Fetching screenshots…")
    process_screenshots()
    print("Building logo, favicon, and OG image…")
    logo = make_logo_set()
    make_og(logo)
    shrink_project_icons()
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
