#!d:\min\python.exe
# -*- coding: utf-8 -*-
"""生成台州全科通 PWA 图标（可重复执行）。"""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "icons"
SS = 4  # 超采样倍数，边缘更平滑

JADE_900 = (13, 67, 63, 255)
JADE_800 = (16, 82, 76, 255)
LEAF_FILL = (159, 226, 207, 68)
LEAF_EDGE = (184, 238, 221, 105)
LEAF_VEIN = (216, 247, 236, 130)
WHITE = (255, 255, 255, 255)


def cubic(p0, p1, p2, p3, steps=42):
    points = []
    for i in range(steps + 1):
        t = i / steps
        mt = 1 - t
        x = mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0]
        y = mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1]
        points.append((x, y))
    return points


def leaf_points(size):
    scale = lambda p: (p[0] * size, p[1] * size)
    a, b = (0.74, 0.22), (0.26, 0.78)
    first = cubic(a, (0.34, 0.24), (0.20, 0.56), b)
    second = cubic(b, (0.62, 0.78), (0.78, 0.46), a)
    return [scale(p) for p in first + second[1:]]


def draw_icon(size: int, full_bleed: bool) -> Image.Image:
    canvas = size * SS
    image = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image, "RGBA")

    radius = 0 if full_bleed else int(canvas * 0.21)
    draw.rounded_rectangle(
        (0, 0, canvas - 1, canvas - 1),
        radius=radius,
        fill=JADE_900,
    )

    draw.ellipse(
        (int(canvas * 0.11), int(canvas * 0.11), int(canvas * 0.89), int(canvas * 0.89)),
        fill=JADE_800,
    )

    leaf = leaf_points(canvas)
    draw.polygon(leaf, fill=LEAF_FILL)
    draw.line(leaf + [leaf[0]], fill=LEAF_EDGE, width=max(1, int(canvas * 0.0045)), joint="curve")
    draw.line(
        ((0.31 * canvas, 0.71 * canvas), (0.69 * canvas, 0.29 * canvas)),
        fill=LEAF_VEIN,
        width=max(1, int(canvas * 0.011)),
    )

    bar_width = int(canvas * 0.082)
    arm = int(canvas * 0.19)
    center = canvas / 2
    draw.rounded_rectangle(
        (center - arm, center - bar_width / 2, center + arm, center + bar_width / 2),
        radius=bar_width / 2,
        fill=WHITE,
    )
    draw.rounded_rectangle(
        (center - bar_width / 2, center - arm, center + bar_width / 2, center + arm),
        radius=bar_width / 2,
        fill=WHITE,
    )

    return image.resize((size, size), Image.Resampling.LANCZOS)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    outputs = [
        (192, "icon-192.png", False),
        (512, "icon-512.png", False),
        (512, "icon-maskable-512.png", True),
        (180, "apple-touch-icon.png", True),
    ]
    for size, name, full_bleed in outputs:
        icon = draw_icon(size, full_bleed)
        if name == "apple-touch-icon.png":
            # iOS 会在透明像素后垫黑底；Apple 图标必须是不透底的 PNG。
            icon = Image.alpha_composite(Image.new("RGBA", icon.size, WHITE), icon).convert("RGB")
        icon.save(OUT_DIR / name, format="PNG", optimize=True)
        print(f"created public/icons/{name} ({size}x{size})")


if __name__ == "__main__":
    main()
