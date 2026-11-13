(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');

  /* Menú móvil */
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

  /* Titulares palabra a palabra */
  document.querySelectorAll('.section h2').forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', words.join(' '));
    h.textContent = '';
    words.forEach(function (w, i) {
      var outer = document.createElement('span');
      var inner = document.createElement('span');
      outer.className = 'w';
      outer.setAttribute('aria-hidden', 'true');
      inner.textContent = w;
      inner.style.transitionDelay = (0.12 + i * 0.07) + 's';
      outer.appendChild(inner);
      h.appendChild(outer);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  /* Retardos escalonados dentro de cada grupo */
  [['.cards .card', 0.1, 4], ['.reviews .review', 0.1, 3], ['.prices li', 0.06, 9], ['.amounts li', 0.12, 3], ['.stats-in li', 0.1, 4]].forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % g[2]) * g[1]) + 's';
    });
  });

  document.querySelectorAll('.gallery figure').forEach(function (el, i) {
    el.style.setProperty('--d', (i * 0.15) + 's');
  });

  /* Revelado al entrar en pantalla + contadores */
  function count(el) {
    var to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || '0', 10);
    var fmt = function (v) { return v.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec }); };
    if (reduce) { el.textContent = fmt(to); return; }
    var t0 = performance.now(), dur = 1700;
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var targets = document.querySelectorAll('.reveal, .wipe');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('.count').forEach(count);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* Barra inferior móvil: aparece al pasar el hero */
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

    /* Enlace activo en el menú */
    var links = {};
    nav.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (a && en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* Scroll: progreso, cabecera y paralaje */
  var progress = document.querySelector('.progress');
  var plx = [].slice.call(document.querySelectorAll('[data-parallax-img]'));
  var marks = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    header.classList.toggle('scrolled', y > 8);
    if (reduce) return;
    var vh = window.innerHeight;
    plx.forEach(function (img) {
      var r = img.parentNode.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) return;
      var c = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = 'translate3d(0,' + (c * -14).toFixed(1) + 'px,0) scale(1.1)';
    });
    marks.forEach(function (m) {
      var r = m.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var c = (r.top + r.height / 2 - vh / 2);
      m.style.transform = 'translate3d(0,' + (c * parseFloat(m.dataset.parallax)).toFixed(1) + 'px,0)';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* Botones magnéticos (solo con ratón) */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22, y = (e.clientY - r.top - r.height / 2) * 0.3;
        b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }
})();
