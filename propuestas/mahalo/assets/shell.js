/* Elementos comunes a todas las páginas: menú de navegación y cuenta (registro / entrar, simulado). */
(() => {
  const { t, getLang } = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const here = location.pathname.split('/').pop() || 'index.html';
  let user = store.get('mv_user', null);

  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2400);
  }

  // ------------------------------------------------------------ botón de cuenta en cabecera
  function syncAccountBtn() {
    document.querySelectorAll('[data-account] .acct-btn__t').forEach(el => el.textContent = user ? t('acct.btn.my') : t('acct.btn.in'));
    document.querySelectorAll('[data-account]').forEach(b => {
      b.classList.toggle('is-in', !!user);
      if (b.classList.contains('acct-btn')) { const l = t(user ? 'acct.btn.my' : 'acct.btn.in'); b.setAttribute('aria-label', l); b.title = l; }
    });
  }

  // ------------------------------------------------------------ menú
  const ITEMS = [
    ['index.html#coleccion', '🛍️', 'menu.shop', 'menu.shop.s'],
    ['sobre-nosotras.html', '🌺', 'f.about', 'menu.about.s'],
    ['contacto.html', '📬', 'f.contact', 'menu.contact.s'],
    ['privacidad.html', '🔒', 'f.privacy', 'menu.privacy.s']
  ];
  const menu = document.createElement('div');
  menu.className = 'menu'; menu.id = 'menu'; menu.hidden = true;
  document.body.appendChild(menu);
  const scrim = document.createElement('div');
  scrim.className = 'menu-scrim'; scrim.hidden = true;
  document.body.appendChild(scrim);

  function renderMenu() {
    menu.innerHTML = `<div class="menu__head"><b>${t('menu.title')}</b><button class="icon-btn" data-menu-close aria-label="${t('menu.close')}">✕</button></div>
      <nav class="menu__list">${ITEMS.map(([href, emoji, k, s]) => {
        const cur = href.split('#')[0] === here && !href.includes('#');
        return `<a class="menu__item${cur ? ' is-cur' : ''}" href="${href}"${cur ? ' aria-current="page"' : ''}><span class="menu__e">${emoji}</span><span><b>${t(k)}</b><small>${t(s)}</small></span><i>→</i></a>`;
      }).join('')}</nav>
      <button class="menu__acct" data-account>${user ? `👤 ${esc(user.name)} · ${t('acct.btn.my')}` : `👤 ${t('acct.btn.in')} / ${t('acct.tab.reg')}`}</button>`;
  }
  function openMenu() {
    renderMenu(); menu.hidden = false; scrim.hidden = false;
    requestAnimationFrame(() => { menu.classList.add('on'); scrim.classList.add('on'); });
    document.querySelectorAll('[data-menu]').forEach(b => b.setAttribute('aria-expanded', 'true'));
  }
  function closeMenu() {
    menu.classList.remove('on'); scrim.classList.remove('on');
    document.querySelectorAll('[data-menu]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    setTimeout(() => { if (!menu.classList.contains('on')) { menu.hidden = true; scrim.hidden = true; } }, 220);
  }

  // ------------------------------------------------------------ cuenta (simulada)
  const acct = document.createElement('div');
  acct.className = 'modal'; acct.hidden = true; acct.setAttribute('role', 'dialog'); acct.setAttribute('aria-modal', 'true');
  acct.innerHTML = '<div class="modal__card narrow" id="acctCard"></div>';
  document.body.appendChild(acct);
  let tab = 'in';

  const orders = () => store.get('mv_orders', []);
  const fmtDate = iso => { try { return new Date(iso).toLocaleDateString(getLang() === 'en' ? 'en-GB' : getLang() === 'ca' ? 'ca-ES' : 'es-ES'); } catch { return ''; } };
  const eur = n => '€' + (Number.isInteger(n) ? n : n.toFixed(2));

  function renderAcct() {
    const card = $('#acctCard');
    const close = `<button class="icon-btn modal__close" data-acct-close aria-label="${t('close')}">✕</button>`;
    if (user) {
      const list = orders();
      card.innerHTML = `${close}<div class="form">
        <span class="demo-pill">${t('acct.demo')}</span>
        <h2>${t('acct.hi', { name: esc(user.name) })}</h2>
        <p>${t('acct.logged', { email: esc(user.email) })}</p>
        <h3 class="acct__h">${t('acct.orders')}</h3>
        ${list.length ? `<ul class="acct__orders">${list.slice().reverse().map(o => `<li><div><b>${t('acct.order', { no: esc(o.no), date: fmtDate(o.date) })}</b><span>${o.items.map(esc).join(' · ')}</span></div><em>${eur(o.total)}</em></li>`).join('')}</ul>`
          : `<p class="note">${t('acct.orders.empty')}</p>`}
        <a class="btn btn--pink btn--block" href="index.html#coleccion">${t('acct.shop')}</a>
        <button class="btn btn--outline btn--block" type="button" data-acct-logout>${t('acct.logout')}</button>
      </div>`;
      return;
    }
    const reg = tab === 'reg';
    card.innerHTML = `${close}<form class="form" id="acctForm">
      <span class="demo-pill">${t('acct.demo')}</span>
      <div class="tabs" role="tablist"><button type="button" role="tab" data-acct-tab="in" aria-selected="${!reg}">${t('acct.tab.in')}</button><button type="button" role="tab" data-acct-tab="reg" aria-selected="${reg}">${t('acct.tab.reg')}</button></div>
      <h2>${reg ? t('acct.title.reg') : t('acct.title.in')}</h2>
      ${reg ? `<label>${t('acct.name')}<input required name="name" autocomplete="name"></label>` : ''}
      <label>${t('acct.email')}<input required type="email" name="email" autocomplete="email"></label>
      <label>${t('acct.pass')}<input required type="password" name="pass" minlength="4" autocomplete="${reg ? 'new-password' : 'current-password'}"></label>
      <button class="btn btn--pink btn--block" type="submit">${reg ? t('acct.go.reg') : t('acct.go.in')}</button>
      <p class="note">${t('acct.note')}</p>
      <p class="note">${t('acct.note2')}</p>
    </form>`;
  }
  function openAcct(which) {
    closeMenu();
    if (which) tab = which;
    renderAcct(); acct.hidden = false; document.body.style.overflow = 'hidden';
    const f = $('#acctForm'); if (f) f.elements[0].focus();
  }
  function closeAcct() { acct.hidden = true; document.body.style.overflow = ''; }

  document.addEventListener('submit', e => {
    if (e.target.id !== 'acctForm') return;
    e.preventDefault();
    const f = e.target, email = f.email.value.trim();
    const name = f.name ? f.name.value.trim() : email.split('@')[0];
    user = { name: name || email, email };
    store.set('mv_user', user);
    toast(t(f.name ? 'toast.created' : 'toast.in'));
    syncAccountBtn(); renderAcct();
    document.dispatchEvent(new CustomEvent('accountchange'));
  });

  document.addEventListener('click', e => {
    const x = e.target.closest('[data-menu],[data-menu-close],[data-account],[data-acct-close],[data-acct-tab],[data-acct-logout]');
    if (!x) {
      if (e.target === acct) closeAcct();
      if (e.target === scrim) closeMenu();
      if (!menu.hidden && !e.target.closest('.menu')) closeMenu();
      return;
    }
    if (x.matches('[data-menu]')) { menu.hidden ? openMenu() : closeMenu(); }
    else if (x.matches('[data-menu-close]')) closeMenu();
    else if (x.matches('[data-account]')) openAcct();
    else if (x.matches('[data-acct-close]')) closeAcct();
    else if (x.matches('[data-acct-tab]')) { tab = x.dataset.acctTab; renderAcct(); }
    else if (x.matches('[data-acct-logout]')) { user = null; store.set('mv_user', null); toast(t('toast.out')); syncAccountBtn(); closeAcct(); document.dispatchEvent(new CustomEvent('accountchange')); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!acct.hidden) closeAcct(); else if (!menu.hidden) closeMenu(); } });
  // los enlaces del menú cierran el panel antes de navegar (mismo documento: #coleccion)
  menu.addEventListener('click', e => { if (e.target.closest('a.menu__item')) closeMenu(); });


  // ------------------------------------------------------------ plantas y flores decorativas: al pasar por encima, florecen
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function bloomAround(el, isFlower) {
    const parent = el.offsetParent || el.parentElement;
    if (reduce || !parent || el._bloomUntil > performance.now()) return;
    el._bloomUntil = performance.now() + 2600;
    const pr = parent.getBoundingClientRect(), lr = el.getBoundingClientRect();
    // plantas: puntos sobre la hoja (punta, lados, centro); flores: pequeños brotes alrededor
    const sc = isFlower ? 1 : Math.min(1, Math.max(.6, lr.height / 260));
    const spots = isFlower
      ? [[.5, -.15, 20], [1.12, .45, 16], [-.12, .6, 18]].slice(0, 2 + Math.floor(Math.random() * 2))
      : [[.5, .1, 44], [.3, .34, 32], [.72, .3, 36], [.5, .55, 28]].slice(0, 2 + Math.floor(Math.random() * 3));
    spots.forEach(([fx, fy, sz], i) => {
      const size = Math.round(sz * sc);
      const f = document.createElement('img');
      f.src = 'assets/deco/hibiscus.svg'; f.alt = ''; f.className = 'bloom';
      f.style.left = (lr.left - pr.left + lr.width * (fx + (Math.random() - .5) * .1)) + 'px';
      f.style.top = (lr.top - pr.top + lr.height * (fy + (Math.random() - .5) * .08)) + 'px';
      f.style.setProperty('--s', size + 'px');
      f.style.animationDelay = (i * 140) + 'ms';
      f.addEventListener('animationend', () => f.remove());
      setTimeout(() => f.remove(), 3600 + i * 140);   // red de seguridad si la animación no llega a terminar
      parent.appendChild(f);
    });
  }
  document.querySelectorAll('img.deco').forEach(el => {
    const m = /(palm|leaf|hibiscus|sprout)\.svg/.exec(el.getAttribute('src') || '');
    if (m) el.addEventListener('pointerenter', () => bloomAround(el, m[1] === 'hibiscus'));
  });


  // ------------------------------------------------------------ emojis de flor y planta: también florecen
  const EMO_SPLIT = /(🌺|🌸|🌿|🌴)/, EMO_ONE = /^(🌺|🌸|🌿|🌴)$/;
  function wrapEmojis(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || p.closest('script,style,textarea,input,select,option,title,.emo,.toast,.marquee,.logo')) return NodeFilter.FILTER_REJECT;
        return EMO_SPLIT.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      n.nodeValue.split(EMO_SPLIT).forEach(part => {
        if (!part) return;
        if (EMO_ONE.test(part)) { const sp = document.createElement('span'); sp.className = 'emo'; sp.textContent = part; frag.appendChild(sp); }
        else frag.appendChild(document.createTextNode(part));
      });
      n.replaceWith(frag);
    });
  }
  wrapEmojis(document.body);
  let emoTimer;
  new MutationObserver(() => { clearTimeout(emoTimer); emoTimer = setTimeout(() => wrapEmojis(document.body), 80); })
    .observe(document.body, { childList: true, subtree: true, characterData: true });
  document.addEventListener('pointerover', e => {
    const em = e.target.closest && e.target.closest('.emo');
    if (em) bloomAround(em, true);
  });

  document.addEventListener('langchange', () => { syncAccountBtn(); if (!menu.hidden) renderMenu(); if (!acct.hidden) renderAcct(); });
  window.MVAccount = { get user() { return user; } };
  syncAccountBtn();
})();
