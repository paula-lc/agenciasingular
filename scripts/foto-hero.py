#!/usr/bin/env python3
"""Prepara una foto para el hero con el mismo acabado que la de la floristería.

Uso:
    python3 scripts/foto-hero.py foto-original.jpg taller
    python3 scripts/foto-hero.py foto-original.jpg ceramica --recorte 0.25,0.49,0.60

--recorte izquierda,arriba,ancho (fracciones de 0 a 1 de la foto original) elige qué parte
usar. Útil para subir el sujeto y que no lo tape la conversación con la IA, que ocupa la
parte baja de la foto.

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


def preparar(origen: str, nombre: str, recorte=None) -> None:
    im = ImageOps.exif_transpose(Image.open(origen)).convert("RGB")
    if recorte:
        izq, arriba, ancho = recorte
        cw = im.width * ancho
        ch = cw * H / W
        x0, y0 = im.width * izq, im.height * arriba
        y0 = min(y0, im.height - ch)
        im = im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))
    im = ImageOps.fit(im, (W, H), Image.LANCZOS, centering=(0.5, 0.45))
    gris = ImageEnhance.Contrast(ImageOps.grayscale(im)).enhance(1.15)
    tono = ImageOps.colorize(gris, black=SOMBRA, white=LUZ, mid=(96, 120, 146))
    destino = Path(__file__).resolve().parent.parent / "assets" / "img" / "hero"
    destino.mkdir(parents=True, exist_ok=True)
    tono.save(destino / f"{nombre}.webp", quality=80, method=6)
    tono.save(destino / f"{nombre}.jpg", quality=80, optimize=True, progressive=True)
    print(f"Listo: assets/img/hero/{nombre}.webp y .jpg")


if __name__ == "__main__":
    args = sys.argv[1:]
    recorte = None
    if "--recorte" in args:
        i = args.index("--recorte")
        recorte = tuple(float(v) for v in args[i + 1].split(","))
        del args[i:i + 2]
    if len(args) != 2:
        sys.exit(__doc__)
    preparar(args[0], args[1], recorte)
