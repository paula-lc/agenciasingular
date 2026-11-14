# Genera las páginas de servicio en castellano (/servicios/<slug>/index.html) con una sola plantilla.
# Datos: packs_data.py y services_data.py (los mismos de las ventanas de detalle), servicios_data.py
# (titular, explicaciones y preguntas) y data/portfolio.json (ejemplos; vacío = no se pinta nada).
# Las versiones en catalán e inglés las genera translate.py con las rutas de routes.py.
# Cada sección solo se escribe si tiene contenido. Todo el texto va en HTML y el JSON-LD repite lo visible.
import json, re, os, sys, html
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
from packs_data import PACKS
from services_data import SERVICES
from servicios_data import PAGES, ORDER
from routes import service_url, page_of
from lang_ui import apply
import portfolio
SITE='https://agenciasingular.es'
VAT={'250 €':'302,50','120 €':'145,20'}
DATA={p['slug']:p for p in PACKS+SERVICES}
esc=lambda s: html.escape(s, quote=False)
att=lambda s: html.escape(s, quote=True)

def founder_left():
    """Plazas del precio fundador: la única variable está en assets/src/js/main.js (SITE.fundadorPlazas)"""
    m=re.search(r'fundadorPlazas:\s*(\d+)', open(ROOT+'assets/src/js/main.js').read())
    return max(0, min(5, int(m.group(1)))) if m else 0

def prices(d):
    """(base, total) normal y, si lo hay, fundador; como texto, tal cual se publican"""
    if isinstance(d['price'], tuple): return d['price'], d.get('founder')
    base=d['price'].replace(' €','')
    return (base, VAT[d['price']]), None
num=lambda s: float(s.replace('.','').replace(',','.'))
def jnum(s):
    v=num(s); return int(v) if v==int(v) else v

def chrome():
    """Cabecera (iconos + menú) y pie, copiados de la guía con las rutas en absoluto"""
    s=open(ROOT+'guia-aparecer-en-ia-y-google-maps.html').read()
    head=s[s.index('<a class="skip-link"'):s.index('</header>')+len('</header>')]
    foot=s[s.index('<footer class="site-footer">'):s.index('</footer>')+len('</footer>')]
    ver=re.search(r'styles\.css\?v=(\d+)', s).group(1)
    def absolutize(h):
        h=re.sub(r'(href|src)="(assets/|guia-|aviso-legal|privacidad|contratar)', r'\1="/\2', h)
        h=re.sub(r'href="\./', 'href="/', h)
        return h.replace(' is-active"','"').replace(' aria-current="page"','')
    return absolutize(head), absolutize(foot), ver

def li(items): return ''.join(f'<li>{esc(x)}</li>' for x in items)
def link(sid): return f'<a href="{service_url(sid,"es")}">Ver {esc(DATA[sid]["title"])}</a>'

def page(sid, plazas, cases):
    d=DATA[sid]; pg=PAGES[sid]; url=SITE+service_url(sid,'es')
    (base,total),founder=prices(d)
    desde=bool(d.get('desde'))
    toc=[]; out=[]
    def sec(i, title, body):
        toc.append((i,title)); out.append(f'<h2 id="{i}">{esc(title)}</h2>\n{body}')
    # 1 · Para quién es y para quién no
    no=''.join(f'<li>{esc(t)}{" "+link(s) if s else ""}</li>' for t,s in pg.get('no_para',[]))
    sec('para-quien','Para quién es y para quién no',
        f'<h3>Es para ti si…</h3>\n<p>{esc(d["para"])}</p>'+(f'\n<h3>No es para ti si…</h3>\n<ul>{no}</ul>' if no else ''))
    # 2 · Qué incluye, explicado
    ex=pg.get('explica',{}); rot=pg.get('rotulo',{}); rotg=pg.get('rotulo_grupo',{}); todo=[]
    groups=''
    for t,items in d['incluye']:
        lis=''
        for x in items:
            if x not in ex: todo.append(x)
            lis+=f'<li><strong>{esc(rot.get(x,x))}</strong>'+(f'<br><span>{esc(ex[x])}</span>' if x in ex else '')+'</li>'
        groups+=f'<h3>{esc(rotg.get(t,t))}</h3>\n<ul>{lis}</ul>\n'
    if d.get('nota') and 'IVA' not in d['nota']: groups+=f'<p>{esc(d["nota"])}</p>\n'
    if d.get('noincluye'): groups+=f'<p><strong>No incluye:</strong> <span>{esc(d["noincluye"])}</span></p>'
    sec('incluye','Qué incluye, explicado',groups)
    # 3 · Cómo trabajamos
    pasos=''.join(f'<li><strong>{esc(w)}</strong><br><span>{esc(t)}</span></li>' for w,t in d['pasos'])
    plazo=f'\n<p><strong>Plazo:</strong> <span>{esc(d["plazo"])}</span></p>' if d.get('plazo') else ''
    if pasos: sec('como-trabajamos','Cómo trabajamos',f'<ol>{pasos}</ol>{plazo}')
    # 4 · Qué necesitamos de ti
    if d.get('necesitamos'): sec('que-necesitamos','Qué necesitamos de ti',f'<ul>{li(d["necesitamos"])}</ul>')
    # 5 · Precio
    pre='desde ' if desde else ''
    line=lambda b,t: f'{pre}{b} € + IVA ({t} € IVA incl.)'
    if founder:
        on=plazas>0
        precio=(f'<div data-founder{"" if on else " hidden"}>\n<p><strong>Precio fundador:</strong> <span>{line(*founder)}</span></p>\n'
                f'<p>Precio fundador · quedan <span data-founder-left>{plazas}</span> de 5 plazas</p>\n'
                f'<p><span>Precio normal:</span> <s>{line(base,total)}</s></p>\n</div>\n'
                f'<div data-web-price{" hidden" if on else ""}>\n<p><strong>{line(base,total)}</strong></p>\n</div>')
    else:
        precio=f'<p><strong>{line(base,total)}</strong></p>'
    if d.get('nota') and 'IVA' in d['nota']: precio+=f'\n<p>{esc(d["nota"])}</p>'
    precio+='\n<p>Precios para negocios, cerrados para el alcance descrito. IVA (21 %) no incluido; te indicamos el total con IVA. Pago 50 % al empezar y 50 % a la entrega. Sin permanencia.</p>'
    sec('precio','Precio',precio)
    # 6 · Preguntas frecuentes (las mismas que van en el JSON-LD)
    faq=pg.get('faq',[])
    if faq:
        sec('preguntas','Preguntas frecuentes',''.join(f'<h3>{esc(q)}</h3>\n<p>{esc(a)}</p>\n'+(f'<p>{link(s)}</p>\n' if s else '') for q,a,s in faq))
    # 7 · Ejemplos (data/portfolio.json; sin casos con permiso no se escribe nada)
    ej=portfolio.render([c for c in cases if c['tipo'] in pg.get('ejemplos',[])])
    if ej: sec('ejemplos','Ejemplos',ej)
    # Siguiente paso: enlaces entre servicios
    if pg.get('sigue'):
        out.append('<h2 id="siguiente">También te puede interesar</h2>\n<ul>'+''.join(f'<li><a href="{service_url(s,"es")}">{esc(DATA[s]["title"])}</a><br><span>{esc(DATA[s]["para"])}</span></li>' for s in pg['sigue'])+'</ul>')
    # 8 · Un solo CTA: el del servicio, el mismo de la portada
    cta=d.get('cta','Pedir propuesta')
    out.append(f'<div class="callout">\n<h3>¿Lo vemos?</h3>\n<p>Cuéntanos qué necesitas y te enviamos una propuesta cerrada en 48 horas.</p>\n'
               f'<a class="btn btn--yellow" href="/contratar.html?servicio={sid}" data-track="{sid}-lo-quiero">{esc(cta)}</a>\n</div>')
    # Datos estructurados: lo mismo que se ve
    visible=founder if (founder and plazas>0) else (base,total)
    spec={'@type':'PriceSpecification','priceCurrency':'EUR','valueAddedTaxIncluded':False}
    offer={'@type':'Offer','url':url,'priceCurrency':'EUR'}
    if desde: spec['minPrice']=jnum(visible[0])
    else: spec['price']=offer['price']=jnum(visible[0])
    offer['priceSpecification']=spec
    local=[{'@type':'City','name':'Barcelona'},{'@type':'City','name':"L'Hospitalet de Llobregat"},{'@type':'City','name':'Sant Cugat del Vallès'},{'@type':'City','name':'Sabadell'},{'@type':'AdministrativeArea','name':'Área metropolitana de Barcelona'}]
    area={'cuidados-esenciales':local,'fotografia':local,'cuidados-esenciales-distancia':[{'@type':'Country','name':'España'}]}.get(sid, local+[{'@type':'Country','name':'España'}])
    graph=[{'@type':'Service','@id':url+'#servicio','name':d['title'],'description':pg['desc'],'url':url,
            'provider':{'@type':'ProfessionalService','@id':SITE+'/#agencia','name':'Agencia Singular','url':SITE+'/'},
            'areaServed':area,'offers':offer},
           {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Inicio','item':SITE+'/'},{'@type':'ListItem','position':2,'name':d['title'],'item':url}]}]
    if faq: graph.append({'@type':'FAQPage','@id':url+'#preguntas','inLanguage':'es','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a,_ in faq]})
    ld=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False,indent=2)
    ld='\n'+'\n'.join('  '+l for l in ld.split('\n'))+'\n  '
    head,foot,ver=chrome()
    meta=''.join(f'<span>{esc(x)}</span>' for x in (d['kicker'], d.get('plazo','')) if x)
    tocs=''.join(f'<li><a href="#{i}">{esc(t)}</a></li>' for i,t in toc)
    body='\n\n          '.join(out)
    doc=f'''<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(pg["title"])}</title>
  <meta name="description" content="{att(pg["desc"])}">
  <link rel="canonical" href="{url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="theme-color" content="#3e6083">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Agencia Singular">
  <meta property="og:title" content="{att(pg["title"])}">
  <meta property="og:description" content="{att(pg["desc"])}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}/assets/img/og-agencia-singular.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/img/icon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/img/icon-180.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap"></noscript>
  <link rel="stylesheet" href="/assets/css/styles.css?v={ver}">
  <script type="application/ld+json">{ld}</script>
</head>
<body>
  {head}

  <main id="main">
    <div class="page-wrap">
      <section class="section section--blue article-hero">
        <div class="container">
          <nav class="breadcrumbs" aria-label="Migas de pan">
            <ol><li><a href="/">Inicio</a></li><li><a href="/#packs">Packs y servicios</a></li><li aria-current="page">{esc(d["title"])}</li></ol>
          </nav>
          <h1>{esc(pg["h1"])}</h1>
          <p class="article-meta">{meta}</p>
        </div>
      </section>

      <div class="container article">
        <aside class="toc" aria-label="Índice">
          <h2>En esta página</h2>
          <ol>{tocs}</ol>
        </aside>

        <article class="prose">
          {body}
        </article>
      </div>
    </div>
  </main>

  {foot}

  <script src="/assets/js/main.js?v={ver}" defer></script>
</body>
</html>
'''
    return apply(doc,'es',page_of(sid)), todo

def run():
    plazas=founder_left(); cases=portfolio.load(); todos={}
    for sid in ORDER:
        doc,todo=page(sid, plazas, cases)
        dest=ROOT+page_of(sid); os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest,'w').write(doc)
        if todo: todos[DATA[sid]['title']]=todo
    return todos
if __name__=='__main__':
    for t,items in run().items():
        print(f'TODO · {t}: ítems sin explicación (se publican solo con su nombre):')
        for x in items: print('   -',x)
