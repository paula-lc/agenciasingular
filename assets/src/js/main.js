/* Agencia Singular — interacciones de la web */

/* ------------------------------------------------------------------
   CONFIGURACIÓN: rellena estos datos antes de publicar
   ------------------------------------------------------------------ */
const SITE = {
  email: "hola@agenciasingular.es",
  // Número con prefijo de país y sin espacios, p. ej. "34600111222". Vacío = se oculta.
  whatsapp: "34684747795",
  // Dirección que recibe los formularios: la URL de la aplicación web de Google Apps Script
  // (ver README → "Recibir los formularios por email") o de Formspree/Web3Forms.
  // Vacío = el formulario abre el correo del usuario con el mensaje ya escrito.
  formEndpoint: "https://script.google.com/macros/s/AKfycbyK_Dqwi7gZ_pNRRHdVpg8wU9NDWJo0u3jWUuWLwA2bBgMqSTlYpmZll9o6SfKQrvYo/exec",
  // Analítica: clave pública del proyecto de Amplitude (solo sirve para enviar eventos; es pública por diseño)
  // y región de los datos. Vacío = no se carga nada.
  amplitude: { apiKey: "ca2c789f1493dc7f487513b84c8ee813", serverZone: "EU" },
  // Plazas que quedan del precio fundador de Cuidados esenciales (y de su versión a distancia), de 5 en total.
  // Es el único sitio donde se cambia: con 0 desaparecen la insignia y el precio fundador y queda solo el precio web.
  fundadorPlazas: 5,
};

document.documentElement.classList.remove("no-js");

/* Idioma de la página: los textos del JavaScript se traducen con assets/js/i18n.js (catalán e inglés) */
const LANG = (document.documentElement.lang || "es").slice(0, 2);
const t = (s, vars) => {
  let out = window.I18N?.[LANG]?.[s] ?? s;
  if (vars) out = out.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  return out;
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Precios: los genera scripts/build/menus.py desde precios.json (única fuente) en <script id="precios-data"> */
const PRECIOS = (() => {
  try { return JSON.parse(document.getElementById("precios-data")?.textContent || "{}"); } catch { return {}; }
})();
const PROD = PRECIOS.productos || {};
const conIva = (x) => Math.round(x * (100 + (PRECIOS.iva ?? 21))) / 100;
const fmtEur = (x) => `${x.toLocaleString("es-ES", { minimumFractionDigits: x % 1 ? 2 : 0, maximumFractionDigits: 2, useGrouping: "always" })} €`;

/* Precio fundador: [data-founder] (precio fundador, insignia y condiciones) solo se ve si quedan plazas;
   [data-web-price] (precio web sin tachar) solo cuando se han acabado */
const founderLeft = Math.max(0, Math.min(5, Math.floor(Number(SITE.fundadorPlazas)) || 0));
const founderOn = founderLeft > 0;
document.querySelectorAll("[data-founder]").forEach((el) => { el.hidden = !founderOn; });
document.querySelectorAll("[data-web-price]").forEach((el) => { el.hidden = founderOn; });
document.querySelectorAll("[data-founder-left]").forEach((el) => { el.textContent = founderLeft; });

/* ------------------------------------------------------------------
   Analítica (Amplitude), en modo híbrido:
   - Por defecto, SIN identificador: no se guarda nada en el navegador (ni cookies ni localStorage),
     no se guarda la IP y cada página cuenta como una visita anónima. Mide visitas y clics.
   - Solo si la persona pulsa «Aceptar» en el aviso: identificador propio de Amplitude (cookie)
     y grabación de sesiones, para ver recorridos y embudos. Se aplica desde la siguiente página.
   La elección se guarda en este navegador (localStorage "as-analitica": "accept" | "reject").
   Los eventos se anotan con track("nombre"); si no hay analítica, no hacen nada.
   ------------------------------------------------------------------ */
const CONSENT_KEY = "as-analitica";
const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const writeConsent = (v) => { try { v ? localStorage.setItem(CONSENT_KEY, v) : localStorage.removeItem(CONSENT_KEY); } catch { /* navegador sin almacenamiento */ } };
// Almacén en memoria: sin consentimiento, la cola de eventos de Amplitude no toca el navegador
const memoryStore = () => {
  const m = new Map();
  return {
    isEnabled: async () => true,
    get: async (k) => m.get(k),
    getRaw: async (k) => (m.has(k) ? JSON.stringify(m.get(k)) : undefined),
    set: async (k, v) => { m.set(k, v); },
    remove: async (k) => { m.delete(k); },
    reset: async () => { m.clear(); },
  };
};
let ampReady = false;
const ampQueue = [];
if (SITE.amplitude?.apiKey) {
  const { apiKey, serverZone } = SITE.amplitude;
  // Se carga la librería de analítica directamente (no el cargador /script/<clave>.js, que además
  // arranca Amplitude Experiment y deja una cookie aunque no haya consentimiento).
  const CDN = `https://cdn${serverZone === "EU" ? ".eu" : ""}.amplitude.com/libs`;
  const loadScript = (src) => new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.async = true; s.src = src; s.onload = ok; s.onerror = ko;
    document.head.appendChild(s);
  });
  const consented = readConsent() === "accept";
  const libs = [loadScript(`${CDN}/analytics-browser-2.42.4-min.js.gz`)];
  if (consented) libs.push(loadScript(`${CDN}/plugin-session-replay-browser-1.32.1-min.js.gz`));
  Promise.all(libs).then(() => {
    const amp = window.amplitude;
    if (!amp?.init) throw new Error("sin window.amplitude");
    if (consented) {
      if (window.sessionReplay?.plugin) amp.add(window.sessionReplay.plugin({ sampleRate: 1, serverZone }));
      amp.init(apiKey, { serverZone, autocapture: true });
    } else {
      // Sin consentimiento: nada se guarda en el navegador y no se guarda la IP.
      // Se desactivan las partes de la autocaptura que usan almacenamiento; la vista de página se anota a mano.
      amp.init(apiKey, {
        serverZone,
        identityStorage: "none",
        storageProvider: memoryStore(),
        trackingOptions: { ipAddress: false },
        fetchRemoteConfig: false,
        autocapture: { attribution: false, pageViews: false, pageUrlEnrichment: false, sessions: true, formInteractions: true, fileDownloads: true, elementInteractions: true, frustrationInteractions: false, webVitals: false, networkTracking: false },
      });
      amp.track("pagina-vista", { ruta: location.pathname });
    }
    ampReady = true;
    ampQueue.splice(0).forEach(([n, p]) => amp.track(n, p));
  }).catch(() => console.error("[amplitude] no se ha podido cargar la librería: no se enviarán eventos"));
} else {
  console.error("[amplitude] falta SITE.amplitude.apiKey: no se enviarán eventos");
}
const track = (name, detail) => {
  if (!SITE.amplitude?.apiKey) return;
  const props = detail ? { detalle: detail } : undefined;
  try { ampReady ? window.amplitude.track(name, props) : ampQueue.push([name, props]); } catch { /* sin analítica */ }
};

/* Aviso de analítica: solo si la persona aún no ha elegido. En /reserva no se muestra
   porque esa página ya tiene su propio aviso (el del calendario de HubSpot). */
const showConsentPop = () => {
  if (!SITE.amplitude?.apiKey || document.getElementById("cookie-pop") || document.querySelector(".consent-pop")) return;
  const pop = document.createElement("div");
  pop.className = "consent-pop";
  pop.setAttribute("role", "dialog");
  pop.setAttribute("aria-labelledby", "consent-pop-title");
  pop.innerHTML = `<h2 id="consent-pop-title"></h2><p><span></span> <a href="/privacidad.html#analitica"></a></p>
    <div class="consent-pop__btns"><button type="button" class="btn btn--yellow" data-analytics-choice="accept" data-track="analitica-aceptar"></button><button type="button" class="btn consent-pop__no" data-analytics-choice="reject" data-track="analitica-rechazar"></button></div>`;
  pop.querySelector("h2").textContent = t("¿Te recordamos?");
  pop.querySelector("p span").textContent = t("Contamos visitas y clics sin guardar nada en tu navegador. Si aceptas, usamos una cookie de analítica para entender mejor cómo se usa la web.");
  pop.querySelector("p a").textContent = t("Más info");
  pop.querySelector('[data-analytics-choice="accept"]').textContent = t("Aceptar");
  pop.querySelector('[data-analytics-choice="reject"]').textContent = t("Ahora no");
  document.body.appendChild(pop);
};
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-analytics-choice]");
  if (b) { writeConsent(b.dataset.analyticsChoice); b.closest(".consent-pop")?.remove(); return; }
  if (e.target.closest("[data-analytics-reset]")) { writeConsent(null); showConsentPop(); }
});
if (!readConsent()) showConsentPop();
window.AS = { SITE, track, t }; // lo usa /hola/ (assets/src/js/hola.js)
const slugify = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Clic en cualquier elemento con data-track="evento" (o en un botón de diagnóstico gratis)
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-track], [data-interes]");
  if (!el || el.matches("input")) return;
  const name = el.dataset.track || (el.dataset.interes === "diagnostico" ? "cta-diagnostico" : "");
  if (name) track(name);
});
// 34684747795 → +34 684 74 77 95
const prettyPhone = (n) => {
  const m = /^34(\d{3})(\d{2})(\d{2})(\d{2})$/.exec(n);
  return m ? `+34 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : `+${n}`;
};

/* ------------------------------------------------------------------
   Cabecera: sombra al hacer scroll + menú móvil
   ------------------------------------------------------------------ */
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? t("Cerrar menú") : t("Abrir menú"));
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

const stickyCta = document.querySelector("[data-sticky-cta]");
const contactSection = document.getElementById("contacto");
let contactVisible = false;

/* Marca la sección visible en la cabecera, en el menú móvil y en el índice lateral */
const navLinks = [...document.querySelectorAll('.nav__links a[href^="#"]')];
const railLinks = [...document.querySelectorAll('.section-rail a[href^="#"]')];
const sectionOf = (a) => document.getElementById(a.getAttribute("href").slice(1));
// Secciones que cubre cada botón (p. ej. "Packs y servicios" cubre packs y servicios)
const sectionsOf = (a) => (a.dataset.sections || a.getAttribute("href").slice(1)).split(" ");
// Todas las secciones de la página, en orden
const allSections = [...new Set([...railLinks, ...navLinks].map(sectionOf).filter(Boolean)),
  ...navLinks.flatMap((a) => sectionsOf(a).map((id) => document.getElementById(id))).filter(Boolean)]
  .filter((v, i, arr) => arr.indexOf(v) === i)
  .sort((x, y) => (x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

const markLinks = (links, id) => links.forEach((a) => {
  const active = links === navLinks ? sectionsOf(a).includes(id) : a.getAttribute("href") === `#${id}`;
  a.classList.toggle("is-active", active);
  if (active) a.setAttribute("aria-current", "location");
  else a.removeAttribute("aria-current");
});

function currentOf(sections) {
  // Línea de referencia: un tercio de la pantalla por debajo de la cabecera
  const line = (header?.offsetHeight || 0) + window.innerHeight * 0.3;
  let current = null;
  for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
  // Al llegar al final de la página, la última sección
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
  return current?.id;
}

function setActive(id) {
  markLinks(railLinks, id);
  markLinks(navLinks, id);
}

let navLock = null;
function updateActiveNav() {
  if (navLock || (!navLinks.length && !railLinks.length)) return;
  markLinks(railLinks, currentOf(allSections));
  // Solo se marca el botón de la sección en la que estás; las secciones sin botón no marcan ninguno
  markLinks(navLinks, currentOf(allSections));
}

// Al hacer clic se marca al momento y se ignora el scroll suave hasta que termina
const releaseNavLock = () => { clearTimeout(navLock); navLock = null; updateActiveNav(); };
[...navLinks, ...railLinks].forEach((a) => a.addEventListener("click", () => {
  setActive(a.getAttribute("href").slice(1));
  clearTimeout(navLock);
  navLock = setTimeout(releaseNavLock, 1200);
}));
window.addEventListener("scrollend", () => { if (navLock) releaseNavLock(); });

let navTicking = false;
function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 10);
  stickyCta?.classList.toggle("is-visible", y > 600 && !contactVisible);
  if (!navTicking) {
    navTicking = true;
    requestAnimationFrame(() => { updateActiveNav(); navTicking = false; });
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (contactSection && stickyCta && "IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    contactVisible = entry.isIntersecting;
    onScroll();
  }).observe(contactSection);
}

/* ------------------------------------------------------------------
   Rebote de los botones al hacer clic
   ------------------------------------------------------------------ */
if (!reduceMotion) {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;
    btn.classList.remove("is-bouncing");
    void btn.offsetWidth; // reinicia la animación si se pulsa varias veces
    btn.classList.add("is-bouncing");
  });
  document.addEventListener("animationend", (e) => {
    if (e.animationName === "btn-bounce") e.target.classList.remove("is-bouncing");
  });
}

/* Logo del pie: rebota y vuelve arriba */
document.querySelectorAll(".footer-logo").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (!reduceMotion) {
      link.classList.remove("is-bouncing");
      void link.offsetWidth;
      link.classList.add("is-bouncing");
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }), reduceMotion ? 0 : 250);
  });
});
document.addEventListener("animationend", (e) => {
  if (e.animationName === "btn-bounce") e.target.classList?.remove("is-bouncing");
});

/* Tarjetas de servicios: rebotan al hacer clic y después abren el formulario */
document.querySelectorAll(".service__link").forEach((link) => {
  const card = link.closest(".service");
  link.addEventListener("click", (e) => {
    if (reduceMotion || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    card.classList.remove("is-bouncing");
    void card.offsetWidth;
    card.classList.add("is-bouncing");
    setTimeout(() => { window.location.href = link.href; }, 380);
  });
});

/* Logo del menú: rebota al hacer clic. En la portada sube arriba; en otras páginas
   espera a que termine el rebote antes de ir al inicio */
document.querySelectorAll(".nav__logo").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const logo = link.querySelector(".alogo");
    if (logo && !reduceMotion) {
      logo.classList.remove("is-bouncing");
      void logo.offsetWidth;
      logo.classList.add("is-bouncing");
    }
    if (document.getElementById("hero-title")) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      setTimeout(() => { window.location.href = link.href; }, reduceMotion ? 0 : 420);
    }
  });
});

/* ------------------------------------------------------------------
   Aparición suave al hacer scroll
   ------------------------------------------------------------------ */
const revealEls = document.querySelectorAll(".reveal");
if (!reduceMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}

/* ------------------------------------------------------------------
   Efecto "escribiendo" en la tarjeta de IA del hero
   ------------------------------------------------------------------ */
const typingEl = document.querySelector("[data-typing]");
if (typingEl) {
  const raw = typingEl.dataset.typing;
  const toHtml = (s) => s.replace(/\*\*(.+?)\*\*/g, "<mark>$1</mark>");
  if (reduceMotion) {
    typingEl.innerHTML = toHtml(raw);
  } else {
    // Se escribe a trocitos: una palabra por fotograma (110 ms), como el resto del movimiento
    const FOTOGRAMA = 110;
    let i = 0;
    typingEl.classList.add("typing");
    const tick = () => {
      const next = raw.indexOf(" ", i + 1);
      i = next === -1 ? raw.length : next;
      // No cortar dentro de una marca **…**
      let partial = raw.slice(0, i);
      const opens = (partial.match(/\*\*/g) || []).length;
      if (opens % 2 === 1) partial += "**";
      typingEl.innerHTML = toHtml(partial);
      if (i < raw.length) setTimeout(tick, FOTOGRAMA);
      else typingEl.classList.remove("typing");
    };
    setTimeout(tick, 900);
  }
}

/* ------------------------------------------------------------------
   Pestañas de sectores (patrón ARIA tabs)
   ------------------------------------------------------------------ */
const tablist = document.querySelector('.sector-tabs[role="tablist"]');
if (tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next); next.focus(); }
    });
  });
}

/* ------------------------------------------------------------------
   Test de visibilidad
   ------------------------------------------------------------------ */
const QUESTIONS = [
  { svc: "google-maps", area: t("Google Maps"), q: t("¿Tu negocio aparece en Google Maps con la ficha verificada?"), hint: t("Busca el nombre de tu negocio en Google Maps desde el móvil."),
    opts: [[t("Sí, y está completa"), 2], [t("Sí, pero a medias"), 1], [t("No / no lo sé"), 0]],
    tip: t("<strong>Reclama y completa tu Perfil de Empresa de Google</strong>: categoría principal exacta, horario, servicios y al menos 10 fotos reales.") },
  { svc: "google-maps", area: t("Reseñas"), q: t("¿Cuántas reseñas tienes en Google?"), hint: t("Las reseñas pesan en Maps y en lo que recomienda la IA."),
    opts: [[t("Más de 50"), 2], [t("Entre 10 y 50"), 1], [t("Menos de 10"), 0]],
    tip: t("<strong>Pide reseñas de forma sistemática</strong>: un QR en el mostrador y un mensaje tras cada visita. Y responde a todas, también a las malas.") },
  { svc: "diseno-web", area: t("Web"), q: t("¿Tienes web propia (no solo Instagram)?"), hint: t("Una web es la fuente oficial que leen Google y las IA."),
    opts: [[t("Sí, y es reciente"), 2], [t("Sí, pero antigua o lenta"), 1], [t("No tengo"), 0]],
    tip: t("<strong>Una web sencilla y rápida</strong> con tus servicios, precios orientativos, zona y contacto es la base de todo lo demás.") },
  { svc: "diseno-web", area: t("Web"), q: t("¿Tu web tiene una página para cada servicio importante?"), hint: t("Ej.: “manicura semipermanente”, “ramos de novia”, “cambio de neumáticos”."),
    opts: [[t("Sí"), 2], [t("Todo está en una sola página"), 1], [t("No tengo web"), 0]],
    tip: t("<strong>Crea una página por servicio clave</strong> que responda: qué es, precio, duración, para quién y dónde. Así Google y la IA saben por qué recomendarte.") },
  { svc: "ia", area: t("IA"), q: t("Si preguntas a ChatGPT o Gemini por tu servicio en tu zona, ¿te nombra?"), hint: t("Pruébalo: “¿qué [tu servicio] me recomiendas en [tu barrio]?”."),
    opts: [[t("Sí, aparezco"), 2], [t("Aparece mi competencia"), 0], [t("No lo he probado"), 0]],
    tip: t("<strong>Hazte visible para la IA</strong>: mismos datos (nombre, dirección, teléfono) en todas partes, preguntas frecuentes en tu web y menciones en medios o blogs locales.") },
  { svc: "google-maps", area: t("Coherencia"), q: t("¿Tu nombre, dirección, teléfono y horario son iguales en todas partes?"), hint: t("Web, Google, redes, directorios, TripAdvisor, Páginas Amarillas…"),
    opts: [[t("Sí, lo he revisado"), 2], [t("Creo que sí"), 1], [t("Seguro que hay diferencias"), 0]],
    tip: t("<strong>Unifica tus datos</strong> en todas las plataformas. Las incoherencias hacen que Google y la IA desconfíen de tu información.") },
  { svc: "fotografia", area: t("Imagen"), q: t("¿Tienes fotos profesionales de tu local, equipo y productos?"), hint: t("Las fotos reales generan más clics y visitas que las de stock."),
    opts: [[t("Sí"), 2], [t("Algunas hechas con el móvil"), 1], [t("No / uso fotos de internet"), 0]],
    tip: t("<strong>Invierte en una sesión de fotos real</strong>: fachada, interior, equipo y tus 5 productos o servicios estrella. Súbelas a Maps, web y redes.") },
  { svc: "redes-sociales", area: t("Constancia"), q: t("¿Publicas novedades en Google o redes al menos una vez por semana?"), hint: t("La actividad reciente es una señal de negocio vivo."),
    opts: [[t("Sí"), 2], [t("De vez en cuando"), 1], [t("Casi nunca"), 0]],
    tip: t("<strong>Programa una publicación semanal</strong> en tu ficha de Google (ofertas, novedades, eventos). 15 minutos que marcan la diferencia.") },
];

// Platos de la carta para cada área débil del test; sin plato (IA, redes) = «Pregúntanos»
const ALT_LINK = { "diseno-web": "web-una-pagina", "fotografia": "fotografia" };
const SERVICE_NAMES = {
  "google-maps": t("Google Maps y reseñas"), "diseno-web": t("Diseño web"), "ia": t("Visibilidad en IA"),
  "fotografia": t("Fotografía local"), "redes-sociales": t("Redes sociales"),
};
// El test recomienda uno de los 3 menús del día
const PACKS = {
  cuidados: { slug: "cuidados-esenciales", name: t("Menú 1 · Cuidados esenciales") },
  escaparate: { slug: "escaparate-nuevo", name: t("Menú 2 · Escaparate nuevo") },
  distancia: { slug: "cuidados-esenciales-distancia", name: t("Menú 3 · A distancia") },
};

/* Elige el menú según qué ha fallado (g(servicio) = puntos perdidos; hasWeb = ya tiene alguna web) */
function recommend(g, score, hasWeb) {
  if (!hasWeb || g("diseno-web") >= 2) {
    return { pack: PACKS.escaparate, why: t("Tu web es el punto flojo (o no la tienes). El Escaparate nuevo junta tu ficha de Google a punto, la sesión de fotos y una web de una página con tu botón de reservar.") };
  }
  if (score >= 75) {
    return { pack: PACKS.cuidados, why: t("Tienes buena base. Con Cuidados esenciales dejamos tu ficha niquelada y, si quieres, luego seguimos en la sobremesa.") };
  }
  return { pack: PACKS.cuidados, why: t("Tu web aguanta, pero tu ficha de Google, tus fotos o tus reseñas no te están ayudando. Cuidados esenciales ataca justo eso.") };
}
const DISTANCIA_NOTA = t("¿Estás fuera de Barcelona? Mira el Menú 3 · A distancia: lo mismo, sin sesión de fotos.");

const quiz = document.querySelector("[data-quiz]");
let quizSummary = "";

if (quiz) {
  const $ = (sel) => quiz.querySelector(sel);
  const qWrap = $("[data-quiz-questions]");
  const resultWrap = $("[data-quiz-result]");
  const gate = $("[data-quiz-gate]");
  const gateForm = $("[data-quiz-gate-form]");
  const gateStatus = $("[data-gate-status]");
  const gateText = gate.querySelector(".quiz__gate-text");
  const gateIntro = gateText.textContent;
  let started = false;   // el evento «test iniciado» se anota una vez por intento
  let report = null;     // datos del resultado para enviar junto al contacto
  const answers = [];
  let current = 0;

  const render = () => {
    const item = QUESTIONS[current];
    $("[data-quiz-bar]").style.width = `${(current / QUESTIONS.length) * 100}%`;
    $("[data-quiz-count]").textContent = t("Pregunta {n} de {total}", { n: current + 1, total: QUESTIONS.length });
    $("[data-quiz-area]").textContent = item.area;
    $("[data-quiz-q]").textContent = item.q;
    $("[data-quiz-hint]").textContent = item.hint;
    $("[data-quiz-back]").hidden = current === 0;
    const opts = $("[data-quiz-options]");
    opts.innerHTML = "";
    item.opts.forEach(([label, pts], idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quiz__opt";
      b.innerHTML = `<kbd>${"ABC"[idx]}</kbd><span></span>`;
      b.querySelector("span").textContent = label;
      b.addEventListener("click", () => answer(pts, label));
      opts.appendChild(b);
    });
  };

  const answer = (pts, label) => {
    if (!started) { started = true; track("test-iniciado"); }
    answers[current] = { pts, label };
    if (current < QUESTIONS.length - 1) {
      current++;
      render();
      quiz.querySelector(".quiz__opt")?.focus({ preventScroll: true });
    } else {
      showResult();
    }
  };

  const showResult = () => {
    track("test-terminado");
    const total = answers.reduce((s, a) => s + a.pts, 0);
    const score = Math.round((total / (QUESTIONS.length * 2)) * 100);
    let title, text, color;
    if (score < 40) {
      title = t("Eres casi invisible");
      text = t("Tus clientes potenciales no te están encontrando. La buena noticia: hay mucho margen y los primeros cambios se notan rápido.");
      color = "var(--rojo)";
    } else if (score < 75) {
      title = t("Vas por buen camino");
      text = t("Tienes una base, pero hay huecos que están regalando clientes a tu competencia. Con unos ajustes puedes dar el salto.");
      color = "var(--rojo-2)";
    } else {
      title = t("¡Eres bastante visible!");
      text = t("Lo estás haciendo bien. El siguiente paso es mantenerte arriba y asegurarte de que la IA te recomienda a ti.");
      color = "var(--mostaza)";
    }

    // Puntos perdidos por servicio (0 = perfecto)
    const gap = {};
    QUESTIONS.forEach((q, i) => { gap[q.svc] = (gap[q.svc] || 0) + (2 - answers[i].pts); });
    const g = (k) => gap[k] || 0;
    const reco = recommend(g, score, answers[2].pts > 0);

    const ring = $("[data-score-ring]");
    ring.style.setProperty("--ring", color);
    $("[data-score-title]").textContent = `${score}/100 · ${title}`;
    $("[data-score-text]").textContent = text;
    $("[data-reco-name]").textContent = reco.pack.name;
    $("[data-reco-why]").textContent = reco.pack.slug === "escaparate-nuevo" ? reco.why : `${reco.why} ${DISTANCIA_NOTA}`;
    const recoLink = $("[data-reco-link]");
    if (recoLink) recoLink.href = `#menu-${reco.pack.slug}`;

    // Servicios a la carta: los que más puntos han perdido (máx. 3)
    const alt = Object.entries(gap).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const altList = $("[data-reco-alt]");
    altList.innerHTML = "";
    alt.forEach(([k]) => {
      const a = document.createElement("a");
      a.className = "quiz__alt-item";
      a.href = ALT_LINK[k] ? "#carta" : "#contacto";
      if (!ALT_LINK[k]) a.dataset.interes = "otra"; // rebranding, redes, SEO o IA: «Pregúntanos»
      a.textContent = SERVICE_NAMES[k];
      altList.appendChild(a);
    });
    $("[data-reco-alt-wrap]").hidden = alt.length === 0;

    const tips = $("[data-quiz-tips]");
    tips.innerHTML = "";
    const weak = QUESTIONS
      .map((q, i) => ({ q, pts: answers[i].pts }))
      .sort((a, b) => a.pts - b.pts)
      .filter((x) => x.pts < 2)
      .slice(0, 3);
    (weak.length ? weak : [{ q: { tip: t("<strong>Revisa cada mes qué dicen las IA de ti</strong> y mantén tu ficha activa con novedades y fotos nuevas.") } }])
      .forEach(({ q }) => {
        const li = document.createElement("li");
        li.innerHTML = q.tip;
        tips.appendChild(li);
      });

    // Animación del número
    const scoreEl = $("[data-score]");
    if (reduceMotion) {
      scoreEl.textContent = score; ring.style.setProperty("--p", score);
    } else {
      let n = 0;
      const step = () => {
        n = Math.min(score, n + 2);
        scoreEl.textContent = n; ring.style.setProperty("--p", n);
        if (n < score) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    quizSummary = t("Resultado del test de visibilidad: {score}/100 ({title}). Recomendación: {pack}.", { score, title, pack: reco.pack.name });

    report = {
      score, title, pack: reco.pack.name,
      weak: weak.map((x) => x.q.area).join(", "),
      answers: QUESTIONS.map((q, i) => [q.q, answers[i].label]),
    };
    qWrap.hidden = true;
    gateForm.hidden = false;
    gateForm.reset();
    gateStatus.textContent = "";
    gateText.textContent = gateIntro;
    resultWrap.classList.add("is-visible");
    resultWrap.setAttribute("tabindex", "-1");
    resultWrap.focus({ preventScroll: true });
  };

  // Envía el email + el resultado al mismo receptor que el formulario de contacto (Google Apps Script)
  const sendLead = async (data) => {
    const servicio = report.pack;
    const sections = [
      { titulo: "Resultado del test", filas: [["Nota", `${report.score}/100 (${report.title})`], ["Menú recomendado", servicio], ["Áreas más flojas", report.weak || "—"]] },
      { titulo: "Respuestas del test", filas: report.answers },
    ];
    const subject = `[Test] ${data.negocio || data.contacto} · ${report.score}/100${LANG !== "es" ? ` [${LANG.toUpperCase()}]` : ""}`;
    if (SITE.formEndpoint.includes("script.google.com")) {
      const payload = new URLSearchParams({
        formulario: "Test visibilidad", asunto: subject, servicios: servicio, nombre: "", negocio: data.negocio, email: data.email,
        telefono: data.telefono, whatsapp: "", ficha: "", sector: "", ciudad: "", pagina: location.href, secciones: JSON.stringify(sections),
      });
      await fetch(SITE.formEndpoint, { method: "POST", mode: "no-cors", body: payload });
    } else {
      const body = new FormData();
      body.set("contacto", data.contacto); body.set("negocio", data.negocio); body.set("_subject", subject);
      body.set("resumen", sections.map((s) => `${s.titulo.toUpperCase()}\n${s.filas.map(([k, v]) => `${k}: ${v}`).join("\n")}`).join("\n\n"));
      const res = await fetch(SITE.formEndpoint, { method: "POST", body, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(res.statusText);
    }
  };

  const gateError = (el, msg) => {
    el.focus();
    gateStatus.textContent = msg;
    gateStatus.className = "form__status is-error";
  };

  gateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (gateForm.web_hp.value) return; // bot
    const contacto = gateForm.contacto.value.trim();
    const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto);
    const esTelefono = /^[+\d][\d\s.-]{7,}$/.test(contacto);
    if (!esEmail && !esTelefono) return gateError(gateForm.contacto, t("Escribe un WhatsApp o un email válido para poder escribirte."));
    if (!gateForm.privacidad.checked) return gateError(gateForm.privacidad, t("Necesitamos que aceptes la política de privacidad."));
    const btn = gateForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      await sendLead({
        contacto, negocio: gateForm.negocio.value.trim(),
        email: esEmail ? contacto : "", telefono: esEmail ? "" : contacto,
      });
      track("form-test-de-visibilidad-enviado");
      if (esEmail) document.querySelectorAll('[data-contact-form] [name="email"]').forEach((el) => { if (!el.value) el.value = contacto; });
      gateText.textContent = t("¡Recibido! Te escribo en 48 h laborables con tus 3 arreglos.");
      gateForm.hidden = true;
    } catch {
      gateError(gateForm.contacto, t("No hemos podido enviarlo. Escríbenos a {email} y te respondemos enseguida.", { email: SITE.email }));
    }
    btn.disabled = false;
  });

  $("[data-quiz-back]").addEventListener("click", () => { if (current > 0) { current--; render(); } });
  $("[data-quiz-restart]").addEventListener("click", () => {
    answers.length = 0; current = 0; quizSummary = ""; started = false;
    resultWrap.classList.remove("is-visible");
    qWrap.hidden = false;
    render();
  });
  render();
}

/* ------------------------------------------------------------------
   Botones "Lo quiero" → preseleccionan el pack en el formulario
   ------------------------------------------------------------------ */
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-pack]");
  if (!link) return;
  const pack = link.dataset.pack;
  document.querySelectorAll('input[name="interes"]').forEach((cb) => {
    if (cb.value === pack) cb.checked = true;
  });
  const msg = document.getElementById("f-msg");
  if (msg && quizSummary && !msg.value.includes(t("test de visibilidad"))) {
    msg.value = (msg.value ? msg.value + "\n\n" : "") + quizSummary;
  }
});

/* ------------------------------------------------------------------
   Formulario de contacto
   ------------------------------------------------------------------ */
document.querySelectorAll("[data-whatsapp]").forEach((item) => {
  if (!SITE.whatsapp) return;
  item.hidden = false;
  const waLink = item.matches("a") ? item : item.querySelector("[data-whatsapp-link]");
  waLink.href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t("¡Hola, Agencia Singular! Me gustaría pedir el diagnóstico gratis para mi negocio."))}`;
  waLink.dataset.track = "whatsapp";
});

/* ------------------------------------------------------------------
   Mi propuesta (cesta): packs y servicios elegidos, guardados en este navegador.
   Se pueden combinar productos de distintos pasos y servicios a la carta, pero no dos del mismo paso.
   ------------------------------------------------------------------ */
const CART_KEY = "mi-propuesta";
// Pasos: de cada paso solo se elige un producto (Cuidados esenciales o a distancia, una web, un plan mensual)
const STEP_OF = {
  "cuidados-esenciales": 1, "escaparate-nuevo": 1, "cuidados-esenciales-distancia": 1,
  "web-una-pagina": 2, "web-completa": 2,
  "plan-basico": 3, "plan-siempre-visible": 3,
};
// Platos de la carta que existen (lo guardado de servicios retirados se ignora)
const SERVICE_SLUGS = ["fotografia", "trastienda"];
// Enlaces y propuestas guardadas con los nombres antiguos
const LEGACY_SLUGS = { "pack-encuentren": "cuidados-esenciales", "pack-escaparate-remoto": "cuidados-esenciales-distancia", "pack-visible": "plan-siempre-visible" };
const stepOf = (slug) => STEP_OF[slug] || 0;
const knownSlug = (slug) => slug in STEP_OF || SERVICE_SLUGS.includes(slug);
const pop = (el) => { el.classList.remove("is-popping"); void el.offsetWidth; el.classList.add("is-popping"); };
document.addEventListener("animationend", (e) => {
  if (e.animationName === "add-pop") e.target.classList?.remove("is-popping");
});

const cart = {
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(v) ? [...new Set(v.map((x) => LEGACY_SLUGS[x] || x))].filter((x) => typeof x === "string" && knownSlug(x)) : [];
    } catch { return []; }
  },
  set(list) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(list)); } catch { /* sin almacenamiento */ }
    renderCartPill();
  },
  add(slug) {
    const step = stepOf(slug);
    this.set([...this.get().filter((s) => s !== slug && !(step && stepOf(s) === step)), slug]);
  },
  remove(slug) { this.set(this.get().filter((s) => s !== slug)); },
};

// Cesta del menú: siempre visible; se despliega para ver (y quitar) lo elegido
const CART_NAMES = {
  "cuidados-esenciales": "Menú 1 · Cuidados esenciales", "escaparate-nuevo": "Menú 2 · Escaparate nuevo", "cuidados-esenciales-distancia": "Menú 3 · A distancia",
  "web-una-pagina": "Web de una página", "web-completa": "Web completa",
  "plan-basico": "Plan Básico", "plan-siempre-visible": "Plan Siempre visible",
  fotografia: "Fotografía Local", trastienda: "La Trastienda",
};
const CART_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><g transform="translate(2 2)"><path d="M9 17h30l-2.5 26h-25z" style="fill:var(--mostaza);stroke:none"/></g><g fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17h30l-2.5 26h-25z"/><path d="M17 17v-3a7 7 0 0114 0v3"/></g></svg>';
const escHtml = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cartOpen = () => !document.getElementById("cart-panel")?.hidden;
function setCartOpen(open, focusPill) {
  const panel = document.getElementById("cart-panel");
  const pill = document.querySelector(".cart-pill");
  if (!panel || !pill) return;
  panel.hidden = !open;
  pill.setAttribute("aria-expanded", String(open));
  if (!open && focusPill) pill.focus();
}
function renderCartPill() {
  const actions = document.querySelector(".nav__actions");
  if (!actions) return;
  const list = cart.get(), n = list.length, editable = !document.getElementById("hire-form");
  let pill = actions.querySelector(".cart-pill");
  if (!pill) {
    pill = document.createElement("button");
    pill.type = "button";
    pill.className = "cart-pill";
    pill.innerHTML = CART_ICON + '<span class="cart-pill__count" hidden></span>';
    actions.prepend(pill);
  }
  pill.setAttribute("aria-haspopup", "true");
  pill.setAttribute("aria-controls", "cart-panel");
  if (!pill.hasAttribute("aria-expanded")) pill.setAttribute("aria-expanded", "false");
  pill.title = t("Mi propuesta");
  const count = pill.querySelector(".cart-pill__count");
  count.hidden = !n;
  count.textContent = n;
  pill.setAttribute("aria-label", n ? t(n === 1 ? "Mi propuesta: {n} servicio elegido" : "Mi propuesta: {n} servicios elegidos", { n }) : t("Mi propuesta: nada elegido todavía"));
  let panel = document.getElementById("cart-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "cart-panel";
    panel.className = "cart-panel";
    panel.hidden = true;
    panel.setAttribute("role", "region");
    (document.querySelector(".site-header") || document.body).appendChild(panel);
  }
  panel.setAttribute("aria-label", t("Mi propuesta"));
  // La cesta como cuenta de restaurante: líneas con precio, base, IVA y total
  let base = 0, mes = 0, desde = false;
  const items = list.map((slug) => {
    const name = escHtml(t(CART_NAMES[slug] || slug));
    const pr = PROD[slug] || {};
    let precio = "";
    if (typeof pr.precio === "number") {
      if (pr.mensual) { mes += pr.precio; precio = `${fmtEur(pr.precio)}${escHtml(t("/mes"))}`; }
      else { base += pr.precio; if (pr.desde) desde = true; precio = (pr.desde ? `<small>${escHtml(t("desde"))}</small> ` : "") + fmtEur(pr.precio); }
    }
    const rm = editable ? `<button type="button" class="cart-panel__remove" data-cart-remove="${slug}" aria-label="${escHtml(t("Quitar"))}: ${name}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>` : "";
    return `<li><span class="cart-panel__qty">1</span><span class="cart-panel__name">${name}</span><span class="cart-panel__dots" aria-hidden="true"></span><span class="cart-panel__price">${precio}</span>${rm}</li>`;
  }).join("");
  const d = new Date(), pad = (x) => String(x).padStart(2, "0");
  const fecha = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const iva = PRECIOS.iva ?? 21;
  const fila = (k, v, cls = "") => `<p class="cart-panel__row ${cls}"><span>${k}</span><span>${v}</span></p>`;
  const pre = desde ? `<small>${escHtml(t("desde"))}</small> ` : "";
  const totales = (base ? fila(escHtml(t("Base")), pre + fmtEur(base)) + fila(escHtml(t("IVA {n} %", { n: iva })), pre + fmtEur(conIva(base) - base)) + fila(escHtml(t("Total")), pre + fmtEur(conIva(base)), "cart-panel__row--total") : "")
    + (mes ? fila(escHtml(t("Cada mes")), `${fmtEur(conIva(mes))} ${escHtml(t("IVA incl."))}`, "cart-panel__row--mes") : "");
  panel.innerHTML = `<div class="cart-panel__head"><div class="cart-panel__casa"><strong>Agencia Singular</strong><span>${escHtml(t("Cuenta · Mesa del barrio"))}</span><span>${fecha}</span></div><button type="button" class="cart-panel__close" aria-label="${escHtml(t("Cerrar"))}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>` +
    (n ? `<ul class="cart-panel__list">${items}</ul><div class="cart-panel__totales">${totales}</div><a class="btn btn--yellow btn--block cart-panel__cta" href="contratar.html" data-track="cesta-pedir-propuesta">${escHtml(t(editable ? "Pedir propuesta" : "Ver mi propuesta"))}</a><p class="cart-panel__gracias">${escHtml(t("¡Gracias por su visita!"))}</p>`
       : `<p class="cart-panel__empty">${escHtml(t("Aún no has elegido nada. Pulsa «Añadir a mi propuesta» en un pack o un servicio y aparecerá aquí."))}</p>`);
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".cart-pill")) { setCartOpen(!cartOpen()); return; }
  const rm = e.target.closest("[data-cart-remove]");
  if (rm) { cart.remove(rm.dataset.cartRemove); syncAddButtons(); return; }
  if (e.target.closest(".cart-panel__close")) { setCartOpen(false, true); return; }
  if (cartOpen() && !e.target.closest("#cart-panel")) setCartOpen(false);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && cartOpen()) setCartOpen(false, true); });

// Botones "Añadir" de la portada
const syncAddButtons = () => {
  const list = cart.get();
  document.querySelectorAll("[data-add-check]").forEach((cb) => { cb.checked = list.includes(cb.dataset.addCheck); });
  document.querySelectorAll("[data-add]").forEach((b) => {
    const on = list.includes(b.dataset.add);
    const isPackBtn = b.classList.contains("add-btn--pack");
    b.setAttribute("aria-pressed", String(on));
    b.querySelector("use")?.setAttribute("href", on ? "#i-check" : "#i-plus");
    const label = b.querySelector("[data-add-label]");
    if (label) label.textContent = t(on ? (isPackBtn ? "En tu propuesta" : "Añadido") : (isPackBtn ? "Añadir a mi propuesta" : "Añadir"));
  });
};
document.querySelectorAll("[data-add]").forEach((b) => {
  b.addEventListener("click", () => {
    const slug = b.dataset.add;
    if (cart.get().includes(slug)) cart.remove(slug); else cart.add(slug);
    syncAddButtons();
    pop(b);
  });
});
document.querySelectorAll("[data-add-check]").forEach((cb) => {
  cb.addEventListener("change", () => {
    const slug = cb.dataset.addCheck;
    if (cb.checked) cart.add(slug); else cart.remove(slug);
    syncAddButtons();
  });
});
syncAddButtons();
renderCartPill();
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) { syncAddButtons(); renderCartPill(); }
});

/* Opción de «¿Qué te interesa?» que se marca al llegar desde un botón: data-interes="diagnostico" | "otra" (Pregúntanos)
   (también con ?interes=diagnostico en la dirección o #contacto?interes=diagnostico) */
const preselectInteres = (key) => {
  document.querySelectorAll(`input[name="interes"][data-interes="${key}"]`).forEach((cb) => {
    if (cb.checked) return;
    cb.checked = true;
    cb.dispatchEvent(new Event("change", { bubbles: true }));
  });
};
const applyInteresFromUrl = () => {
  const m = /[?&]interes=(\w+)/.exec(location.search + location.hash);
  if (!m) return;
  preselectInteres(m[1]);
  const target = document.getElementById("contacto");
  if (target && location.hash.startsWith("#contacto") && location.hash !== "#contacto") target.scrollIntoView({ behavior: "instant", block: "start" });
};
applyInteresFromUrl();
window.addEventListener("hashchange", applyInteresFromUrl);

/* Botones de diagnóstico: saltan directamente al formulario, sin el desplazamiento largo */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href="#contacto"], a[href="./#contacto"]');
  const target = document.getElementById("contacto");
  if (!a || !target || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  if (a.dataset.interes) preselectInteres(a.dataset.interes);
  target.scrollIntoView({ behavior: "instant", block: "start" });
  history.pushState(null, "", "#contacto");
});

/* Selector de idioma */
document.querySelectorAll("[data-lang-switch]").forEach((box) => {
  const btn = box.querySelector("button");
  const menu = box.querySelector("ul");
  const set = (open) => { menu.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", () => set(menu.hidden));
  document.addEventListener("click", (e) => { if (!box.contains(e.target)) set(false); });
  box.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); btn.focus(); } });
});

/* Enlaces antiguos a ventanas de detalle (#detalle-…) o a la sección de servicios: al menú de la casa */
if (/^#(detalle-|servicios$|cuidados-esenciales|web-|plan-)/.test(location.hash)) location.hash = "#packs";

/* Página de contratación: packs y servicios elegidos, sus preguntas y el resumen */
const hireForm = document.getElementById("hire-form");
if (hireForm) {
  const picker = hireForm.querySelector(".chips--services");
  const inputs = [...picker.querySelectorAll("input[data-slug]")];
  const bySlug = (slug) => inputs.find((i) => i.dataset.slug === slug);
  const title = document.querySelector("[data-hire-title]");
  const kicker = document.querySelector("[data-hire-kicker]");
  const cartBox = document.querySelector("[data-cart]");
  const cartList = cartBox.querySelector("[data-cart-list]");
  const tipBox = cartBox.querySelector("[data-cart-tip]");
  const toggles = [...picker.querySelectorAll("[data-group-toggle]")];
  let lastTouched = null;

  const selected = () => inputs.filter((i) => i.checked).map((i) => i.dataset.slug);

  // Ajusta el tamaño del nombre para que quepa en una línea sin cambiar la altura del título
  const fitTitle = () => {
    const box = title.parentElement;
    title.style.fontSize = "";
    if (title.scrollWidth > box.clientWidth) {
      title.style.fontSize = `${Math.floor((box.clientWidth / title.scrollWidth) * 100)}%`;
    }
  };

  // Grupos plegables: plegado solo se ve lo elegido de ese grupo
  const isFolded = (group) => toggles.find((t) => t.dataset.groupToggle === group)?.getAttribute("aria-expanded") === "false";
  const applyFold = () => {
    picker.querySelectorAll(".chip[data-group]").forEach((chip) => {
      const hide = isFolded(chip.dataset.group) && !chip.querySelector("input").checked;
      if (chip.hidden !== hide) {
        chip.hidden = hide;
        chip.classList.toggle("is-unfolding", !hide);
      }
    });
  };
  const fold = (group, folded) => {
    toggles.find((t) => t.dataset.groupToggle === group)?.setAttribute("aria-expanded", String(!folded));
  };
  toggles.forEach((t) => t.addEventListener("click", () => {
    fold(t.dataset.groupToggle, !isFolded(t.dataset.groupToggle));
    applyFold();
  }));

  // Precio de cada plato apuntado (de PRECIOS): fundador mientras queden plazas; la web, como suplemento si va con el Menú 3
  const priceOf = (slug, slugs) => {
    const p = PROD[slug];
    if (!p) return null;
    if (slug === "web-una-pagina") {
      const dist = slugs.map((x) => PROD[x]).find((x) => x?.suplementoWeb);
      if (dist) return { base: dist.suplementoWeb, mensual: false };
    }
    if (p.desde) return { base: p.precio, desde: true };
    if (p.tipo === "menu" && !founderOn && p.sinFundador) return { base: p.sinFundador };
    return { base: p.precio, mensual: !!p.mensual };
  };
  const priceText = (pr) => !pr ? t("Precio a medida en tu propuesta")
    : pr.desde ? t("desde {p} + IVA", { p: fmtEur(pr.base) })
    : `${fmtEur(pr.base)}${pr.mensual ? t("/mes") : ""} + ${t("IVA")}`;
  const cartItem = (input, slugs) => {
    const li = document.createElement("li");
    li.className = "menu__plato";
    li.innerHTML = '<span class="menu__linea"><span class="menu__nombre"></span><span class="menu__puntos" aria-hidden="true"></span><span class="menu__precio"></span><button type="button" class="cart__remove">×</button></span>';
    li.querySelector(".menu__nombre").textContent = input.value;
    li.querySelector(".menu__precio").textContent = priceText(priceOf(input.dataset.slug, slugs));
    const remove = li.querySelector(".cart__remove");
    remove.setAttribute("aria-label", t("Quitar {name}", { name: input.value }));
    remove.addEventListener("click", () => { input.checked = false; update(); });
    return li;
  };
  // Totales: lo puntual (+ IVA y con IVA) y, aparte, lo mensual y lo que va con presupuesto
  const renderTotals = (slugs) => {
    const box = cartBox.querySelector("[data-cart-total]");
    let once = 0, monthly = 0; const quote = [];
    slugs.forEach((sl) => {
      const pr = priceOf(sl, slugs);
      if (!pr) return;
      if (pr.desde) quote.push(bySlug(sl).value);
      else if (pr.mensual) monthly += pr.base;
      else once += pr.base;
    });
    box.hidden = !slugs.length;
    box.querySelector("[data-total-base]").textContent = `${fmtEur(once)} + ${t("IVA")}`;
    box.querySelector("[data-total-iva]").textContent = fmtEur(conIva(once));
    const notes = [];
    if (monthly) notes.push(t("Y cada mes: {p} + IVA ({t} IVA incl.).", { p: fmtEur(monthly), t: fmtEur(conIva(monthly)) }));
    if (quote.length) notes.push(t("{names}: con presupuesto a medida.", { names: quote.join(", ") }));
    const nota = box.querySelector("[data-total-nota]");
    nota.textContent = notes.join(" ");
    nota.hidden = !notes.length;
  };
  // Si lo apuntado suelto ya forma un menú más barato, lo sugerimos (con un enlace que cambia la comanda)
  const renderTip = (slugs) => {
    const menu = Object.entries(PROD).find(([k, p]) => p.tipo === "menu" && p.incluye?.length && !slugs.includes(k) &&
      p.incluye.every((x) => slugs.includes(x)));
    if (!menu) { tipBox.hidden = true; return; }
    const [slug, p] = menu;
    const suelto = p.incluye.reduce((acc, x) => acc + (priceOf(x, slugs)?.base || 0), 0);
    const enMenu = priceOf(slug, slugs).base;
    if (suelto <= enMenu) { tipBox.hidden = true; return; }
    tipBox.innerHTML = "";
    const txt = document.createElement("p");
    txt.textContent = t("Si te apuntas ficha + web, el menú Escaparate nuevo te sale más a cuenta");
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "link-btn"; btn.dataset.track = "comanda-cambiar-menu";
    btn.textContent = t("Cambiar mi comanda por el menú");
    btn.addEventListener("click", () => {
      p.incluye.forEach((x) => { const i = bySlug(x); if (i) i.checked = false; });
      bySlug(slug).checked = true; lastTouched = slug; update();
    });
    tipBox.append(txt, btn);
    tipBox.hidden = false;
  };

  const update = () => {
    const slugs = selected();

    // Preguntas de cada elegido, sin repetir las que ya se han hecho
    const seen = new Set();
    hireForm.querySelectorAll("[data-fields]").forEach((fs) => {
      const on = slugs.includes(fs.dataset.fields);
      let visible = 0;
      fs.querySelectorAll(":scope > .field").forEach((field) => {
        const names = [...new Set([...field.querySelectorAll("[name]")].map((el) => el.name))];
        const dup = on && names.some((n) => seen.has(n));
        field.hidden = dup;
        field.querySelectorAll("[name]").forEach((el) => { el.disabled = dup; });
        if (on && !dup) { names.forEach((n) => seen.add(n)); visible++; }
      });
      fs.hidden = !on || !visible;
      fs.disabled = fs.hidden; // los campos ocultos no se envían
    });

    // Información del último elegido (o "¿Cómo funciona?" si no hay nada)
    const infoSlug = slugs.includes(lastTouched) ? lastTouched : slugs[0] || "";
    document.querySelectorAll("[data-info]").forEach((card) => { card.hidden = card.dataset.info !== infoSlug; });

    // Resumen
    cartBox.hidden = !slugs.length;
    cartList.replaceChildren(...slugs.map((s) => cartItem(bySlug(s), slugs)));
    renderTotals(slugs);
    renderTip(slugs);

    // Título
    const names = slugs.map((s) => bySlug(s).dataset.short);
    if (!slugs.length) {
      kicker.textContent = t("Cuéntanos");
      title.textContent = t("Qué necesitas");
      document.title = t("Contratar un servicio · Agencia Singular");
    } else {
      kicker.textContent = t(slugs.length === 1 ? "Contratar" : "Tu propuesta");
      title.textContent = slugs.length === 1 ? bySlug(slugs[0]).value : slugs.length === 2 ? names.join(" + ") : t("{first} + {n} más", { first: names[0], n: slugs.length - 1 });
      document.title = t("Contratar {names} · Agencia Singular", { names: slugs.map((s) => bySlug(s).value).join(" + ") });
    }
    fitTitle();

    if (!slugs.length) toggles.forEach((t) => fold(t.dataset.groupToggle, false));
    applyFold();
    cart.set(slugs);
    history.replaceState(null, "", slugs.length ? `?servicio=${slugs.join(",")}` : location.pathname);
  };

  // Un pack elegido se puede quitar volviendo a pulsarlo
  inputs.filter((i) => i.type === "radio").forEach((r) => {
    let was = false;
    r.closest("label").addEventListener("pointerdown", () => { was = r.checked; });
    r.addEventListener("click", () => {
      if (was) { r.checked = false; lastTouched = null; update(); }
      was = false;
    });
  });
  // Al elegir un pack se pliegan los servicios a la carta, y al revés
  inputs.forEach((i) => i.addEventListener("change", () => {
    if (i.checked) {
      lastTouched = i.dataset.slug;
      const group = i.closest(".chip").dataset.group;
      // el grupo elegido se queda abierto y los demás se pliegan (siguen viéndose sus elegidos)
      toggles.forEach((t) => fold(t.dataset.groupToggle, t.dataset.groupToggle !== group));
    }
    update();
  }));
  window.addEventListener("resize", fitTitle);
  document.fonts?.ready.then(fitTitle);

  // Selección inicial: lo guardado en el navegador + lo que venga en el enlace
  const params = new URLSearchParams(location.search);
  const wanted = (params.get("servicio") || "").split(",").map((s) => LEGACY_SLUGS[s] || s).filter((s) => bySlug(s));
  let start = cart.get().filter((s) => bySlug(s));
  wanted.forEach((s) => {
    if (stepOf(s)) start = start.filter((x) => stepOf(x) !== stepOf(s));
    if (!start.includes(s)) start.push(s);
  });
  start.forEach((s) => { bySlug(s).checked = true; });
  lastTouched = wanted.at(-1) || start.at(-1) || null;
  if (lastTouched) {
    const group = bySlug(lastTouched).closest(".chip").dataset.group;
    toggles.forEach((t) => fold(t.dataset.groupToggle, t.dataset.groupToggle !== group));
  }
  const testScore = params.get("test");
  const msg = hireForm.querySelector('textarea[name="mensaje"]');
  if (testScore && /^\d{1,3}$/.test(testScore) && msg && !msg.value) {
    msg.value = t("Vengo del test de visibilidad: mi nota es {score}/100.", { score: testScore });
  }
  update();
  // Tras enviar la solicitud, la propuesta se vacía
  hireForm.addEventListener("reset", () => setTimeout(() => { lastTouched = null; update(); }));
}

/* Envío de cualquier formulario de contacto de la web */
const fieldLabel = (el) => {
  const legend = el.closest("fieldset.chips")?.querySelector("legend");
  if ((el.type === "checkbox" || el.type === "radio") && legend) return legend.textContent.trim();
  const label = el.id && document.querySelector(`label[for="${el.id}"]`);
  return label ? label.childNodes[0].textContent.trim() : el.name;
};

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector("[data-form-status]");
  const setStatus = (msg, ok) => {
    status.textContent = msg;
    status.className = `form__status ${ok ? "is-ok" : "is-error"}`;
  };
  // «Diagnóstico gratis de mi ficha»: pide la ciudad o barrio y se envía como formulario «Diagnóstico»
  const diagChip = form.querySelector('input[name="interes"][data-interes="diagnostico"]');
  const ciudadEl = form.querySelector('[name="ciudad"]');
  const syncDiag = () => { if (diagChip && ciudadEl) ciudadEl.required = diagChip.checked; };
  form.addEventListener("change", syncDiag);
  form.addEventListener("reset", () => setTimeout(syncDiag));
  syncDiag();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.web_hp.value) return; // bot

    const choice = form.querySelector("[data-need-choice]");
    if (choice && !choice.querySelector("input:checked")) {
      choice.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      setStatus(t("Apunta al menos un menú o un plato."), false);
      return;
    }
    const invalid = [...form.querySelectorAll("[required]")].find((el) => {
      if (el.disabled) return false;
      if (el.type === "radio") return !form.querySelector(`input[name="${el.name}"]:checked`);
      if (el.type === "checkbox") return !el.checked;
      return !el.value.trim() || (el.type === "email" && !el.checkValidity());
    });
    if (invalid) {
      invalid.focus();
      setStatus(
        t(invalid.type === "radio" ? "Elige el servicio que quieres contratar."
        : invalid.type === "checkbox" ? "Necesitamos que aceptes la política de privacidad."
        : invalid.name === "ciudad" ? "Indica tu ciudad o barrio para preparar el diagnóstico."
        : "Revisa los campos marcados: tu nombre, el de tu salón y cómo contactarte."), false);
      return;
    }
    // Formularios con WhatsApp: hace falta el email o el WhatsApp (al menos uno)
    const emailEl = form.querySelector('[name="email"]');
    const waEl = form.querySelector('[name="whatsapp"]');
    if (emailEl && waEl) {
      if (!emailEl.value.trim() && !waEl.value.trim()) {
        emailEl.focus();
        setStatus(t("Déjanos tu email o tu WhatsApp para poder contestarte."), false);
        return;
      }
      if (emailEl.value.trim() && !emailEl.checkValidity()) {
        emailEl.focus();
        setStatus(t("Revisa tu email: no parece válido."), false);
        return;
      }
    }

    // Respuestas agrupadas por sección (qué contrata, cada servicio, datos de contacto) y por pregunta
    const sections = new Map();
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      if (!el.name || el.disabled || ["web_hp", "privacidad"].includes(el.name)) return;
      if ((el.type === "checkbox" || el.type === "radio") && !el.checked) return;
      if (!el.value.trim()) return;
      const block = el.closest("[data-fields]");
      const title = block ? block.querySelector("legend").textContent.trim()
        : el.closest("[data-need-choice]") ? "Qué quiere contratar" : "Datos de contacto";
      if (!sections.has(title)) sections.set(title, new Map());
      const rows = sections.get(title);
      const key = fieldLabel(el);
      rows.set(key, [...(rows.get(key) || []), el.value.trim()]);
    });
    const report = [...sections].map(([titulo, rows]) => ({ titulo, filas: [...rows].map(([k, v]) => [k, v.join(", ")]) }));
    const body = report.map((s) => `${s.titulo.toUpperCase()}\n${s.filas.map(([k, v]) => `${k}: ${v}`).join("\n")}`).join("\n\n");

    const data = new FormData(form);
    const diag = !!diagChip?.checked || form.dataset.subject === "Diagnóstico";
    const formulario = diag ? "Diagnóstico" : (form.dataset.subject || "Contacto");
    const servicio = [...data.getAll("paso1"), ...data.getAll("paso2"), ...data.getAll("paso3"), ...data.getAll("servicio")].join(" + ");
    const subject = `${diag ? "Diagnóstico gratis" : form.dataset.subject || "Contacto"}${LANG !== "es" ? ` [${LANG.toUpperCase()}]` : ""}${servicio ? ` ${servicio}` : ""} · ${data.get("negocio")}`;

    if (!SITE.formEndpoint) {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus(t("Abriendo tu correo con el mensaje listo para enviar…"), true);
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      if (SITE.formEndpoint.includes("script.google.com")) {
        // Google Apps Script (scripts/formularios-google-apps-script.gs): guarda la solicitud en la hoja
        // y envía el informe en PDF. No devuelve cabeceras CORS, así que se envía sin leer la respuesta.
        const get = (n) => (data.get(n) || "").toString();
        // El vale pide «WhatsApp o email» en un solo campo: se reparte en la columna que toca
        const contacto = get("contacto").trim();
        const email = get("email") || (contacto.includes("@") ? contacto : "");
        const whatsapp = get("whatsapp") || (contacto && !contacto.includes("@") ? contacto : "");
        // En el informe no se repite lo que ya va en el resumen (servicios y datos de contacto)
        const summary = ["Qué quiere contratar"];
        const contactKeys = ["nombre", "negocio", "email", "contacto", "telefono", "whatsapp", "ficha", "sector", "ciudad", "interes"].map((n) => {
          const el = form.querySelector(`[name="${n}"]`);
          return el ? fieldLabel(el) : n;
        });
        const detail = report
          .filter((s) => !summary.includes(s.titulo))
          .map((s) => (s.titulo === "Datos de contacto"
            ? { titulo: "Más información", filas: s.filas.filter(([k]) => !contactKeys.includes(k)) } : s))
          .filter((s) => s.filas.length);
        const payload = new URLSearchParams({
          formulario, asunto: subject, servicios: servicio || data.getAll("interes").join(", "),
          nombre: get("nombre"), negocio: get("negocio"), email, telefono: get("telefono"), whatsapp, ficha: get("ficha"),
          sector: get("sector"), ciudad: get("ciudad"), pagina: location.href, secciones: JSON.stringify(detail),
        });
        await fetch(SITE.formEndpoint, { method: "POST", mode: "no-cors", body: payload });
      } else {
        data.delete("web_hp");
        data.set("_subject", subject);
        data.set("resumen", body);
        const res = await fetch(SITE.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.statusText);
      }
      form.reset();
      track(`form-${slugify(formulario)}-enviado`);
      setStatus(diag
        ? (SITE.whatsapp
          ? t("¡Recibido! En 48 h laborables te mando tu diagnóstico. Si prefieres WhatsApp, escríbeme al {phone}.", { phone: prettyPhone(SITE.whatsapp) })
          : t("¡Recibido! En 48 h laborables te mando tu diagnóstico."))
        : t("¡Recibido! Te respondemos en 48 h laborables."), true);
    } catch {
      setStatus(t("No hemos podido enviarlo. Escríbenos a {email} y te respondemos enseguida.", { email: SITE.email }), false);
    } finally {
      btn.disabled = false;
    }
  });
});

/* Año del pie */
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

/* Titulares y sellos que giran al entrar en pantalla, como el periódico que da vueltas en las películas */
(function () {
  var els = [].slice.call(document.querySelectorAll(".sx-motto, .sx-burst, .sx-burst--plain"));
  if (!els.length || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("sx-spin"); io.unobserve(e.target); } });
  }, { threshold: 0.35 });
  els.forEach(function (el) { el.classList.add("sx-pre"); io.observe(el); });
})();

/* Singular Extra: subrayado amarillo y entrada de los menús al hacer scroll */
(() => {
  const els = document.querySelectorAll(".sx-hl, .menu");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.35 });
  els.forEach((e) => io.observe(e));
})();

/* La carta se sirve al pedirla: el enlace «¿Solo te apetece un plato?» la despliega */
(() => {
  const carta = document.querySelector(".carta-y-sobremesa");
  const links = document.querySelectorAll('a[href="#carta"]');
  if (!carta || !links.length) return;
  carta.id = carta.id || "carta-servida";
  const set = (open) => {
    carta.hidden = !open;
    links.forEach((a) => { a.setAttribute("aria-expanded", String(open)); a.setAttribute("aria-controls", carta.id); });
  };
  const abrir = (scroll) => {
    if (carta.hidden) { set(true); carta.classList.remove("is-served"); void carta.offsetWidth; carta.classList.add("is-served"); carta.querySelectorAll(".menu").forEach((m) => m.classList.add("is-in")); }
    if (scroll) document.getElementById("carta")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };
  set(location.hash === "#carta");
  if (location.hash === "#carta") abrir(true);
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href="#carta"]');
    if (!a) return;
    e.preventDefault();
    if (!carta.hidden && a.closest(".menus-pie__puente")) { set(false); return; }
    abrir(true);
  });
})();
