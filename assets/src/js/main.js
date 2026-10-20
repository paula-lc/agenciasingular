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
  // Código de tu sitio en goatcounter.com (analítica sin cookies): "micodigo" → https://micodigo.goatcounter.com.
  // Vacío = no se carga nada.
  goatcounter: "agenciasingular",
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

/* Precio fundador: [data-founder] (precio fundador, insignia y condiciones) solo se ve si quedan plazas;
   [data-web-price] (precio web sin tachar) solo cuando se han acabado */
const founderLeft = Math.max(0, Math.min(5, Math.floor(Number(SITE.fundadorPlazas)) || 0));
const founderOn = founderLeft > 0;
document.querySelectorAll("[data-founder]").forEach((el) => { el.hidden = !founderOn; });
document.querySelectorAll("[data-web-price]").forEach((el) => { el.hidden = founderOn; });
document.querySelectorAll("[data-founder-left]").forEach((el) => { el.textContent = founderLeft; });

/* ------------------------------------------------------------------
   Analítica sin cookies (GoatCounter): solo se carga si SITE.goatcounter tiene valor.
   Los eventos se anotan con track("nombre"); si no hay analítica, no hacen nada.
   ------------------------------------------------------------------ */
if (SITE.goatcounter) {
  const gc = document.createElement("script");
  gc.async = true;
  gc.src = "https://gc.zgo.at/count.js";
  gc.dataset.goatcounter = `https://${SITE.goatcounter}.goatcounter.com/count`;
  document.head.appendChild(gc);
}
const track = (name, detail) => {
  // count.js se carga de forma asíncrona: si aún no está, se espera a que termine
  const send = () => {
    try { window.goatcounter?.count?.({ path: detail ? `${name}/${detail}` : name, title: detail ? `${name} · ${detail}` : name, event: true }); } catch { /* sin analítica */ }
  };
  if (!SITE.goatcounter) return;
  if (window.goatcounter?.count) send();
  else document.querySelector("script[data-goatcounter]")?.addEventListener("load", send, { once: true });
};
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
    let i = 0;
    typingEl.classList.add("typing");
    const tick = () => {
      i++;
      // No cortar dentro de una marca **…**
      let partial = raw.slice(0, i);
      const opens = (partial.match(/\*\*/g) || []).length;
      if (opens % 2 === 1) partial += "**";
      typingEl.innerHTML = toHtml(partial);
      if (i < raw.length) setTimeout(tick, raw[i] === " " ? 30 : 22);
      else typingEl.classList.remove("typing");
    };
    setTimeout(tick, 900);
  }
}

/* ------------------------------------------------------------------
   Pestañas de sectores (patrón ARIA tabs)
   ------------------------------------------------------------------ */
const tablist = document.querySelector('[role="tablist"]');
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

// Dónde lleva cada área débil del test; sin enlace (IA, redes) = formulario de contacto
const ALT_LINK = { "google-maps": "cuidados-esenciales", "diseno-web": "web-una-pagina", "fotografia": "fotografia" };
const SERVICE_NAMES = {
  "google-maps": t("Google Maps y reseñas"), "diseno-web": t("Diseño web"), "ia": t("Posicionamiento en IA"),
  "fotografia": t("Fotografía local"), "redes-sociales": t("Redes sociales"),
};
const PACKS = {
  cuidados: { slug: "cuidados-esenciales", name: t("Cuidados esenciales"), short: t("Cuidados esenciales") },
  web: { slug: "web-una-pagina", name: t("Web de una página"), short: t("Web de una página") },
  completa: { slug: "web-completa", name: t("Web completa"), short: t("Web completa") },
  basico: { slug: "plan-basico", name: t("Plan Básico"), short: t("Plan Básico") },
  visible: { slug: "plan-siempre-visible", name: t("Plan Siempre visible"), short: t("Siempre visible") },
};

/* Elige el producto según qué ha fallado (g(servicio) = puntos perdidos; hasWeb = ya tiene alguna web) */
function recommend(g, score, hasWeb) {
  if (g("diseno-web") >= 2 && score < 45) {
    return { pack: PACKS.cuidados, why: t("Partes casi de cero: empieza por lo que más se nota. Cuidados esenciales deja tu ficha de Google a punto, con botón de reserva, fotos y reseñas; la web va en el paso 2.") };
  }
  if (g("diseno-web") >= 2) {
    return hasWeb
      ? { pack: PACKS.completa, why: t("Tu web existe pero no está a la altura. La Web completa añade SEO local con una página por servicio clave y datos estructurados para buscadores e IA.") }
      : { pack: PACKS.web, why: t("Tu web es el punto débil, y es la fuente que leen Google y las IA. Una página clara, rápida y con botón de reserva es el primer paso.") };
  }
  if (score >= 75) {
    return { pack: PACKS.visible, why: t("Tienes buena base. El Plan Siempre visible mantendrá tu ficha y tu web cuidadas cada mes y vigilará qué dicen las IA de ti.") };
  }
  if (g("google-maps") + g("ia") >= 3) {
    return { pack: PACKS.cuidados, why: t("Tu web aguanta, pero Google Maps, las reseñas o la IA no te están ayudando. Cuidados esenciales ataca justo eso, rápido y por menos.") };
  }
  return { pack: g("redes-sociales") + g("fotografia") >= 2 ? PACKS.basico : PACKS.cuidados,
    why: t("Te falta constancia más que una gran reforma: pequeñas mejoras cada mes para seguir subiendo en Google, Maps y las IA.") };
}

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
      color = "var(--crimson)";
    } else if (score < 75) {
      title = t("Vas por buen camino");
      text = t("Tienes una base, pero hay huecos que están regalando clientes a tu competencia. Con unos ajustes puedes dar el salto.");
      color = "var(--orange)";
    } else {
      title = t("¡Eres bastante visible!");
      text = t("Lo estás haciendo bien. El siguiente paso es mantenerte arriba y asegurarte de que la IA te recomienda a ti.");
      color = "var(--mustard)";
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
    $("[data-reco-why]").textContent = reco.why;

    // Servicios a la carta: los que más puntos han perdido (máx. 3)
    const alt = Object.entries(gap).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const altList = $("[data-reco-alt]");
    altList.innerHTML = "";
    alt.forEach(([k]) => {
      const a = document.createElement("a");
      a.className = "quiz__alt-item";
      a.href = ALT_LINK[k] ? `contratar.html?servicio=${ALT_LINK[k]}&test=${score}` : "#contacto";
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
    const cta = $("[data-quiz-cta]");
    cta.href = `contratar.html?servicio=${reco.pack.slug}&test=${score}`;
    cta.innerHTML = `${t("Pedir propuesta")}<span class="cta-pack">: ${reco.pack.short}</span>`;

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
      { titulo: "Resultado del test", filas: [["Nota", `${report.score}/100 (${report.title})`], ["Pack recomendado", servicio], ["Áreas más flojas", report.weak || "—"]] },
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
      gateText.textContent = t("¡Recibido! Te escribo en menos de 24 h laborables con tus 3 arreglos. ☕");
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
  "cuidados-esenciales": 1, "cuidados-esenciales-distancia": 1,
  "web-una-pagina": 2, "web-completa": 2,
  "plan-basico": 3, "plan-siempre-visible": 3,
};
// Servicios a la carta que existen (lo guardado de servicios retirados se ignora)
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

// Contador en el menú (en contratar no hace falta: allí está el resumen)
function renderCartPill() {
  const actions = document.querySelector(".nav__actions");
  if (!actions || document.getElementById("hire-form")) return;
  const n = cart.get().length;
  let pill = actions.querySelector(".cart-pill");
  if (!n) { pill?.remove(); return; }
  const isNew = !pill;
  if (isNew) {
    pill = document.createElement("a");
    pill.className = "cart-pill";
    pill.href = "contratar.html";
    pill.title = t("Ver mi propuesta");
    pill.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg><span class="cart-pill__count"></span>';
    actions.prepend(pill);
  }
  const count = pill.querySelector(".cart-pill__count");
  if (count.textContent !== String(n)) {
    count.textContent = n;
    if (!isNew) pop(pill);
  }
  pill.setAttribute("aria-label", t(n === 1 ? "Mi propuesta: {n} servicio elegido" : "Mi propuesta: {n} servicios elegidos", { n }));
}

// Botones "Añadir" de la portada
const syncAddButtons = () => {
  const list = cart.get();
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
syncAddButtons();
renderCartPill();
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) { syncAddButtons(); renderCartPill(); }
});

/* Cajas de los pasos: el interruptor (Paso 1) o las pestañas (pasos 2 y 3) cambian la variante visible.
   Un enlace #<variante> abre la caja con esa variante a la vista. Cada cambio se anota para medir qué se mira. */
const variantBoxes = [...document.querySelectorAll("[data-variants]")];
const showVariant = (box, slug) => {
  box.querySelectorAll("[data-variant-tab]").forEach((tab) => {
    const on = tab.dataset.variantTab === slug;
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
  });
  box.querySelectorAll("[data-variant-switch]").forEach((sw) => { sw.checked = sw.dataset.variantSwitch === slug; });
  box.querySelectorAll("[data-variant]").forEach((panel) => { panel.hidden = panel.dataset.variant !== slug; });
};
variantBoxes.forEach((box) => {
  const tabs = [...box.querySelectorAll("[data-variant-tab]")];
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => { showVariant(box, tab.dataset.variantTab); track(`variante-${tab.dataset.variantTab}`); });
    tab.addEventListener("keydown", (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      showVariant(box, target.dataset.variantTab);
      target.focus();
    });
  });
  box.querySelectorAll("[data-variant-switch]").forEach((sw) => sw.addEventListener("change", () => {
    const slug = sw.checked ? sw.dataset.variantSwitch : sw.dataset.variantBase;
    showVariant(box, slug);
    track(`variante-${slug}`);
  }));
});
const openLinkedVariant = () => {
  const id = location.hash.slice(1);
  const panel = id && variantBoxes.length && document.querySelector(`[data-variant="${CSS.escape(id)}"]`);
  if (!panel) return;
  showVariant(panel.closest("[data-variants]"), id);
  panel.closest("[data-variants]").scrollIntoView({ block: "center" });
};
openLinkedVariant();
window.addEventListener("hashchange", openLinkedVariant);

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
  document.querySelectorAll("dialog[open]").forEach((d) => d.close()); // el botón de una ventana de detalle
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

/* Packs y servicios: ventana con el detalle (también se abre con #detalle-… en la URL) */
document.querySelectorAll("dialog.pmodal").forEach((dlg) => {
  const close = () => dlg.close();
  dlg.addEventListener("close", () => {
    if (location.hash === `#${dlg.id}`) history.replaceState(null, "", location.pathname + location.search);
  });
  dlg.querySelector("[data-pmodal-close]")?.addEventListener("click", close);
  // Clic fuera de la ventana (en el fondo oscuro) = cerrar
  dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
});
document.querySelectorAll("[data-pmodal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const dlg = document.getElementById(btn.dataset.pmodal);
    if (!dlg) return;
    dlg.showModal();
    dlg.querySelector(".pmodal__body").scrollTop = 0;
    history.replaceState(null, "", `#${dlg.id}`);
  });
});
const openLinkedPack = () => {
  const dlg = location.hash.startsWith("#detalle-") && document.getElementById(location.hash.slice(1));
  // Enlaces antiguos a ventanas que ya no existen (packs retirados, rebranding, web, SEO, IA, redes): a la sección de packs
  if (location.hash.startsWith("#detalle-") && !dlg) { location.hash = "#packs"; return; }
  if (dlg?.showModal && !dlg.open) dlg.showModal();
};
openLinkedPack();
window.addEventListener("hashchange", openLinkedPack);

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

  // Precio de cada elegido: el de fundador mientras queden plazas y el de cliente de Cuidados esenciales en la web de una página
  const priceOf = (input, slugs) => {
    const d = input.dataset;
    if (d.priceFounder && founderOn) return d.priceFounder;
    if (d.priceClient && slugs.some((s) => s.startsWith("cuidados-esenciales"))) return d.priceClient;
    return d.price;
  };
  const cartItem = (input, slugs) => {
    const li = document.createElement("li");
    li.className = "cart__item";
    li.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${input.dataset.icon}"/></svg><span class="cart__name"></span><button type="button" class="cart__remove">×</button>`;
    const name = li.querySelector(".cart__name");
    name.textContent = input.value;
    const small = document.createElement("small");
    small.textContent = priceOf(input, slugs) || t("Precio a medida en tu propuesta");
    name.append(small);
    const remove = li.querySelector(".cart__remove");
    remove.setAttribute("aria-label", t("Quitar {name}", { name: input.value }));
    remove.addEventListener("click", () => { input.checked = false; update(); });
    return li;
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
    tipBox.hidden = true;

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
      setStatus(t("Elige al menos un pack o un servicio."), false);
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
        : "Revisa los campos marcados: nombre, negocio y un email válido."), false);
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
    const diag = !!diagChip?.checked;
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
        // En el informe no se repite lo que ya va en el resumen (servicios y datos de contacto)
        const summary = ["Qué quiere contratar"];
        const contactKeys = ["nombre", "negocio", "email", "telefono", "whatsapp", "ficha", "sector", "ciudad", "interes"].map((n) => {
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
          nombre: get("nombre"), negocio: get("negocio"), email: get("email"), telefono: get("telefono"), whatsapp: get("whatsapp"), ficha: get("ficha"),
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
        : t("¡Recibido! Te escribimos en menos de 24 h laborables. ☕"), true);
    } catch {
      setStatus(t("No hemos podido enviarlo. Escríbenos a {email} y te respondemos enseguida.", { email: SITE.email }), false);
    } finally {
      btn.disabled = false;
    }
  });
});

/* Año del pie */
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
