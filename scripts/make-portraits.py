"""Portrait prep: public/images/atanu.jpg -> cut-out variants for the site and Figma.

Outputs
  public/images/atanu-cutout.webp  plain monochrome cut-out (particle sampling source)
  public/images/atanu-hero.webp    hero version: side-lit, fades into the void at the bottom/right
  design/figma/atanu-hero.png      same hero version as PNG, to drop into the Figma Hero frame

Run (one-time setup is in CLAUDE.md):
  U2NET_HOME=.u2net .venv/bin/python scripts/make-portraits.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/images/atanu.jpg"
OUT_CUTOUT = ROOT / "public/images/atanu-cutout.webp"
OUT_HERO = ROOT / "public/images/atanu-hero.webp"
OUT_FIGMA = ROOT / "design/figma/atanu-hero.png"


def smoothstep(e0: float, e1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def cut_out(src: Image.Image) -> Image.Image:
    session = new_session("u2net_human_seg")
    # Alpha matting softens the hair edge instead of a hard binary mask.
    cut = remove(src, session=session, alpha_matting=True)
    alpha = cut.getchannel("A")
    # Contrast-stretch only the subject's pixels (ignore the removed background).
    subject = alpha.point(lambda a: 255 if a > 128 else 0)
    gray = ImageOps.autocontrast(cut.convert("L"), cutoff=1, mask=subject)
    mono = Image.merge("LA", (gray, alpha)).convert("RGBA")
    # Trim fully transparent margins so layout uses the real silhouette bounds.
    return mono.crop(alpha.getbbox())


def hero_grade(mono: Image.Image) -> Image.Image:
    """Match the Figma hero: low-key light from the left (towards the name), torso sinking into black."""
    rgba = np.asarray(mono).astype(np.float32) / 255.0
    lum, alpha = rgba[..., 0], rgba[..., 3]
    h, w = lum.shape
    x = np.linspace(0.0, 1.0, w)[None, :]
    y = np.linspace(0.0, 1.0, h)[:, None]

    # Key light: brightest on the left cheek, falling off to ~35% on the far shoulder.
    key = 1.0 - 0.65 * smoothstep(0.3, 0.95, x)
    # Torso falls into shadow below the chin line (~42% of the cut-out height).
    body = 1.0 - 0.75 * smoothstep(0.4, 0.85, y)
    lum = np.clip(lum * key * body, 0.0, 1.0) ** 1.6  # gamma > 1 deepens the mid-tones

    # Fade out: bottom dissolves into the page; feather the photo's hard left/right crop edges
    # (the source photo cuts both arms at the frame).
    alpha = (
        alpha
        * (1.0 - smoothstep(0.55, 0.97, y))
        * smoothstep(0.0, 0.12, x)
        * smoothstep(0.0, 0.04, 1.0 - x)
    )

    out = np.dstack([lum, lum, lum, alpha])
    return Image.fromarray((out * 255).round().astype(np.uint8), "RGBA")


def main() -> None:
    mono = cut_out(Image.open(SRC).convert("RGB"))
    mono.save(OUT_CUTOUT, "WEBP", quality=90, method=6)

    hero = hero_grade(mono)
    hero.save(OUT_HERO, "WEBP", quality=90, method=6)
    OUT_FIGMA.parent.mkdir(parents=True, exist_ok=True)
    hero.save(OUT_FIGMA, "PNG", optimize=True)

    for p in (OUT_CUTOUT, OUT_HERO, OUT_FIGMA):
        print(f"wrote {p.relative_to(ROOT)} {mono.size[0]}x{mono.size[1]}")


if __name__ == "__main__":
    main()
