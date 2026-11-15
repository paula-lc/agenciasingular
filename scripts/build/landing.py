# Genera /salones/index.html: la landing para peluquerías, uñas y estética (copy v1 del 15/11/2026).
# Un solo objetivo: que pidan el diagnóstico gratis (el «vale») o reserven 10 minutos.
# Solo en castellano. Reutiliza los estilos de la web; lo propio de la página va en su <style> (clases lp-).
# El precio fundador sale de SITE.fundadorPlazas (main.js) y el bloque de casos, de data/portfolio.json.
import json, re, os, sys, html
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
import portfolio
from servicios import founder_left, chrome
from routes import service_url
SITE='https://agenciasingular.es'; URL=SITE+'/salones/'
AGENDA='https://meetings-eu1.hubspot.com/paula-lara'
TITLE='Ficha de Google, fotos y web para salones · Agencia Singular'
DESC='Cuidamos tu ficha de Google, tus fotos y tu web para que te encuentren y reserven. Peluquerías y estética en Barcelona. Diagnóstico gratis.'
esc=lambda s: html.escape(s, quote=False)
star='<svg class="icon icon--star" aria-hidden="true"><use href="#i-star"/></svg>'
check='<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>'

SUENA=['Tus mejores fotos están en tu móvil, no en Google.','Tienes reseñas preciosas que nadie responde.','Para reservar contigo hay que dar tres saltos.','Internet te da pereza, y tiempo no te sobra.']
PASOS=[('Te miramos con ojos de clienta.','Revisamos tu ficha de Google, tu web y tu Instagram como lo haría alguien que aún no te conoce. Te lo regalamos en un diagnóstico.'),
       ('Te lo dejamos niquelado.','Ficha completa, botón de reservar conectado a tu Booksy, Fresha o Treatwell, fotos de tu local hechas por nosotras y, si hace falta, tu web. En 1 a 3 semanas.'),
       ('Tú atiendes el mostrador.','A los 60 días te enseñamos qué ha cambiado, con las estadísticas de tu propia ficha.')]
GARANTIA=[('Precio cerrado:','sabes el total antes de empezar.'),('Pagas en dos veces:','la mitad al empezar y la otra mitad a la entrega.'),('Sin permanencia:','nada de contratos que atan.'),
          ('Todo es tuyo:','la web, el dominio, las fotos y los accesos.'),('Te enseñamos los números:','informe a los 60 días.')]
FAQ=[('¿Qué es la ficha de Google y por qué importa?','Es lo que aparece cuando alguien busca tu negocio o «peluquería cerca» en Google o Maps: fotos, horario, reseñas y el botón de reservar. Para muchas clientas es tu primer escaparate.'),
     ('¿Necesito tener web?','No para empezar. Si solo tienes Booksy, Fresha, Treatwell o Instagram, te proponemos el Escaparate nuevo: ficha, fotos y una web sencilla con tu botón de reservas.'),
     ('¿Trabajáis con Booksy, Fresha o Treatwell?','Sí. Conectamos el botón de reservar de tu ficha y de tu web a la plataforma que ya usas.'),
     ('¿Cuánto tarda?','Cuidados esenciales, 1-2 semanas. Escaparate nuevo, 2-3 semanas.'),
     ('¿Tenéis que venir al local?','Solo para la sesión de fotos, en Barcelona y el área metropolitana. Todo lo demás lo hacemos online.'),
     ('¿Y si mi negocio no está en Barcelona?','Trabajamos a distancia en toda España, sin sesión de fotos.'),
     ('¿Me garantizáis salir el primero en Google?','No. Garantizamos el trabajo bien hecho y enseñarte los resultados con tus propias estadísticas.'),
     ('¿Qué pasa cuando terminamos?','Todo queda a tu nombre. Si quieres que sigamos cuidándolo, lo hablamos.')]
# Tarjetas: (ancla, cinta, título, texto, precio normal, total normal, precio fundador, total fundador, precio sin plazas, total sin plazas, plazo, CTA, servicios de contratar.html, página)
# Escaparate nuevo = Cuidados esenciales + Web de una página al precio de cliente de Cuidados (250 €):
#   con precio fundador 350 + 250 = 600 €; sin plazas 450 + 250 = 700 €; por separado 450 + 690 = 1.140 €.
PACKS=[
 dict(id='escaparate-nuevo', cinta='Recomendado si no tienes web', titulo='Escaparate nuevo', sub='El lote completo', featured=True,
      texto='Tu ficha de Google cuidada, una sesión de fotos de 1 h en tu local (10-12 fotos editadas) y tu web de una página con botón de reservas. Todo a juego.',
      was='1.140 €', founder=('600','726'), normal=('700','847'), plazo='2-3 semanas', cta='Quiero mi escaparate nuevo', servicio='cuidados-esenciales,web-una-pagina', page=None),
 dict(id='cuidados-esenciales', cinta='Si ya tienes web', titulo='Cuidados esenciales', sub='',
      texto='Que te encuentren en Google, te elijan y reserven sin intermediarios. Incluye la sesión de fotos de 1 h en tu local.',
      was='450 €', founder=('350','423,50'), normal=('450','544,50'), plazo='1-2 semanas', cta='Quiero Cuidados esenciales', servicio='cuidados-esenciales', page='cuidados-esenciales'),
 dict(id='cuidados-esenciales-distancia', cinta='Fuera de Barcelona', titulo='Cuidados esenciales a distancia', sub='',
      texto='Lo mismo, sin sesión de fotos: te damos una guía para hacerlas con el móvil y las editamos nosotras.',
      was='300 €', founder=('250','302,50'), normal=('300','363'), plazo='1-2 semanas', cta='Quiero la versión a distancia', servicio='cuidados-esenciales-distancia', page='cuidados-esenciales-distancia'),
]
CARTA=[('Fotografía Local:','fotos de tu espacio y tu trabajo. 250 € + IVA · 302,50 € IVA incl.','fotografia'),
       ('La Trastienda:','90 minutos de consultoría para tu comercio. 120 € + IVA · 145,20 € IVA incl.','trastienda'),
       ('Web completa:','para negocios con muchos servicios. Desde 1.290 € + IVA · presupuesto a medida.','web-completa')]

CSS='''
  .lp-bar{margin:0;background:var(--yellow);color:var(--blue-deep);text-align:center;font-family:var(--font-display);font-size:13px;letter-spacing:.04em;text-transform:uppercase;padding:9px 16px;line-height:1.4}
  .lp-bar[hidden]{display:none}
  .lp-nav{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .lp-ante{font-family:"Yellowtail","Brush Script MT",cursive;font-size:clamp(30px,4vw,44px);line-height:1;color:var(--yellow-light);transform:rotate(-3deg);transform-origin:left bottom;margin:0 0 14px}
  .lp-hero h1{font-size:clamp(34px,5vw,60px);line-height:1.08;text-transform:uppercase;color:var(--yellow);text-shadow:3px 3px 0 var(--crimson);font-family:var(--font-display);font-weight:400}
  .lp-small{font-size:13.5px;margin-top:14px;opacity:.92}
  .lp-link{color:var(--cream);font-weight:700;text-underline-offset:4px}
  .lp-link:hover{color:var(--yellow)}
  .lp-visual{position:relative;min-height:480px}
  .lp-visual .hero__photo{inset:0 0 0 4%}
  .lp-seal{position:absolute;left:-18px;bottom:-26px;width:156px;height:156px;z-index:2;transform:rotate(-10deg);filter:drop-shadow(4px 4px 0 var(--blue-ink))}
  .lp-seal text{font-family:var(--font-display);font-size:9.2px;letter-spacing:.05em;text-transform:uppercase;fill:var(--blue-deep)}
  .lp-narrow{max-width:760px}
  .lp-narrow p+p{margin-top:14px}
  .lp-narrow p{font-size:18px;line-height:1.6}
  .lp-cupon{margin-top:32px;max-width:760px;border:3px dashed var(--blue);border-radius:var(--radius);background:var(--cream-soft);padding:24px}
  .lp-cupon h3{font-size:20px;text-transform:uppercase;margin-bottom:14px}
  .lp-cupon ul{list-style:none;padding:0;margin:0;display:grid;gap:10px}
  .lp-cupon label{display:flex;gap:12px;align-items:flex-start;font-size:16.5px;font-weight:600;cursor:pointer}
  .lp-cupon input{width:22px;height:22px;margin-top:2px;accent-color:var(--crimson);flex:none}
  .lp-cierre{margin-top:18px;font-family:var(--font-display);font-size:18px;color:var(--crimson)}
  ol.lp-steps{grid-template-columns:repeat(3,minmax(0,1fr));margin-top:68px}
  .lp-packs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;align-items:stretch;margin-top:48px}
  .lp-packs .pack h3 small{display:block;font-family:var(--font-body);font-weight:700;font-size:13px;letter-spacing:.08em;margin-top:6px}
  .lp-packs .pack__for{flex:1;font-size:15px}
  .lp-packs .pack__prices{display:grid;gap:8px}
  .lp-packs .pack__prices[hidden]{display:none}
  .lp-packs .pack__was,.lp-packs .pack__vat{margin:0}
  .lp-tag{align-self:flex-start;background:var(--blue);color:var(--cream);font-family:var(--font-display);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;padding:5px 10px;border-radius:6px}
  .lp-carta{margin-top:48px;max-width:860px}
  .lp-carta h3{font-size:22px;text-transform:uppercase;margin-bottom:14px}
  .lp-carta ul{padding-left:1.2em;display:grid;gap:8px;font-size:16px}
  .lp-carta a{color:var(--crimson);font-weight:800}
  .lp-fine{margin-top:22px;font-size:13.5px;max-width:860px}
  .lp-fine[hidden]{display:none}
  .lp-list{list-style:none;padding:0;margin:28px 0 0;display:grid;gap:14px;max-width:760px;font-size:17px}
  .lp-list li{display:flex;gap:12px;align-items:flex-start}
  .lp-list .icon{width:22px;height:22px;margin-top:3px;color:var(--crimson);flex:none}
  .lp-no{margin-top:28px;max-width:760px;border-left:5px solid var(--crimson);padding:6px 0 6px 18px;font-size:17px}
  .lp-vale{position:relative;max-width:760px;margin:0 auto;background:var(--cream);color:var(--blue-ink);border:3px dashed var(--blue-ink);border-radius:var(--radius);padding:clamp(24px,4vw,44px);box-shadow:8px 8px 0 var(--crimson)}
  .lp-vale__cut{position:absolute;top:-19px;left:28px;font-size:28px;line-height:1;background:var(--blue);color:var(--cream);padding:0 8px;border-radius:6px}
  .lp-vale h2{font-size:clamp(24px,3.4vw,38px);text-transform:uppercase;line-height:1.15;color:var(--blue)}
  .lp-vale h2 span{display:block;font-size:.55em;letter-spacing:.2em;color:var(--crimson);margin-bottom:6px}
  .lp-vale__sub{margin:12px 0 26px;font-size:16px}
  .lp-vale .btn--send{width:100%}
  .lp-vale__alt{margin-top:18px;font-size:15px}
  .lp-vale__alt a{color:var(--crimson);font-weight:800}
  .lp-foot{text-align:center;display:grid;gap:10px;justify-items:center}
  .lp-foot__fieras{font-family:var(--font-display);font-size:18px;color:var(--yellow)}
  .lp-cases{margin-top:36px;display:grid;gap:24px;max-width:860px}
  @media (max-width:980px){.lp-packs,ol.lp-steps{grid-template-columns:1fr;row-gap:40px}.lp-visual{min-height:380px;margin-top:8px}.lp-seal{left:-6px;width:128px;height:128px}}
  @media (max-width:520px){.lp-navcta{padding:10px 14px;font-size:11.5px}.lp-visual{min-height:320px}}
'''
def price_block(p, plazas):
    def blk(pair): return f'<p class="pack__price">{pair[0]} €<small>+ IVA</small></p>\n              <p class="pack__vat">{pair[1]} € IVA incl.</p>'
    on=plazas>0
    return (f'<div class="pack__prices" data-founder{"" if on else " hidden"}>\n              <p class="pack__was"><s>{p["was"]}</s></p>\n              {blk(p["founder"])}\n'
            f'              <p class="pack__badge">{star}Precio fundador · quedan <span data-founder-left>{plazas}</span> de 5 plazas</p>\n            </div>\n'
            f'            <div class="pack__prices" data-web-price{" hidden" if on else ""}>\n              '
            +(f'<p class="pack__was"><s>{p["was"]}</s></p>\n              ' if p['was'].split()[0]!=p['normal'][0] else '')+f'{blk(p["normal"])}\n            </div>')
def pack(p, plazas):
    more=f'\n            <a class="pack__more" href="{service_url(p["page"],"es")}">Ver qué incluye <span aria-hidden="true">→</span></a>' if p['page'] else ''
    sub=f'<small>{esc(p["sub"])}</small>' if p['sub'] else ''
    return f'''<article class="pack{' pack--featured' if p.get('featured') else ''}" id="{p['id']}">
            {f'<span class="pack__ribbon">{star}{esc(p["cinta"])}</span>' if p.get('featured') else f'<span class="lp-tag">{esc(p["cinta"])}</span>'}
            <h3>{esc(p['titulo'])}{sub}</h3>
            <p class="pack__for">{esc(p['texto'])}</p>
            {price_block(p, plazas)}
            <p class="pack__time"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-clock"/></svg>{esc(p['plazo'])}</p>{more}
            <a class="btn {'btn--yellow' if p.get('featured') else 'btn--ghost'}" href="/contratar.html?servicio={p['servicio']}" data-track="salones-pack-{p['id']}">{esc(p['cta'])}</a>
          </article>'''

def build():
    plazas=founder_left(); on=plazas>0
    head,foot,ver=chrome()
    sprite=head[head.index('<svg'):head.index('<header')].strip()
    logo=re.search(r'<a class="nav__logo".*?</a>', head, re.S).group(0)
    cases=portfolio.render(portfolio.load())
    ld=json.dumps({'@context':'https://schema.org','@type':'FAQPage','@id':URL+'#preguntas','inLanguage':'es',
                   'mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in FAQ]},ensure_ascii=False,indent=2)
    ld='\n'+'\n'.join('  '+l for l in ld.split('\n'))+'\n  '
    fonts='https://fonts.googleapis.com/css2?family=Archivo+Black&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&family=Yellowtail&display=swap'
    doc=f'''<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(TITLE)}</title>
  <meta name="description" content="{html.escape(DESC)}">
  <link rel="canonical" href="{URL}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="theme-color" content="#3e6083">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Agencia Singular">
  <meta property="og:title" content="{html.escape(TITLE)}">
  <meta property="og:description" content="{html.escape(DESC)}">
  <meta property="og:url" content="{URL}">
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
  <link rel="preload" as="style" href="{fonts}" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="{fonts}"></noscript>
  <link rel="stylesheet" href="/assets/css/styles.css?v={ver}">
  <style>{CSS}  </style>
  <script type="application/ld+json">{ld}</script>
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>

  {sprite}

  <p class="lp-bar" data-founder{"" if on else " hidden"}>★ ¡Atención, comercio de la zona! Quedan <span data-founder-left>{plazas}</span> de 5 plazas a precio fundador ★</p>

  <header class="site-header">
    <nav class="container nav lp-nav" aria-label="Principal">
      {logo}
      <a class="btn btn--cream lp-navcta" href="#vale" data-track="salones-cta-cabecera"><svg class="icon icon--line" aria-hidden="true"><use href="#i-steth"/></svg>Diagnóstico gratis</a>
    </nav>
  </header>

  <main id="main">
    <div class="page-wrap">

      <!-- 1 · Hero -->
      <section class="section section--blue hero lp-hero" aria-labelledby="lp-title">
        <div class="container hero__grid">
          <div>
            <p class="lp-ante">¡Nuevo en Barcelona!</p>
            <h1 id="lp-title">Tu negocio es de primera. Que en internet también se note.</h1>
            <p class="hero__copy">Somos la niñera digital del comercio local. Cuidamos tu ficha de Google, tus fotos y tu web para que quien te busque te encuentre, te elija y reserve. Tú, a lo tuyo: el mostrador.</p>
            <div class="hero__ctas">
              <a class="btn btn--yellow" href="#vale" data-track="salones-cta-hero">{star}La casa invita: quiero mi diagnóstico gratis</a>
              <a class="lp-link" href="{AGENDA}" target="_blank" rel="noopener" data-track="salones-agenda-hero">Prefiero hablar 10 minutos <span aria-hidden="true">→</span></a>
            </div>
            <p class="lp-small">Sin compromiso. Es tuyo, trabajes con nosotras o no.</p>
          </div>
          <div class="lp-visual">
            <div class="hero__photo">
              <picture>
                <source srcset="/assets/img/hero/peluqueria.webp?v=3" type="image/webp">
                <img src="/assets/img/hero/peluqueria.jpg?v=3" alt="Peluquera cortando el pelo a una clienta en su salón" width="576" height="736" fetchpriority="high">
              </picture>
            </div>
            <svg class="lp-seal" viewBox="0 0 160 160" role="img" aria-label="Hecho a mano en Barcelona · Desde 2026">
              <circle cx="80" cy="80" r="78" fill="#fab419"/><circle cx="80" cy="80" r="72" fill="none" stroke="#2c4763" stroke-width="2" stroke-dasharray="3 4"/>
              <path id="lp-arc-a" d="M 19 80 A 61 61 0 0 1 141 80" fill="none"/><path id="lp-arc-b" d="M 30 80 A 50 50 0 0 0 130 80" fill="none"/>
              <text><textPath href="#lp-arc-a" startOffset="50%" text-anchor="middle">Hecho a mano en Barcelona</textPath></text>
              <text><textPath href="#lp-arc-b" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">Desde 2026</textPath></text>
              <path d="M80 50l8.2 18.6 20.2 2-15.2 13.5 4.4 19.9L80 93.6 62.4 104l4.4-19.9-15.2-13.5 20.2-2z" fill="#b82b55"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 2 · Empatía -->
      <section class="section section--cream" id="problema" aria-labelledby="lp-problema">
        <div class="container">
          <h2 class="section-title lp-narrow" id="lp-problema">Lo bueno de tu negocio no cabe en una ficha a medio rellenar.</h2>
          <div class="lp-narrow" style="margin-top:24px">
            <p>En persona, tu salón lo tiene todo: buenas manos, buen género y clientas que repiten.</p>
            <p>Pero quien te busca en Google ve otra cosa: fotos de hace años, un horario que no cuadra, una web que no abre o un perfil de reservas que podría ser de cualquiera.</p>
            <p>Y elige al de enfrente. No porque sea mejor, sino porque se ve mejor.</p>
          </div>
          <div class="lp-cupon">
            <h3>¿Te suena?</h3>
            <ul>
              {''.join(f'<li><label><input type="checkbox"><span>{esc(x)}</span></label></li>' for x in SUENA)}
            </ul>
            <p class="lp-cierre">Si has marcado alguna, tenemos que hablar.</p>
          </div>
        </div>
      </section>

      <!-- 3 · Tres pasos -->
      <section class="section section--soft" id="pasos" aria-labelledby="lp-pasos">
        <div class="container">
          <span class="eyebrow">{star}Así trabaja tu niñera digital</span>
          <h2 class="section-title" id="lp-pasos" style="margin-top:16px">Tres pasos, sin líos. Como en las tiendas de toda la vida.</h2>
          <ol class="steps lp-steps">
            {''.join(f'<li class="step"><h3>{esc(t)}</h3><p>{esc(d)}</p></li>' for t,d in PASOS)}
          </ol>
        </div>
      </section>

      <!-- 4 · Género de la casa -->
      <section class="section section--cream" id="precios" aria-labelledby="lp-precios">
        <div class="container">
          <span class="eyebrow">{star}Género de la casa</span>
          <h2 class="section-title" id="lp-precios" style="margin-top:16px">Precios cerrados, como los de antes.</h2>
          <p class="section-lead">Sin letra pequeña. Bueno, solo esta: el IVA va aparte y siempre te decimos el total.</p>
          <div class="lp-packs">
          {chr(10).join('          '+pack(p, plazas) for p in PACKS).strip()}
          </div>
          <div class="lp-carta">
            <h3>A la carta</h3>
            <ul>
              {''.join(f'<li><a href="{service_url(s,"es")}">{esc(a)}</a> {esc(b)}</li>' for a,b,s in CARTA)}
            </ul>
          </div>
          <p class="lp-fine" data-founder{"" if on else " hidden"}><strong>Precio fundador:</strong> A cambio, nos dejas una reseña, nos permites enseñar el antes y el después y compartes con nosotras las estadísticas de tu ficha durante 60 días.</p>
        </div>
      </section>

      <!-- 5 · Prueba honesta -->
      <section class="section section--blue" id="nuevas" aria-labelledby="lp-nuevas">
        <div class="container">
          <h2 class="section-title lp-narrow" id="lp-nuevas">Somos nuevas, y no lo escondemos.</h2>
          <div class="lp-narrow" style="margin-top:20px">
            <p>No te vamos a enseñar reseñas que no tenemos. Por eso las 5 primeras pagan menos: a cambio, nos ayudan a demostrar lo que sabemos hacer.</p>
          </div>{f'{chr(10)}          <div class="lp-cases">{cases}</div>' if cases else ''}
        </div>
      </section>

      <!-- 6 · Garantía de la casa -->
      <section class="section section--cream" id="garantia" aria-labelledby="lp-garantia">
        <div class="container">
          <span class="eyebrow">{star}Garantía de la casa</span>
          <h2 class="section-title" id="lp-garantia" style="margin-top:16px">Lo que sí te prometemos.</h2>
          <ul class="lp-list">
            {''.join(f'<li>{check}<span><strong>{esc(a)}</strong> {esc(b)}</span></li>' for a,b in GARANTIA)}
          </ul>
          <p class="lp-no"><strong>Lo que no te prometemos:</strong> salir el primero en Google. Nadie puede garantizarlo, y quien te lo prometa no te está diciendo la verdad.</p>
        </div>
      </section>

      <!-- 7 · Preguntas frecuentes (las mismas del JSON-LD) -->
      <section class="section section--soft" id="preguntas" aria-labelledby="lp-faq">
        <div class="container faq">
          <div class="faq__intro"><h2 id="lp-faq">Preguntas frecuentes</h2></div>
          <div class="faq__list">
            {''.join(f'<details><summary>{esc(q)}</summary><div class="answer"><p>{esc(a)}</p></div></details>' for q,a in FAQ)}
          </div>
        </div>
      </section>

      <!-- 8 · El vale recortable -->
      <section class="section section--blue" id="vale" aria-labelledby="lp-vale">
        <div class="container">
          <div class="lp-vale">
            <span class="lp-vale__cut" aria-hidden="true">✂</span>
            <h2 id="lp-vale"><span>Vale por</span>un diagnóstico gratis de tu escaparate digital</h2>
            <p class="lp-vale__sub">Válido para peluquerías, uñas y centros de estética. Sin caducidad y sin compromiso.</p>
            <form class="form" id="vale-form" data-contact-form data-subject="Vale diagnóstico" novalidate>
              <div class="field">
                <label for="v-negocio">Nombre del negocio</label>
                <input id="v-negocio" name="negocio" type="text" autocomplete="organization" required>
              </div>
              <div class="field">
                <label for="v-ficha">Enlace a tu ficha de Google o a tu Instagram</label>
                <input id="v-ficha" name="ficha" type="text" inputmode="url" autocomplete="off" required>
              </div>
              <div class="field">
                <label for="v-contacto">WhatsApp o email</label>
                <input id="v-contacto" name="contacto" type="text" autocomplete="off" required data-vale-contacto>
              </div>
              <input type="hidden" name="email"><input type="hidden" name="whatsapp">
              <input type="checkbox" name="interes" value="Diagnóstico gratis de mi ficha" data-interes="diagnostico" checked hidden>
              <input class="hp" type="text" name="web_hp" tabindex="-1" autocomplete="off" aria-hidden="true">
              <label class="field--check">
                <input type="checkbox" name="privacidad" required>
                <span>He leído y acepto la <a href="/privacidad.html">política de privacidad</a>. Usaremos tus datos solo para responderte.</span>
              </label>
              <button class="btn btn--send" type="submit">Canjear mi vale</button>
              <p class="form__status" role="status" data-form-status></p>
            </form>
            <p class="lp-vale__alt">¿Prefieres hablar? <a href="{AGENDA}" target="_blank" rel="noopener" data-track="salones-agenda-vale">10 minutos aquí</a></p>
          </div>
        </div>
      </section>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container lp-foot">
      <p class="lp-foot__fieras">Agencia Singular. Somos niñeras y somos fieras 🐆</p>
      <p>Que tu escaparate digital trabaje por ti.</p>
      <p>© <span data-year>2026</span> Agencia Singular · <a href="/">Inicio</a> · <a href="/aviso-legal.html">Aviso legal</a> · <a href="/privacidad.html">Privacidad</a></p>
    </div>
  </footer>

  <script>
    /* El vale pide un solo dato de contacto: lo repartimos en email o WhatsApp, que es lo que entiende el formulario */
    (function () {{
      var c = document.querySelector("[data-vale-contacto]"); if (!c) return;
      var f = c.form;
      c.addEventListener("input", function () {{
        var v = c.value.trim(), mail = v.indexOf("@") > -1;
        f.elements.email.value = mail ? v : ""; f.elements.whatsapp.value = mail ? "" : v;
      }});
    }})();
  </script>
  <script src="/assets/js/main.js?v={ver}" defer></script>
</body>
</html>
'''
    os.makedirs(ROOT+'salones', exist_ok=True)
    open(ROOT+'salones/index.html','w').write(doc)
if __name__=='__main__': build(); print('ok')
