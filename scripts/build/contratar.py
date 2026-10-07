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

P=[
 dict(slug='pack-encuentren',name='Pack Que te encuentren',short='Que te encuentren',icon='i-pin',price='desde 290 €',
  intro='Para negocios con clientes fieles que en Google Maps son invisibles o están a medias.',
  inc=['Perfil de Empresa de Google optimizado de arriba abajo','Kit de reseñas: QR, cartel impreso y plantillas','Alta coherente en directorios y base para la IA'],
  plazo='1 a 2 semanas',
  fields=[chips('ficha','¿Tienes ficha en Google Maps?',['Sí, y tengo acceso','Sí, pero no tengo acceso','No tengo','No lo sé'],'radio'),
          select('resenas','¿Cuántas reseñas tienes?',['Ninguna','Menos de 10','Entre 10 y 50','Más de 50']),
          text('direccion','Dirección del local','Calle, número y ciudad')]),
 dict(slug='pack-arranque',name='Pack Arranque',short='Arranque',icon='i-store',price='desde 490 €',
  intro='Lo esencial bien hecho en 7 a 10 días: Google Maps, web de una página con reservas, fotos exprés e Instagram alineado.',
  inc=['Google Maps esencial: perfil completo y fotos','Web de una página con botón de reserva (Booksy, Fresha o WhatsApp)','Sesión de fotos exprés (1 hora, 15 fotos) e Instagram alineado'],
  plazo='7 a 10 días',
  fields=[chips('ficha','¿Tienes ficha en Google Maps?',['Sí, y tengo acceso','Sí, pero no tengo acceso','No tengo','No lo sé'],'radio'),
          chips('reservas','¿Cómo te reservan ahora?',['Booksy','Fresha','Treatwell','WhatsApp','Teléfono','Nada todavía'],'radio'),
          text('instagram','Tu usuario de Instagram','@tunegocio'),
          text('fotos','¿Cuándo te vendría bien la sesión de fotos?','Ej.: mañanas entre semana')]),
 dict(slug='pack-escaparate',name='Pack Escaparate',short='Escaparate',icon='i-monitor',price='desde 1.290 €',
  intro='Web nueva o rediseñada, SEO local, sesión de fotos y Google Maps: tu casa digital a la altura de tu negocio.',
  inc=['Diseño o rediseño web rápida y fácil de actualizar, con dominio y alojamiento el primer año','SEO local, sesión de fotografía y todo el Pack Que te encuentren','De regalo: 30 minutos de La Trastienda'],
  plazo='3 a 4 semanas',
  fields=[chips('web_actual','¿Tienes web ahora?',['No tengo','Sí, pero está anticuada','Sí, pero no me trae clientes'],'radio'),
          text('url','Dirección de tu web actual','https://…'),
          chips('funciones','¿Qué debe poder hacer tu web?',['Mostrar servicios y precios','Reservas o citas','Pedidos por WhatsApp','Tienda online','Carta o menú']),
          text('fotos','¿Cuándo te vendría bien la sesión de fotos?','Ej.: mañanas entre semana')]),
 dict(slug='pack-singular',name='Pack Singular',short='Singular',icon='i-palette',price='desde 2.490 €',
  intro='Cambio de imagen total: nueva marca, web, fotos, SEO y lanzamiento en redes.',
  inc=['Rebranding completo y aplicaciones (rótulo, tarjetas, carta…)','Todo el Pack Escaparate','Primer mes de redes con vídeos y sesión de La Trastienda'],
  plazo='6 a 10 semanas',
  fields=[chips('motivo','¿Qué te trae?',['Voy a abrir','Voy a reabrir o reformar','Mi marca ya no me representa','Quiero subir precios o de categoría'],'radio'),
          chips('logo_actual','¿Tienes logo ahora?',['Sí, y quiero renovarlo','Sí, pero no me representa','No tengo'],'radio'),
          chips('web_actual','¿Tienes web ahora?',['No tengo','Sí, pero está anticuada','Sí, y me sirve'],'radio'),
          text('fecha','¿Tienes una fecha clave?','Ej.: reapertura en marzo')]),
 dict(slug='plan-basico',name='Plan Básico',short='Básico',icon='i-pin',price='desde 59 €/mes',
  intro='Lo justo para que tu ficha de Google no se quede parada, sin pagar un mantenimiento completo.',
  inc=['Una publicación al mes en tu ficha de Google','Respuesta a todas tus reseñas','Sin permanencia'],
  plazo='Mes a mes, sin permanencia',
  fields=[chips('ficha','¿Tienes ficha en Google Maps?',['Sí, y tengo acceso','Sí, pero no tengo acceso','No tengo','No lo sé'],'radio'),
          select('resenas','¿Cuántas reseñas tienes?',['Ninguna','Menos de 10','Entre 10 y 50','Más de 50'])]),
 dict(slug='pack-visible',name='Plan Siempre visible',short='Siempre visible',icon='i-chart',price='desde 149 €/mes',
  intro='Mantenimiento mensual de tu web y tu presencia en Google, Maps y las IA, para seguir subiendo sin tener que pensar en ello.',
  inc=['Mantenimiento web: cambios, copias de seguridad, dominio y alojamiento','Publicaciones en Google Maps y gestión de reseñas','Contenido SEO, ajustes para IA e informe mensual, sin permanencia'],
  plazo='Mes a mes, sin permanencia',
  fields=[chips('base','¿Qué tienes ya en marcha?',['Web','Ficha de Google Maps','Redes sociales','Nada todavía']),
          text('url','Dirección de tu web','https://…'),
          chips('objetivo','¿Qué es lo más importante para ti?',['Más llamadas y reservas','Más reseñas','Salir en las IA','Que no se me olvide publicar'])]),
]

S=[
 dict(slug='rebranding',name='Rebranding',icon='i-palette',
  intro='Una identidad que se recuerda y que cuenta quién eres: logo, colores, tipografías y tono de voz.',
  inc=['Diagnóstico de tu marca actual y de tu competencia','Logo, paleta, tipografías y manual de uso sencillo','Aplicaciones: rótulo, tarjetas, carta, packaging o redes'],
  plazo='3 a 5 semanas',
  fields=[chips('logo_actual','¿Tienes logo ahora?',['Sí, y quiero renovarlo','Sí, pero no me representa','No tengo'],'radio'),
          chips('piezas','¿Qué necesitas?',['Logo','Colores y tipografías','Rótulo o fachada','Tarjetas','Carta o menú','Packaging','Plantillas para redes']),
          text('estilo','¿Cómo te gustaría que se viera tu marca?','Ej.: retro, cálida, elegante, divertida…'),
          text('fecha','¿Tienes una fecha clave?','Ej.: reapertura en marzo')]),
 dict(slug='diseno-web',name='Diseño Web',icon='i-monitor',
  intro='Una web rápida, bonita y fácil de actualizar que convierte visitas en clientes de tu barrio.',
  inc=['Diseño a medida, adaptado al móvil','Textos pensados para Google y para las IA','Reservas, WhatsApp, carta o tienda integrados'],
  plazo='3 a 6 semanas',
  fields=[chips('web_actual','¿Tienes web ahora?',['No tengo','Sí, pero está anticuada','Sí, pero no me trae clientes'],'radio'),
          text('url','Dirección de tu web actual','https://…'),
          chips('funciones','¿Qué debe poder hacer tu web?',['Mostrar servicios y precios','Reservas o citas','Pedidos por WhatsApp','Tienda online','Carta o menú','Blog o novedades']),
          chips('dominio','¿Tienes dominio (tunegocio.es)?',['Sí','No','No lo sé'],'radio')]),
 dict(slug='seo-local',name='SEO Local',icon='i-search',
  intro='Que te encuentren tus vecinos justo cuando buscan lo que tú vendes.',
  inc=['Análisis de tus búsquedas clave y de tu competencia','Páginas por servicio y zona optimizadas','Informe mensual con posiciones y llamadas'],
  plazo='Resultados en 3 a 6 meses',
  fields=[text('url','Dirección de tu web','https://…'),
          text('busquedas','¿Por qué búsquedas te gustaría aparecer?','Ej.: manicura semipermanente en Sant Antoni'),
          text('competencia','¿Qué negocios de tu zona salen ahora por delante?','Nombres o webs')]),
 dict(slug='ia',name='Posicionamiento en IA',icon='i-sparkles',
  intro='Preparamos tu información para que Gemini, ChatGPT y la IA de Google te entiendan, se fíen de ti y te recomienden.',
  inc=['Auditoría de lo que dicen hoy las IA de tu negocio','Datos coherentes en web, Maps y directorios','Contenido y datos estructurados que las IA pueden citar'],
  plazo='Primeros cambios en 4 a 8 semanas',
  fields=[chips('prueba','Si preguntas a una IA por tu servicio en tu zona…',['Me recomienda','Recomienda a mi competencia','No lo he probado'],'radio'),
          text('pregunta','¿Qué pregunta te gustaría que te trajera clientes?','Ej.: ¿dónde compro un ramo bonito en Gràcia?'),
          text('url','Dirección de tu web','https://…')]),
 dict(slug='fotografia',name='Fotografía Local',icon='i-aperture',price='desde 250 €',
  intro='Fotos reales y profesionales de tu negocio, tu equipo y tus productos estrella. Nada de bancos de imágenes.',
  inc=['Sesión en tu local con dirección de arte','Fotos editadas para web, Google Maps y redes','Derechos de uso para siempre'],
  plazo='Entrega en 1 a 2 semanas',
  fields=[chips('que_fotos','¿Qué quieres fotografiar?',['El local','El equipo','Productos','Platos o bebidas','Trabajos (uñas, peinados…)','Ambiente con clientes']),
          text('direccion','¿Dónde está tu negocio?','Ciudad y barrio'),
          text('fecha','¿Para cuándo las necesitas?','Ej.: antes de la campaña de Navidad')]),
 dict(slug='redes-sociales',name='Redes Sociales',icon='i-share',
  intro='Plantillas con tu marca, calendario de contenidos y gestión para que tus redes trabajen sin robarte las noches.',
  inc=['Estrategia y calendario de contenidos','Plantillas con tu identidad','Gestión, publicación y respuesta (opcional)'],
  plazo='Arranque en 2 semanas',
  fields=[chips('redes','¿Qué redes usas?',['Instagram','TikTok','Facebook','Google (publicaciones)','Ninguna aún']),
          chips('ayuda','¿Qué tipo de ayuda buscas?',['Plantillas para hacerlo yo','Calendario e ideas','Gestión completa','Formación'],'checkbox'),
          text('usuario','Tu usuario principal','@tunegocio')]),
 dict(slug='trastienda',name='La Trastienda',icon='i-chart',price='desde 120 € por sesión',
  intro='Consultoría de negocio retro-directa: precios, márgenes y estrategia comercial para vender mejor.',
  inc=['Sesión de diagnóstico de tu negocio','Revisión de precios, márgenes y oferta','Plan de acción claro y priorizado'],
  plazo='Sesiones de 90 minutos',
  fields=[chips('temas','¿Qué te preocupa?',['Precios','Márgenes','Qué productos o servicios potenciar','Captar clientes nuevos','Fidelizar clientes','Abrir o ampliar el negocio']),
          select('antiguedad','¿Cuánto tiempo lleva abierto tu negocio?',['Aún no he abierto','Menos de 1 año','1 a 3 años','Más de 3 años'])]),
]

PLANS=('plan-basico','pack-visible')
def chip_(s, g):
    radio = g in ('packs','planes')
    kind, name = ('radio', 'pack' if g=='packs' else 'plan') if radio else ('checkbox', 'servicio')
    extra = f' data-price="{s["price"]}"' if s.get('price') else ''
    return (f'<label class="chip chip--service" data-group="{g}"><input type="{kind}" name="{name}" value="{s["name"]}" data-slug="{s["slug"]}"'
            f' data-short="{s.get("short", s["name"])}" data-icon="{s["icon"]}"{extra}><span><svg class="icon icon--sm" aria-hidden="true"><use href="#{s["icon"]}"/></svg>'
            f'{s.get("short", s["name"])}{"" if radio else "<small class=chip__inc>· incluido</small>"}</span></label>')
head_=lambda g, t: f'<button type="button" class="chips__group" data-group-toggle="{g}" aria-expanded="true">{t} <span class="chips__arrow" aria-hidden="true">▾</span></button>'
PK=[x for x in P if x['slug'] not in PLANS]; PL=[x for x in P if x['slug'] in PLANS]
picker=(head_('packs','Packs <small>(elige uno)</small>')+''.join(chip_(x,'packs') for x in PK)
        +head_('planes','Planes mensuales <small>(elige uno)</small>')+''.join(chip_(x,'planes') for x in PL)
        +head_('carta','Servicios a la carta <small>(los que quieras)</small>')+''.join(chip_(x,'carta') for x in S))
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
    aside+=f'''
              <div class="contact-card service-info" data-info="{s["slug"]}" hidden>
                <span class="icon-tile"><svg class="icon" aria-hidden="true"><use href="#{s["icon"]}"/></svg></span>
                <h3>{s["name"]}</h3>{f'<p class="service-info__price">{s["price"]}</p>' if s.get("price") else ""}
                <p>{s["intro"]}</p>
                <h4>Qué incluye</h4>
                <ul>{lis}</ul>
                <p class="service-info__time"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-clock"/></svg>{s["plazo"]}</p>
              </div>'''

page=f'''<!doctype html>
<html lang="es" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Contratar un servicio · Agencia Singular</title>
  <meta name="description" content="Cuéntanos qué servicio quieres contratar (rebranding, web, SEO local, Google Maps, IA, fotografía, redes o consultoría) y te enviamos una propuesta cerrada en 48 horas.">
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
          <p data-hire-lead>Elige un pack, un plan mensual o los servicios que quieras, responde unas preguntas rápidas sobre tu negocio y te enviamos una propuesta con precio cerrado en 48 horas. Sin compromiso.</p>
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
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Combinas un pack, un plan mensual y servicios sueltos</li>
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Te enviamos una propuesta cerrada en 48 h</li>
                <li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Sin permanencia y todo a tu nombre</li>
              </ul>
            </div>{aside}
            <div class="contact-card contact-card--yellow">
              <h3>¿No sabes qué necesitas?</h3>
              <p>Haz el test de visibilidad o pide un diagnóstico gratis de 30 minutos y te orientamos.</p>
              <a class="btn btn--crimson" href="./#test">Hacer el test</a>
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
