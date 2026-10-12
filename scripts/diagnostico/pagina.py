"""HTML del diagnóstico: una sola página que se ve bien en el móvil (/d/<slug>/) y se imprime en A4 (el PDF sale de ella)."""
import html
import os
import re
from urllib.parse import quote

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
ICONO = {"verde": "✓", "ambar": "!", "rojo": "✕"}
ETIQUETA = {"verde": "Bien", "ambar": "Mejorable", "rojo": "A arreglar"}
URL_SITIO = "https://agenciasingular.es"

# Precio del Pack "Que te encuentren" (el mismo que la web: index.html, FAQ y modals.py)
PACK_PRECIO, PACK_IVA = 290, 21


def tokens():
    """Colores y tipografías de :root en assets/src/css/styles.css."""
    css = open(os.path.join(RAIZ, "assets", "src", "css", "styles.css"), encoding="utf-8").read()
    raiz = re.search(r":root\s*\{(.*?)\n\}", css, re.S).group(1)
    t = dict(re.findall(r"(--[\w-]+):\s*([^;]+);", raiz))
    return {k: v.strip() for k, v in t.items()}


def e(x):
    return html.escape(str(x), quote=True)


def euros(x):
    return f"{x:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def fecha_larga(iso):
    a, m, d = iso.split("-")
    return f"{int(d)} de {MESES[int(m) - 1]} de {a}"


def semaforo(color, texto=None):
    return f'<span class="sem sem--{color}" role="img" aria-label="{ETIQUETA[color]}">{ICONO[color]}</span>'


CSS = """
:root {{ {raiz} }}
* {{ box-sizing: border-box; }}
html {{ -webkit-text-size-adjust: 100%; }}
body {{ margin: 0; background: var(--cream-soft); color: var(--ink); font-family: var(--font-body); font-size: 16px; line-height: 1.5; }}
h1, h2, h3 {{ font-family: var(--font-display); font-weight: 400; line-height: 1.12; margin: 0; color: var(--blue); }}
a {{ color: var(--blue); }}
.hoja {{ max-width: 760px; margin: 0 auto; padding: 20px 16px 48px; display: grid; gap: 22px; }}
.cab {{ display: flex; justify-content: space-between; align-items: center; gap: 12px; }}
.cab img {{ width: 120px; height: auto; display: block; }}
.cab p {{ margin: 0; font-size: 13px; text-align: right; color: var(--blue); font-weight: 600; }}
.titulo {{ display: grid; gap: 4px; }}
.titulo .sup {{ font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--crimson); margin: 0; }}
.titulo h1 {{ font-size: clamp(26px, 7vw, 38px); }}
.titulo .sub {{ margin: 0; font-size: 14px; color: #55524a; }}
.nota-personal {{ margin: 0; padding: 12px 16px; border-left: 5px solid var(--yellow); background: #fff; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-style: italic; }}
.nota-box {{ display: flex; gap: 18px; align-items: center; background: var(--blue); color: var(--cream); border-radius: var(--radius-lg); padding: 18px 20px; }}
.nota-box .num {{ font-family: var(--font-display); font-size: 52px; line-height: 1; color: var(--yellow); flex: none; }}
.nota-box .num small {{ font-size: 20px; color: var(--cream); }}
.nota-box p {{ margin: 0; font-weight: 700; font-size: 17px; }}
.nota-box p span {{ display: block; font-weight: 500; font-size: 13px; opacity: .85; margin-top: 2px; }}
section h2 {{ font-size: 19px; text-transform: uppercase; margin-bottom: 10px; }}
.lista {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }}
.fila {{ display: flex; gap: 12px; align-items: flex-start; background: #fff; border-radius: var(--radius-sm); padding: 10px 12px; border: 1px solid #e5dfc6; break-inside: avoid; }}
.fila b {{ display: block; }}
.fila span.txt {{ font-size: 14px; color: #4b4b4b; display: block; }}
.fila .pos {{ margin-left: auto; font-family: var(--font-display); font-size: 18px; color: var(--blue); flex: none; align-self: center; }}
.sem {{ flex: none; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: 15px; color: #fff; margin-top: 1px; }}
.sem--verde {{ background: #2e7d32; }}
.sem--ambar {{ background: var(--yellow); color: var(--blue-ink); }}
.sem--rojo {{ background: var(--crimson); }}
.verde-nota {{ margin: 10px 0 0; font-size: 14px; }}
.arreglos {{ list-style: none; counter-reset: n; margin: 0; padding: 0; display: grid; gap: 8px; }}
.arreglos li {{ counter-increment: n; display: flex; gap: 12px; align-items: center; background: var(--yellow); color: var(--blue-ink); border-radius: var(--radius-sm); padding: 10px 14px; font-weight: 700; break-inside: avoid; }}
.arreglos li::before {{ content: counter(n); font-family: var(--font-display); font-size: 22px; color: var(--crimson); flex: none; }}
.cierre {{ background: #fff; border: 2px solid var(--blue); border-radius: var(--radius-lg); padding: 16px 18px; display: grid; gap: 12px; break-inside: avoid; }}
.cierre p {{ margin: 0; }}
.cierre .frase {{ font-weight: 700; color: var(--blue-ink); font-size: 17px; }}
.cierre .acciones {{ display: flex; gap: 10px; flex-wrap: wrap; }}
.btn {{ display: inline-flex; align-items: center; justify-content: center; padding: 13px 20px; border-radius: var(--radius-sm); font-weight: 800; text-decoration: none; border: 2px solid var(--blue-ink); min-height: 48px; }}
.btn--wa {{ background: var(--yellow); color: var(--blue-deep); box-shadow: 3px 3px 0 var(--blue); }}
.btn--ghost {{ background: transparent; color: var(--blue); border-color: var(--blue); }}
.qr {{ display: none; }}
.oferta {{ background: var(--blue); color: var(--cream); border-radius: var(--radius-lg); padding: 20px; display: grid; gap: 12px; }}
.oferta h2 {{ color: var(--yellow); }}
.oferta ul {{ margin: 0; padding-left: 20px; display: grid; gap: 6px; }}
.oferta .precio {{ font-family: var(--font-display); font-size: 28px; color: var(--yellow); }}
.oferta .precio small {{ font-family: var(--font-body); font-size: 14px; color: var(--cream); font-weight: 600; }}
.oferta p {{ margin: 0; }}
.pie {{ font-size: 12px; text-align: center; color: #6a665a; margin: 0; }}
.solo-imp {{ display: none; }}

@media print {{
  @page {{ size: A4; margin: 10mm; }}
  html {{ font-size: 9.5pt; }}
  body {{ background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  .hoja {{ max-width: none; padding: 0; gap: 2.8mm; }}
  section h2 {{ font-size: 12pt; margin-bottom: 2mm; }}
  .lista {{ grid-template-columns: 1fr 1fr; gap: 2mm; }}
  .fila {{ gap: 2.5mm; }}
  .fila span.txt {{ font-size: 8.5pt; line-height: 1.35; }}
  .titulo {{ gap: 0; }}
  .sem {{ width: 6mm; height: 6mm; font-size: 9pt; }}
  .solo-pant, .pie {{ display: none !important; }}
  .solo-imp {{ display: block; }}
  .cab img {{ width: 30mm; }}
  .titulo h1 {{ font-size: 21pt; }}
  .nota-personal {{ padding: 2mm 4mm; }}
  .nota-box {{ padding: 3mm 5mm; }}
  .nota-box .num {{ font-size: 34pt; }}
  .fila {{ padding: 2mm 3mm; }}
  .arreglos {{ gap: 2mm; }}
  .arreglos li {{ padding: 2mm 4mm; }}
  .cierre {{ grid-template-columns: 1fr 26mm; align-items: center; gap: 5mm; padding: 2.5mm 5mm; }}
  .cierre .texto {{ display: grid; gap: 2mm; }}
  .qr {{ display: grid; justify-items: center; gap: 1mm; font-size: 7.5pt; text-align: center; }}
  .qr svg {{ width: 26mm; height: 26mm; display: block; }}
  .dorso {{ break-before: page; }}
  .oferta {{ padding: 8mm; gap: 5mm; }}
  .oferta .qr {{ color: var(--cream); }}
  .oferta .qr svg {{ background: #fff; }}
  a {{ color: inherit; text-decoration: none; }}
}}
"""


def render(d, apartados, nota, titulo, posiciones, tel_wa, qr_svg, dorso):
    t = tokens()
    raiz = " ".join(f"{k}: {v};" for k, v in t.items())
    n = e(d["negocio"])
    url_hola = f"{URL_SITIO}/hola/?n={e(d['slug'])}&src=visita"
    wa_msg = f"Hola Paula, soy de {d['negocio']}, me dejaste el diagnóstico."
    wa = f"https://wa.me/{tel_wa}?text={quote(wa_msg)}" if tel_wa else ""

    verdes = [a["nombre"] for a in apartados if a["color"] == "verde"]
    sem_html = "".join(
        f'<li class="fila">{semaforo(a["color"])}<div><b>{e(a["nombre"])}</b><span class="txt">{e(a["detalle"])}</span></div></li>'
        for a in apartados)
    def fila_busqueda(b, c):
        pos = b["posicion"]
        txt = f"Sois el nº {pos} en Google Maps." if pos else "No salís entre los primeros resultados."
        num = f'<span class="pos">#{pos}</span>' if pos else ""
        return (f'<li class="fila">{semaforo(c)}<div><b>«{e(b["consulta"])}»</b>'
                f'<span class="txt">{txt}</span></div>{num}</li>')
    busq_html = "".join(fila_busqueda(b, c) for b, c in posiciones)
    arreglos = "".join(f"<li>{e(x)}</li>" for x in d["arreglos_top3"])
    nota_personal = f'<p class="nota-personal">{e(d["nota_personal"])}</p>' if d.get("nota_personal") else ""
    verdes_txt = (f'<p class="verde-nota">Lo de verde ya lo tenéis genial: {e(", ".join(v.lower() for v in verdes))}.</p>' if verdes else "")
    cierre = e(d.get("cierre") or "Esto lo podéis arreglar vosotras mismas. Si preferís que lo haga yo, os lo dejo hecho en una semana.")

    total = PACK_PRECIO * (1 + PACK_IVA / 100)
    oferta = f"""
    <section class="oferta {'dorso' if dorso else 'solo-pant'}" aria-labelledby="of-t">
      <h2 id="of-t">Si preferís que lo haga yo</h2>
      <p>Pack «Que te encuentren»: dejo vuestra ficha de Google Maps lista y os doy las herramientas para conseguir reseñas.</p>
      <ul>
        <li>Ficha de Google optimizada de arriba abajo: categorías, servicios, horario y fotos.</li>
        <li>Kit de reseñas: QR, cartel para el mostrador y plantillas de respuesta.</li>
        <li>Datos iguales en directorios y web, para que Google y las IA se fíen de vosotros.</li>
        <li>Listo en 1 a 2 semanas. Pago 50&nbsp;% al empezar y 50&nbsp;% a la entrega.</li>
      </ul>
      <p class="precio">{PACK_PRECIO}&nbsp;€ + IVA <small>· {euros(total)}&nbsp;€ en total</small></p>
      <div class="qr">{qr_svg}<span>Escanea y escríbeme</span></div>
    </section>"""

    botones = ""
    if wa:
        botones += f'<a class="btn btn--wa" href="{e(wa)}" target="_blank" rel="noopener">Escríbeme por WhatsApp</a>'
    botones += f'<a class="btn btn--ghost" href="../../hola/?n={e(d["slug"])}&amp;src=visita">Dejar mis datos</a>'

    return f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Diagnóstico de {n} · Agencia Singular</title>
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap">
<style>{CSS.format(raiz=raiz)}</style>
</head>
<body>
<main class="hoja">
  <header class="cab">
    <img src="../../assets/img/logo-agencia-singular.webp" alt="Agencia Singular" width="537" height="201">
    <p>{e(fecha_larga(d["fecha"]))}</p>
  </header>

  <div class="titulo">
    <p class="sup">Diagnóstico gratis de vuestra ficha de Google</p>
    <h1>{n}</h1>
    <p class="sub">{e(d["sector"])} · {e(d["barrio"])}</p>
  </div>
  {nota_personal}

  <div class="nota-box">
    <div class="num">{nota}<small>/100</small></div>
    <p>{e(titulo)}<span>Con los mismos criterios que el test de visibilidad de agenciasingular.es</span></p>
  </div>

  <section aria-labelledby="t-busq">
    <h2 id="t-busq">Cómo os encuentran hoy</h2>
    <ul class="lista">{busq_html}</ul>
  </section>

  <section aria-labelledby="t-ficha">
    <h2 id="t-ficha">Vuestra ficha, apartado a apartado</h2>
    <ul class="lista">{sem_html}</ul>
    {verdes_txt}
  </section>

  <section aria-labelledby="t-arr">
    <h2 id="t-arr">Lo primero que yo cambiaría</h2>
    <ol class="arreglos">{arreglos}</ol>
  </section>

  <section class="cierre" aria-label="Siguiente paso">
    <div class="texto">
      <p class="frase">{cierre}</p>
      <p class="solo-imp">Con la cámara del móvil, escaneando el código me escribís directamente: {e(url_hola.replace('https://', '').split('?')[0].rstrip('/'))}</p>
      <div class="acciones solo-pant">{botones}</div>
    </div>
    <div class="qr">{qr_svg}<span>Escanea y escríbeme</span></div>
  </section>
  {oferta}
  <p class="pie">Hecho con cariño por Paula · Agencia Singular · Horta-Guinardó · agenciasingular.es</p>
</main>
</body>
</html>
"""
