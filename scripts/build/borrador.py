#!/usr/bin/env python3
# Genera borrador.html: copia de index.html con el sistema "Singular Extra" aplicado
# (assets/src/css/extra.css encima de styles.css). No se indexa ni se enlaza desde la web.
# Uso: python3 scripts/build/borrador.py
import re, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
h = (root / 'index.html').read_text(encoding='utf-8')

# 1. Fuera de buscadores
h = re.sub(r'<meta name="robots"[^>]*>', '', h)
h = h.replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow">', 1)
h = re.sub(r'<title>(.*?)</title>', r'<title>BORRADOR · \1</title>', h, count=1)

# 2. Tipografías propias (assets/fonts) en lugar de Google Fonts
h = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.g[^>]*>', '', h)
h = re.sub(r'\s*<link rel="preload" as="style" href="https://fonts\.googleapis[^>]*>', '', h)
h = re.sub(r'\s*<noscript><link rel="stylesheet" href="https://fonts\.googleapis[^>]*></noscript>', '', h)

# 3. Capa de estilos del borrador, después de styles.css
h, n = re.subn(r'(<link rel="stylesheet" href="assets/css/styles\.css[^>]*>)',
               r'\1\n  <link rel="stylesheet" href="assets/src/css/extra.css">', h, count=1)
assert n == 1, 'no se encontró styles.css'

# 4. Data de periódico encima de la foto (columna derecha de la portada)
dateline = ('<div class="sx-hero-side"><p class="sx-dateline"><span>Barcelona</span><span>Google, Maps e IA</span>'
            '<span class="sx-dateline__wide">Marketing local para pequeños negocios</span></p>')
h, n = re.subn(r'(<div class="hero__visual")', dateline + r'\1', h, count=1); assert n == 1, 'no se encontró la foto'
h, n = re.subn(r'(<span class="ai-card__label">.*?</span>\s*</div>\s*</div>)', r'\1</div>', h, count=1, flags=re.S); assert n == 1

# 5. Azul = seleccionado: el pack recomendado deja de ser azul por defecto
h, n = re.subn(r'class="pack pack--step pack--featured"', 'class="pack pack--step pack--recommended"', h); assert n == 1

# 6. Lema de sección como sello
h, n = re.subn(r'(<span class="badge[^"]*">)Sin textos rellenos, trabajo real(</span>)', r'\1¡Sin textos rellenos, trabajo real!\2', h); assert n == 2

# 7. Script del borrador (azul al seleccionar, clic en toda la caja)
h, n = re.subn(r'(<script src="assets/js/main\.js[^"]*" defer></script>)', r'\1\n  <script src="assets/src/js/extra.js" defer></script>', h); assert n == 1

# 8. Problema: anuncio de diagnóstico junto al titular, con estallido
ad = ('''<aside class="sx-adbox reveal" aria-label="Diagnóstico gratis">
            <span class="sx-burst" aria-hidden="true"><b>Gratis</b><span>Diagnóstico</span></span>
            <p class="sx-adbox__head">Visibilidad de luna…</p>
            <p class="sx-adbox__big">¡Gratis!</p>
            <p class="sx-adbox__head">…a precio de barrio.</p>
            <ul><li>Diagnóstico de tu ficha de Google</li><li>Sin compromiso, respuesta en 48&nbsp;h</li><li>Barcelona y alrededores</li></ul>
            <a class="btn btn--yellow" href="#contacto" data-interes="diagnostico">Pedir diagnóstico</a>
          </aside>''')
h, n = re.subn(r'(<div class="boxed-title reveal"><h2 id="pain-title">.*?</h2></div>)',
               lambda m: '<div class="sx-pain-head">' + m.group(1) + '\n          ' + ad + '</div>', h, count=1)
assert n == 1, 'no se encontró el titular del problema'

# 9. Menú: logo en tinta, estático
h, n = re.subn(r'<div class="alogo alogo--nav" aria-hidden="true">.*?</div>\s*</div>\s*</a>',
               '<img class="sx-nav-logo" src="assets/img/logo/logo-ink.webp" alt="" width="480" height="189">\n      </a>', h, count=1, flags=re.S)
assert n == 1, 'no se encontró el logo del menú'

# 10. Lemas de sección como coverlines
mottos = {
    '¡Sin textos rellenos, trabajo real!': ('¡Sin relleno!', 'trabajo de verdad'),
    'SEO + Maps + IA = más fácil de elegir': ('SEO + Maps + IA', '¡el trío ganador!'),
}
for txt, (a1, a2) in mottos.items():
    h, n = re.subn(r'<span class="badge[^"]*">' + re.escape(txt) + '</span>',
                   f'<p class="sx-motto"><span>{a1}</span><span>{a2}</span></p>', h)
    assert n >= 1, txt

# 11. Estallido en la guía gratuita
h, n = re.subn(r'(<div class="contact-card contact-card--yellow">)',
               r'\1\n                <span class="sx-burst--plain sx-burst--guide" aria-hidden="true"><b>Gratis</b><span>Guía</span></span>', h)
assert n == 1

# 12. Estallido de precio fundador junto al precio (se oculta con el bloque de fundador)
for price, saving in (('350', '100'), ('250', '50')):
    h, n = re.subn(r'(<div class="pack__prices" data-founder>.*?<p class="pack__price">' + price + r' €<small>\+ IVA</small>)',
                   r'\1<span class="sx-burst--plain sx-burst--founder" aria-hidden="true"><b>−' + saving + r' €</b><span>Fundador</span></span>',
                   h, count=1, flags=re.S)
    assert n == 1, price

# 13. Iconos retro: sustituyen los símbolos del sprite (assets/src/icons/retro-sprite.svg)
retro = (root / 'assets/src/icons/retro-sprite.svg').read_text(encoding='utf-8')
for sid, body in re.findall(r'<symbol id="(i-[\w-]+)"[^>]*>(.*?)</symbol>', retro, re.S):
    h, n = re.subn(r'<symbol id="' + sid + r'"[^>]*>.*?</symbol>',
                   lambda m: '<symbol id="' + sid + '" viewBox="0 0 48 48">' + body + '</symbol>', h, count=1, flags=re.S)
    assert n == 1, sid

# 14. Pasos: etiqueta con tono de época y número grande delante del título y el subtítulo
NUM = {'1': 'Para empezar con buen pie', '2': 'Para subir un peldaño', '3': 'El no va más'}
def pack_block(m):
    n = re.search(r'Paso (\d)', m.group(1)).group(1)
    return ('<span class="pack__kicker">' + NUM[n] + '</span>\n              <div class="sx-titlebox"><span class="sx-bignum" aria-hidden="true">' + n +
            '</span><div>' + m.group(2) + m.group(3) + '</div></div>')
h, n = re.subn(r'<span class="pack__kicker">([^<]*Paso \d[^<]*)</span>\s*(<h3>.*?</h3>)\s*(<p class="pack__for">.*?</p>)', pack_block, h, flags=re.S)
assert n >= 6, n

# 15. Copy 60s-70s (borrador de /draft-content): se mantiene el anuncio «Visibilidad de luna…»
copy = [
    ('<span class="highlight">Transformamos la imagen digital de tu negocio.</span>', '<span class="highlight">¡Nueva imagen digital para tu negocio!</span>'),
    ('>Entendemos tu problema<', '>Sabemos lo que te pasa<'),
    ('>Packs singulares<', '>Ofertas singulares<'),
    ('</svg>Pide tu diagnóstico gratis</a>', '</svg>¡Pide ya tu diagnóstico gratis!</a>'),
    ('Empieza por el Paso 1; el resto, cuando lo necesites.', 'Empieza por el primero; el resto, cuando te haga falta.'),
    ('</svg>¡Hablemos!</a>', '</svg>¡Cuéntanos tu caso!</a>'),
]
for old, new in copy:
    assert old in h, old
    h = h.replace(old, new)
h, n = re.subn(r'(<p class="hero__tagline">).*?(</p>)', r'\1tú a lo tuyo, nosotros a lo nuestro\2', h, count=1)
assert n == 1

# 16. Lemas: cajas altas y estallidos
_cls = iter(['sx-motto sx-motto--burst', 'sx-motto', 'sx-motto sx-motto--burst sx-motto--pink'])
h = re.sub(r'<p class="sx-motto">', lambda m: '<p class="%s">' % next(_cls), h)

(root / 'borrador.html').write_text(h, encoding='utf-8')
print('borrador.html generado')
