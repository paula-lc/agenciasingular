/* Idiomas: es · en · ca.  Cada clave: [castellano, inglés, catalán] */
(() => {
  const D = {
    // ---------- común ----------
    'proto.banner': ['Propuesta de rediseño <b>no oficial</b> preparada por Agencia Singular para Mahalo Vintage. No es la web oficial: aquí no se vende nada ni se guardan datos. Tienda oficial: <a href="https://www.mahalovintage.com" target="_blank" rel="noopener" style="color:#fab419;text-decoration:underline">mahalovintage.com</a>', 'Unofficial redesign proposal by Agencia Singular for Mahalo Vintage. This is not the official website: nothing is sold here and no data is stored. Official shop: <a href="https://www.mahalovintage.com" target="_blank" rel="noopener" style="color:#fab419;text-decoration:underline">mahalovintage.com</a>', 'Proposta de redisseny <b>no oficial</b> preparada per Agencia Singular per a Mahalo Vintage. No és la web oficial: aquí no es ven res ni es desen dades. Botiga oficial: <a href="https://www.mahalovintage.com" target="_blank" rel="noopener" style="color:#fab419;text-decoration:underline">mahalovintage.com</a>'],
    'skip': ['Saltar al contenido', 'Skip to content', 'Salta al contingut'],
    'logo.aria': ['Mahalo Vintage, inicio', 'Mahalo Vintage, home', 'Mahalo Vintage, inici'],
    'cart.open': ['Abrir cesta', 'Open cart', 'Obre la cistella'],
    'cats.aria': ['Categorías', 'Categories', 'Categories'],
    'cat.all': ['Todo', 'All', 'Tot'],
    'cat.Sportwear': ['Sportwear', 'Sportswear', 'Sportswear'],
    'cat.Jerseys': ['Jerseys', 'Jerseys', 'Samarretes d\'equip'],
    'cat.Shirts': ['Camisas', 'Shirts', 'Camises'],
    'cat.Tops': ['Tops', 'Tops', 'Tops'],
    'cat.USA Sportwear': ['USA', 'USA', 'USA'],
    'lang.aria': ['Idioma', 'Language', 'Idioma'],
    'f.links': ['Enlaces', 'Links', 'Enllaços'],
    'f.about': ['Sobre nosotras', 'About us', 'Sobre nosaltres'],
    'f.contact': ['Contacto', 'Contact', 'Contacte'],
    'f.delivery': ['Envíos', 'Shipping', 'Enviaments'],
    'f.terms': ['Términos', 'Terms', 'Termes'],
    'f.privacy': ['Privacidad', 'Privacy', 'Privadesa'],
    'f.email': ['Email', 'Email', 'Correu electrònic'],
    'f.copy': ['© 2026 MAHALO VINTAGE · Hecho con 🌺 y amor por la moda circular', '© 2026 MAHALO VINTAGE · Made with 🌺 and love for circular fashion', '© 2026 MAHALO VINTAGE · Fet amb 🌺 i amor per la moda circular'],
    'h.monsat': ['Lunes a sábado', 'Monday to Saturday', 'De dilluns a dissabte'],
    'h.monsun': ['Lunes a domingo', 'Monday to Sunday', 'De dilluns a diumenge'],
    'maps.view': ['Ver en Google Maps ↗', 'View on Google Maps ↗', 'Mostra a Google Maps ↗'],
    'maps.open': ['Abrir en Google Maps ↗', 'Open in Google Maps ↗', 'Obre a Google Maps ↗'],
    'maps.dir': ['Cómo llegar ↗', 'Directions ↗', 'Com arribar ↗'],
    'photos.aria': ['Fotos de nuestras tiendas', 'Photos of our stores', 'Fotos de les nostres botigues'],
    'close': ['Cerrar', 'Close', 'Tanca'],
    'free': ['Gratis', 'Free', 'Gratuït'],
    'piece.one': ['pieza', 'piece', 'peça'],
    'piece.many': ['piezas', 'pieces', 'peces'],
    'meta.desc': ['Propuesta de rediseño para Mahalo Vintage: ropa vintage y sportswear de segunda mano seleccionada con amor, desde Barcelona.', 'Redesign proposal for Mahalo Vintage: second-hand vintage and sportswear picked with love, from Barcelona.', 'Proposta de redisseny per a Mahalo Vintage: roba vintage i sportswear de segona mà seleccionada amb amor, des de Barcelona.'],

    // ---------- títulos de pestaña ----------
    'tt.index': ['Mahalo Vintage · Moda que cuenta historias', 'Mahalo Vintage · Fashion that tells stories', 'Mahalo Vintage · Moda que explica històries'],
    'tt.about': ['Sobre nosotras · Mahalo Vintage', 'About us · Mahalo Vintage', 'Sobre nosaltres · Mahalo Vintage'],
    'tt.contact': ['Contacto · Mahalo Vintage', 'Contact · Mahalo Vintage', 'Contacte · Mahalo Vintage'],
    'tt.delivery': ['Envíos · Mahalo Vintage', 'Shipping · Mahalo Vintage', 'Enviaments · Mahalo Vintage'],
    'tt.terms': ['Términos y condiciones · Mahalo Vintage', 'Terms and conditions · Mahalo Vintage', 'Termes i condicions · Mahalo Vintage'],
    'tt.privacy': ['Política de privacidad · Mahalo Vintage', 'Privacy policy · Mahalo Vintage', 'Política de privadesa · Mahalo Vintage'],

    // ---------- portada ----------
    'hero.badge': ['🌺 Segunda Mano · Primer Amor · Aloha Spirit', '🌺 Second Hand · First Love · Aloha Spirit', '🌺 Segona Mà · Primer Amor · Aloha Spirit'],
    'hero.h1': ['Moda que cuenta <span class="pink">historias</span> 🌸', 'Fashion that tells <span class="pink">stories</span> 🌸', 'Moda que explica <span class="pink">històries</span> 🌸'],
    'hero.sub': ['Piezas únicas con alma. Ropa de segunda mano seleccionada con amor en cada etiqueta.', 'One-of-a-kind pieces with soul. Second-hand clothes picked with love, tag by tag.', 'Peces úniques amb ànima. Roba de segona mà seleccionada amb amor en cada etiqueta.'],
    'hero.cta1': ['Explorar colección', 'Explore the collection', 'Explora la col·lecció'],
    'hero.cta2': ['¿Cómo funciona?', 'How does it work?', 'Com funciona?'],
    'stat.pieces': ['Piezas', 'Pieces', 'Peces'],
    "stat.years": ["Años de experiencia", "Years of experience", "Anys d'experiència"],
    'stat.avg': ['Precio medio', 'Average price', 'Preu mitjà'],
    'stat.stores': ['Tiendas en BCN', 'Stores in BCN', 'Botigues a BCN'],
    'm.1': ['🌺 MAHALO VINTAGE', '🌺 MAHALO VINTAGE', '🌺 MAHALO VINTAGE'],
    'm.2': ['♻️ SEGUNDA MANO', '♻️ SECOND HAND', '♻️ SEGONA MÀ'],
    'm.3': ['🌿 ALOHA SPIRIT', '🌿 ALOHA SPIRIT', '🌿 ALOHA SPIRIT'],
    'm.4': ['💛 AMOR POR LA MODA', '💛 LOVE FOR FASHION', '💛 AMOR PER LA MODA'],
    'm.5': ['📍 6 TIENDAS EN BARCELONA', '📍 6 STORES IN BARCELONA', '📍 6 BOTIGUES A BARCELONA'],
    'm.6': ['🏆 SPORTSWEAR 90\'S', '🏆 90\'S SPORTSWEAR', '🏆 SPORTSWEAR 90\'S'],
    'm.7': ['🌸 TROPICAL VIBES', '🌸 TROPICAL VIBES', '🌸 TROPICAL VIBES'],
    'coll.new': ['Nueva llegada', 'New arrival', 'Nova arribada'],
    'coll.coll': ['Colección', 'Collection', 'Col·lecció'],
    'coll.title.new': ['Recién llegadas ✨', 'Just landed ✨', 'Acabades d\'arribar ✨'],
    'coll.title.all': ['Todas las piezas', 'All pieces', 'Totes les peces'],
    'coll.size': ['talla', 'size', 'talla'],
    'sizes.aria': ['Filtrar por talla', 'Filter by size', 'Filtra per talla'],
    'res.one': ['pieza única', 'one-of-a-kind piece', 'peça única'],
    'res.many': ['piezas únicas', 'one-of-a-kind pieces', 'peces úniques'],
    'empty.p': ['🌺 No hay piezas con esta combinación ahora mismo.', '🌺 No pieces match this combination right now.', '🌺 Ara mateix no hi ha peces amb aquesta combinació.'],
    'empty.btn': ['Quitar filtros', 'Clear filters', 'Treu els filtres'],
    'more': ['Ver más piezas', 'See more pieces', 'Veure més peces'],
    'promo.badge': ['Visítanos', 'Visit us', 'Visita\'ns'],
    'promo.h2': ['6 tiendas<br><span class="amber">en Barcelona</span>', '6 stores<br><span class="amber">in Barcelona</span>', '6 botigues<br><span class="amber">a Barcelona</span>'],
    'promo.p': ['Ven a ver la colección en persona y llévate tu pieza al momento.', 'Come and see the collection in person and take your piece home right away.', 'Vine a veure la col·lecció en persona i emporta\'t la teva peça al moment.'],
    'promo.btn': ['Ver direcciones', 'See addresses', 'Veure adreces'],
    'how.badge': ['Simple y ético', 'Simple & ethical', 'Simple i ètic'],
    'how.h2': ['¿Cómo funciona?', 'How does it work?', 'Com funciona?'],
    'how.1.h': ['Elige tu pieza', 'Pick your piece', 'Tria la teva peça'],
    'how.1.p': ['Cada prenda es única: una talla, una pieza, curada con amor.', 'Every garment is one of a kind: one size, one piece, curated with love.', 'Cada peça és única: una talla, una peça, escollida amb amor.'],
    'how.2.h': ['Compra online y pásate por nuestras tiendas', 'Shop online and drop by our stores', 'Compra en línia i passa per les nostres botigues'],
    'how.2.p': ['Añádela a la cesta y paga de forma segura desde tu móvil u ordenador, o ven a verla en una de nuestras 6 tiendas.', 'Add it to your cart and pay securely from your phone or computer, or come and see it in one of our 6 stores.', 'Afegeix-la a la cistella i paga de manera segura des del mòbil o l\'ordinador, o vine a veure-la en una de les nostres 6 botigues.'],
    'how.3.h': ['Llega con aloha', 'Arrives with aloha', 'Arriba amb aloha'],
    'how.3.p': ['Recíbela en casa con seguimiento de pedido.', 'Get it delivered home with order tracking.', 'Rep-la a casa amb seguiment de la comanda.'],

    // ---------- tarjetas / cesta / avisos ----------
    'card.add': ['Añadir', 'Add', 'Afegeix'],
    'card.in': ['En la cesta ✓', 'In cart ✓', 'A la cistella ✓'],
    'card.color': ['Color', 'Colour', 'Color'],
    'card.length': ['Largo', 'Length', 'Llarg'],
    'card.size': ['Talla', 'Size', 'Talla'],
    'card.fav': ['Favorito', 'Favourite', 'Preferit'],
    'badge.new': ['Nuevo', 'New', 'Nou'],
    'badge.rare': ['Rare', 'Rare', 'Rare'],
    'col.Rojo': ['Rojo', 'Red', 'Vermell'], 'col.Azul': ['Azul', 'Blue', 'Blau'], 'col.Blanco': ['Blanco', 'White', 'Blanc'],
    'col.Morado': ['Morado', 'Purple', 'Morat'], 'col.Gris': ['Gris', 'Grey', 'Gris'], 'col.Negro': ['Negro', 'Black', 'Negre'],
    'col.Rosa': ['Rosa', 'Pink', 'Rosa'], 'col.Marrón': ['Marrón', 'Brown', 'Marró'], 'col.Beige': ['Beige', 'Beige', 'Beix'],
    'col.Verde': ['Verde', 'Green', 'Verd'], 'col.Amarillo': ['Amarillo', 'Yellow', 'Groc'], 'col.Naranja': ['Naranja', 'Orange', 'Taronja'], 'col.Marino': ['Marino', 'Navy', 'Marí'],
    'cart.title': ['Tu cesta 🛍️', 'Your cart 🛍️', 'La teva cistella 🛍️'],
    'cart.aria': ['Cesta', 'Cart', 'Cistella'],
    'cart.empty': ['Tu cesta está vacía', 'Your cart is empty', 'La cistella és buida'],
    'cart.empty.p': ['Cada pieza es única. ¡Encuentra la tuya!', 'Every piece is unique. Find yours!', 'Cada peça és única. Troba la teva!'],
    'cart.rm': ['Quitar', 'Remove', 'Treu'],
    'cart.left': ['Te faltan <b>{amt}</b> para envío gratis a España', 'You\'re <b>{amt}</b> away from free shipping to Spain', 'Et falten <b>{amt}</b> per a l\'enviament gratuït a Espanya'],
    'cart.done': ['🎉 Envío gratis a España', '🎉 Free shipping to Spain', '🎉 Enviament gratuït a Espanya'],
    'cart.sub': ['Subtotal ({n} {unit})', 'Subtotal ({n} {unit})', 'Subtotal ({n} {unit})'],
    'cart.note': ['El envío se calcula al finalizar la compra.', 'Shipping is calculated at checkout.', 'L\'enviament es calcula en finalitzar la compra.'],
    'cart.checkout': ['Finalizar compra', 'Checkout', 'Finalitza la compra'],
    'toast.exists': ['Es una pieza única: ya está en tu cesta 🌺', 'It\'s a one-of-a-kind piece: it\'s already in your cart 🌺', 'És una peça única: ja és a la cistella 🌺'],
    'toast.added': ['{name} añadida a la cesta ✨', '{name} added to your cart ✨', '{name} afegida a la cistella ✨'],
    'toast.fav': ['Guardada en favoritos 💗', 'Saved to favourites 💗', 'Desada a preferits 💗'],
    'qv.unique': ['Pieza única de segunda mano · stock: 1 ud.', 'One-of-a-kind second-hand piece · stock: 1 unit', 'Peça única de segona mà · estoc: 1 ut.'],
    'qv.add': ['Añadir a la cesta', 'Add to cart', 'Afegeix a la cistella'],
    'qv.view': ['Ver en la cesta', 'View in cart', 'Veure a la cistella'],
    'qv.site': ['Ver ficha en mahalovintage.com ↗', 'View listing on mahalovintage.com ↗', 'Veure fitxa a mahalovintage.com ↗'],
    'qv.photo': ['Foto', 'Photo', 'Foto'],
    'sm.title': ['Nuestras tiendas 📍', 'Our stores 📍', 'Les nostres botigues 📍'],
    'sm.sub': ['6 tiendas en Barcelona. Elige una para ver su ficha.', '6 stores in Barcelona. Pick one to see its details.', '6 botigues a Barcelona. Tria\'n una per veure\'n els detalls.'],
    'sm.tag': ['Tienda {i} de {n}', 'Store {i} of {n}', 'Botiga {i} de {n}'],

    // ---------- checkout ----------
    'co.demo': ['Demo · no se realizará ningún cobro', 'Demo · no payment will be taken', 'Demo · no es farà cap cobrament'],
    'co.title': ['Finalizar compra', 'Checkout', 'Finalitza la compra'],
    'co.guest': ['Compra como invitado: no necesitas crear cuenta.', 'Checkout as a guest: no account needed.', 'Compra com a convidat: no cal crear compte.'],
    'co.back': ['← Seguir comprando', '← Keep shopping', '← Continua comprant'],
    'co.s1': ['Contacto', 'Contact', 'Contacte'],
    'co.email': ['Email', 'Email', 'Correu electrònic'],
    'co.phone': ['Teléfono', 'Phone', 'Telèfon'],
    'co.s2': ['Método de envío', 'Shipping method', 'Mètode d\'enviament'],
    'co.ship': ['Envío a domicilio', 'Home delivery', 'Enviament a domicili'],
    'co.ship.d': ['Entrega en no más de 6 días laborables (España). Tarifa según peso y destino.', 'Delivery in no more than 6 working days (Spain). Rate depends on weight and destination.', 'Lliurament en no més de 6 dies laborables (Espanya). Tarifa segons pes i destinació.'],
    'co.pick': ['Recogida en tienda', 'Pick up in store', 'Recollida a botiga'],
    'co.pick.d': ['Showroom de Barcelona (Sardenya 100)', 'Barcelona showroom (Sardenya 100)', 'Showroom de Barcelona (Sardenya 100)'],
    'co.s3': ['Dirección de envío', 'Shipping address', 'Adreça d\'enviament'],
    'co.fn': ['Nombre', 'First name', 'Nom'],
    'co.ln': ['Apellidos', 'Last name', 'Cognoms'],
    'co.country': ['País', 'Country', 'País'],
    'co.addr': ['Dirección', 'Address', 'Adreça'],
    'co.addr.ph': ['Calle, número, piso', 'Street, number, floor', 'Carrer, número, pis'],
    'co.zip': ['Código postal', 'Postcode', 'Codi postal'],
    'co.city': ['Ciudad', 'City', 'Ciutat'],
    'cn.ES': ['España', 'Spain', 'Espanya'], 'cn.PT': ['Portugal', 'Portugal', 'Portugal'], 'cn.FR': ['Francia', 'France', 'França'],
    'cn.IT': ['Italia', 'Italy', 'Itàlia'], 'cn.DE': ['Alemania', 'Germany', 'Alemanya'], 'cn.NL': ['Países Bajos', 'Netherlands', 'Països Baixos'],
    'cn.BE': ['Bélgica', 'Belgium', 'Bèlgica'], 'cn.IE': ['Irlanda', 'Ireland', 'Irlanda'], 'cn.GB': ['Reino Unido', 'United Kingdom', 'Regne Unit'],
    'cn.US': ['Estados Unidos', 'United States', 'Estats Units'], 'cn.MX': ['México', 'Mexico', 'Mèxic'], 'cn.XX': ['Otro país', 'Other country', 'Un altre país'],
    'cg.EU': ['Europa', 'Europe', 'Europa'], 'cg.WW': ['Resto del mundo', 'Rest of the world', 'Resta del món'],
    'co.s4': ['Pago', 'Payment', 'Pagament'],
    'co.pay.t': ['🔒 Pago seguro.', '🔒 Secure payment.', '🔒 Pagament segur.'],
    'co.pay.s': ['En su web real se paga con PayPal o tarjeta. En esta propuesta el pago está simulado: no se pide ningún dato de tarjeta y no se hace ningún cobro.', 'On the real site you pay with PayPal or card. In this proposal payment is simulated: no card details are requested and nothing is charged.', 'A la seva web real es paga amb PayPal o targeta. En aquesta proposta el pagament és simulat: no es demana cap dada de targeta i no es fa cap cobrament.'],
    'co.notes': ['Notas del pedido (opcional)', 'Order notes (optional)', 'Notes de la comanda (opcional)'],
    'co.notes.ph': ['Indicaciones para la entrega', 'Delivery instructions', 'Indicacions per al lliurament'],
    'co.terms': ['He leído y acepto los <a href="terminos.html" target="_blank" rel="noopener">términos y condiciones</a>', 'I have read and accept the <a href="terminos.html" target="_blank" rel="noopener">terms and conditions</a>', 'He llegit i accepto els <a href="terminos.html" target="_blank" rel="noopener">termes i condicions</a>'],
    'co.pay': ['Pagar {total} (simulado)', 'Pay {total} (simulated)', 'Paga {total} (simulat)'],
    'co.sum': ['Tu pedido', 'Your order', 'La teva comanda'],
    'co.subtotal': ['Subtotal', 'Subtotal', 'Subtotal'],
    'co.shipping': ['Envío', 'Shipping', 'Enviament'],
    'co.pickfree': ['Recogida gratis', 'Free pickup', 'Recollida gratuïta'],
    'co.total': ['Total', 'Total', 'Total'],
    'co.proc': ['Procesando pago…', 'Processing payment…', 'Processant el pagament…'],
    'co.friend': ['amig@', 'friend', 'amic/amiga'],
    'co.done.h': ['¡Mahalo, {name}!', 'Mahalo, {name}!', 'Mahalo, {name}!'],
    'co.done.o': ['Pedido <b>{no}</b> · {total}', 'Order <b>{no}</b> · {total}', 'Comanda <b>{no}</b> · {total}'],
    'co.done.pick': ['Te avisaremos en <b>{email}</b> cuando esté listo para recoger.', 'We\'ll email <b>{email}</b> when it\'s ready for pickup.', 'T\'avisarem a <b>{email}</b> quan estigui llesta per recollir.'],
    'co.done.ship': ['Enviaremos la confirmación y el seguimiento a <b>{email}</b>.', 'We\'ll send the confirmation and tracking to <b>{email}</b>.', 'T\'enviarem la confirmació i el seguiment a <b>{email}</b>.'],
    'co.done.demo': ['Esto es una demostración: no se ha realizado ningún cobro ni se enviará ningún paquete.', 'This is a demo: nothing has been charged and no parcel will be sent.', 'Això és una demostració: no s\'ha fet cap cobrament ni s\'enviarà cap paquet.'],
    'co.done.btn': ['Volver a la tienda', 'Back to the store', 'Torna a la botiga'],

    // ---------- sobre nosotras ----------
    'ab.badge': ['Nuestra historia', 'Our story', 'La nostra història'],
    'ab.h1': ['Sobre <span class="pink">nosotras</span> 🌺', 'About <span class="pink">us</span> 🌺', 'Sobre <span class="pink">nosaltres</span> 🌺'],
    'ab.who': ['Quiénes somos', 'Who we are', 'Qui som'],
    'ab.h2': ['Una pasión convertida en negocio familiar', 'A passion turned into a family business', 'Una passió convertida en negoci familiar'],
    'ab.p1': ['Nuestro proyecto nació de nuestra mayor pasión: coleccionar ropa de los 80, los 90 y los 00. Podría decirse que somos unos enamorados del vintage. La idea surgió de nuestro hobby favorito y, desde 2015, lo compaginamos con nuestros trabajos.', 'Our project started from our biggest passion: collecting clothes from the 80s, 90s and 00s. So, you could say we\'re vintage lovers. This idea came from our favourite hobby and, since 2015, we\'ve been balancing it with our jobs.', 'El nostre projecte va néixer de la nostra gran passió: col·leccionar roba dels 80, els 90 i els 00. Podríem dir que som uns enamorats del vintage. La idea va sorgir del nostre hobby preferit i, des del 2015, el compaginem amb les nostres feines.'],
    'ab.p2': ['Poco a poco nuestra pasión se fue haciendo algo más serio y, hace unos años, dejamos nuestros empleos para dedicarnos por completo y convertir el vintage en un negocio familiar. Importamos ropa del extranjero a nuestra ciudad, Barcelona.', 'Gradually, our passion turned into something more serious, and a few years ago we left our jobs to dedicate ourselves fully and turn vintage into a family business. We import clothes from abroad to our city, Barcelona.', 'A poc a poc la nostra passió es va fer més seriosa i, fa uns anys, vam deixar les feines per dedicar-nos-hi del tot i convertir el vintage en un negoci familiar. Importem roba de l\'estranger a la nostra ciutat, Barcelona.'],
    'ab.s1': ['empezamos a coleccionar', 'we started collecting', 'vam començar a col·leccionar'],
    'ab.s2': ['años vendiendo online a todo el mundo', 'years selling online worldwide', 'anys venent en línia a tot el món'],
    'ab.s3': ['tiendas en Barcelona', 'stores in Barcelona', 'botigues a Barcelona'],
    'ab.s4': ['personas en nuestra comunidad', 'people in our community', 'persones a la nostra comunitat'],
    'ab.find.b': ['Online y en persona', 'Online and in person', 'En línia i en persona'],
    'ab.find.h': ['Encuéntranos en las dos', 'Find us in both', 'Trobeu-nos a totes dues'],
    'ab.find.p': ['Online en <a href="index.html">mahalovintage.com</a>, y físicamente en seis tiendas de Barcelona. ¡Te invitamos a visitarnos!', 'Online at <a href="index.html">mahalovintage.com</a>, and in person in six stores in Barcelona. We invite you to visit us!', 'En línia a <a href="index.html">mahalovintage.com</a>, i físicament en sis botigues de Barcelona. Et convidem a visitar-nos!'],
    'ab.cta.h': ['Únete a nuestra familia de <span class="amber">VINTAGE addicts</span>', 'Join our family of <span class="amber">VINTAGE addicts</span>', 'Uneix-te a la nostra família de <span class="amber">VINTAGE addicts</span>'],
    'ab.cta.p': ['Síguenos en <b>@mahalovintage</b>: una comunidad de más de 30k personas que nos apoya desde hace tiempo, construida paso a paso.', 'Follow us at <b>@mahalovintage</b>: a community of over 30k people who have supported us for a long time, built step by step.', 'Segueix-nos a <b>@mahalovintage</b>: una comunitat de més de 30k persones que ens dona suport des de fa temps, construïda pas a pas.'],
    'ab.cta.b1': ['Seguir en Instagram ↗', 'Follow on Instagram ↗', 'Segueix a Instagram ↗'],
    'ab.cta.b2': ['Ver la colección', 'See the collection', 'Veure la col·lecció'],

    // ---------- contacto ----------
    'ct.badge': ['Hablamos', 'Let\'s talk', 'Parlem'],
    'ct.h1': ['Contacto <span class="pink">📬</span>', 'Contact <span class="pink">📬</span>', 'Contacte <span class="pink">📬</span>'],
    'ct.sub': ['Nuestro equipo está aquí para ayudarte. Escríbenos o pásate por tienda.', 'Our friendly team is here to help. Write to us or drop by a store.', 'El nostre equip és aquí per ajudar-te. Escriu-nos o passa per una botiga.'],
    'ct.email.s': ['Nuestro equipo está aquí para ayudarte.', 'Our friendly team is here to help.', 'El nostre equip és aquí per ajudar-te.'],
    'ct.phone': ['Teléfono', 'Phone', 'Telèfon'],
    'ct.phone.s': ['Lunes a viernes de 8:00 a 17:00.', 'Monday to Friday, 8am to 5pm.', 'De dilluns a divendres de 8:00 a 17:00.'],
    'ct.ig.s': ['Escríbenos por mensaje directo.', 'Send us a direct message.', 'Escriu-nos per missatge directe.'],
    'ct.demo': ['Demo · el formulario no envía datos', 'Demo · the form doesn\'t send any data', 'Demo · el formulari no envia cap dada'],
    'ct.f.h': ['Escríbenos', 'Write to us', 'Escriu-nos'],
    'ct.f.p': ['Si tienes cualquier duda o inquietud, no dudes en contactarnos.', 'If you have any questions or concerns, feel free to contact us.', 'Si tens qualsevol dubte o inquietud, no dubtis a contactar-nos.'],
    'ct.name': ['Nombre', 'Name', 'Nom'],
    'ct.subject': ['Asunto', 'Subject', 'Assumpte'],
    'ct.subject.ph': ['Pedido, envío, una pieza…', 'Order, shipping, a piece…', 'Comanda, enviament, una peça…'],
    'ct.msg': ['Mensaje', 'Message', 'Missatge'],
    'ct.send': ['Enviar mensaje', 'Send message', 'Envia el missatge'],
    'ct.ok': ['🌺 ¡Mahalo! Mensaje recibido (simulado). En la web real te responderemos por email.', '🌺 Mahalo! Message received (simulated). On the real site we\'ll reply by email.', '🌺 Mahalo! Missatge rebut (simulat). A la web real et respondrem per correu electrònic.'],
    'ct.st.h': ['Nuestras tiendas', 'Our stores', 'Les nostres botigues'],
    'ct.st.p': ['Seis tiendas en Barcelona y nuestro showroom (C/ Sardenya, 100, 08018) para recogida de pedidos online.', 'Six stores in Barcelona and our showroom (C/ Sardenya, 100, 08018) for picking up online orders.', 'Sis botigues a Barcelona i el nostre showroom (C/ Sardenya, 100, 08018) per recollir comandes en línia.'],

    // ---------- envíos ----------
    'sh.badge': ['Cómo te llega', 'How it reaches you', 'Com t\'arriba'],
    'sh.h1': ['Envíos <span class="pink">🌴</span>', 'Shipping <span class="pink">🌴</span>', 'Enviaments <span class="pink">🌴</span>'],
    'sh.sub': ['Trabajamos principalmente con Correos, tanto a nivel nacional como internacional.', 'We work mainly with Correos, both nationally and internationally.', 'Treballem principalment amb Correos, tant a nivell nacional com internacional.'],
    'sh.m.b': ['Elige tu tarifa', 'Choose your rate', 'Tria la teva tarifa'],
    'sh.m.h': ['Métodos de envío', 'Shipping methods', 'Mètodes d\'enviament'],
    'sh.m.p': ['Las tarifas son las que estipula la empresa de envíos y puedes elegir entre varias al finalizar la compra.', 'Rates are set by the shipping company and you can choose between several at checkout.', 'Les tarifes són les que estipula l\'empresa d\'enviaments i pots triar-ne entre diverses en finalitzar la compra.'],
    'sh.pick.p': ['Recogida en tienda. Tu pedido queda en espera en nuestro local hasta que lo recojas, y nos comprometemos a guardarlo y mantenerlo.', 'Pick up in store. Your order is held at our shop until you collect it, and we commit to keeping it safe until then.', 'Recollida a botiga. La teva comanda queda en espera al nostre local fins que la recullis, i ens comprometem a guardar-la i mantenir-la.'],
    'sh.ord.h': ['Envío ordinario', 'Ordinary shipping', 'Enviament ordinari'],
    'sh.ord.p': ['La tarifa más económica. No tiene número de seguimiento: no se puede localizar el paquete hasta que llega a destino. Mahalo Vintage no se hace responsable de pérdidas o retrasos; el comprador asume el riesgo.', 'The cheapest rate. It has no tracking number: the parcel can\'t be located until it reaches its destination. Mahalo Vintage is not responsible for loss or delay; the buyer assumes the risk.', 'La tarifa més econòmica. No té número de seguiment: no es pot localitzar el paquet fins que arriba a destí. Mahalo Vintage no es fa responsable de pèrdues ni retards; el comprador n\'assumeix el risc.'],
    'sh.cert.h': ['Envío certificado', 'Certified shipping', 'Enviament certificat'],
    'sh.cert.p': ['Con número de seguimiento: localizamos el paquete en todo momento hasta destino. Es la tarifa más recomendada por nuestro equipo. Nos responsabilizamos del seguimiento y la entrega, y somos intermediarios entre Correos y tú.', 'With a tracking number: we can locate the parcel at all times until it arrives. It\'s the rate our team recommends most. We take responsibility for tracking and delivery and act as intermediaries between Correos and you.', 'Amb número de seguiment: localitzem el paquet en tot moment fins a destí. És la tarifa més recomanada pel nostre equip. Ens responsabilitzem del seguiment i del lliurament, i fem d\'intermediaris entre Correos i tu.'],
    'sh.rec': ['Recomendado', 'Recommended', 'Recomanat'],
    'sh.exp.h': ['Envío exprés', 'Express shipping', 'Enviament exprés'],
    'sh.exp.p': ['Mismas características que el certificado, pero con la entrega en el mínimo tiempo posible. Mantenemos un seguimiento al detalle contigo.', 'Same features as certified, but delivered in the shortest time possible. We keep you closely updated on the shipment.', 'Mateixes característiques que el certificat, però amb el lliurament en el mínim temps possible. Mantenim un seguiment detallat amb tu.'],
    'sh.t.b': ['Plazos', 'Delivery times', 'Terminis'],
    'sh.t.h': ['¿Cuándo recibiré mi pedido?', 'When will I receive my order?', 'Quan rebré la meva comanda?'],
    'sh.t.p1': ['El envío se realiza con Correos, que generalmente entrega en <b>no más de 6 días laborables</b>.', 'Shipping is with Correos, which generally delivers in <b>no more than 6 working days</b>.', 'L\'enviament es fa amb Correos, que generalment lliura en <b>no més de 6 dies laborables</b>.'],
    'sh.t.p2': ['Correos hace un único intento de entrega. Si no te encuentra en casa, dejará una nota de paso en tu buzón y entregará tu pedido en la oficina de correos más cercana.', 'Correos makes a single delivery attempt. If you\'re not home, they\'ll leave a note in your mailbox and deliver your order to the nearest post office.', 'Correos fa un únic intent de lliurament. Si no et troba a casa, deixarà una nota a la teva bústia i lliurarà la teva comanda a l\'oficina de correus més propera.'],
    'sh.t.p3': ['No nos hacemos cargo de los costes aduaneros de Canarias.', 'We do not cover customs costs for the Canary Islands.', 'No ens fem càrrec dels costos duaners de Canàries.'],
    'sh.free.h': ['Envío gratis 🎉', 'Free shipping 🎉', 'Enviament gratuït 🎉'],
    'sh.free.1': ['Recogida en nuestro showroom de la calle Sardenya 100 (Barcelona): sin coste añadido.', 'Pick-up at our showroom on Sardenya 100 (Barcelona): no extra cost.', 'Recollida al nostre showroom del carrer Sardenya 100 (Barcelona): sense cost afegit.'],
    'sh.free.2': ['Envíos a España con compras de <b>100 € o más</b>: sin coste añadido.', 'Shipping to Spain on purchases of <b>€100 or more</b>: no extra cost.', 'Enviaments a Espanya amb compres de <b>100 € o més</b>: sense cost afegit.'],
    'sh.r.b': ['Tarifas', 'Rates', 'Tarifes'],
    'sh.r.h': ['¿Cuánto me cuesta el envío?', 'How much does shipping cost?', 'Quant em costa l\'enviament?'],
    'sh.th.w': ['Peso del paquete', 'Parcel weight', 'Pes del paquet'],
    'sh.th.es': ['España', 'Spain', 'Espanya'], 'sh.th.eu': ['Europa', 'Europe', 'Europa'], 'sh.th.ww': ['Resto del mundo', 'Rest of the world', 'Resta del món'],
    'sh.w1': ['Hasta 500 g', 'Up to 500 g', 'Fins a 500 g'], 'sh.w2': ['De 500 g a 1 kg', '500 g to 1 kg', 'De 500 g a 1 kg'],
    'sh.w3': ['De 1 a 2 kg', '1 to 2 kg', 'D\'1 a 2 kg'], 'sh.w4': ['De 2 a 5 kg', '2 to 5 kg', 'De 2 a 5 kg'],
    'sh.note': ['Al realizar la compra confirmas que aceptas nuestra política de envíos y estás conforme con la tarifa elegida y sus características. ¿Dudas? <a href="contacto.html" style="text-decoration:underline">Contacta con el equipo Mahalo Vintage</a>.', 'By making a purchase you confirm that you accept our shipping policy and are happy with the chosen rate and its features. Questions? <a href="contacto.html" style="text-decoration:underline">Contact the Mahalo Vintage team</a>.', 'En fer la compra confirmes que acceptes la nostra política d\'enviaments i estàs conforme amb la tarifa triada i les seves característiques. Dubtes? <a href="contacto.html" style="text-decoration:underline">Contacta amb l\'equip de Mahalo Vintage</a>.'],

    // ---------- menú, cuenta y about (nuevo) ----------
    "menu.label": ["Menú", "Menu", "Menú"],
    "menu.title": ["Explora Mahalo", "Explore Mahalo", "Explora Mahalo"],
    "menu.close": ["Cerrar menú", "Close menu", "Tanca el menú"],
    "menu.shop": ["Tienda", "Shop", "Botiga"],
    "menu.shop.s": ["Ver la colección", "See the collection", "Veure la col·lecció"],
    "menu.about.s": ["Nuestra historia", "Our story", "La nostra història"],
    "menu.contact.s": ["Escríbenos o visítanos", "Write to us or visit us", "Escriu-nos o visita'ns"],
    "menu.delivery.s": ["Plazos y tarifas", "Times and rates", "Terminis i tarifes"],
    "menu.terms.s": ["Condiciones de compra", "Terms of sale", "Condicions de compra"],
    "menu.privacy.s": ["Tus datos", "Your data", "Les teves dades"],
    "acct.btn.in": ["Entrar", "Log in", "Entra"],
    "acct.btn.my": ["Mi cuenta", "My account", "El meu compte"],
    "acct.title.in": ["Entrar", "Log in", "Entra"],
    "acct.title.reg": ["Crea tu cuenta", "Create your account", "Crea el teu compte"],
    "acct.tab.in": ["Entrar", "Log in", "Entra"],
    "acct.tab.reg": ["Registro", "Sign up", "Registre"],
    "acct.demo": ["Demo · cuenta simulada", "Demo · simulated account", "Demo · compte simulat"],
    "acct.name": ["Nombre", "Name", "Nom"],
    "acct.email": ["Email", "Email", "Correu electrònic"],
    "acct.pass": ["Contraseña", "Password", "Contrasenya"],
    "acct.go.in": ["Entrar", "Log in", "Entra"],
    "acct.go.reg": ["Crear cuenta", "Create account", "Crea el compte"],
    "acct.note": ["Acceso simulado: no hay cuentas reales en esta propuesta y la contraseña no se guarda.", "Simulated access: there are no real accounts in this proposal and your password isn't stored.", "Accés simulat: no hi ha comptes reals en aquesta proposta i la contrasenya no es desa."],
    "acct.note2": ["También puedes comprar sin cuenta: en el pago, como invitado.", "You can also buy without an account: checkout works as a guest.", "També pots comprar sense compte: el pagament funciona com a convidat."],
    "acct.hi": ["Hola, {name} 🌺", "Hi, {name} 🌺", "Hola, {name} 🌺"],
    "acct.logged": ["Sesión iniciada como <b>{email}</b>.", "Logged in as <b>{email}</b>.", "Sessió iniciada com a <b>{email}</b>."],
    "acct.orders": ["Mis pedidos", "My orders", "Les meves comandes"],
    "acct.orders.empty": ["Todavía no tienes pedidos. ¡Encuentra tu pieza!", "You have no orders yet. Find your piece!", "Encara no tens cap comanda. Troba la teva peça!"],
    "acct.order": ["Pedido {no} · {date}", "Order {no} · {date}", "Comanda {no} · {date}"],
    "acct.logout": ["Cerrar sesión", "Log out", "Tanca la sessió"],
    "acct.shop": ["Ir a la tienda", "Go to the shop", "Ves a la botiga"],
    "toast.in": ["Sesión iniciada 🌴", "Logged in 🌴", "Sessió iniciada 🌴"],
    "toast.out": ["Hasta pronto 👋", "See you soon 👋", "Fins aviat 👋"],
    "toast.created": ["Cuenta creada 🌺", "Account created 🌺", "Compte creat 🌺"],
    "co.guest.user": ["Comprando como {name}.", "Checking out as {name}.", "Comprant com a {name}."],
    "ab.sub": ["Moda vintage con historia, desde Barcelona", "Vintage fashion with a story, from Barcelona", "Moda vintage amb història, des de Barcelona"],
    "ab.exp.l": ["años de experiencia", "years of experience", "anys d'experiència"],
    "ab.exp.p": ["Con años de experiencia en el sector, aportamos conocimiento y saber hacer a cada pieza que seleccionamos.", "With years of experience in the industry, we bring a wealth of knowledge and expertise to the table.", "Amb anys d'experiència al sector, aportem coneixement i saber fer a cada peça que seleccionem."],
    "ab.loc.l": ["tiendas locales", "local stores", "botigues locals"],
    "ab.loc.p": ["Apoyamos al comercio local y damos prioridad a construir relaciones sólidas con la comunidad.", "Supporting local businesses, we prioritize building strong community relationships.", "Donem suport al comerç local i prioritzem construir relacions sòlides amb la comunitat."],
    "ab.begin.h": ["Aquí empieza MAHALO VINTAGE", "This is the beginning of MAHALO VINTAGE", "Aquí comença MAHALO VINTAGE"],
    "ab.begin.p": ["Puedes encontrarnos <b>ONLINE</b> en nuestra web, vendiendo ropa vintage a todo el mundo desde hace más de cinco años: <a href=\"index.html\">www.mahalovintage.com</a>", "You can find us <b>ONLINE</b> through our website, selling vintage clothing globally for over five years: <a href=\"index.html\">www.mahalovintage.com</a>", "Pots trobar-nos <b>EN LÍNIA</b> a la nostra web, venent roba vintage a tot el món des de fa més de cinc anys: <a href=\"index.html\">www.mahalovintage.com</a>"],
    "ab.begin.q": ["Y también, físicamente, en:", "And also, physically at:", "I també, físicament, a:"],
    "ab.gal.h": ["Un vistazo a nuestras tiendas", "A peek inside our stores", "Una ullada a les nostres botigues"],
    "ab.msg.h": ["Tienes 2 mensajes nuevos 💌", "You have 2 new messages 💌", "Tens 2 missatges nous 💌"],
    "ab.msg.now": ["ahora", "now", "ara"],
    "ab.msg1.t": ["¡Te invitamos a visitarnos!", "We invite you to visit us!", "Et convidem a visitar-nos!"],
    "ab.msg1.p": ["Seis tiendas en la ciudad de Barcelona te están esperando. 🌺", "Six stores in the city of Barcelona are waiting for you. 🌺", "Sis botigues a la ciutat de Barcelona t'esperen. 🌺"],
    "ab.msg1.b": ["Ver tiendas", "See stores", "Veure botigues"],
    "ab.msg2.t": ["Únete a nuestra familia de VINTAGE addicts", "Join our family of VINTAGE addicts", "Uneix-te a la nostra família de VINTAGE addicts"],
    "ab.msg2.p": ["Síguenos en @mahalovintage: una comunidad de más de 30k personas que nos apoya desde hace tiempo, construida paso a paso.", "Follow us at @mahalovintage: a community of over 30k people who have supported us for a long time, built step by step.", "Segueix-nos a @mahalovintage: una comunitat de més de 30k persones que ens dona suport des de fa temps, construïda pas a pas."],
    "ab.msg2.b": ["Seguir en Instagram", "Follow on Instagram", "Segueix a Instagram"],

    // ---------- legal ----------
    "lg.contact.extra": ["Para cualquier otra consulta, también puedes escribirnos a <a href=\"mailto:info@mahalovintage.com\">info@mahalovintage.com</a>.", "For any other enquiry, you can also write to us at <a href=\"mailto:info@mahalovintage.com\">info@mahalovintage.com</a>.", "Per a qualsevol altra consulta, també pots escriure'ns a <a href=\"mailto:info@mahalovintage.com\">info@mahalovintage.com</a>."],
    'lg.badge': ['Legal', 'Legal', 'Legal'],
    'lg.toc': ['En esta página', 'On this page', 'En aquesta pàgina'],
    'lg.t.h1': ['Términos y <span class="pink">condiciones</span>', 'Terms and <span class="pink">conditions</span>', 'Termes i <span class="pink">condicions</span>'],
    'lg.t.sub': ['Condiciones generales de contratación de mahalovintage.com', 'General terms of sale of mahalovintage.com', 'Condicions generals de contractació de mahalovintage.com'],
    'lg.t.note': ['Texto íntegro de las condiciones vigentes en mahalovintage.com.', 'Full text of the terms currently in force on mahalovintage.com.', 'Text íntegre de les condicions vigents a mahalovintage.com. Aquest text legal només està disponible en castellà i anglès: es mostra la versió original en castellà.'],
    'lg.p.h1': ['Política de <span class="pink">privacidad</span>', 'Privacy <span class="pink">policy</span>', 'Política de <span class="pink">privadesa</span>'],
    'lg.p.sub': ['Cómo tratamos tus datos personales en mahalovintage.com', 'How we handle your personal data on mahalovintage.com', 'Com tractem les teves dades personals a mahalovintage.com'],
    'lg.p.note': ['Texto íntegro de la política de privacidad vigente en mahalovintage.com.', 'Full text of the privacy policy currently in force on mahalovintage.com.', 'Text íntegre de la política de privadesa vigent a mahalovintage.com. Aquest text legal només està disponible en castellà i anglès: es mostra la versió original en castellà.']
  };
  const LANGS = ['es', 'en', 'ca'];
  const dict = { es: {}, en: {}, ca: {} };
  for (const k in D) LANGS.forEach((l, i) => dict[l][k] = D[k][i]);

  const pick = () => {
    try { const q = new URLSearchParams(location.search).get('lang'); if (LANGS.includes(q)) { localStorage.setItem('mv_lang', q); return q; } } catch {}
    try { const s = localStorage.getItem('mv_lang'); if (LANGS.includes(s)) return s; } catch {}
    const n = (navigator.language || 'es').slice(0, 2).toLowerCase();
    return LANGS.includes(n) ? n : 'es';
  };
  let lang = pick();

  const t = (k, v) => {
    let s = (dict[lang][k] ?? dict.es[k] ?? k);
    if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  };
  const fmtEur = n => lang === 'en' ? '€' + n.toFixed(2) : n.toFixed(2).replace('.', ',') + ' €';

  function apply() {
    const root = document.documentElement;
    root.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); el.hasAttribute('data-i18n-html') ? el.innerHTML = v : el.textContent = v; });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(p => { const [a, k] = p.split(':'); el.setAttribute(a, t(k)); }));
    document.querySelectorAll('[data-eur]').forEach(el => el.textContent = fmtEur(+el.dataset.eur));
    document.querySelectorAll('[data-legal]').forEach(el => el.hidden = el.dataset.legal !== (lang === 'en' ? 'en' : 'es'));
    if (root.dataset.title) document.title = t(root.dataset.title);
    const md = document.querySelector('meta[name=description]'); if (md) md.content = t('meta.desc');
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    document.querySelectorAll('.lang__code').forEach(el => el.textContent = lang.toUpperCase());
  }
  function setLang(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    try { localStorage.setItem('mv_lang', l); } catch {}
    apply();
    document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }
  const closeLangMenus = () => document.querySelectorAll('.lang').forEach(m => { m.querySelector('.lang__list').hidden = true; m.querySelector('.lang__cur').setAttribute('aria-expanded', 'false'); });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (b) { setLang(b.dataset.lang); closeLangMenus(); return; }
    const cur = e.target.closest('.lang__cur');
    if (cur) {
      const list = cur.parentElement.querySelector('.lang__list'), open = list.hidden;
      closeLangMenus();
      if (open) { list.hidden = false; cur.setAttribute('aria-expanded', 'true'); }
      return;
    }
    if (!e.target.closest('.lang')) closeLangMenus();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLangMenus(); });
  window.I18N = { dict, t, fmtEur, getLang: () => lang, setLang, apply };
  apply();
})();
