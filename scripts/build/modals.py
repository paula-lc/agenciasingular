# Inserta en index.html el botón "Ver detalles" de cada pack y su ventana con la información completa
import re
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
PACKS=[
 dict(slug='pack-encuentren', kicker='Para empezar ya', name='Que te encuentren', price='290 €', unit='', plazo='1 a 2 semanas', icon='i-pin', btn='btn--crimson',
  para='Tienes un negocio con clientes fieles, pero cuando alguien busca tu servicio en Google Maps apareces a medias, con pocas fotos, sin reseñas recientes o directamente no apareces.',
  incluye=[
   ('Perfil de Empresa de Google, de arriba abajo', ['Reclamamos o recuperamos el acceso a tu ficha si no lo tienes','Categoría principal y secundarias exactas (la decisión que más pesa en Maps)','Servicios o productos con descripción y precio orientativo, horarios, festivos y zona','Descripción del negocio escrita para tus clientes y para Google, sin relleno','Editamos las fotos que nos envíes (luz, color y encuadre) para que se vean profesionales','Fotos ordenadas y etiquetadas: fachada, interior, equipo y trabajos']),
   ('Kit de reseñas', ['Código QR con tu marca que lleva directo a dejar la reseña','Cartel para el mostrador o el escaparate que invita a escanearlo: diseño e impresión incluidos','Mensajes listos para pedir reseñas por WhatsApp sin sonar pesado','Plantillas para responder reseñas buenas y no tan buenas']),
   ('Directorios y base para la IA', ['Mismos datos (nombre, dirección, teléfono) en Apple Maps, Bing y directorios clave','Datos coherentes para que las IA te identifiquen y puedan recomendarte']),
  ],
  pasos=[('Día 1','Llamada de 30 minutos: tu negocio, tus clientes y qué te buscan.'),('Semana 1','Revisamos tu ficha y la de tu competencia, y la dejamos a punto.'),('Semana 2','Kit de reseñas, directorios y una guía corta para mantenerlo tú.')],
  necesitamos=['Acceso a tu ficha de Google (o te ayudamos a recuperarlo)','Tus servicios, precios orientativos y horarios','Unas 10 fotos reales hechas con el móvil (te decimos cuáles y nosotros las editamos)'],
  llevas=['Ficha completa y optimizada, a tu nombre','Tus fotos editadas, listas para Maps, web y redes','Cartel impreso con QR y mensajes para conseguir reseñas','Informe antes/después y guía de mantenimiento'],
  esperar='Una ficha que convence y aparece en más búsquedas de tu zona. Las visitas y llamadas desde Maps suelen notarse en las semanas siguientes; las reseñas dependen de que las pidas, y para eso te damos todo hecho.',
  noincluye='Web ni sesión de fotos (las tienes en versión esencial en el Pack Arranque y completas en el Escaparate). La gestión mensual de la ficha es el Plan Básico o el Siempre visible.'),
 dict(slug='pack-arranque', kicker='Tu primera web', name='Arranque', price='490 €', unit='', plazo='7 a 10 días', icon='i-store', btn='btn--crimson',
  para='Necesitas una presencia online cuidada pero sencilla: un estudio de uñas o de estética, una tienda pequeña o tu primera web. Lo esencial bien hecho, rápido y sin complicarte.',
  incluye=[
   ('Google Maps esencial', ['Perfil de Empresa completo: categorías, servicios, horarios y descripción','Tus mejores fotos de la sesión, subidas y ordenadas']),
   ('Web de una página', ['Diseñada a partir de nuestra plantilla, adaptada a tu marca y pensada para el móvil','Tus servicios, precios orientativos, horario, mapa y contacto','Botón de reserva conectado a Booksy, Fresha o WhatsApp','Dominio y alojamiento el primer año, a tu nombre']),
   ('Sesión de fotos exprés', ['1 hora en tu local','15 fotos editadas para Maps, web e Instagram']),
   ('Instagram alineado', ['Biografía clara con lo que haces y dónde','Portadas de destacadas con tu marca','Enlace a tu web o a tu sistema de reservas']),
  ],
  pasos=[('Día 1','Llamada de 30 minutos y elección de tu plantilla.'),('Días 2-4','Sesión de fotos exprés y textos.'),('Días 5-8','Web, ficha de Google e Instagram listos para revisar.'),('Días 9-10','Ajustes contigo (una ronda de cambios) y publicación.')],
  necesitamos=['Tu logo y colores (si no tienes, elegimos una tipografía y un color que te representen)','Tus servicios, precios y horario','Acceso a tu ficha de Google, a tu Instagram y a tu sistema de reservas','Una hora en tu local para las fotos'],
  llevas=['Web de una página publicada, a tu nombre','Ficha de Google completa y con fotos','15 fotos profesionales tuyas para siempre','Instagram coherente con tu web'],
  esperar='Una presencia online profesional en menos de dos semanas, con todo listo para recibir reservas. Cuando quieras crecer, el siguiente paso natural es el Plan Básico cada mes o el Pack Escaparate.',
  noincluye='El kit de reseñas con cartel impreso y el alta en directorios (están en el Pack Que te encuentren), páginas por servicio ni SEO local a fondo (Pack Escaparate), ni la gestión mensual (Plan Básico o Siempre visible).'),
 dict(slug='pack-escaparate', kicker='Web + Google', name='Escaparate', price='1.290 €', unit='', plazo='3 a 4 semanas', icon='i-monitor', btn='btn--yellow',
  para='Tu web no existe, está anticuada o no te trae clientes. Quieres una casa digital a la altura de tu negocio, que funcione en el móvil y que Google y las IA entiendan.',
  incluye=[
   ('Web nueva o rediseñada', ['Diseño a medida con tu marca, pensado primero para el móvil','Rápida, segura y fácil de actualizar por ti','Hasta 6 páginas: inicio, servicios, sobre ti, contacto…','Reservas, WhatsApp, pedidos o carta integrados según tu negocio','Textos escritos contigo, claros y sin relleno']),
   ('SEO local', ['Una página por cada servicio clave (lo que la gente busca de verdad)','Títulos, descripciones y enlaces pensados para tu barrio y tu ciudad','Alta en Google Search Console y analítica sencilla']),
   ('Fotografía', ['Sesión de fotos en tu local: espacio, equipo y tus productos o trabajos estrella','Fotos editadas y optimizadas para web, Maps y redes']),
   ('Todo el Pack Que te encuentren', ['Perfil de Empresa de Google optimizado de arriba abajo: categorías, servicios, horarios y descripción','Tus fotos en la ficha, ordenadas y etiquetadas','Kit de reseñas: QR, cartel impreso y mensajes para pedirlas y responderlas','Alta coherente en Apple Maps, Bing y directorios clave']),
   ('Dominio, alojamiento e IA', ['Dominio (tunegocio.es) y alojamiento incluidos durante el primer año, a tu nombre','Preguntas frecuentes y datos estructurados para que las IA te entiendan']),
   ('De regalo', ['30 minutos de La Trastienda: repasamos tus precios y qué servicios destacar en la web']),
  ],
  pasos=[('Semana 1','Llamada de arranque, 30 minutos de La Trastienda, estructura de la web y búsquedas clave.'),('Semana 2','Sesión de fotos, textos y diseño. Te enseñamos una primera versión.'),('Semana 3','Ajustes contigo (dos rondas de cambios), SEO local y Google Maps.'),('Semana 4','Publicación, pruebas y una sesión para que sepas actualizarla.')],
  necesitamos=['Tu logo y colores (si no tienes, mira el Pack Singular)','Una mañana o tarde para la sesión de fotos','Tus servicios, precios y lo que te hace diferente','Si ya tienes dominio, el acceso; si no, lo registramos a tu nombre'],
  llevas=['Web publicada, a tu nombre y sin permanencia','Fotos profesionales para usar donde quieras','Ficha de Google optimizada y kit de reseñas','Guía sencilla para que puedas actualizarla'],
  esperar='Una web que da confianza, se ve bien en el móvil y convierte visitas en llamadas, reservas o mensajes. El SEO empieza a dar frutos en semanas y crece con los meses; no prometemos el número 1 en Google, sino hacerlo bien para tener opciones reales.',
  noincluye='A partir del segundo año, la renovación del dominio y el alojamiento (a tu nombre), que va incluida si contratas el Plan Siempre visible. Una tienda online con muchos productos se presupuesta aparte. El mantenimiento de la web y la gestión mensual de tu ficha y tus reseñas son el Plan Siempre visible.'),
 dict(slug='pack-singular', kicker='Cambio de imagen total', name='Singular', price='2.490 €', unit='', plazo='6 a 10 semanas', icon='i-palette', btn='btn--crimson',
  para='Vas a abrir, reabrir o reformar, o sientes que tu marca ya no cuenta quién eres ni lo que cobras. Quieres un cambio completo, coherente de la fachada al Instagram.',
  incluye=[
   ('Rebranding', ['Logo principal y versiones (horizontal, icono, blanco y negro)','Paleta de colores y tipografías','Tono de voz: cómo habla tu marca','Manual de marca sencillo para que todo sea coherente']),
   ('Aplicaciones de marca', ['Hasta 3 piezas a elegir: rótulo o fachada, tarjetas, carta o menú, packaging, bolsas…','Archivos listos para imprenta','Si prefieres que nos encarguemos de la impresión y de hablar con la imprenta, lo acordamos en tu presupuesto']),
   ('Todo el Pack Escaparate', ['Web nueva con tu nueva imagen, con dominio y alojamiento el primer año','SEO local con una página por servicio clave','Sesión de fotos profesional en tu local','Google Maps optimizado y kit de reseñas con cartel QR impreso']),
   ('Lanzamiento en redes: tu primer mes', ['Estrategia y calendario del primer mes: 12 publicaciones para anunciar el cambio','Textos de todas las publicaciones, escritos con tu tono','Guiones para 4 vídeos cortos (reels o TikTok), pensados para grabar con el móvil','Grabación de clips en tu local el mismo día de la sesión de fotos','2 vídeos cortos editados y listos para publicar','Plantillas editables con tu nueva imagen para seguir publicando tú']),
   ('Sesión de La Trastienda', ['90 minutos, en tu local o por videollamada','Revisamos tus precios y márgenes: qué te deja dinero y qué no','Miramos a tu competencia de la zona y dónde encajas con tu nueva imagen','Qué servicios o productos potenciar y cómo presentarlos','Te llevas un plan de acción por escrito, en una página']),
  ],
  pasos=[('Semanas 1-2','Entrevista de marca, referencias y competencia. Propuesta de identidad.'),('Semanas 3-4','Desarrollo de la marca y aplicaciones, con dos rondas de cambios.'),('Semanas 5-8','Fotos, web, SEO local y Google Maps con la nueva imagen.'),('Semanas 9-10','Sesión de La Trastienda, contenido del primer mes listo y entrega de todo.')],
  necesitamos=['Tiempo para una buena entrevista de marca (una hora y media)','Referencias de lo que te gusta y lo que no','Una fecha clave si la hay (apertura, reforma…) para planificar hacia atrás','Ganas de salir en algún vídeo (o de que salga tu equipo o tus manos trabajando)'],
  llevas=['Marca completa con manual y todos los archivos','Diseños de rótulo, tarjetas o carta listos para imprenta','Web, fotos y ficha de Google con la nueva imagen','Primer mes de redes listo para publicar, con vídeos','Plan de acción de precios y estrategia'],
  esperar='Una imagen que se recuerda y que justifica lo que cobras, aplicada igual en todos sitios. Es el pack con más impacto, y el que más tiempo pide: cuanto antes empecemos respecto a tu fecha clave, mejor.',
  noincluye='El coste de impresión y producción (rótulo, tarjetas…), que se paga a la imprenta; si quieres, lo gestionamos nosotros y lo incluimos en el presupuesto. Tampoco la publicación y gestión de redes a partir del segundo mes (servicio de Redes Sociales a la carta), ni el mantenimiento mensual de web y Google (Plan Siempre visible).'),
 dict(slug='plan-basico', kicker='Cada mes', name='Básico', price='59 €', unit='/mes', plazo='Mes a mes, sin permanencia', icon='i-pin', btn='btn--crimson',
  para='Tienes un negocio pequeño, ya tienes ficha en Google (por ejemplo, después del Pack Arranque) y quieres que no se quede parada, sin pagar un mantenimiento completo.',
  incluye=[
   ('Google Maps activo', ['Una publicación al mes en tu ficha: novedades, ofertas o temporada','Respuesta a todas tus reseñas, en tu tono']),
   ('Sin ataduras', ['Sin permanencia: te das de baja cuando quieras','Pasas al Plan Siempre visible cuando lo necesites']),
  ],
  pasos=[('Mes 1','Revisamos tu ficha y acordamos el tono de las respuestas.'),('Cada mes','Una publicación y respuesta a las reseñas nuevas.')],
  necesitamos=['Acceso a tu ficha de Google','Un aviso cuando tengas novedades u ofertas','Alguna foto nueva de vez en cuando'],
  llevas=['Tu ficha de Google activa cada mes','Todas tus reseñas respondidas'],
  esperar='Una ficha que se ve viva y cuidada: Google valora la actividad reciente y tus clientes ven que respondes. Es el mínimo para no perder lo conseguido.',
  noincluye='Mantenimiento web, revisión de lo que dicen las IA ni informe mensual (están en el Plan Siempre visible).'),
 dict(slug='pack-visible', kicker='Cada mes', name='Siempre visible', price='149 €', unit='/mes', plazo='Mes a mes, sin permanencia', icon='i-chart', btn='btn--crimson',
  para='Ya tienes la base (ficha de Google y, a ser posible, web) y quieres que alguien la cuide y la haga crecer: sin acordarte de actualizar la web, publicar, responder reseñas ni revisar qué dicen de ti.',
  incluye=[
   ('Google Maps al día', ['Publicaciones y novedades en tu ficha cada mes','Respuesta a todas tus reseñas en tu tono','Fotos y datos siempre actualizados (horarios de festivos, servicios nuevos…)']),
   ('Mantenimiento web', ['Cambios de contenido cuando los necesites: textos, precios, horarios, fotos (hasta 1 hora al mes)','Copias de seguridad y revisión de que todo funciona: formularios, enlaces y velocidad','Renovación y gestión del dominio y el alojamiento, siempre a tu nombre']),
   ('Contenido y SEO', ['Contenido para tu web o ficha pensado para lo que busca tu zona','Ajustes de SEO local según los resultados']),
   ('Inteligencia artificial', ['Revisión mensual de qué dicen ChatGPT, Gemini y Google de ti','Ajustes para que te recomienden más y mejor']),
   ('Informe mensual', ['Llamadas, visitas, reseñas y búsquedas, explicado en cristiano','Qué hemos hecho y qué toca el mes siguiente']),
  ],
  pasos=[('Mes 1','Revisión inicial, objetivos y calendario.'),('Cada mes','Publicaciones, reseñas, cambios en la web, contenido y ajustes.'),('Fin de mes','Informe claro y llamada de 15 minutos si la quieres.')],
  necesitamos=['Acceso a tu ficha de Google y a tu web (si la hicimos nosotros, ya lo tenemos)','Un aviso cuando haya novedades (ofertas, cierres, productos nuevos)','Fotos nuevas de vez en cuando (te decimos cuáles)'],
  llevas=['Tu web siempre al día y funcionando','Tu presencia en Google y la IA cuidada cada mes','Informe mensual y cero permanencia: te quedas cuando te funciona'],
  esperar='Crecimiento constante: más reseñas, más visibilidad y más llamadas mes a mes. Funciona mejor con la base bien hecha; si aún no la tienes, empieza por el Pack Que te encuentren o Escaparate.',
  noincluye='Gestión completa de redes sociales (se puede añadir como servicio a la carta). Si solo necesitas una publicación al mes y respuesta a reseñas, mira el Plan Básico.'),
]

import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parent))
from services_data import SERVICES
for p in PACKS:
    p['title'] = ('Plan ' if p['slug'] in ('pack-visible','plan-basico') else 'Pack ') + p['name']

def esc(s): return s.replace('&','&amp;').replace('<','&lt;')
check='<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>'
xicon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
def modal(p, is_pack):
    inc=''.join(f'<div class="pmodal__group"><h4>{esc(t)}</h4><ul>{"".join(f"<li>{check}<span>{esc(x)}</span></li>" for x in items)}</ul></div>' for t,items in p['incluye'])
    pasos=''.join(f'<li><span class="pmodal__when">{esc(w)}</span><span>{esc(d)}</span></li>' for w,d in p['pasos'])
    nec=''.join(f'<li>{check}<span>{esc(x)}</span></li>' for x in p['necesitamos'])
    llev=''.join(f'<li>{check}<span>{esc(x)}</span></li>' for x in p['llevas'])
    if is_pack:
        unit=f'<small>{p["unit"]}</small>' if p['unit'] else ''
        price=f'<span class="pmodal__price"><small>desde</small>{p["price"]}{unit}</span>'
        btn=p['btn']
    elif p.get('price'):
        price=f'<span class="pmodal__price"><small>desde</small>{p["price"]}<small>{p.get("unit","")}</small></span>'
        btn='btn--crimson'
    else:
        price='<span class="pmodal__price pmodal__price--quote">Presupuesto a medida en 48 h</span>'
        btn='btn--crimson'
    return f"""
          <dialog class="pmodal" id="detalle-{p["slug"]}" aria-labelledby="detalle-{p["slug"]}-title">
            <div class="pmodal__inner">
              <header class="pmodal__head">
                <button type="button" class="pmodal__close" data-pmodal-close aria-label="Cerrar">{xicon}</button>
                <span class="pmodal__kicker">{esc(p["kicker"])}</span>
                <h3 id="detalle-{p["slug"]}-title">{esc(p["title"])}</h3>
                <p class="pmodal__meta">{price}<span class="pmodal__time"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-clock"/></svg>{esc(p["plazo"])}</span></p>
              </header>
              <div class="pmodal__body" tabindex="0" autofocus>
                <section><h4 class="pmodal__h">Es para ti si…</h4><p>{esc(p["para"])}</p></section>
                <section><h4 class="pmodal__h">Qué incluye, en detalle</h4><div class="pmodal__groups">{inc}</div></section>
                <section><h4 class="pmodal__h">Cómo lo hacemos</h4><ol class="pmodal__steps">{pasos}</ol></section>
                <div class="pmodal__cols">
                  <section><h4 class="pmodal__h">Qué necesitamos de ti</h4><ul class="pmodal__list">{nec}</ul></section>
                  <section><h4 class="pmodal__h">Qué te llevas</h4><ul class="pmodal__list">{llev}</ul></section>
                </div>
                <section class="pmodal__expect"><h4 class="pmodal__h">Qué puedes esperar</h4><p>{esc(p["esperar"])}</p></section>
                <p class="pmodal__not"><strong>No incluye:</strong> {esc(p["noincluye"])}</p>
              </div>
              <footer class="pmodal__foot">
                <a class="btn {btn}" href="contratar.html?servicio={p["slug"]}">{"Lo quiero" if is_pack else "Pedir propuesta"}</a>
                <button type="button" class="add-btn" data-add="{p["slug"]}" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg><span data-add-label>Añadir</span></button>
              </footer>
            </div>
          </dialog>"""

s=open(ROOT+'index.html').read()
# limpiar una ejecución anterior
s=re.sub(r'\n\s*<button type="button" class="(?:pack__more|service__more|trastienda__more)"[^\n]*?</button>','',s)
s=re.sub(r'<button type="button" class="(?:add-btn )?service__more"[^>]*>.*?</button>','',s)
s=re.sub(r'\s*<dialog class="pmodal".*?</dialog>','',s,flags=re.S)
# Packs: botón y ventanas
for p in PACKS:
    pat=re.compile(r'(</ul>\n)(\s*)(<a class="btn btn--(?:ghost|yellow)" href="contratar\.html\?servicio='+p['slug']+'">)')
    s,n=pat.subn(lambda m: m.group(1)+m.group(2)+f'<button type="button" class="pack__more" data-pmodal="detalle-{p["slug"]}">Ver detalles <span aria-hidden="true">→</span></button>\n'+m.group(2)+m.group(3), s)
    assert n==1, p['slug']
end='          <p class="packs-note">'
s=s.replace(end, ''.join(modal(p,True) for p in PACKS).lstrip('\n')+'\n\n'+end,1)
# Servicios: botón "Ver detalles" en cada tarjeta
for sv in SERVICES:
    pat=re.compile(r'(<article class="service reveal" data-slug="'+sv['slug']+r'">.*?<span class="service__actions">)', re.S)
    s,n=pat.subn(lambda m: m.group(1)+f'<button type="button" class="add-btn service__more" data-pmodal="detalle-{sv["slug"]}" aria-label="Ver detalles de {sv["title"]}">Detalles</button>', s)
    assert n==1, sv['slug']
# Tarjetas que llevan a un pack (Google Maps → Pack Que te encuentren)
for card, pk in (('google-maps','pack-encuentren'),):
    pat=re.compile(r'(<article class="service reveal" data-slug="'+card+r'">.*?<span class="service__actions">)', re.S)
    s,n=pat.subn(lambda m: m.group(1)+f'<button type="button" class="add-btn service__more" data-pmodal="detalle-{pk}" aria-label="Ver detalles del Pack Que te encuentren">Detalles</button>', s)
    assert n==1, card
# Ventanas de los servicios, justo después de la cuadrícula de servicios
grid=s.index('<div class="services">')
grid_end=s.index('          </div>\n', grid)+len('          </div>\n')
s=s[:grid_end]+''.join(modal(sv,False) for sv in SERVICES).lstrip('\n')+'\n'+s[grid_end:]
open(ROOT+'index.html','w').write(s)
print('ok')
