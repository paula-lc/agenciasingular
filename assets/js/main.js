/* Agencia Singular — interacciones de la web */

/* ------------------------------------------------------------------
   CONFIGURACIÓN: rellena estos datos antes de publicar
   ------------------------------------------------------------------ */
const SITE = {
  email: "hola@agenciasingular.es",
  // Número con prefijo de país y sin espacios, p. ej. "34600111222". Vacío = se oculta.
  whatsapp: "",
  // Dirección que recibe los formularios: la URL de la aplicación web de Google Apps Script
  // (ver README → "Recibir los formularios por email") o de Formspree/Web3Forms.
  // Vacío = el formulario abre el correo del usuario con el mensaje ya escrito.
  formEndpoint: "https://script.google.com/macros/s/AKfycbyK_Dqwi7gZ_pNRRHdVpg8wU9NDWJo0u3jWUuWLwA2bBgMqSTlYpmZll9o6SfKQrvYo/exec",
};

document.documentElement.classList.remove("no-js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
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
  { svc: "google-maps", area: "Google Maps", q: "¿Tu negocio aparece en Google Maps con la ficha verificada?", hint: "Busca el nombre de tu negocio en Google Maps desde el móvil.",
    opts: [["Sí, y está completa", 2], ["Sí, pero a medias", 1], ["No / no lo sé", 0]],
    tip: "<strong>Reclama y completa tu Perfil de Empresa de Google</strong>: categoría principal exacta, horario, servicios y al menos 10 fotos reales." },
  { svc: "google-maps", area: "Reseñas", q: "¿Cuántas reseñas tienes en Google?", hint: "Las reseñas pesan en Maps y en lo que recomienda la IA.",
    opts: [["Más de 50", 2], ["Entre 10 y 50", 1], ["Menos de 10", 0]],
    tip: "<strong>Pide reseñas de forma sistemática</strong>: un QR en el mostrador y un mensaje tras cada visita. Y responde a todas, también a las malas." },
  { svc: "diseno-web", area: "Web", q: "¿Tienes web propia (no solo Instagram)?", hint: "Una web es la fuente oficial que leen Google y las IA.",
    opts: [["Sí, y es reciente", 2], ["Sí, pero antigua o lenta", 1], ["No tengo", 0]],
    tip: "<strong>Una web sencilla y rápida</strong> con tus servicios, precios orientativos, zona y contacto es la base de todo lo demás." },
  { svc: "diseno-web", area: "Web", q: "¿Tu web tiene una página para cada servicio importante?", hint: "Ej.: “manicura semipermanente”, “ramos de novia”, “cambio de neumáticos”.",
    opts: [["Sí", 2], ["Todo está en una sola página", 1], ["No tengo web", 0]],
    tip: "<strong>Crea una página por servicio clave</strong> que responda: qué es, precio, duración, para quién y dónde. Así Google y la IA saben por qué recomendarte." },
  { svc: "ia", area: "IA", q: "Si preguntas a ChatGPT o Gemini por tu servicio en tu zona, ¿te nombra?", hint: "Pruébalo: “¿qué [tu servicio] me recomiendas en [tu barrio]?”.",
    opts: [["Sí, aparezco", 2], ["Aparece mi competencia", 0], ["No lo he probado", 0]],
    tip: "<strong>Hazte visible para la IA</strong>: mismos datos (nombre, dirección, teléfono) en todas partes, preguntas frecuentes en tu web y menciones en medios o blogs locales." },
  { svc: "google-maps", area: "Coherencia", q: "¿Tu nombre, dirección, teléfono y horario son iguales en todas partes?", hint: "Web, Google, redes, directorios, TripAdvisor, Páginas Amarillas…",
    opts: [["Sí, lo he revisado", 2], ["Creo que sí", 1], ["Seguro que hay diferencias", 0]],
    tip: "<strong>Unifica tus datos</strong> en todas las plataformas. Las incoherencias hacen que Google y la IA desconfíen de tu información." },
  { svc: "fotografia", area: "Imagen", q: "¿Tienes fotos profesionales de tu local, equipo y productos?", hint: "Las fotos reales generan más clics y visitas que las de stock.",
    opts: [["Sí", 2], ["Algunas hechas con el móvil", 1], ["No / uso fotos de internet", 0]],
    tip: "<strong>Invierte en una sesión de fotos real</strong>: fachada, interior, equipo y tus 5 productos o servicios estrella. Súbelas a Maps, web y redes." },
  { svc: "redes-sociales", area: "Constancia", q: "¿Publicas novedades en Google o redes al menos una vez por semana?", hint: "La actividad reciente es una señal de negocio vivo.",
    opts: [["Sí", 2], ["De vez en cuando", 1], ["Casi nunca", 0]],
    tip: "<strong>Programa una publicación semanal</strong> en tu ficha de Google (ofertas, novedades, eventos). 15 minutos que marcan la diferencia." },
];

const SERVICE_NAMES = {
  "google-maps": "Google Maps y reseñas", "diseno-web": "Diseño web", "ia": "Posicionamiento en IA",
  "fotografia": "Fotografía local", "redes-sociales": "Redes sociales",
};
const PACKS = {
  encuentren: { slug: "pack-encuentren", name: "Pack Que te encuentren", short: "Que te encuentren" },
  escaparate: { slug: "pack-escaparate", name: "Pack Escaparate", short: "Escaparate" },
  visible: { slug: "pack-visible", name: "Plan Siempre visible", short: "Siempre visible" },
};

/* Elige el pack según qué ha fallado (g(servicio) = puntos perdidos) */
function recommend(g, score) {
  if (g("diseno-web") >= 2) {
    return { pack: PACKS.escaparate, why: g("fotografia") >= 1
      ? "Tu web no está a la altura y te faltan fotos reales: el Escaparate te da web nueva, sesión de fotos y Google Maps en un solo paso."
      : "Tu web es el punto débil, y es la fuente que leen Google y las IA. El Escaparate incluye web nueva, SEO local y Google Maps." };
  }
  if (score >= 75) {
    return { pack: PACKS.visible, why: "Tienes buena base. Con el plan mensual mantienes la ficha activa, las reseñas al día y vigilas qué dicen las IA de ti." };
  }
  if (g("google-maps") + g("ia") >= 3) {
    return { pack: PACKS.encuentren, why: "Tu web aguanta, pero Google Maps, las reseñas o la IA no te están ayudando. Este pack ataca justo eso, rápido y por menos." };
  }
  return { pack: g("redes-sociales") + g("fotografia") >= 2 ? PACKS.visible : PACKS.encuentren,
    why: "Te falta constancia más que una gran reforma: pequeñas mejoras cada mes para seguir subiendo en Google, Maps y las IA." };
}

const quiz = document.querySelector("[data-quiz]");
let quizSummary = "";

if (quiz) {
  const $ = (sel) => quiz.querySelector(sel);
  const qWrap = $("[data-quiz-questions]");
  const resultWrap = $("[data-quiz-result]");
  const answers = [];
  let current = 0;

  const render = () => {
    const item = QUESTIONS[current];
    $("[data-quiz-bar]").style.width = `${(current / QUESTIONS.length) * 100}%`;
    $("[data-quiz-count]").textContent = `Pregunta ${current + 1} de ${QUESTIONS.length}`;
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
    const total = answers.reduce((s, a) => s + a.pts, 0);
    const score = Math.round((total / (QUESTIONS.length * 2)) * 100);
    let title, text, color;
    if (score < 40) {
      title = "Eres casi invisible";
      text = "Tus clientes potenciales no te están encontrando. La buena noticia: hay mucho margen y los primeros cambios se notan rápido.";
      color = "var(--crimson)";
    } else if (score < 75) {
      title = "Vas por buen camino";
      text = "Tienes una base, pero hay huecos que están regalando clientes a tu competencia. Con unos ajustes puedes dar el salto.";
      color = "var(--orange)";
    } else {
      title = "¡Eres bastante visible!";
      text = "Lo estás haciendo bien. El siguiente paso es mantenerte arriba y asegurarte de que la IA te recomienda a ti.";
      color = "var(--mustard)";
    }

    // Puntos perdidos por servicio (0 = perfecto)
    const gap = {};
    QUESTIONS.forEach((q, i) => { gap[q.svc] = (gap[q.svc] || 0) + (2 - answers[i].pts); });
    const g = (k) => gap[k] || 0;
    const reco = recommend(g, score);

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
      a.href = `contratar.html?servicio=${k}&test=${score}`;
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
    (weak.length ? weak : [{ q: { tip: "<strong>Revisa cada mes qué dicen las IA de ti</strong> y mantén tu ficha activa con novedades y fotos nuevas." } }])
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

    quizSummary = `Resultado del test de visibilidad: ${score}/100 (${title}). Recomendación: ${reco.pack.name}.`;
    const cta = $("[data-quiz-cta]");
    cta.href = `contratar.html?servicio=${reco.pack.slug}&test=${score}`;
    cta.innerHTML = `Pedir propuesta<span class="cta-pack">: ${reco.pack.short}</span>`;

    qWrap.hidden = true;
    resultWrap.classList.add("is-visible");
    resultWrap.setAttribute("tabindex", "-1");
    resultWrap.focus({ preventScroll: true });
  };

  $("[data-quiz-back]").addEventListener("click", () => { if (current > 0) { current--; render(); } });
  $("[data-quiz-restart]").addEventListener("click", () => {
    answers.length = 0; current = 0; quizSummary = "";
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
  if (msg && quizSummary && !msg.value.includes("test de visibilidad")) {
    msg.value = (msg.value ? msg.value + "\n\n" : "") + quizSummary;
  }
});

/* ------------------------------------------------------------------
   Formulario de contacto
   ------------------------------------------------------------------ */
const waItem = document.querySelector("[data-whatsapp]");
if (SITE.whatsapp && waItem) {
  waItem.hidden = false;
  waItem.querySelector("[data-whatsapp-link]").href =
    `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("¡Hola, Agencia Singular! Me gustaría pedir el diagnóstico gratis para mi negocio.")}`;
}

/* ------------------------------------------------------------------
   Mi propuesta (cesta): packs y servicios elegidos, guardados en este navegador.
   Se puede combinar un pack con servicios a la carta, pero no dos packs.
   ------------------------------------------------------------------ */
const CART_KEY = "mi-propuesta";
// Servicios a la carta que ya van dentro de cada pack
const PACK_INCLUDES = {
  "pack-encuentren": ["google-maps"],
  "pack-escaparate": ["diseno-web", "seo-local", "fotografia", "google-maps"],
  "pack-singular": ["rebranding", "diseno-web", "seo-local", "fotografia", "google-maps", "trastienda"],
  "pack-visible": [],
};
// Servicios a la carta que existen (lo guardado de servicios retirados se ignora)
const SERVICE_SLUGS = ["rebranding", "diseno-web", "seo-local", "google-maps", "ia", "fotografia", "redes-sociales", "trastienda"];
const isPack = (slug) => slug.startsWith("pack-");
const knownSlug = (slug) => slug in PACK_INCLUDES || SERVICE_SLUGS.includes(slug);
const pop = (el) => { el.classList.remove("is-popping"); void el.offsetWidth; el.classList.add("is-popping"); };
document.addEventListener("animationend", (e) => {
  if (e.animationName === "add-pop") e.target.classList?.remove("is-popping");
});

const cart = {
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(v) ? v.filter((x) => typeof x === "string" && knownSlug(x)) : [];
    } catch { return []; }
  },
  set(list) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(list)); } catch { /* sin almacenamiento */ }
    renderCartPill();
  },
  add(slug) {
    let list = this.get().filter((s) => s !== slug);
    if (isPack(slug)) {
      const inc = PACK_INCLUDES[slug] || [];
      list = [slug, ...list.filter((s) => !isPack(s) && !inc.includes(s))];
    } else list.push(slug);
    this.set(list);
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
    pill.title = "Ver mi propuesta";
    pill.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg><span class="cart-pill__count"></span>';
    actions.prepend(pill);
  }
  const count = pill.querySelector(".cart-pill__count");
  if (count.textContent !== String(n)) {
    count.textContent = n;
    if (!isNew) pop(pill);
  }
  pill.setAttribute("aria-label", `Mi propuesta: ${n} ${n === 1 ? "servicio elegido" : "servicios elegidos"}`);
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
    if (label) label.textContent = on ? (isPackBtn ? "En tu propuesta" : "Añadido") : (isPackBtn ? "Añadir a mi propuesta" : "Añadir");
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
  const currentPack = () => inputs.find((i) => i.name === "pack" && i.checked);

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

  const cartItem = (input) => {
    const li = document.createElement("li");
    li.className = "cart__item";
    li.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${input.dataset.icon}"/></svg><span class="cart__name"></span><button type="button" class="cart__remove">×</button>`;
    const name = li.querySelector(".cart__name");
    name.textContent = input.value;
    const small = document.createElement("small");
    small.textContent = input.dataset.price || "Precio a medida en tu propuesta";
    name.append(small);
    const remove = li.querySelector(".cart__remove");
    remove.setAttribute("aria-label", `Quitar ${input.value}`);
    remove.addEventListener("click", () => { input.checked = false; update(); });
    return li;
  };

  // Si varios servicios sueltos ya forman un pack, se sugiere el pack
  const packTip = (slugs) => {
    let best = null;
    Object.entries(PACK_INCLUDES).forEach(([pack, inc]) => {
      const hits = slugs.filter((s) => inc.includes(s));
      if (hits.length >= 2 && (!best || hits.length > best.hits.length)) best = { pack, inc, hits };
    });
    if (!best) return null;
    const packInput = bySlug(best.pack);
    const list = (arr) => arr.map((s) => bySlug(s).dataset.short).join(", ").replace(/, ([^,]*)$/, " y $1");
    const rest = best.inc.filter((s) => !best.hits.includes(s));
    const tip = document.createElement("div");
    tip.innerHTML = `<p><strong></strong> ya van incluidos en el <strong></strong> (${packInput.dataset.price})${rest.length ? ", junto con " + list(rest) : ""}. Suele salir más a cuenta.</p><button type="button" class="btn btn--crimson">Cambiar al pack</button>`;
    const [a, b] = tip.querySelectorAll("strong");
    a.textContent = list(best.hits);
    b.textContent = packInput.value;
    tip.querySelector("button").addEventListener("click", () => {
      packInput.checked = true;
      lastTouched = best.pack;
      update();
    });
    return tip;
  };

  const update = () => {
    const pack = currentPack();
    const included = pack ? PACK_INCLUDES[pack.dataset.slug] || [] : [];
    inputs.filter((i) => i.name === "servicio").forEach((i) => {
      const inc = included.includes(i.dataset.slug);
      if (inc) i.checked = false;
      i.disabled = inc;
      i.closest(".chip").classList.toggle("is-included", inc);
      i.closest(".chip").title = inc ? `Ya va incluido en el ${pack.value}` : "";
    });
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
    cartList.replaceChildren(...slugs.map((s) => cartItem(bySlug(s))));
    const tip = pack ? null : packTip(slugs);
    tipBox.hidden = !tip;
    tipBox.replaceChildren(...(tip ? [tip] : []));

    // Título
    const names = slugs.map((s) => bySlug(s).dataset.short);
    if (!slugs.length) {
      kicker.textContent = "Cuéntanos";
      title.textContent = "Qué necesitas";
      document.title = "Contratar un servicio · Agencia Singular";
    } else {
      kicker.textContent = slugs.length === 1 ? "Contratar" : "Tu propuesta";
      title.textContent = slugs.length === 1 ? bySlug(slugs[0]).value : slugs.length === 2 ? names.join(" + ") : `${names[0]} + ${slugs.length - 1} más`;
      document.title = `Contratar ${slugs.map((s) => bySlug(s).value).join(" + ")} · Agencia Singular`;
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
      fold(group, false);
      fold(group === "packs" ? "carta" : "packs", true);
    }
    update();
  }));
  window.addEventListener("resize", fitTitle);
  document.fonts?.ready.then(fitTitle);

  // Selección inicial: lo guardado en el navegador + lo que venga en el enlace
  const params = new URLSearchParams(location.search);
  const wanted = (params.get("servicio") || "").split(",").filter((s) => bySlug(s));
  let start = cart.get().filter((s) => bySlug(s));
  wanted.forEach((s) => {
    if (isPack(s)) start = start.filter((x) => !isPack(x));
    if (!start.includes(s)) start.push(s);
  });
  const firstPack = start.find(isPack);
  start.filter((s) => !isPack(s) || s === firstPack).forEach((s) => { bySlug(s).checked = true; });
  lastTouched = wanted.at(-1) || start.at(-1) || null;
  if (lastTouched) {
    const group = bySlug(lastTouched).closest(".chip").dataset.group;
    fold(group === "packs" ? "carta" : "packs", true);
  }
  const testScore = params.get("test");
  const msg = hireForm.querySelector('textarea[name="mensaje"]');
  if (testScore && /^\d{1,3}$/.test(testScore) && msg && !msg.value) {
    msg.value = `Vengo del test de visibilidad: mi nota es ${testScore}/100.`;
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.web_hp.value) return; // bot

    const choice = form.querySelector("[data-need-choice]");
    if (choice && !choice.querySelector("input:checked")) {
      choice.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      setStatus("Elige al menos un pack o un servicio.", false);
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
        invalid.type === "radio" ? "Elige el servicio que quieres contratar."
        : invalid.type === "checkbox" ? "Necesitamos que aceptes la política de privacidad."
        : "Revisa los campos marcados: nombre, negocio y un email válido.", false);
      return;
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
    const servicio = [...data.getAll("pack"), ...data.getAll("servicio")].join(" + ");
    const subject = `${form.dataset.subject || "Contacto"}${servicio ? ` ${servicio}` : ""} · ${data.get("negocio")}`;

    if (!SITE.formEndpoint) {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("Abriendo tu correo con el mensaje listo para enviar…", true);
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
        const contactKeys = ["nombre", "negocio", "email", "telefono", "sector", "ciudad", "interes"].map((n) => {
          const el = form.querySelector(`[name="${n}"]`);
          return el ? fieldLabel(el) : n;
        });
        const detail = report
          .filter((s) => !summary.includes(s.titulo))
          .map((s) => (s.titulo === "Datos de contacto"
            ? { titulo: "Más información", filas: s.filas.filter(([k]) => !contactKeys.includes(k)) } : s))
          .filter((s) => s.filas.length);
        const payload = new URLSearchParams({
          formulario: form.dataset.subject || "Contacto", asunto: subject, servicios: servicio || data.getAll("interes").join(", "),
          nombre: get("nombre"), negocio: get("negocio"), email: get("email"), telefono: get("telefono"),
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
      setStatus("¡Recibido! Te escribimos en menos de 24 h laborables. ☕", true);
    } catch {
      setStatus(`No hemos podido enviarlo. Escríbenos a ${SITE.email} y te respondemos enseguida.`, false);
    } finally {
      btn.disabled = false;
    }
  });
});

/* Año del pie */
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
