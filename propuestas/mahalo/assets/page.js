(() => {
  // contador de la cesta (guardada en el navegador desde la tienda)
  const badge = () => {
    try {
      const n = (JSON.parse(localStorage.getItem('mv_cart')) || []).length, c = document.getElementById('cartCount');
      if (c) { c.textContent = n; c.hidden = !n; }
    } catch {}
  };
  badge();

  // formulario de contacto simulado
  const f = document.getElementById('contactForm');
  if (f) f.addEventListener('submit', e => { e.preventDefault(); f.querySelector('.cform__ok').hidden = false; f.reset(); });

  // contadores animados (años de experiencia = desde 2015)
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targetOf = el => el.dataset.countTo === 'years' ? new Date().getFullYear() - 2015 : +el.dataset.countTo;
  document.querySelectorAll('[data-count-to]').forEach(el => { el.textContent = still ? targetOf(el) : '0'; });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    const el = en.target;
    if (el.hasAttribute('data-count-to')) {
      if (still) return;
      const to = targetOf(el), t0 = performance.now(), dur = 1400;
      const step = now => { const k = Math.min(1, (now - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    } else el.classList.add('in-view');
  }), { threshold: .35 }) : null;
  document.querySelectorAll('[data-count-to],[data-reveal]').forEach(el => io ? io.observe(el) : (el.dataset.countTo ? el.textContent = targetOf(el) : el.classList.add('in-view')));
})();
