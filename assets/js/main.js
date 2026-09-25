/* Agencia Singular — interacciones de la web */

/* ------------------------------------------------------------------
   CONFIGURACIÓN: rellena estos datos antes de publicar
   ------------------------------------------------------------------ */
const SITE = {
  email: "hola@agenciasingular.es",
  // Número con prefijo de país y sin espacios, p. ej. "34600111222". Vacío = se oculta.
  whatsapp: "",
  // Endpoint de un servicio de formularios (Formspree, Getform, Web3Forms…).
  // Vacío = el formulario abre el correo del usuario con el mensaje ya escrito.
  formEndpoint: "",
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

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 10);
  stickyCta?.classList.toggle("is-visible", y > 600 && !contactVisible);
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
  { area: "Google Maps", q: "¿Tu negocio aparece en Google Maps con la ficha verificada?", hint: "Busca el nombre de tu negocio en Google Maps desde el móvil.",
    opts: [["Sí, y está completa", 2], ["Sí, pero a medias", 1], ["No / no lo sé", 0]],
    tip: "<strong>Reclama y completa tu Perfil de Empresa de Google</strong>: categoría principal exacta, horario, servicios y al menos 10 fotos reales." },
  { area: "Reseñas", q: "¿Cuántas reseñas tienes en Google?", hint: "Las reseñas pesan en Maps y en lo que recomienda la IA.",
    opts: [["Más de 50", 2], ["Entre 10 y 50", 1], ["Menos de 10", 0]],
    tip: "<strong>Pide reseñas de forma sistemática</strong>: un QR en el mostrador y un mensaje tras cada visita. Y responde a todas, también a las malas." },
  { area: "Web", q: "¿Tienes web propia (no solo Instagram)?", hint: "Una web es la fuente oficial que leen Google y las IA.",
    opts: [["Sí, y es reciente", 2], ["Sí, pero antigua o lenta", 1], ["No tengo", 0]],
    tip: "<strong>Una web sencilla y rápida</strong> con tus servicios, precios orientativos, zona y contacto es la base de todo lo demás." },
  { area: "Web", q: "¿Tu web tiene una página para cada servicio importante?", hint: "Ej.: “manicura semipermanente”, “ramos de novia”, “cambio de neumáticos”.",
    opts: [["Sí", 2], ["Todo está en una sola página", 1], ["No tengo web", 0]],
    tip: "<strong>Crea una página por servicio clave</strong> que responda: qué es, precio, duración, para quién y dónde. Así Google y la IA saben por qué recomendarte." },
  { area: "IA", q: "Si preguntas a ChatGPT o Gemini por tu servicio en tu zona, ¿te nombra?", hint: "Pruébalo: “¿qué [tu servicio] me recomiendas en [tu barrio]?”.",
    opts: [["Sí, aparezco", 2], ["Aparece mi competencia", 0], ["No lo he probado", 0]],
    tip: "<strong>Hazte visible para la IA</strong>: mismos datos (nombre, dirección, teléfono) en todas partes, preguntas frecuentes en tu web y menciones en medios o blogs locales." },
  { area: "Coherencia", q: "¿Tu nombre, dirección, teléfono y horario son iguales en todas partes?", hint: "Web, Google, redes, directorios, TripAdvisor, Páginas Amarillas…",
    opts: [["Sí, lo he revisado", 2], ["Creo que sí", 1], ["Seguro que hay diferencias", 0]],
    tip: "<strong>Unifica tus datos</strong> en todas las plataformas. Las incoherencias hacen que Google y la IA desconfíen de tu información." },
  { area: "Imagen", q: "¿Tienes fotos profesionales de tu local, equipo y productos?", hint: "Las fotos reales generan más clics y visitas que las de stock.",
    opts: [["Sí", 2], ["Algunas hechas con el móvil", 1], ["No / uso fotos de internet", 0]],
    tip: "<strong>Invierte en una sesión de fotos real</strong>: fachada, interior, equipo y tus 5 productos o servicios estrella. Súbelas a Maps, web y redes." },
  { area: "Constancia", q: "¿Publicas novedades en Google o redes al menos una vez por semana?", hint: "La actividad reciente es una señal de negocio vivo.",
    opts: [["Sí", 2], ["De vez en cuando", 1], ["Casi nunca", 0]],
    tip: "<strong>Programa una publicación semanal</strong> en tu ficha de Google (ofertas, novedades, eventos). 15 minutos que marcan la diferencia." },
];

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
    let title, text, pack, color;
    if (score < 40) {
      title = "Eres casi invisible";
      text = "Tus clientes potenciales no te están encontrando. La buena noticia: hay mucho margen y los primeros cambios se notan rápido.";
      pack = "Escaparate"; color = "var(--crimson)";
    } else if (score < 75) {
      title = "Vas por buen camino";
      text = "Tienes una base, pero hay huecos que están regalando clientes a tu competencia. Con unos ajustes puedes dar el salto.";
      pack = "Que te encuentren"; color = "var(--orange)";
    } else {
      title = "¡Eres bastante visible!";
      text = "Lo estás haciendo bien. El siguiente paso es mantenerte arriba y asegurarte de que la IA te recomienda a ti.";
      pack = "Siempre visible"; color = "var(--mustard)";
    }

    const ring = $("[data-score-ring]");
    ring.style.setProperty("--ring", color);
    $("[data-score-title]").textContent = `${score}/100 · ${title}`;
    $("[data-score-text]").textContent = `${text} Pack recomendado: ${pack}.`;

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

    quizSummary = `Resultado del test de visibilidad: ${score}/100 (${title}). Pack sugerido: ${pack}.`;
    const cta = $("[data-quiz-cta]");
    cta.dataset.pack = pack;

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

const form = document.getElementById("contact-form");
if (form) {
  const status = form.querySelector("[data-form-status]");
  const setStatus = (msg, ok) => {
    status.textContent = msg;
    status.className = `form__status ${ok ? "is-ok" : "is-error"}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.web_hp.value) return; // bot

    const invalid = [...form.querySelectorAll("[required]")].find((el) =>
      el.type === "checkbox" ? !el.checked : !el.value.trim() || (el.type === "email" && !el.checkValidity())
    );
    if (invalid) {
      invalid.focus();
      setStatus(invalid.type === "checkbox"
        ? "Necesitamos que aceptes la política de privacidad."
        : "Revisa los campos marcados: nombre, negocio y un email válido.", false);
      return;
    }

    const data = new FormData(form);
    const intereses = data.getAll("interes").join(", ") || "—";
    const body = [
      `Nombre: ${data.get("nombre")}`,
      `Negocio: ${data.get("negocio")}`,
      `Email: ${data.get("email")}`,
      `Sector: ${data.get("sector") || "—"}`,
      `Interés: ${intereses}`,
      "",
      data.get("mensaje") || "",
    ].join("\n");

    if (!SITE.formEndpoint) {
      const subject = `Café virtual · ${data.get("negocio")}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("Abriendo tu correo con el mensaje listo para enviar…", true);
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      data.delete("web_hp");
      const res = await fetch(SITE.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(res.statusText);
      form.reset();
      setStatus("¡Recibido! Te escribimos en menos de 24 h laborables para ese café. ☕", true);
    } catch {
      setStatus(`No hemos podido enviarlo. Escríbenos a ${SITE.email} y te respondemos enseguida.`, false);
    } finally {
      btn.disabled = false;
    }
  });
}

/* Año del pie */
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
