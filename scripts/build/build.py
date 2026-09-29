# Regenera toda la web a partir de las fuentes:
#   1. Ventanas de detalle de packs y servicios (modals.py, services_data.py) en index.html
#   2. contratar.html (contratar.py)
#   3. Selector de idioma y enlaces hreflang en las páginas en castellano (lang_ui.py)
#   4. Versiones en catalán (/ca/) e inglés (/en/) con las traducciones de i18n/*.json (translate.py)
#   5. sitemap.xml con las tres versiones
# Uso: python3 scripts/build/build.py
import subprocess, sys, os, datetime
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from lang_ui import apply, url, LANGS
import translate
ROOT=translate.ROOT
def run(script): subprocess.run([sys.executable, os.path.join(HERE,script)], check=True, stdout=subprocess.DEVNULL)
run('modals.py'); run('contratar.py')
for page in translate.PAGES:
    s=open(ROOT+page).read(); open(ROOT+page,'w').write(apply(s,'es',page))
miss=translate.missing()
subprocess.run([sys.executable, os.path.join(HERE,'translate.py')], check=True)
# sitemap
today=datetime.date.today().isoformat()
SITE='https://www.agenciasingular.es'
rows=[]
for page,prio in (('index.html','1.0'),('guia-aparecer-en-ia-y-google-maps.html','0.8')):
    alts=''.join(f'\n    <xhtml:link rel="alternate" hreflang="{c}" href="{SITE}{url(c,page)}"/>' for c,_,_ in LANGS)+f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{url("es",page)}"/>'
    for c,_,_ in LANGS:
        rows.append(f'  <url>\n    <loc>{SITE}{url(c,page)}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>{prio}</priority>{alts}\n  </url>')
open(ROOT+'sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+'\n'.join(rows)+'\n</urlset>\n')
for lang,m in miss.items():
    if m:
        print(f'\n⚠ {len(m)} textos sin traducir al {lang} (se quedan en castellano). Añádelos a scripts/build/i18n/{lang}.json:')
        for s in m: print('   ', s[:110])
print('\nListo.')
