(function () {
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Barra inferior: aparece al pasar el hero
  var bar = document.getElementById('bar');
  var hero = document.getElementById('hero');
  function toggleBar(show) {
    bar.classList.toggle('show', show);
    bar.setAttribute('aria-hidden', String(!show));
    bar.querySelectorAll('a').forEach(function (a) {
      if (show) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1');
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      toggleBar(!entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
    }).observe(hero);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
