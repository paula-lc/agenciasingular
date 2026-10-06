(() => {
  // ---------- fotos de tienda: carruseles con fundido ----------
  const PH = window.STORE_PHOTOS || [];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-slides]').forEach((box, n) => {
    if (!PH.length) return;
    let i = (+box.dataset.slides) % PH.length;
    const mk = () => { const im = new Image(); im.className = 'slide'; im.decoding = 'async'; return im; };
    const a = mk(), b = mk(); let cur = a;
    box.append(a, b);
    a.src = PH[i].src; a.alt = ''; a.classList.add('on');
    if (still) return;
    setTimeout(() => setInterval(() => {
      i = (i + 1) % PH.length;
      const nxt = cur === a ? b : a;
      nxt.src = PH[i].src;
      nxt.onload = () => { const old = cur; nxt.style.zIndex = 2; old.style.zIndex = 1; nxt.classList.add('on'); cur = nxt; setTimeout(() => old.classList.remove('on'), 1100); };
    }, 4200), 1400 * n);
  });
})();
