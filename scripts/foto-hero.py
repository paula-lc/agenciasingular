#!/usr/bin/env python3
"""Prepara una foto para el hero con el mismo acabado que la de la floristería.

Uso:
    python3 scripts/foto-hero.py foto-original.jpg taller

Genera assets/img/hero/taller.webp y assets/img/hero/taller.jpg (576 × 736, tono azul
pizarra). Después, en index.html, pon  photo: "taller"  en el negocio correspondiente.
Necesita Pillow:  pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance

W, H = 576, 736                   # tamaño del hueco del hero (vertical)
SOMBRA = (28, 56, 88)             # azul oscuro de las sombras
LUZ = (205, 216, 224)             # crema azulado de las luces


def preparar(origen: str, nombre: str) -> None:
    im = Image.open(origen).convert("RGB")
    im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.45))
    gris = ImageEnhance.Contrast(ImageOps.grayscale(im)).enhance(1.15)
    tono = ImageOps.colorize(gris, black=SOMBRA, white=LUZ, mid=(96, 120, 146))
    destino = Path(__file__).resolve().parent.parent / "assets" / "img" / "hero"
    destino.mkdir(parents=True, exist_ok=True)
    tono.save(destino / f"{nombre}.webp", quality=80, method=6)
    tono.save(destino / f"{nombre}.jpg", quality=80, optimize=True, progressive=True)
    print(f"Listo: assets/img/hero/{nombre}.webp y .jpg")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    preparar(sys.argv[1], sys.argv[2])
