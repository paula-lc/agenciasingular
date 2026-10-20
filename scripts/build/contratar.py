# Genera contratar.html: un formulario adaptado a cada servicio
import re, html
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
# Cada producto lleva: precio web, total con IVA y, si lo hay, precio fundador (founder) o de cliente (client)
P=[
 dict(slug='cuidados-esenciales',name='Cuidados esenciales',short='Cuidados esenciales',icon='i-pin',step=1,
  price='450 € + IVA',vat='544,50 € IVA incl.',founder=('350 € + IVA','423,50 € IVA incl.'),
  intro='Que te encuentren en Google, te elijan y reserven sin intermediarios.',
  inc=['Ficha de Google completa y cuidada: categorías, servicios, horarios y descripción','Botón «Reservar» conectado a tu Booksy, Fresha o Treatwell','Sesión de fotos de 1 h en tu local: 10–12 fotos editadas','Cartel con QR para conseguir reseñas y plantillas para responderlas','Alta en Apple Maps y Bing','Informe de resultados a los 60 días'],
  plazo='1–2 semanas',
  fields=[FICHA,
          select('resenas','¿Cuántas reseñas tienes?',['Ninguna','Menos de 10','Entre 10 y 50','Más de 50']),
          chips('reservas','¿Cómo te reservan ahora?',BOOK,'radio'),
          text('direccion','Dirección del local','Calle, número y ciudad'),
          text('fotos','¿Cuándo te vendría bien la sesión de fotos?','Ej.: mañanas entre semana')]),
 dict(slug='cuidados-esenciales-distancia',name='Cuidados esenciales a distancia',short='Cuidados a distancia',icon='i-pin',step=1,
  price='300 € + IVA',vat='363 € IVA incl.',founder=('250 € + IVA','302,50 € IVA incl.'),
  intro='Lo mismo que Cuidados esenciales, sin sesión de fotos. Para negocios fuera de Barcelona.',
  inc=['Todo lo de Cuidados esenciales, excepto la sesión de fotos','Guía para hacer buenas fotos con el móvil','Edición de tus fotos'],
  plazo='1–2 semanas',
  fields=[FICHA,
          select('resenas','¿Cuántas reseñas tienes?',['Ninguna','Menos de 10','Entre 10 y 50','Más de 50']),
          chips('reservas','¿Cómo te reservan ahora?',BOOK,'radio'),
          text('direccion','Dirección del local','Calle, número y ciudad')]),
 dict(slug='web-una-pagina',name='Web de una página',short='Web de una página',icon='i-monitor',step=2,
  price='690 € + IVA',vat='834,90 € IVA incl.',client=('250 € + IVA','302,50 € IVA incl.'),
  intro='Tu escaparate propio, con tu botón de reservas.',
  inc=['Una página clara, rápida y pensada para el móvil','Botón de reserva de Booksy o Fresha integrado','2 rondas de cambios','Dominio y alojamiento el primer año'],
  plazo='',
  fields=[chips('web_actual','¿Tienes web ahora?',['No tengo','Sí, pero está anticuada','Sí, pero no me trae clientes'],'radio'),
          text('url','Dirección de tu web actual','https://…'),
          chips('reservas','¿Cómo te reservan ahora?',BOOK,'radio'),
          chips('dominio','¿Tienes dominio (tunegocio.es)?',['Sí','No','No lo sé'],'radio')]),
 dict(slug='web-completa',name='Web completa',short='Web completa',icon='i-monitor',step=2,
  price='desde 1.290 € + IVA',vat='1.560,90 € IVA incl.',
  intro='Para negocios con muchos servicios que contar. Presupuesto a medida.',
  inc=['Hasta 6 páginas','SEO local con una página por servicio clave','Preguntas frecuentes y datos estructurados para buscadores e IA','30 min de La Trastienda'],
  plazo='',
  fields=[chips('web_actual','¿Tienes web ahora?',['No tengo','Sí, pero está anticuada','Sí, pero no me trae clientes'],'radio'),
          text('url','Dirección de tu web actual','https://…'),
          chips('funciones','¿Qué debe poder hacer tu web?',['Mostrar servicios y precios','Reservas o citas','Pedidos por WhatsApp','Tienda online','Carta o menú']),
          chips('dominio','¿Tienes dominio (tunegocio.es)?',['Sí','No','No lo sé'],'radio')]),
 dict(slug='plan-basico',name='Plan Básico',short='Plan Básico',icon='i-pin',step=3,
  price='59 €/mes + IVA',vat='71,39 €/mes IVA incl.',
  intro='Tu ficha, siempre al día. Mes a mes, sin permanencia.',
  inc=['1 publicación al mes en tu ficha de Google','Respuesta a todas tus reseñas'],
  plazo='Mes a mes, sin permanencia',
  fields=[FICHA]),
 dict(slug='plan-siempre-visible',name='Plan Siempre visible',short='Siempre visible',icon='i-chart',step=3,
  price='149 €/mes + IVA',vat='180,29 €/mes IVA incl.',
  intro='Ficha y web, cuidadas cada mes. Para clientes con web. Mes a mes, sin permanencia.',
  inc=['Todo lo del Plan Básico','Mantenimiento web (hasta 1 h de cambios, copias, dominio y alojamiento)','Contenido SEO','Seguimiento de tu visibilidad en IA','Informe mensual'],
  plazo='Mes a mes, sin permanencia',
  fields=[FICHA,
          text('url','Dirección de tu web','https://…')]),
]

S=[
 dict(slug='fotografia',name='Fotografía Local',icon='i-aperture',price='250 € + IVA',vat='302,50 € IVA incl.',
  intro='Fotos de tu espacio y tus productos. Nada de bancos de imágenes.',
  inc=['Sesión en tu local con dirección de arte','Fotos editadas para web, Google Maps y redes','Derechos de uso para siempre'],
  plazo='Entrega en 1 a 2 semanas',
  fields=[chips('que_fotos','¿Qué quieres fotografiar?',['El local','El equipo','Productos','Platos o bebidas','Trabajos (uñas, peinados…)','Ambiente con clientes']),
          text('direccion','¿Dónde está tu negocio?','Ciudad y barrio'),
          text('fecha','¿Para cuándo las necesitas?','Ej.: antes de la campaña de Navidad')]),
 dict(slug='trastienda',name='La Trastienda',icon='i-chart',price='120 € + IVA',vat='145,20 € IVA incl.',
  intro='Sesión de consultoría de marketing para tu comercio: precios, márgenes y estrategia comercial para vender mejor.',
  inc=['Sesión de diagnóstico de tu negocio','Revisión de precios, márgenes y oferta','Plan de acción claro y priorizado'],
  plazo='Sesiones de 90 minutos',
  fields=[chips('temas','¿Qué te preocupa?',['Precios','Márgenes','Qué productos o servicios potenciar','Captar clientes nuevos','Fidelizar clientes','Abrir o ampliar el negocio']),
          select('antiguedad','¿Cuánto tiempo lleva abierto tu negocio?',['Aún no he abierto','Menos de 1 año','1 a 3 años','Más de 3 años'])]),
]

def price_attrs(s):
    """Precio que ve el cesto (data-price) y, si lo hay, el de fundador o el de cliente de Cuidados"""
    a=f' data-price="{s["price"]} · {s["vat"]}"'
    if s.get('founder'): a+=f' data-price-founder="{s["founder"][0]} · {s["founder"][1]}"'
    if s.get('client'): a+=f' data-price-client="{s["client"][0]} · {s["client"][1]}"'
    return a
def chip_(s, g):
    radio = g == 'packs'
    kind = 'radio' if radio else 'checkbox'
    name = f'paso{s["step"]}' if radio else 'servicio'
    return (f'<label class="chip chip--service" data-group="{g}"><input type="{kind}" name="{name}" value="{s["name"]}" data-slug="{s["slug"]}"'
            f' data-short="{s.get("short", s["name"])}" data-icon="{s["icon"]}"{price_attrs(s)}><span><svg class="icon icon--sm" aria-hidden="true"><use href="#{s["icon"]}"/></svg>'
            f'{s.get("short", s["name"])}</span></label>')
head_=lambda g, t: f'<button type="button" class="chips__group" data-group-toggle="{g}" aria-expanded="true">{t} <span class="chips__arrow" aria-hidden="true">▾</span></button>'
picker=(head_('packs','Packs y planes <small>(uno por paso)</small>')+''.join(chip_(x,'packs') for x in P)

                +head_('carta','A la carta <small>(los que quieras)</small>')+''.join(chip_(x,'carta') for x in S))
ALL=P+S

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
    if s.get('founder'): precio+=f'<p class="service-info__founder" data-founder>Precio fundador: <strong>{s["founder"][0]}</strong> · {s["founder"][1]}</p>'
    if s.get('client'): precio+=f'<p class="service-info__founder">Si ya eres cliente de Cuidados esenciales: <strong>{s["client"][0]}</strong> · {s["client"][1]}</p>'
    tiempo=f'<p class="service-info__time"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-clock"/></svg>{s["plazo"]}</p>' if s['plazo'] else ''
    aside+=f'''
              <div class="contact-card service-info" data-info="{s["slug"]}" hidden>
                <span class="icon-tile"><svg class="icon" aria-hidden="true"><use href="#{s["icon"]}"/></svg></span>
                <h3>{s["name"]}</h3>{precio}
                <p>{s["intro"]}</p>
                <h4>Qué incluye</h4>
                <ul>{lis}</ul>
                {tiempo}
              </div>'''

page=f'''<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Contratar un servicio · Agencia Singular</title>
  <meta name="description" content="Cuéntanos qué quieres contratar (Cuidados esenciales, web, planes mensuales, fotografía o consultoría) y te enviamos una propuesta cerrada en 48 horas.">
  <link rel="canonical" href="https://agenciasingular.es/contratar.html">
  <meta name="robots" content="noindex, follow">
  <meta name="theme-color" content="#3e6083">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="icon" href="assets/img/icon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="assets/img/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap"></noscript>
  <link rel="stylesheet" href="assets/css/styles.css?v={VER}">
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>
{sprite}{header}
  <main id="main">
    <div class="page-wrap">
      <section class="section section--blue article-hero">
        <div class="container">
          <nav class="breadcrumbs" aria-label="Migas de pan">
            <ol><li><a href="./">Inicio</a></li><li><a href="./#servicios">Servicios</a></li><li aria-current="page">Contratar</li></ol>
          </nav>
          <h1 class="hire-title"><span class="hire-title__kicker" data-hire-kicker>Cuéntanos</span><span class="hire-title__name"><span data-hire-title>Qué necesitas</span></span></h1>
          <p data-hire-lead>Elige un pack o los servicios que quieras, responde unas preguntas rápidas sobre tu negocio y te enviamos una propuesta con precio cerrado en 48 horas. Sin compromiso.</p>
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
              {select("sector","Sector",["Uñas y estética","Peluquería / barbería","Floristería","Taller","Tienda de ropa / comercio","Cafetería / restaurante","Espacio local","Otro"])}
              {text("ciudad","Ciudad o barrio","Ej.: Barcelona, Gràcia")}
            </div>
            {area("mensaje","¿Algo más que debamos saber?","Plazos, presupuesto, ideas…")}
            <input class="hp" type="text" name="web_hp" tabindex="-1" autocomplete="off" aria-hidden="true">
            <label class="field--check">
              <input type="checkbox" name="privacidad" required>
              <span>He leído y acepto la <a href="privacidad.html">política de privacidad</a>. Usaremos tus datos solo para responderte.</span>
            </label>
            <button class="btn btn--send" type="submit">Pedir propuesta</button>
            <p class="form__status" role="status" data-form-status></p>
          </form>

          <aside class="contact-aside">
            <div class="contact-card cart" data-cart hidden>
              <h3>Tu propuesta</h3>
              <ul class="cart__list" data-cart-list></ul>
              <p class="cart__total" data-cart-total hidden></p>
              <div class="cart__tip" data-cart-tip hidden></div>
              <p class="cart__note">Te enviamos el precio cerrado de todo junto en 48 horas. Sin compromiso.</p>
            </div>
            <div class="contact-card service-info" data-info="" >
              <h3>¿Cómo funciona?</h3>
              <ul>
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Combinas un pack y servicios sueltos</li>
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Te enviamos una propuesta cerrada en 48 h</li>
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
print('slugs', [s['slug'] for s in ALL])
