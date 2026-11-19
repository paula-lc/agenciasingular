import { useEffect, useState } from 'react'
import {
  ABOUT, ABOUT_IMAGE, BRAND, HERO_IMAGE, HERO_IMAGE_2, PORTFOLIO, RATING, REVIEWS, REVIEWS_URL,
  REVIEW_COUNT, SERVICES, waLink,
} from './content'

// Imágenes de /img indexadas por nombre de archivo
const IMAGES = import.meta.glob('../img/*.{jpg,jpeg,png,webp,JPG,PNG}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const imageUrl = (name: string) => {
  const key = Object.keys(IMAGES).find(k => k.endsWith('/' + name))
  return key ? IMAGES[key] : undefined
}

const INK = '#141414'
const MUTED = '#6B6258'
const GOLD = '#C8973A'
const BG = '#F7F4EF'
const CARD = '#FCFAF7'
const LINE = 'rgba(200,151,58,0.3)'

const GOLD_BTN = {
  background: 'linear-gradient(135deg, #8B6010 0%, #C8973A 35%, #F5D98B 50%, #C8973A 65%, #8B6010 100%)',
  backgroundSize: '200% auto',
  color: '#FFF9F0',
  letterSpacing: '0.12em',
  animation: 'shimmer 3s linear infinite',
} as const

const NAV = [
  ['Servicios', 'servicios'],
  ['Portafolio', 'portafolio'],
  ['Sobre mí', 'sobre-mi'],
  ['Contacto', 'contacto'],
]

function Photo({ name, alt, className = '', position = 'center' }: { name: string; alt: string; className?: string; position?: string }) {
  const src = imageUrl(name)
  if (src) return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} style={{ objectPosition: position }} />
  return (
    <div role="img" aria-label={alt} className={`flex items-center justify-center text-center p-3 ${className}`}
      style={{ background: 'linear-gradient(135deg, #ECE5D8, #D9CDB6)' }}>
      <span className="text-[10px] tracking-widest uppercase" style={{ color: '#8A7B63' }}>Foto pendiente<br />img/{name}</span>
    </div>
  )
}

const Icon = ({ name }: { name: 'pin' | 'whatsapp' | 'instagram' }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === 'pin' && (<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>)}
    {name === 'whatsapp' && (<><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5L3 21z" /><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2L9 8.5z" /></>)}
    {name === 'instagram' && (<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" /></>)}
  </svg>
)

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i === null ? i : (i + 1) % PORTFOLIO.length))
      if (e.key === 'ArrowLeft') setLightbox(i => (i === null ? i : (i - 1 + PORTFOLIO.length) % PORTFOLIO.length))
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: BG }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(247,244,239,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${LINE}` }}>
        <a href="#home" className="font-display text-2xl font-semibold gold-text">{BRAND.name}</a>
        <div className="hidden md:flex items-center gap-8">
          {NAV.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="nav-link text-sm tracking-widest uppercase" style={{ color: INK, letterSpacing: '0.12em', fontWeight: 500 }}>{label}</a>
          ))}
        </div>
        <a href={waLink()} target="_blank" rel="noopener noreferrer"
          className="hidden md:inline-flex px-6 py-2.5 text-xs tracking-widest uppercase font-semibold transition-all duration-300 hover:scale-105"
          style={GOLD_BTN}>
          Reservar
        </a>
        <button className="md:hidden p-2" aria-label="Menú" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5" style={{ background: GOLD }} />
            <span className="block w-4 h-0.5" style={{ background: GOLD }} />
            <span className="block w-6 h-0.5" style={{ background: GOLD }} />
          </div>
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center" style={{ background: 'rgba(247,244,239,0.97)' }} onClick={() => setMenuOpen(false)}>
          {NAV.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="nav-link font-display text-3xl py-4 italic" style={{ color: GOLD }}>{label}</a>
          ))}
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-display text-3xl py-4 italic" style={{ color: INK }}>Reservar</a>
        </div>
      )}

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: 96 }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #C8973A 0%, transparent 70%)', transform: 'translate(30%, -10%)' }} />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: GOLD }}>✦ {BRAND.tagline} · Dama, caballero y niños ✦</p>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-4">
              <span className="italic" style={{ color: INK }}>Tu </span>
              <span className="gold-text font-semibold">MEJOR</span>
              <br />
              <span className="italic" style={{ color: INK }}>versión</span>
            </h1>
            <p className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: INK }}>by {BRAND.name}</p>
            <p className="text-base md:text-lg mb-10 max-w-md leading-relaxed" style={{ color: MUTED, fontWeight: 300 }}>
              {BRAND.slogan}. Cortes de dama, caballero y niños, balayage y trenzas.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={waLink()} target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:scale-105 gold-glow" style={GOLD_BTN}>
                Reservar por WhatsApp
              </a>
              <a href="#portafolio"
                className="px-8 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:bg-black/5"
                style={{ border: `1px solid ${INK}`, color: INK, letterSpacing: '0.12em' }}>
                Ver portafolio
              </a>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
              <div className="shine-hover absolute inset-0 overflow-hidden">
                <Photo name={HERO_IMAGE} alt={`${BRAND.name} trabajando`} className="w-full h-full" />
              </div>
              <div className="absolute -right-8 top-16 px-5 py-4" style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 0 40px rgba(200,151,58,0.25)' }}>
                <div className="font-display italic text-lg" style={{ color: GOLD }}>Lucir tu mejor versión</div>
                <div className="text-xs tracking-widest uppercase mt-0.5" style={{ color: MUTED }}>{BRAND.city}</div>
              </div>
              <div className="absolute -right-10 -bottom-8 w-40 h-52 overflow-hidden gold-glow" style={{ border: `3px solid ${CARD}` }}>
                <Photo name={HERO_IMAGE_2} alt="El estudio" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <div className="bar-shine py-3" style={{ background: 'linear-gradient(135deg, #C8973A 0%, #F5D98B 50%, #C8973A 100%)' }}>
        <div className="flex whitespace-nowrap">
          <div className="flex gap-8 shrink-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="text-xs tracking-widest uppercase font-medium px-4" style={{ color: '#3A2000' }}>
                ✦ Corte caballero &nbsp;✦ Corte dama &nbsp;✦ Niños &nbsp;✦ Balayage &nbsp;✦ Trenzas
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="servicios" className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-medium" style={{ color: GOLD }}>Carta de servicios</p>
          <h2 className="font-display text-5xl md:text-6xl italic" style={{ color: INK }}>
            Nuestros <span className="gold-text font-semibold not-italic">Servicios</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(s => (
            <div key={s.title} className="service-card relative overflow-hidden flex flex-col" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <div className="aspect-[16/10] overflow-hidden">
                <Photo name={s.image} alt={s.title} className="w-full h-full" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2" style={{ color: INK }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: MUTED, fontWeight: 300 }}>{s.desc}</p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold" style={{ color: GOLD }}>{s.price}</span>
                  <a href={waLink(`Hola Diana, quiero reservar: ${s.title}`)} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 text-xs tracking-widest uppercase font-semibold transition-transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #C8973A, #F5D98B, #C8973A)', color: '#3A2000', letterSpacing: '0.12em' }}>
                    Reservar
                  </a>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #C8973A, transparent)' }} />
            </div>
          ))}
          <div className="relative overflow-hidden p-8 text-center flex flex-col justify-center"
            style={{ background: 'linear-gradient(135deg, #141414 0%, #2A2A2A 100%)', border: `1px solid ${LINE}` }}>
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>Tu cita</p>
            <h3 className="font-display text-3xl italic text-white mb-6">¿Lista/o para <span className="gold-text font-semibold">cambiar de look</span>?</h3>
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="inline-block w-full px-8 py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:scale-105 gold-glow" style={GOLD_BTN}>
              Reservar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre-mi" className="py-16 overflow-hidden" style={{ background: CARD }}>
        <div className="max-w-6xl mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10 overflow-hidden aspect-[4/5]" style={{ border: `1px solid ${LINE}` }}>
              <Photo name={ABOUT_IMAGE} alt={BRAND.name} className="w-full h-full" />
            </div>
            <div className="absolute -top-4 -left-4 w-16 h-16" style={{ border: `2px solid ${GOLD}`, borderRight: 'none', borderBottom: 'none' }} />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: GOLD }}>Sobre mí</p>
            <h2 className="font-display text-5xl italic mb-6" style={{ color: INK, lineHeight: 1.1 }}>
              Hola, soy <span className="gold-text">Diana</span>
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: MUTED, fontWeight: 300 }}>
              {ABOUT.paragraphs.map(p => <p key={p}>{p}</p>)}
              <p className="font-display italic text-xl" style={{ color: GOLD }}>{BRAND.slogan}.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-8">
              {ABOUT.highlights.map(([top, bot]) => (
                <div key={top}>
                  <div className="font-display text-lg italic gold-text font-semibold">{top}</div>
                  <div className="text-xs tracking-wider uppercase mt-0.5" style={{ color: MUTED }}>{bot}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portafolio" className="py-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-3 font-medium" style={{ color: GOLD }}>Portafolio</p>
          <h2 className="font-display text-5xl md:text-6xl italic" style={{ color: INK }}>
            Nuestro <span className="gold-text font-semibold">trabajo</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PORTFOLIO.map((g, i) => (
            <div key={i} role="button" tabIndex={0} onClick={() => setLightbox(i)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setLightbox(i)}
              className="group overflow-hidden relative cursor-zoom-in" style={{ aspectRatio: '4/5', background: '#E7E0D6' }}>
              <Photo name={g.src} alt={g.alt} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.6), transparent)' }}>
                <span className="text-xs tracking-wider uppercase font-medium text-white">{g.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(20,20,20,0.93)' }} onClick={() => setLightbox(null)}>
          <button aria-label="Cerrar" onClick={() => setLightbox(null)} className="absolute top-4 right-6 text-4xl leading-none text-white">×</button>
          <button aria-label="Anterior" onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + PORTFOLIO.length) % PORTFOLIO.length) }}
            className="absolute left-3 md:left-8 text-5xl leading-none" style={{ color: '#F5D98B' }}>‹</button>
          <div onClick={e => e.stopPropagation()} className="max-h-[88vh] max-w-full">
            <Photo name={PORTFOLIO[lightbox].src} alt={PORTFOLIO[lightbox].alt} className="max-h-[88vh] max-w-full w-[80vw] md:w-[480px] aspect-[4/5]" />
          </div>
          <button aria-label="Siguiente" onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % PORTFOLIO.length) }}
            className="absolute right-3 md:right-8 text-5xl leading-none" style={{ color: '#F5D98B' }}>›</button>
        </div>
      )}

      {/* REVIEWS (solo si hay reseñas) */}
      {REVIEWS.length > 0 && (
        <section id="resenas" className="py-16" style={{ background: 'linear-gradient(135deg, #141414 0%, #2A2A2A 100%)' }}>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: GOLD }}>Reseñas</p>
            <h2 className="font-display text-4xl md:text-5xl italic mb-8 text-white">Lo que dicen <span className="gold-text font-semibold">mis clientes</span></h2>
            {RATING && <p className="text-white mb-8">{RATING} ★★★★★ · {REVIEW_COUNT} reseñas</p>}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {REVIEWS.slice(0, 3).map(r => (
                <figure key={r.name} className="p-7" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${LINE}` }}>
                  <div className="mb-3" style={{ color: '#F5D98B', letterSpacing: '2px' }}>★★★★★</div>
                  <blockquote className="font-display italic text-base leading-relaxed text-white mb-4">“{r.text}”</blockquote>
                  <figcaption className="text-xs tracking-widest uppercase font-medium" style={{ color: GOLD }}>{r.name}</figcaption>
                </figure>
              ))}
            </div>
            {REVIEWS_URL && (
              <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 px-8 py-4 text-sm tracking-widest uppercase" style={{ border: `1px solid ${GOLD}`, color: '#F5D98B' }}>
                Ver todas las reseñas
              </a>
            )}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contacto" className="py-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: GOLD }}>Contacto</p>
            <h2 className="font-display text-5xl italic mb-6" style={{ color: INK, lineHeight: 1.15 }}>
              Reserva tu <span className="gold-text font-semibold">cita</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: MUTED, fontWeight: 300, maxWidth: '380px' }}>
              Escríbeme por WhatsApp y te confirmo día y hora. {BRAND.slogan}.
            </p>
            <div className="space-y-5 mb-10">
              {([
                ['whatsapp', 'WhatsApp', BRAND.whatsappLabel, waLink()],
                ['instagram', 'Instagram', BRAND.instagramHandle, BRAND.instagram],
                ['pin', 'Ubicación', `${BRAND.address}, ${BRAND.city}`, BRAND.mapsUrl],
              ] as const).map(([icon, label, val, href]) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ color: GOLD, border: '1px solid rgba(200,151,58,0.6)', background: 'radial-gradient(circle at 30% 30%, #FFF9F0, #F8E8C8)', boxShadow: '0 0 18px rgba(245,217,139,0.55)' }}>
                    <Icon name={icon} />
                  </span>
                  <div>
                    <div className="text-xs tracking-widest uppercase font-medium mb-0.5" style={{ color: GOLD }}>{label}</div>
                    {href
                      ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: INK }}>{val}</a>
                      : <div className="text-sm" style={{ color: INK }}>{val}</div>}
                  </div>
                </div>
              ))}
            </div>
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="inline-block px-10 py-4 text-sm tracking-widest uppercase font-semibold transition-all duration-300 hover:scale-105 gold-glow" style={GOLD_BTN}>
              ✦ Reservar por WhatsApp ✦
            </a>
          </div>
          <div className="aspect-[4/5] overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
            <Photo name="contacto.jpg" alt="Clientes felices" className="w-full h-full" />
          </div>
        </div>
        {BRAND.mapEmbed && (
          <div className="max-w-5xl mx-auto mt-12 overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
            <iframe title={`Ubicación de ${BRAND.name}`} src={BRAND.mapEmbed} loading="lazy" className="w-full h-80 block" />
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center" style={{ background: INK, borderTop: `1px solid ${LINE}` }}>
        <div className="font-display text-2xl gold-text font-semibold mb-2">{BRAND.name}</div>
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: 'rgba(200,151,58,0.6)' }}>✦ {BRAND.tagline} ✦</p>
        <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="nav-link inline-block mb-6 text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Instagram {BRAND.instagramHandle}
        </a>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2026 {BRAND.name}. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
