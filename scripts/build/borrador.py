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

# 4. Data de cabecera de periódico sobre la portada
dateline = ('<div class="container"><p class="sx-dateline"><span>Barcelona</span>'
            '<span>Marketing local para pequeños negocios</span><span>Google, Maps e IA</span></p></div>\n        ')
h, n = re.subn(r'(<div class="container hero__grid">)', dateline + r'\1', h, count=1)
assert n == 1, 'no se encontró la portada'

(root / 'borrador.html').write_text(h, encoding='utf-8')
print('borrador.html generado')
