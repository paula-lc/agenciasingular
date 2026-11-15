/* Singular Extra · borrador
   - Un pack añadido a "Mi propuesta" se pinta en azul (clase is-selected).
   - Clic en cualquier zona libre de la caja = pulsar su botón "Añadir a mi propuesta". */
(function () {
  var packs = [].slice.call(document.querySelectorAll(".pack--step"));
  if (!packs.length) return;
  var btnOf = function (p) {
    return p.querySelector(".pack__variant:not([hidden]) .add-btn--pack") || p.querySelector(".add-btn--pack");
  };
  var sync = function () {
    packs.forEach(function (p) {
      var b = btnOf(p);
      p.classList.toggle("is-selected", !!b && b.getAttribute("aria-pressed") === "true");
    });
  };
  var mo = new MutationObserver(sync);
  packs.forEach(function (p) {
    mo.observe(p, { subtree: true, attributes: true, attributeFilter: ["aria-pressed", "hidden"] });
    p.addEventListener("click", function (e) {
      if (e.target.closest("a, button, input, label, select, textarea, summary, [role='tab']")) return;
      if (String(window.getSelection ? window.getSelection() : "")) return;
      var b = btnOf(p);
      if (b) b.click();
    });
  });
  sync();
})();

/* Titulares y sellos que giran al entrar en pantalla, como el periódico que da vueltas en las películas */
(function () {
  var els = [].slice.call(document.querySelectorAll(".sx-motto, .sx-burst, .sx-burst--plain"));
  if (!els.length || !("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("sx-spin"); io.unobserve(e.target); } });
  }, { threshold: 0.35 });
  els.forEach(function (el) { el.classList.add("sx-pre"); io.observe(el); });
})();
