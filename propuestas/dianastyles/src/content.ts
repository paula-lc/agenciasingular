// TODO: aquí está TODO el contenido editable de la web. Lo marcado con [corchetes] es relleno a completar.

export const BRAND = {
  name: 'Diana Styles',
  tagline: 'Barbera profesional',
  slogan: 'Déjame ayudarte a lucir tu mejor versión',
  whatsapp: '34673171511', // +34 673 171 511
  whatsappLabel: '673 171 511',
  instagram: 'https://www.instagram.com/diana_styles23/',
  instagramHandle: '@diana_styles23',
  address: '[Dirección por confirmar]',
  city: '[Ciudad]',
  mapsUrl: '', // pega aquí el enlace de Google Maps cuando lo tengas
  mapEmbed: '', // y la URL de "insertar mapa" para mostrar el mapa en la web
}

export const WA_MESSAGE = 'Hola Diana, quiero reservar una cita 💈'
export const waLink = (text = WA_MESSAGE) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`

// Nombre de archivo dentro de /img (si no existe, se muestra un recuadro indicando qué foto poner)
export const HERO_IMAGE = 'hero.jpg'
export const HERO_IMAGE_2 = 'estudio.jpg'
export const ABOUT_IMAGE = 'sobre-mi.jpg'

export type Service = { title: string; desc: string; price: string; image: string }

export const SERVICES: Service[] = [
  { title: 'Corte de caballero', desc: 'Cortes clásicos y modernos, degradados y acabados con detalle.', price: 'Consultar', image: 'corte-hombre.jpg' },
  { title: 'Corte de dama', desc: 'Cortes a tu medida para renovar tu estilo y tu forma de rostro.', price: 'Consultar', image: 'corte-dama.jpg' },
  { title: 'Corte de niños', desc: 'Cortes cómodos y con buen trato para los más pequeños.', price: 'Consultar', image: 'corte-ninos.jpg' },
  { title: 'Balayage', desc: 'Color y luz natural, con degradado suave y a medida de cada persona.', price: 'Consultar', image: 'balayage.jpg' },
  { title: 'Trenzas', desc: 'Trenzas y peinados para el día a día o para ocasiones especiales.', price: 'Consultar', image: 'trenzas.jpg' },
]

export const PORTFOLIO = [
  { src: 'portafolio-01.jpg', alt: 'Corte de caballero' },
  { src: 'portafolio-02.jpg', alt: 'Balayage' },
  { src: 'portafolio-03.jpg', alt: 'Trenzas' },
  { src: 'portafolio-04.jpg', alt: 'Corte de dama' },
  { src: 'portafolio-05.jpg', alt: 'Corte de caballero' },
  { src: 'portafolio-06.jpg', alt: 'Corte de niños' },
  { src: 'portafolio-07.jpg', alt: 'Balayage' },
  { src: 'portafolio-08.jpg', alt: 'Trenzas' },
]

export const ABOUT = {
  title: 'Hola, soy Diana',
  paragraphs: [
    'Barbera profesional de Colombia y ahora en España. Hago cortes de dama, caballero y niños, además de balayage y trenzas.',
    'Mi objetivo es que salgas sintiéndote tu mejor versión. [Completar con la historia de Diana: años de experiencia, formación, estilo de trabajo.]',
  ],
  highlights: [
    ['Cortes', 'Dama · caballero · niños'],
    ['Color', 'Balayage'],
    ['Peinados', 'Trenzas'],
  ] as [string, string][],
}

// Reseñas reales (nombre + texto). Mientras esté vacío, la sección no se muestra.
export const REVIEWS: { name: string; text: string }[] = []
export const RATING = '' // p. ej. '4,9'
export const REVIEW_COUNT = 0
export const REVIEWS_URL = ''
