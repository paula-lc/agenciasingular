"""Convierte dist/ en una web que se abre con doble clic en index.html (sin servidor).

Uso:  npx vite build --base=./  &&  python scripts/standalone.py

- Mete el JS y el CSS dentro de index.html (un <script type="module"> en línea sí funciona desde file://).
- Reapunta las imágenes a assets/ relativo al documento.
"""
import glob
import os
import re

dist = os.path.join(os.path.dirname(__file__), '..', 'dist')
html_path = os.path.join(dist, 'index.html')
html = open(html_path, encoding='utf-8').read()

js_path = glob.glob(os.path.join(dist, 'assets', 'index-*.js'))[0]
css_path = glob.glob(os.path.join(dist, 'assets', 'index-*.css'))[0]
js = open(js_path, encoding='utf-8').read()
css = open(css_path, encoding='utf-8').read()

# imágenes: new URL(`x.jpg`,import.meta.url) -> relativo al index.html
js, n = re.subn(r"""new URL\((["'`])([^"'`]+)\1,import\.meta\.url\)""", r'new URL("assets/\2",document.baseURI)', js)
assert '</script' not in js
print('imágenes reapuntadas:', n)

html = re.sub(r'<script type="module"[^>]*></script>', '', html)
html = re.sub(r'<link rel="stylesheet"[^>]*>', '', html)
html = html.replace('</head>', '<style>' + css + '</style>\n</head>')
html = html.replace('</body>', '<script type="module">' + js + '</script>\n</body>')
open(html_path, 'w', encoding='utf-8').write(html)

os.remove(js_path)
os.remove(css_path)
print('listo:', os.path.abspath(html_path))
