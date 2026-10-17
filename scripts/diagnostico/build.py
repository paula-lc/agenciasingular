#!/usr/bin/env python3
"""Genera el diagnóstico de un negocio a partir de su JSON.

    python3 scripts/diagnostico/build.py diagnosticos/art-nails.json

Crea:
    d/<slug>/index.html      página del diagnóstico (noindex, fuera del sitemap) · se sube a la web
    d/<slug>/negocio.json    solo el nombre del negocio, para personalizar /hola/ · se sube a la web
    salida/<slug>.pdf        hoja A4 para imprimir (con dorso si "dorso": true)  · NO se sube (salida/ está en .gitignore)
    salida/<slug>-qr.png     QR que apunta a /hola/?n=<slug>&src=visita          · NO se sube

Requisitos (una vez):  pip install -r scripts/diagnostico/requirements.txt && playwright install chromium
"""
import argparse
import datetime
import io
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import pagina  # noqa: E402
import puntuacion  # noqa: E402

RAIZ = puntuacion.RAIZ
URL_HOLA = "https://agenciasingular.es/hola/?n={slug}&src=visita"


def error(msg):
    sys.exit(f"✗ {msg}")


# ---------------------------------------------------------------- datos
def cargar(ruta):
    try:
        d = json.load(open(ruta, encoding="utf-8"))
    except FileNotFoundError:
        error(f"No existe {ruta}")
    except json.JSONDecodeError as ex:
        error(f"{ruta} no es un JSON válido: {ex}")
    return {k: v for k, v in d.items() if not k.startswith("_")}


def validar(d, ruta):
    fallos = []

    def req(obj, clave, tipo, donde=""):
        if clave not in obj:
            fallos.append(f"falta «{donde}{clave}»")
            return None
        v = obj[clave]
        # bool es un int en Python: no vale para números
        if not isinstance(v, tipo) or (tipo is not bool and isinstance(v, bool)):
            fallos.append(f"«{donde}{clave}» debe ser {tipo.__name__ if isinstance(tipo, type) else 'número'}")
            return None
        return v

    slug = req(d, "slug", str)
    if slug and not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug):
        fallos.append("«slug» solo admite minúsculas, números y guiones (ej.: art-nails)")
    if slug and os.path.splitext(os.path.basename(ruta))[0] != slug:
        fallos.append(f"el archivo debería llamarse {slug}.json (igual que el slug)")
    for c in ("negocio", "sector", "barrio"):
        v = req(d, c, str)
        if v is not None and not v.strip():
            fallos.append(f"«{c}» está vacío")
    f = req(d, "fecha", str)
    if f:
        try:
            datetime.date.fromisoformat(f)
        except ValueError:
            fallos.append("«fecha» debe ser AAAA-MM-DD")
    busq = req(d, "busquedas", list)
    for i, b in enumerate(busq or []):
        if not isinstance(b, dict) or not isinstance(b.get("consulta"), str) or not b["consulta"].strip():
            fallos.append(f"busquedas[{i}] necesita «consulta»")
        elif "posicion" not in b or not (b["posicion"] is None or (isinstance(b["posicion"], int) and not isinstance(b["posicion"], bool) and b["posicion"] >= 1)):
            fallos.append(f"busquedas[{i}].posicion debe ser un número ≥ 1 (o null si no sale)")
    if busq is not None and not busq:
        fallos.append("«busquedas» necesita al menos una búsqueda")
    fi = req(d, "ficha", dict)
    if fi is not None:
        for c in ("resenas", "fotos", "categorias_secundarias"):
            v = req(fi, c, int, "ficha.")
            if v is not None and v < 0:
                fallos.append(f"«ficha.{c}» no puede ser negativo")
        v = req(fi, "resenas_sin_responder_pct", (int, float), "ficha.")
        if v is not None and not 0 <= v <= 100:
            fallos.append("«ficha.resenas_sin_responder_pct» debe estar entre 0 y 100")
        v = req(fi, "valoracion", (int, float), "ficha.")
        if v is not None and not 1 <= v <= 5:
            fallos.append("«ficha.valoracion» debe estar entre 1 y 5")
        for c in ("foto_principal_ok", "horario_completo", "servicios_con_precio", "web_o_reservas_enlazado", "publicaciones_ultimo_mes"):
            req(fi, c, bool, "ficha.")
        req(fi, "categoria_principal", str, "ficha.")
    top = req(d, "arreglos_top3", list)
    if top is not None and not (1 <= len(top) <= 3 and all(isinstance(x, str) and x.strip() for x in top)):
        fallos.append("«arreglos_top3» debe tener de 1 a 3 textos")
    if "dorso" in d and not isinstance(d["dorso"], bool):
        fallos.append("«dorso» debe ser true o false")
    if fallos:
        error(f"{ruta}:\n   - " + "\n   - ".join(fallos))


# ---------------------------------------------------------------- QR
def hacer_qr(url, png):
    import qrcode
    import qrcode.image.svg
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=4, box_size=24)
    qr.add_data(url)
    qr.make(fit=True)
    qr.make_image(fill_color="black", back_color="white").save(png)
    svg = io.BytesIO()
    qr.make_image(image_factory=qrcode.image.svg.SvgPathImage).save(svg)
    texto = svg.getvalue().decode("utf-8")
    texto = re.sub(r"<\?xml[^>]*\?>\s*", "", texto)
    texto = re.sub(r'<svg [^>]*?width="[^"]*" height="[^"]*"', lambda m: m.group(0).split(' width=')[0], texto, count=1)
    return texto


def telefono_whatsapp():
    js = open(os.path.join(RAIZ, "assets", "src", "js", "main.js"), encoding="utf-8").read()
    m = re.search(r'whatsapp:\s*"(\d*)"', js)
    return m.group(1) if m else ""


# ---------------------------------------------------------------- PDF
def hacer_pdf(html_path, pdf_path, paginas_esperadas):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        error("Falta playwright: pip install -r scripts/diagnostico/requirements.txt && playwright install chromium")
    with sync_playwright() as p:
        # CHROMIUM_PATH: ruta a un Chromium ya instalado (opcional; normalmente basta con `playwright install chromium`)
        nav = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH") or None)
        pag = nav.new_page()
        pag.goto("file://" + os.path.abspath(html_path), wait_until="load")
        try:
            pag.evaluate("document.fonts.ready.then(() => true)")
        except Exception:
            pass
        pag.emulate_media(media="print")
        pag.pdf(path=pdf_path, format="A4", print_background=True, prefer_css_page_size=True)
        nav.close()
    try:
        from pypdf import PdfReader
        n = len(PdfReader(pdf_path).pages)
    except ImportError:
        n = None
    if n is not None and n != paginas_esperadas:
        print(f"⚠ El PDF tiene {n} páginas y debería tener {paginas_esperadas}: recorta textos "
              f"(arreglos, búsquedas o nota personal) para que quepa en una hoja.")
    return n


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("json", help="diagnosticos/<slug>.json")
    ap.add_argument("--sin-pdf", action="store_true", help="solo la página y el QR (no hace falta Chromium)")
    args = ap.parse_args()

    d = cargar(args.json)
    validar(d, args.json)
    slug = d["slug"]
    apartados, nota, titulo = puntuacion.evaluar(d)
    posiciones = [(b, puntuacion.color_posicion(b["posicion"])) for b in d["busquedas"]]

    os.makedirs(os.path.join(RAIZ, "salida"), exist_ok=True)
    carpeta = os.path.join(RAIZ, "d", slug)
    os.makedirs(carpeta, exist_ok=True)
    png = os.path.join(RAIZ, "salida", f"{slug}-qr.png")
    qr_svg = hacer_qr(URL_HOLA.format(slug=slug), png)

    dorso = bool(d.get("dorso"))
    doc = pagina.render(d, apartados, nota, titulo, posiciones, telefono_whatsapp(), qr_svg, dorso)
    ruta_html = os.path.join(carpeta, "index.html")
    open(ruta_html, "w", encoding="utf-8").write(doc)
    json.dump({"negocio": d["negocio"]}, open(os.path.join(carpeta, "negocio.json"), "w", encoding="utf-8"), ensure_ascii=False)

    print(f"✓ {d['negocio']}: nota {nota}/100 ({titulo})")
    for a in apartados:
        print(f"   {pagina.ICONO[a['color']]} {a['nombre']}")
    print(f"✓ d/{slug}/index.html  y  d/{slug}/negocio.json  (súbelos a la web)")
    print(f"✓ salida/{slug}-qr.png  →  {URL_HOLA.format(slug=slug)}")
    if not args.sin_pdf:
        pdf = os.path.join(RAIZ, "salida", f"{slug}.pdf")
        hacer_pdf(ruta_html, pdf, 2 if dorso else 1)
        print(f"✓ salida/{slug}.pdf  ({'2 caras' if dorso else '1 cara'})")


if __name__ == "__main__":
    main()
