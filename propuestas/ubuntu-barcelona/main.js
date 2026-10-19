(() => {
  // URL de reserva real (Treatwell, WhatsApp…). Mientras no exista, los botones bajan a "Encuéntranos".
  const BOOKING_URL = '';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (BOOKING_URL) $$('[data-booking]').forEach(a => { a.href = BOOKING_URL; a.target = '_blank'; a.rel = 'noopener'; });

  /* Trazo dorado a mano alrededor de las palabras clave */
  const STROKE = 'M335.861 14.9838C244.324 -8.85224 81.7993 -0.90689 23.8882 28.8882C-17.21 50.7379 -2.26523 90.4647 63.1183 104.369C145.315 126.219 305.971 110.328 350.806 82.5193C391.904 56.6969 348.938 12.9975 287.29 9.0248C193.885 -2.89323 72.4588 11.0111 27.6244 38.8199';
  $$('[data-circle]').forEach(el => {
    el.insertAdjacentHTML('beforeend',
      `<svg viewBox="0 0 368 115.6" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="${STROKE}"/></svg>`);
  });

  /* Reveal al entrar en pantalla */
  // Las imágenes con clip-path se observan a través de su contenedor (un clip cerrado no intersecta).
  const watched = new Map();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      watched.get(e.target).forEach(el => {
        el.classList.add('in');
        if (el.matches('[data-circle]')) {
          const c = $('[data-count]', el); if (c) countUp(c);
        }
      });
      io.unobserve(e.target); watched.delete(e.target);
    });
  }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal],[data-reveal-img],[data-circle]').forEach(el => {
    const t = el.matches('[data-reveal-img]') ? el.parentElement : el;
    if (!watched.has(t)) { watched.set(t, []); io.observe(t); }
    watched.get(t).push(el);
  });

  /* Contadores */
  const fmt = (n, dec) => dec
    ? n.toFixed(dec).replace('.', ',')
    : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (reduced) { el.textContent = fmt(end, dec); return; }
    const t0 = performance.now(), dur = 1800;
    const tick = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(end * e, dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  $$('[data-count]').forEach(el => {
    if (el.closest('[data-circle]')) return;           // lo dispara su trazo
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { countUp(el); o.disconnect(); } }), { threshold: .6 }).observe(el);
  });

  /* Cabecera, parallax, hilo del ritual, CTA móvil */
  const header = $('#header'), sticky = $('#stickyCta'), thread = $('#thread'), steps = $$('[data-step]');
  const stepsEl = $('#steps'), parallax = $$('[data-parallax]'), contact = $('#reservar');
  let ticking = false;

  function frame() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    header.classList.toggle('is-scrolled', y > 24);

    if (!reduced) parallax.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const k = parseFloat(img.dataset.parallax), lim = r.height * .08;
      const off = Math.max(-lim, Math.min(lim, (r.top + r.height / 2 - vh / 2) * -k));
      img.style.translate = `0 ${off.toFixed(1)}px`;
    });

    // hilo
    const sr = stepsEl.getBoundingClientRect();
    const first = steps[0].getBoundingClientRect().top + 28, lastNum = steps[steps.length - 1].getBoundingClientRect().top + 28;
    const line = vh * .6;
    const p = Math.min(Math.max((line - first) / (lastNum - first), 0), 1);
    thread.style.strokeDashoffset = reduced ? 0 : 1 - p;
    steps.forEach(s => s.classList.toggle('is-on', s.getBoundingClientRect().top + 28 < line));

    // reserva móvil: visible tras la portada y oculta al llegar al contacto
    const cr = contact.getBoundingClientRect();
    sticky.classList.toggle('is-on', y > vh * .6 && cr.top > vh * .55);

    // enlace activo
    let current = '';
    ['ritual', 'servicios', 'ubuntu', 'contacto'].forEach(id => {
      const r = document.getElementById(id).getBoundingClientRect();
      if (r.top < vh * .4 && r.bottom > vh * .4) current = id;
    });
    $$('.nav__link').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* Menú móvil */
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Botones magnéticos (solo con ratón) */
  if (!reduced && matchMedia('(hover:hover)').matches) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* Reserva de ejemplo (no envía nada) */
  const form = $('#bookingForm');
  if (form) {
    const dayBox = $('#optDay'), timeBox = $('#optTime'), err = $('#bError');
    const S = { service: $('#sService'), day: $('#sDay'), time: $('#sTime'), name: $('#sName') };
    const SLOTS = ['10:00', '10:45', '11:30', '12:15', '13:00', '16:00', '16:45', '17:30', '18:15', '19:00'];
    const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
    const fmtDay = d => cap(d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 8 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });

    dayBox.innerHTML = days.map((d, i) => `
      <label class="day"><input type="radio" name="dia" value="${i}"><span>
        <b>${d.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '')}</b><em>${d.getDate()}</em>
      </span></label>`).join('');

    const renderSlots = di => {
      timeBox.innerHTML = SLOTS.map((t, i) => {
        const taken = (di * 7 + i * 3) % 4 === 0;                 // huecos "ocupados" de ejemplo
        return `<label class="slot"><input type="radio" name="hora" value="${t}"${taken ? ' disabled' : ''}><span>${t}</span></label>`;
      }).join('');
      S.time.textContent = 'Sin elegir'; S.time.classList.remove('is-set');
    };
    renderSlots(0);
    timeBox.innerHTML = '<p class="small tag-pending">Elige primero un día.</p>';

    const set = (el, txt, ok) => { el.textContent = txt; el.classList.toggle('is-set', ok); };
    const val = n => (form.querySelector(`[name="${n}"]:checked`) || {}).value || '';

    form.addEventListener('change', e => {
      err.hidden = true;
      if (e.target.name === 'servicio') set(S.service, e.target.value, true);
      if (e.target.name === 'dia') {
        const d = days[+e.target.value]; renderSlots(+e.target.value); set(S.day, fmtDay(d), true);
      }
      if (e.target.name === 'hora') set(S.time, e.target.value + ' h', true);
    });
    $('#bName').addEventListener('input', e => {
      const v = e.target.value.trim(); set(S.name, v || 'Sin indicar', !!v);
    });

    // las tarjetas de Servicios preseleccionan el cuidado
    $$('.card').forEach(card => card.addEventListener('click', () => {
      const name = $('.card__name', card).textContent.trim();
      const r = form.querySelector(`input[name="servicio"][value="${name}"]`);
      if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    }));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const service = val('servicio'), di = val('dia'), time = val('hora'), name = $('#bName').value.trim(), phone = $('#bPhone').value.trim();
      const missing = !service ? 'Elige un cuidado.' : di === '' ? 'Elige un día.' : !time ? 'Elige una hora.' : !name ? 'Dinos tu nombre.' : !phone ? 'Déjanos un teléfono.' : '';
      if (missing) { err.textContent = missing; err.hidden = false; return; }
      $('#doneText').textContent = `${name}, te esperamos el ${fmtDay(days[+di]).toLowerCase()} a las ${time} para tu ${service.toLowerCase()}.`;
      const start = new Date(days[+di]); const [hh, mm] = time.split(':').map(Number); start.setHours(hh, mm, 0, 0);
      const end = new Date(start.getTime() + 60 * 60000);
      const p2 = n => String(n).padStart(2, '0');
      const stamp = d => `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}T${p2(d.getHours())}${p2(d.getMinutes())}00`;
      const title = `${cap(service)} · Saló Ubuntu Barcelona`, place = 'Saló Ubuntu Barcelona, Ronda del Guinardó 209, local 2, Barcelona';
      const note = 'Reserva de ejemplo (demo de la web).';
      $('#calGoogle').href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${stamp(start)}/${stamp(end)}`, ctz: 'Europe/Madrid', details: note, location: place });
      const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Saló Ubuntu Barcelona//ES', 'BEGIN:VEVENT', `UID:${stamp(start)}-${Date.now()}@ubuntu-barcelona`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${title}`, `LOCATION:${place.replace(/,/g, '\\,')}`, `DESCRIPTION:${note}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      $('#calIcs').href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
      $('#sumIdle').hidden = true; $('#sumDone').hidden = false;
      if (innerWidth < 1100) $('#summary').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });

    $('#bReset').addEventListener('click', () => {
      form.reset(); timeBox.innerHTML = '<p class="small tag-pending">Elige primero un día.</p>';
      set(S.service, 'Sin elegir', false); set(S.day, 'Sin elegir', false); set(S.time, 'Sin elegir', false); set(S.name, 'Sin indicar', false);
      $('#sumDone').hidden = true; $('#sumIdle').hidden = false;
    });
  }
})();
