# Regenera toda la web a partir de las fuentes:
#   1. Ventanas de detalle de packs y servicios (modals.py, services_data.py) en index.html
#   2. contratar.html (contratar.py)
#   3. Selector de idioma y enlaces hreflang en las páginas en castellano (lang_ui.py)
#   4. Versiones en catalán (/ca/) e inglés (/en/) con las traducciones de i18n/*.json (translate.py)
#   5. sitemap.xml con las tres versiones
#   7. Páginas de servicio (servicios.py: /servicios/<slug>/, con sus versiones /ca/serveis/ y /en/services/)
#      y el precio fundador en los datos estructurados, igual que el visible (SITE.fundadorPlazas en main.js)
#   6. CSS y JS minificados (minify.py): fuentes en assets/src/, salida en assets/css y assets/js
# Uso: python3 scripts/build/build.py
import subprocess, sys, os, datetime
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from lang_ui import apply, url, LANGS
import translate
ROOT=translate.ROOT
def run(script): subprocess.run([sys.executable, os.path.join(HERE,script)], check=True, stdout=subprocess.DEVNULL)
run('modals.py'); run('contratar.py')
import servicios
from routes import SERVICE_PAGES
from packs_data import PACKS
todos=servicios.run()
def sync_founder():
    """Precio fundador: el JSON-LD y el número de plazas del HTML de la portada dicen lo mismo que se ve.
    La única variable sigue siendo SITE.fundadorPlazas (assets/src/js/main.js)."""
    import json, re
    n=servicios.founder_left()
    s=open(ROOT+'index.html').read()
    m=re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', s, re.S)
    data=json.loads(m.group(2))
    price={p['title']: servicios.jnum((p['founder'] if n>0 else p['price'])[0]) for p in PACKS if p.get('founder')}
    hit=0
    for node in data['@graph']:
        for o in node.get('hasOfferCatalog',{}).get('itemListElement',[]):
            if o.get('name') in price: o['priceSpecification']['price']=price[o['name']]; hit+=1
    assert hit==len(price), 'no encuentro las ofertas con precio fundador en el JSON-LD de index.html'
    txt=json.dumps(data,ensure_ascii=False,indent=2)
    s=s[:m.start(2)]+'\n'+'\n'.join('  '+l for l in txt.split('\n'))+'\n  '+s[m.end(2):]
    s=re.sub(r'(<span data-founder-left>)\d+(</span>)', lambda k: k.group(1)+str(n)+k.group(2), s)
    for a in ('data-founder','data-web-price'):   # visible u oculto ya en el HTML, sin esperar al JavaScript
        show=(n>0)==(a=='data-founder')
        s=re.sub(r'(<(?:span|div|p)\b[^>]*\s'+a+r')( hidden)?(?=[\s>])', lambda k: k.group(1)+('' if show else ' hidden'), s)
    open(ROOT+'index.html','w').write(s)
sync_founder()
for page in translate.PAGES:
    s=open(ROOT+page).read(); open(ROOT+page,'w').write(apply(s,'es',page))
miss=translate.missing()
subprocess.run([sys.executable, os.path.join(HERE,'translate.py')], check=True)
# sitemap
today=datetime.date.today().isoformat()
SITE='https://agenciasingular.es'
rows=[]
for page,prio in (('index.html','1.0'),('guia-aparecer-en-ia-y-google-maps.html','0.8')):
    alts=''.join(f'\n    <xhtml:link rel="alternate" hreflang="{c}" href="{SITE}{url(c,page)}"/>' for c,_,_ in LANGS)+f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{url("es",page)}"/>'
    for c,_,_ in LANGS:
        rows.append(f'  <url>\n    <loc>{SITE}{url(c,page)}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>{prio}</priority>{alts}\n  </url>')
for page in SERVICE_PAGES:
    alts=''.join(f'\n    <xhtml:link rel="alternate" hreflang="{c}" href="{SITE}{url(c,page)}"/>' for c,_,_ in LANGS)+f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{url("es",page)}"/>'
    for c,_,_ in LANGS:
        rows.append(f'  <url>\n    <loc>{SITE}{url(c,page)}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>0.9</priority>{alts}\n  </url>')
rows.append(f'  <url>\n    <loc>{SITE}/reserva/</loc>\n    <lastmod>{today}</lastmod>\n    <priority>0.8</priority>\n  </url>')
open(ROOT+'sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+'\n'.join(rows)+'\n</urlset>\n')
for lang,m in miss.items():
    if m:
        print(f'\n⚠ {len(m)} textos sin traducir al {lang} (se quedan en castellano). Añádelos a scripts/build/i18n/{lang}.json:')
        for s in m: print('   ', s[:110])
for t,items in todos.items():
    print(f'\nTODO · {t}: ítems de «Qué incluye» sin explicación (se publican solo con su nombre; ver servicios_data.py):')
    for x in items: print('   -', x)
import minify; print('Minificando CSS y JS...'); minify.run()
print('\nListo.')
