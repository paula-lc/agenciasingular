# Contenido propio de las páginas de servicio (/servicios/<slug>/). Lo demás (para quién es, qué incluye,
# pasos, qué necesitamos, precios) sale de packs_data.py y services_data.py: se cambia allí y vale para
# las ventanas de detalle y para estas páginas.
#
# Reglas: nada inventado, sin promesas de posición ni de resultados, y sin jerga.
#   explica: frase(s) que explican cada ítem de «Qué incluye» (clave: el texto del ítem tal cual está en los datos).
#            Un ítem sin entrada aquí se publica solo con su nombre: es un TODO pendiente de Paula.
#   rotulo:  nombre alternativo de un ítem para evitar jerga en la página (el dato original no se toca).
#   no_para: (texto, id del servicio al que enlazar o None)
#   faq:     (pregunta, respuesta, id del servicio al que enlazar o None). Van visibles y en el JSON-LD FAQPage.
#   noincluye: sustituye el «No incluye» de los datos cuando el original lleva jerga.
#   sigue:   ids de los servicios que se enlazan como siguiente paso.
#   ejemplos: tipos de caso de data/portfolio.json que se enseñan en la página.
PAGO=('¿Cómo se paga?', 'Pago: 50 % al empezar y 50 % a la entrega, por transferencia y con factura de cada pago.', None)
FUNDADOR_Q='¿Qué es el precio fundador?'
def fundador(base): return (FUNDADOR_Q, f'Es un precio rebajado para las 5 primeras plazas. Mientras queden plazas, lo ves en esta página; cuando se acaben, queda el precio normal: {base} € + IVA.', None)
NO_PROMESA=('¿Me garantizáis salir primero en Google o en Google Maps?', 'No. Nadie puede garantizar una posición, y no lo prometemos. Lo que hacemos es dejar tu ficha completa y cuidada, que es la base para que te encuentren.', None)

FICHA='Tu ficha es lo que sale en Google y en Google Maps cuando alguien busca un salón como el tuyo. La dejamos completa, para que quien te encuentre sepa qué haces, cuándo abres y por qué elegirte.'
MAPAS='No todo el mundo busca en Google: quien tiene iPhone suele abrir Apple Maps. Te damos de alta también ahí y en Bing, con los mismos datos, para que tu información coincida en todas partes.'
RESERVAR='Conectamos tu sistema de reservas a la ficha. Así, quien te encuentra puede pedir cita en el momento, sin llamarte ni escribirte.'
QR='Un cartel para tu salón: tu cliente escanea el código y deja su reseña en el momento. Las plantillas te ahorran pensar qué contestar a cada una.'

INFORME='A los 60 días te enseñamos qué ha cambiado, con las estadísticas de tu propia ficha.'

PAGES={
 'cuidados-esenciales': dict(
  title='Cuidados esenciales: tu ficha de Google al día · Agencia Singular',
  desc='Ficha de Google completa, botón de reserva, sesión de fotos en tu salón y cartel con QR para reseñas. Precio cerrado, sin permanencia. Barcelona.',
  h1='Cuidados esenciales: que te encuentren en Google, te elijan y reserven sin intermediarios',
  no_para=[
   ('Tu salón está fuera de Barcelona y su área metropolitana. La sesión de fotos es presencial; para eso existe la versión a distancia.', 'cuidados-esenciales-distancia'),
   ('Lo que buscas es una web (eso es el Paso 2) o que alguien lleve tu ficha cada mes (Paso 3).', None),
   ('Quieres que te prometan el primer puesto en Google. Nadie puede garantizarlo, y nosotros no lo prometemos.', None),
  ],
  explica={
   'Ficha de Google completa y cuidada: categorías, servicios, horarios y descripción': FICHA,
   'Alta en Apple Maps y Bing': MAPAS,
   'Botón «Reservar» conectado a tu Booksy, Fresha o Treatwell': RESERVAR,
   'Sesión de fotos de 1 h en tu local: 10–12 fotos editadas': 'Vamos una hora a tu salón y te entregamos entre 10 y 12 fotos editadas. Las fotos reales de tu local y de tu trabajo dan más confianza que las de banco de imágenes.',
   'Cartel con QR para conseguir reseñas y plantillas para responderlas': QR,
   'Informe de resultados a los 60 días': INFORME,
  },
  faq=[
   NO_PROMESA,
   ('Mi salón está fuera de Barcelona, ¿puedo contratarlo?', 'La sesión de fotos solo la hacemos en Barcelona y su área metropolitana. Fuera de esa zona tienes Cuidados esenciales a distancia: lo mismo, sin sesión de fotos.', 'cuidados-esenciales-distancia'),
   fundador('450'),
   PAGO,
   ('¿Hay permanencia?', 'No. Es un proyecto cerrado, sin permanencia. La ficha, las fotos y los accesos son siempre tuyos.', None),
  ],
  sigue=['web-una-pagina','web-completa'], ejemplos=['ficha'],
 ),
 'cuidados-esenciales-distancia': dict(
  title='Cuidados esenciales a distancia: tu ficha de Google · Agencia Singular',
  desc='Tu ficha de Google completa, botón de reserva y cartel con QR para reseñas, sin sesión de fotos y trabajando a distancia. Para salones de toda España.',
  h1='Cuidados esenciales a distancia: lo mismo, sin sesión de fotos',
  no_para=[
   ('Estás en Barcelona o su área metropolitana y quieres fotos profesionales de tu salón. Te conviene Cuidados esenciales, que incluye la sesión.', 'cuidados-esenciales'),
   ('Lo que buscas es una web (eso es el Paso 2) o que alguien lleve tu ficha cada mes (Paso 3).', None),
   ('Quieres que te prometan el primer puesto en Google. Nadie puede garantizarlo, y nosotros no lo prometemos.', None),
  ],
  explica={
   'Ficha de Google completa y cuidada: categorías, servicios, horarios y descripción': FICHA,
   'Botón «Reservar» conectado a tu Booksy, Fresha o Treatwell': RESERVAR,
   'Cartel con QR para conseguir reseñas y plantillas para responderlas': QR,
   'Alta en Apple Maps y Bing': MAPAS,
   'Guía para hacer buenas fotos con el móvil': 'Como no vamos a tu salón, las fotos las haces tú. La guía te explica cómo hacerlas bien con el móvil.',
   'Edición de tus fotos': 'Nos mandas las fotos que hagas con la guía y nosotros las editamos.',
   'Informe de resultados a los 60 días': INFORME,
  },
  faq=[
   ('¿En qué se diferencia de Cuidados esenciales?', 'Incluye lo mismo excepto la sesión de fotos en tu local. A cambio, te damos una guía para hacer buenas fotos con el móvil y editamos las que nos mandes.', 'cuidados-esenciales'),
   ('Estoy en Barcelona, ¿puedo elegir la versión a distancia?', 'Sí. Es para negocios de fuera de Barcelona y también para quien prefiere trabajar a distancia.', None),
   ('¿Cómo trabajamos sin vernos?', 'En remoto: por videollamada, WhatsApp y email.', None),
   NO_PROMESA,
   fundador('300'),
   PAGO,
   ('¿Hay permanencia?', 'No. Es un proyecto cerrado, sin permanencia. La ficha, las fotos y los accesos son siempre tuyos.', None),
  ],
  sigue=['web-una-pagina','web-completa'], ejemplos=['ficha'],
 ),
 'web-una-pagina': dict(
  title='Web de una página para tu salón, con reservas · Agencia Singular',
  desc='Una página clara, rápida y pensada para el móvil, con tu botón de reservas, 2 rondas de cambios y dominio y alojamiento el primer año. Precio cerrado.',
  h1='Web de una página: tu escaparate propio, con tu botón de reservas',
  no_para=[
   ('Tienes muchos servicios y quieres que cada uno tenga su propia página. Para eso está la Web completa.', 'web-completa'),
   ('Quieres una tienda online con muchos productos. Eso se presupuesta aparte.', None),
  ],
  noincluye='A partir del segundo año, la renovación del dominio corre de tu cuenta. Si necesitas varias páginas o una página por cada servicio, mira la Web completa.',
  explica={
   'Una página clara, rápida y pensada para el móvil': 'Toda tu información en una sola página, hecha para leerse bien en el móvil. Instagram te ayuda a enamorar, pero Google y los asistentes de IA leen sobre todo webs y fichas de empresa; y tu web es tuya, no depende de un algoritmo.',
   'Botón de reserva de Booksy o Fresha integrado': 'Tu página lleva el botón de tu sistema de reservas, para que quien entra pueda pedir cita desde ahí.',
   '2 rondas de cambios': 'Te enseñamos una primera versión y puedes pedirnos cambios hasta dos veces antes de publicarla.',
   'Dominio y alojamiento el primer año': 'El dominio es la dirección de tu web y el alojamiento, el sitio donde vive. El primer año van incluidos; a partir del segundo, la renovación del dominio corre de tu cuenta.',
  },
  faq=[
   ('Tengo Instagram, ¿de verdad necesito una web?', 'Sí. Instagram te ayuda a enamorar, pero Google y los asistentes de IA leen sobre todo webs y fichas de empresa. Una web sencilla, rápida y bien estructurada es la fuente oficial de la que beben todos ellos, y es tuya: no depende de un algoritmo.', None),
   ('¿De quién es la web?', 'Tuya. La web, el dominio y los accesos están siempre a tu nombre.', None),
   ('¿Qué pasa con el dominio a partir del segundo año?', 'El primer año de dominio y alojamiento va incluido. A partir del segundo año, la renovación del dominio corre de tu cuenta.', None),
   ('¿Cuánto cuesta si ya soy cliente de Cuidados esenciales?', '250 € + IVA (302,50 € IVA incl.), en lugar de 690 € + IVA.', 'cuidados-esenciales'),
   ('¿Y si necesito más de una página?', 'Entonces te encaja la Web completa: hasta 6 páginas, con una página por servicio clave.', 'web-completa'),
   PAGO,
   ('¿Hay permanencia?', 'No. Es un proyecto cerrado, sin permanencia.', None),
  ],
  sigue=['web-completa','cuidados-esenciales'], ejemplos=['web'],
 ),
 'web-completa': dict(
  title='Web completa para tu salón: una página por servicio · Agencia Singular',
  desc='Hasta 6 páginas, una por cada servicio clave, con preguntas frecuentes e información ordenada para buscadores e IA. Presupuesto a medida desde 1.290 € + IVA.',
  h1='Web completa: una web donde cada servicio tiene su sitio',
  no_para=[
   ('Con una sola página te basta. La Web de una página cuesta menos.', 'web-una-pagina'),
   ('Quieres una tienda online con muchos productos. Eso se presupuesta aparte.', None),
  ],
  rotulo={'SEO local con una página por servicio clave': 'Una página por cada servicio clave'},
  rotulo_grupo={'SEO local': 'Tus servicios'},
  explica={
   'Hasta 6 páginas': 'En vez de apretarlo todo en una sola página, repartimos tu información en hasta seis, para contar tu salón con calma.',
   'SEO local con una página por servicio clave': 'Cada servicio importante tiene su propia página. Así, quien busca justo ese servicio en tu zona puede llegar directamente a ella.',
   'Preguntas frecuentes y datos estructurados para buscadores e IA': 'Respondemos en tu web a lo que tus clientes preguntan siempre y añadimos información ordenada que los buscadores y los asistentes de IA saben leer. No garantiza que te nombren: les pone fácil entenderte.',
   '30 min de La Trastienda': 'Media hora de nuestra consultoría de negocio, incluida.',
  },
  faq=[
   ('¿Por qué el precio es «desde»?', 'Porque depende de tus servicios. Preparamos un presupuesto a medida a partir de 1.290 € + IVA (1.560,90 € IVA incl.).', None),
   ('¿En qué se diferencia de la Web de una página?', 'La Web de una página lo cuenta todo en una sola página. La Web completa tiene hasta 6, con una página por servicio clave y preguntas frecuentes.', 'web-una-pagina'),
   ('¿Me garantizáis que Google o ChatGPT recomienden mi salón?', 'No. Nadie controla las respuestas de una IA ni las posiciones de Google, así que no lo prometemos: ponemos los cimientos.', None),
   ('¿Incluye una tienda online?', 'Una tienda online con muchos productos se presupuesta aparte.', None),
   PAGO,
   ('¿Hay permanencia?', 'No. Es un proyecto cerrado, sin permanencia. La web, el dominio y los accesos son siempre tuyos.', None),
  ],
  sigue=['trastienda','cuidados-esenciales'], ejemplos=['web'],
 ),
 'fotografia': dict(
  title='Fotografía Local: fotos reales de tu salón · Agencia Singular',
  desc='Sesión de hasta 2 horas en tu local y unas 30 fotos editadas de tu espacio, tu equipo y tus trabajos, en formato para web, Google Maps y redes. Barcelona.',
  h1='Fotografía Local: fotos reales de tu espacio y de tu trabajo',
  no_para=[
   ('Buscas vídeo, modelos o material especial. Eso se presupuesta aparte.', None),
   ('Tu negocio está fuera del área de Barcelona. El desplazamiento se presupuesta aparte.', None),
  ],
  explica={
   'Lista de tomas pensada para tu web, Google Maps y redes': 'Antes de ir decidimos qué fotos hacen falta y para qué, y así no improvisamos el día de la sesión.',
   'Consejos para preparar el local, el producto y al equipo': 'Te decimos cómo dejarlo todo listo, para que el tiempo de la sesión se vaya en hacer fotos.',
   'Hasta 2 horas en tu negocio, con dirección de arte': 'Dirección de arte quiere decir que cuidamos qué sale en cada foto y cómo: no llegamos, disparamos y nos vamos.',
   'Espacio, fachada, equipo trabajando y productos o trabajos estrella': 'La fachada ayuda a que te reconozcan al llegar; el interior, el equipo y tus trabajos enseñan cómo es ir a tu salón.',
   'Unas 30 fotos editadas (luz, color y encuadre)': 'No te damos todo lo que sale de la cámara: te entregamos unas 30 fotos ya editadas.',
   'En formato para web, Google Maps y redes (horizontal y vertical)': 'Cada sitio pide una forma de foto. Te las damos en horizontal y en vertical para que no tengas que recortarlas.',
   'Derechos de uso para siempre': 'Las fotos son tuyas: puedes usarlas donde quieras y cuando quieras.',
  },
  faq=[
   ('¿En qué se diferencia de la sesión de fotos de Cuidados esenciales?', 'La de Cuidados esenciales dura 1 hora y son 10–12 fotos editadas. Fotografía Local es una sesión de hasta 2 horas, con unas 30 fotos editadas.', 'cuidados-esenciales'),
   ('¿Hacéis sesiones fuera de Barcelona?', 'Los desplazamientos fuera del área de Barcelona se presupuestan aparte.', None),
   ('¿Incluye vídeo?', 'No. Vídeo, modelos y alquiler de material especial se presupuestan aparte.', None),
   ('¿De quién son las fotos?', 'Tuyas, con derechos de uso para siempre.', None),
   PAGO,
  ],
  sigue=['cuidados-esenciales','web-una-pagina'], ejemplos=[],
 ),
 'trastienda': dict(
  title='La Trastienda: consultoría para tu salón, en 90 minutos · Agencia Singular',
  desc='Una sesión de 90 minutos sobre tus precios, tus márgenes y tu oferta, en tu local o por videollamada, con un plan de acción por escrito en 3 días.',
  h1='La Trastienda: 90 minutos para decidir con cabeza sobre tus precios y tu oferta',
  no_para=[
   ('Buscas contabilidad o asesoría fiscal. No las hacemos.', None),
   ('Quieres que alguien ejecute el plan por ti. De la sesión sales con el plan; aplicarlo es cosa tuya, aunque con el marketing podemos ayudarte.', None),
  ],
  explica={
   'Un cuestionario corto sobre tu negocio, tus precios y tus números': 'Lo rellenas antes de la sesión. Así llegamos sabiendo de dónde partes y no gastamos los 90 minutos en ponernos al día.',
   'En tu local o por videollamada': 'Como te vaya mejor.',
   'Tus precios y márgenes: qué te deja dinero y qué no': 'Miramos lo que cobras y lo que te cuesta cada cosa, para ver qué te compensa y qué no.',
   'Tu competencia de la zona y dónde encajas': 'Vemos qué hay en tu zona, para situarte con criterio y no a ojo.',
   'Qué servicios o productos potenciar y cómo presentarlos': 'Decidimos en qué merece la pena que pongas el foco y cómo contarlo.',
   'Plan de acción por escrito, en una página y por prioridades': 'En 3 días tienes una hoja que dice qué hacer primero y qué puede esperar.',
   'Un correo de seguimiento para resolver dudas': 'Después de la sesión, un correo para resolver las dudas que te hayan quedado.',
  },
  faq=[
   ('¿Es presencial o por videollamada?', 'Como prefieras: en tu local o por videollamada.', None),
   ('¿Qué recibo después de la sesión?', 'En 3 días, un plan de acción por escrito, en una página y por prioridades. Y un correo de seguimiento para resolver dudas.', None),
   ('¿Hacéis contabilidad o asesoría fiscal?', 'No. La Trastienda no incluye contabilidad ni asesoría fiscal.', None),
   ('¿Me ayudáis a aplicar el plan?', 'La ejecución del plan no está incluida, aunque podemos ayudarte con el marketing.', None),
   ('¿Tengo que preparar algo?', 'Tus precios y, si puedes, una idea de tus costes. Y honestidad sobre lo que funciona y lo que no.', None),
  ],
  sigue=['web-completa','cuidados-esenciales'], ejemplos=[],
 ),
}
# Orden de las páginas (el de la web: Paso 1, Paso 2 y a la carta)
ORDER=['cuidados-esenciales','cuidados-esenciales-distancia','web-una-pagina','web-completa','fotografia','trastienda']
