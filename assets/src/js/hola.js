/* Agencia Singular — página de destino del QR (/hola/). Va después de main.js, que aporta SITE, track y t. */
const { SITE: HSITE, track: htrack, t: ht } = window.AS;

/* Foto de Paula: guarda assets/img/paula.webp y pon fotoPaula a true. Opiniones: añade objetos { texto, nombre }
   a OPINIONES SOLO cuando sean reales y tengas permiso; mientras esté vacío el bloque no se muestra. */
const HOLA = {
  fotoPaula: false,
  OPINIONES: [],
};

const params = new URLSearchParams(location.search);
const slug = /^[a-z0-9-]{1,60}$/.test(params.get("n") || "") ? params.get("n") : "";
const src = ["visita", "tarjeta", "flyer"].includes(params.get("src")) ? params.get("src") : "directo";

const $h = (sel) => document.querySelector(sel);
let negocio = "";

const waLink = $h("[data-hola-wa]");
const setWhatsapp = () => {
  if (!HSITE.whatsapp) return;
  const msg = negocio
    ? ht("Hola Paula, soy de {negocio}, me dejaste el diagnóstico.", { negocio })
    : ht("Hola Paula, me diste tu QR y quiero que me digas cómo salgo en Google Maps.");
  waLink.href = `https://wa.me/${HSITE.whatsapp}?text=${encodeURIComponent(msg)}`;
  waLink.dataset.track = `whatsapp/hola-${src}/${slug || "generico"}`;
  waLink.hidden = false;
};

if (HOLA.fotoPaula) {
  const foto = $h("[data-hola-foto]");
  foto.src = "../assets/img/paula.webp";
  foto.hidden = false;
}

if (HOLA.OPINIONES.length) {
  const list = $h("[data-hola-opiniones-list]");
  HOLA.OPINIONES.forEach(({ texto, nombre }) => {
    const q = document.createElement("blockquote");
    q.className = "hola__quote";
    const p = document.createElement("p");
    p.textContent = texto;
    const c = document.createElement("cite");
    c.textContent = nombre;
    q.append(p, c);
    list.appendChild(q);
  });
  $h("[data-hola-opiniones]").hidden = false;
}

/* Si existe un diagnóstico para este negocio (lo genera scripts/diagnostico/build.py) se personaliza la página */
const personalizar = async () => {
  if (!slug) return;
  try {
    const res = await fetch(`../d/${slug}/negocio.json`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (!data.negocio) return;
    negocio = String(data.negocio).slice(0, 80);
    $h("[data-hola-title]").textContent = ht("Hola, equipo de {negocio} 👋", { negocio });
    const kicker = $h("[data-hola-kicker]");
    kicker.textContent = ht("Esta es la hoja que os dejé");
    kicker.hidden = false;
    $h("[data-hola-diag-link]").href = `../d/${slug}/`;
    $h("[data-hola-diag]").hidden = false;
    const nombre = $h("#h-negocio");
    if (!nombre.value) nombre.value = negocio;
  } catch { /* sin diagnóstico: se queda la versión genérica */ }
};

personalizar().finally(setWhatsapp);
htrack("hola", `${src}/${slug || "generico"}`);

/* Formulario mínimo */
const form = $h("[data-hola-form]");
const status = $h("[data-hola-status]");
const setStatus = (msg, ok) => { status.textContent = msg; status.className = `form__status ${ok ? "is-ok" : "is-error"}`; };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form.web_hp.value) return; // bot
  const nombre = form.nombre.value.trim();
  const negocioForm = form.negocio.value.trim();
  const contacto = form.contacto.value.trim();
  const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto);
  const esTelefono = /^[+\d][\d\s.-]{7,}$/.test(contacto);
  if (!nombre) { form.nombre.focus(); return setStatus(ht("Dime cómo te llamas."), false); }
  if (!negocioForm) { form.negocio.focus(); return setStatus(ht("Dime cómo se llama tu negocio."), false); }
  if (!esEmail && !esTelefono) { form.contacto.focus(); return setStatus(ht("Escribe un WhatsApp o un email válido para poder escribirte."), false); }
  if (!form.privacidad.checked) { form.privacidad.focus(); return setStatus(ht("Necesitamos que aceptes la política de privacidad."), false); }

  const subject = `[QR visita] ${negocioForm} – nuevo contacto`;
  const resumen = [["Origen del QR", src], ["Diagnóstico", slug || "—"]];
  if (!HSITE.formEndpoint) {
    const body = `Nombre: ${nombre}\nNegocio: ${negocioForm}\nContacto: ${contacto}\nOrigen: ${src} ${slug}`;
    window.location.href = `mailto:${HSITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return setStatus(ht("Abriendo tu correo con el mensaje listo para enviar…"), true);
  }
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const payload = new URLSearchParams({
      formulario: "QR visita", origen: "QR visita", slug, src, asunto: subject, servicios: "", nombre, negocio: negocioForm,
      email: esEmail ? contacto : "", telefono: esEmail ? "" : contacto, sector: "", ciudad: "", pagina: location.href,
      secciones: JSON.stringify([{ titulo: "Origen", filas: resumen }]),
    });
    await fetch(HSITE.formEndpoint, { method: "POST", mode: "no-cors", body: payload });
    htrack("formulario", `hola-${src}/${slug || "generico"}`);
    form.reset();
    setStatus(ht("¡Recibido! Te escribo en menos de 24 h laborables. ☕"), true);
  } catch {
    setStatus(ht("No hemos podido enviarlo. Escríbenos a {email} y te respondemos enseguida.", { email: HSITE.email }), false);
  } finally {
    btn.disabled = false;
  }
});
