# Genera contratar.html: un formulario adaptado a cada servicio
import re, html, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
idx=open(ROOT+'index.html').read(); gui=open(ROOT+'guia-aparecer-en-ia-y-google-maps.html').read()
sprite=re.search(r'  <!-- Sprite de iconos -->\n(  <svg width="0".*?</svg>\n)', idx, re.S).group(1)
header=re.search(r'  <header class="site-header">.*?</header>\n', gui, re.S).group(0)
header=header.replace(' is-active" href="guia-aparecer-en-ia-y-google-maps.html" aria-current="page"','" href="guia-aparecer-en-ia-y-google-maps.html"')
header=header.replace('class="btn btn--outline" href="./#packs" data-sections="packs servicios"','class="btn btn--outline is-active" href="./#packs" data-sections="packs servicios" aria-current="page"')
footer=re.search(r'  <footer class="site-footer">.*?</footer>\n', gui, re.S).group(0)
VER=re.search(r'styles\.css\?v=(\d+)', gui).group(1)

def text(name,label,ph='',type_='text',req=False,auto=''):
    i=f'f-{name}'
    return (f'<div class="field"><label for="{i}">{label}{"" if req else " <small>(opcional)</small>"}</label>'
            f'<input id="{i}" name="{name}" type="{type_}" placeholder="{ph}"{" required" if req else ""}{f" autocomplete={chr(34)}{auto}{chr(34)}" if auto else ""}></div>')
def area(name,label,ph=''):
    return f'<div class="field"><label for="f-{name}">{label} <small>(opcional)</small></label><textarea id="f-{name}" name="{name}" placeholder="{ph}"></textarea></div>'
def select(name,label,opts):
    o=''.join(f'<option>{html.escape(x)}</option>' for x in opts)
    return f'<div class="field"><label for="f-{name}">{label}</label><select id="f-{name}" name="{name}"><option value="">Elige una opción…</option>{o}</select></div>'
def chips(name,label,opts,kind='checkbox'):
    c=''.join(f'<label class="chip"><input type="{kind}" name="{name}" value="{html.escape(x)}"><span>{html.escape(x)}</span></label>' for x in opts)
    return f'<fieldset class="field chips"><legend>{label}</legend>{c}</fieldset>'

BOOK=['Booksy','Fresha','Treatwell','WhatsApp','Teléfono','Nada todavía']
FICHA=chips('ficha','¿Tienes ficha en Google Maps?',['Sí, y tengo acceso','Sí, pero no tengo acceso','No tengo','No lo sé'],'radio')
# Productos y precios: de precios.json (única fuente). Aquí solo van las preguntas y los textos de cada uno.
import json, os
D=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'precios.json')))
def num(x):
    c=int(round(x*100)); s=f'{c//100:,}'.replace(',','.'); return s+(f',{c%100:02d}' if c%100 else '')
def iva(x): return x*(100+D['iva'])/100
RESENAS=select('resenas','¿Cuántas reseñas tienes?',['Ninguna','Menos de 10','Entre 10 y 50','Más de 50'])
WEB=chips('web_actual','¿Tienes web ahora?',['No tengo','Sí, pero está anticuada','Sí, pero no me trae clientes'],'radio')
DOMINIO=chips('dominio','¿Tienes dominio (tunegocio.es)?',['Sí','No','No lo sé'],'radio')
EXTRA={
 'cuidados-esenciales':dict(icon='i-pin',intro='Para salones que ya tienen web.',fields=[FICHA,RESENAS,chips('reservas','¿Cómo te reservan ahora?',BOOK,'radio'),text('direccion','Dirección del local','Calle, número y ciudad'),text('fotos','¿Cuándo te vendría bien la sesión de fotos?','Ej.: mañanas entre semana')]),
 'escaparate-nuevo':dict(icon='i-monitor',intro='Para salones sin web, o con una que no les gusta.',fields=[FICHA,RESENAS,chips('reservas','¿Cómo te reservan ahora?',BOOK,'radio'),WEB,text('url','Dirección de tu web actual','https://…'),DOMINIO,text('direccion','Dirección del local','Calle, número y ciudad'),text('fotos','¿Cuándo te vendría bien la sesión de fotos?','Ej.: mañanas entre semana')]),
 'cuidados-esenciales-distancia':dict(icon='i-pin',intro='Para salones fuera de Barcelona.',fields=[FICHA,RESENAS,chips('reservas','¿Cómo te reservan ahora?',BOOK,'radio'),text('direccion','Dirección del local','Calle, número y ciudad')]),
 'plan-basico':dict(icon='i-pin',intro='Mes a mes, sin permanencia.',fields=[FICHA]),
 'plan-siempre-visible':dict(icon='i-chart',intro='Mes a mes, sin permanencia. Requiere web con nosotras.',fields=[FICHA,text('url','Dirección de tu web','https://…')]),
 'trastienda':dict(icon='i-chart',intro='',fields=[chips('temas','¿Qué te preocupa?',['Precios','Márgenes','Qué servicios potenciar','Captar clientas nuevas','Fidelizar clientas','Abrir o ampliar el negocio'])]),
 'fotografia':dict(icon='i-aperture',intro='',fields=[chips('que_fotos','¿Qué quieres fotografiar?',['El local','El equipo','Trabajos (uñas, peinados…)','Ambiente con clientas']),text('direccion','¿Dónde está tu salón?','Ciudad y barrio')]),
 'web-una-pagina':dict(icon='i-monitor',intro='',fields=[WEB,text('url','Dirección de tu web actual','https://…'),DOMINIO]),
 'web-completa':dict(icon='i-monitor',intro='',fields=[WEB,text('url','Dirección de tu web actual','https://…'),chips('funciones','¿Qué debe poder hacer tu web?',['Mostrar servicios y precios','Reservas o citas','Varias sedes','Tienda online']),DOMINIO]),
}
def item(slug,name,precio,group,step=0,mensual=False,desde=False,inc=None,plazo='',intro=None):
    u='€/mes' if mensual else '€'
    e=EXTRA[slug]
    return dict(slug=slug,name=name,short=name,icon=e['icon'],step=step,group=group,
                price=f'{"desde " if desde else ""}{num(precio)} {u} + IVA',vat=('' if desde else f'{num(iva(precio))} {u} IVA incl.'),
                intro=intro if intro is not None else e['intro'],inc=inc or [],plazo=plazo,fields=e['fields'])
P=[item(m['slug'],f'Menú {m["num"]} · {m["nombre"]}',m['precio'],'packs',1,inc=[x[0] for x in m['platos']],plazo=m['plazo'],intro=m['para']+'.') for m in sorted(D['menus'],key=lambda m:m['num'])]
P+=[item(p['slug'],p['nombre'],p['precio'],'planes',3,mensual=True,intro=p['nota']) for p in D['planes']]
S=[item(x['slug'],x['nombre'],x['precio'],'carta',desde=x.get('desde',False),intro=x['nota']) for g in D['carta'] for x in g['platos']]
def price_attrs(s):
    return f' data-price="{s["price"]}{" · "+s["vat"] if s["vat"] else ""}"'
def chip_(s, g):
    radio = g in ('packs','planes')
    kind = 'radio' if radio else 'checkbox'
    name = f'paso{s["step"]}' if radio else 'servicio'
    return (f'<label class="chip chip--service" data-group="{g}"><input type="{kind}" name="{name}" value="{s["name"]}" data-slug="{s["slug"]}"'
            f' data-short="{s.get("short", s["name"])}" data-icon="{s["icon"]}"{price_attrs(s)}><span><svg class="icon icon--sm" aria-hidden="true"><use href="#{s["icon"]}"/></svg>'
            f'{s.get("short", s["name"])}</span></label>')
head_=lambda g, t: f'<button type="button" class="chips__group" data-group-toggle="{g}" aria-expanded="true">{t} <span class="chips__arrow" aria-hidden="true">▾</span></button>'
picker=(head_('packs','El menú <small>(uno)</small>')+''.join(chip_(x,'packs') for x in P if x['group']=='packs')
                +head_('planes','La sobremesa <small>(uno)</small>')+''.join(chip_(x,'planes') for x in P if x['group']=='planes')

                +head_('carta','A la carta <small>(los que quieras)</small>')+''.join(chip_(x,'carta') for x in S))
ALL=P+S
from menus import datos_js
DATOS=datos_js()

fieldsets=''
aside=''
for s in ALL:
    fieldsets+=f'''
              <fieldset class="service-fields" data-fields="{s["slug"]}" hidden disabled>
                <legend class="service-fields__title"><svg class="icon" aria-hidden="true"><use href="#{s["icon"]}"/></svg>Sobre tu proyecto: {s.get("short", s["name"])}</legend>
                {"".join(s["fields"]).replace('id="f-', f'id="f-{s["slug"]}-').replace('for="f-', f'for="f-{s["slug"]}-')}
              </fieldset>'''
    lis=''.join(f'<li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>{x}</li>' for x in s['inc'])
    precio=f'<p class="service-info__price">{s["price"]}<small class="service-info__vat">{s["vat"]}</small></p>'
    tiempo=f'<p class="service-info__time"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-clock"/></svg>{s["plazo"]}</p>' if s['plazo'] else ''
    aside+=f'''
              <div class="contact-card service-info" data-info="{s["slug"]}" hidden>
                <span class="icon-tile"><svg class="icon" aria-hidden="true"><use href="#{s["icon"]}"/></svg></span>
                <h3>{s["name"]}</h3>{precio}
                <p>{s["intro"]}</p>
                {"<h4>Qué incluye</h4><ul>"+lis+"</ul>" if lis else ""}
                {tiempo}
              </div>'''

page=f'''<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Contratar un servicio · Agencia Singular</title>
  <meta name="description" content="Apunta tu menú y te enviamos la propuesta con el total cerrado en 48 h laborables.">
  <link rel="canonical" href="https://agenciasingular.es/contratar.html">
  <meta name="robots" content="noindex, follow">
  <meta name="theme-color" content="#3e6083">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/img/icon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/img/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="stylesheet" href="assets/css/styles.css?v={VER}">
  <script type="application/json" id="precios-data">{DATOS}</script>
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>
{sprite}{header}
  <main id="main">
    <div class="page-wrap">
      <section class="section section--blue article-hero">
        <div class="container">
          <nav class="breadcrumbs" aria-label="Migas de pan">
            <ol><li><a href="./">Inicio</a></li><li><a href="./#packs">El menú</a></li><li aria-current="page">La comanda</li></ol>
          </nav>
          <h1 class="hire-title"><span class="hire-title__kicker" data-hire-kicker>Cuéntanos</span><span class="hire-title__name"><span data-hire-title>Qué necesitas</span></span></h1>
          <p data-hire-lead>Apunta un menú y los platos que quieras, responde unas preguntas rápidas sobre tu salón y te enviamos la propuesta con el total cerrado en 48 h laborables. Sin compromiso.</p>
          <p class="hire-wa"><a class="btn btn--yellow" href="#" data-whatsapp data-whatsapp-link target="_blank" rel="noopener" hidden><svg class="icon" aria-hidden="true"><use href="#i-chat"/></svg>Prefiero escribir por WhatsApp</a></p>
        </div>
      </section>

      <section class="section section--cream">
        <div class="container contact">
          <h2 class="visually-hidden">Formulario de contratación</h2>
          <form class="form" id="hire-form" data-contact-form data-subject="Contratar" novalidate>
            <fieldset class="field chips chips--services" data-need-choice>
              <legend>¿Qué quieres contratar?</legend>
              {picker}
            </fieldset>
{fieldsets}

            <div class="form__row">
              {text("nombre","Nombre y apellido","Escribe tu nombre…",req=True,auto="name")}
              {text("negocio","Nombre de tu negocio","Tu tienda, cafetería, salón…",req=True,auto="organization")}
            </div>
            <div class="form__row">
              {text("email","Dirección de email","tucorreo@ejemplo.com","email",req=True,auto="email")}
              {text("telefono","Teléfono","Para llamarte si lo prefieres","tel",auto="tel")}
            </div>
            <div class="form__row">
              {select("sector","Sector",["Peluquería","Uñas","Centro de estética","Otro comercio"])}
              {text("ciudad","Ciudad o barrio","Ej.: Barcelona, Gràcia")}
            </div>
            {area("mensaje","¿Algo más que debamos saber?","Plazos, presupuesto, ideas…")}
            <input class="hp" type="text" name="web_hp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <label class="field--check">
              <input type="checkbox" name="privacidad" required>
              <span>He leído y acepto la <a href="privacidad.html">política de privacidad</a>. Usaremos tus datos solo para responderte.</span>
            </label>
            <button class="btn btn--send" type="submit" data-track="pedir-la-cuenta-enviar">Pedir la cuenta</button>
            <p class="form__status" role="status" data-form-status></p>
          </form>

          <aside class="contact-aside">
            <div class="menu menu--comanda" data-cart hidden>
              <header class="menu__head"><p class="menu__kicker">Mesa: tu salón</p><h3 class="menu__title">La comanda</h3></header>
              <ul class="menu__platos" data-cart-list></ul>
              <div class="menu__cuenta" data-cart-total hidden>
                <p class="menu__linea"><span class="menu__nombre">Total</span><span class="menu__puntos" aria-hidden="true"></span><span class="menu__precio" data-total-base></span></p>
                <p class="menu__linea"><span class="menu__nombre">Con IVA</span><span class="menu__puntos" aria-hidden="true"></span><span class="menu__precio" data-total-iva></span></p>
                <p class="menu__nota" data-total-nota hidden></p>
              </div>
              <div class="menu__aviso" data-cart-tip hidden></div>
              <p class="menu__nota">Te enviamos el total cerrado en 48 h laborables. Sin compromiso.</p>
              <a class="btn btn--crimson btn--block" href="#f-nombre" data-track="pedir-la-cuenta">Pedir la cuenta</a>
            </div>
            <div class="contact-card service-info" data-info="" >
              <h3>¿Cómo funciona?</h3>
              <ul>
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Apuntas un menú y los platos sueltos que quieras</li>
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Te enviamos el total cerrado en 48 h laborables</li>
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Sin permanencia y todo a tu nombre</li>
              </ul>
            </div>{aside}
            <div class="contact-card contact-card--yellow">
              <h3>¿No sabes qué necesitas?</h3>
              <p>Haz el test de visibilidad o pide un diagnóstico gratis por escrito (en 48 h laborables) y te orientamos.</p>
              <a class="btn btn--crimson" href="./#test">Hacer el test</a>
              <a class="btn btn--ghost" href="./?interes=diagnostico#contacto" data-track="cta-diagnostico">Diagnóstico gratis</a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  </main>

{footer}
  <script src="assets/js/main.js?v={VER}" defer></script>
</body>
</html>
'''
open(ROOT+'contratar.html','w').write(page)
print('ok')
