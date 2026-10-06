(() => {
  const P = window.PRODUCTS || [];
  const { t } = window.I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const eur = n => '€' + (Number.isInteger(n) ? n : n.toFixed(2));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- persisted state (guarded: storage may be unavailable) ----------
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  let cart = store.get('mv_cart', []).filter(id => P.some(p => p.id === id));
  let favs = new Set(store.get('mv_favs', []));

  const CATS = ['all', 'Sportwear', 'Jerseys', 'Shirts', 'Tops', 'USA Sportwear'];
  const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  // la rejilla se adapta al ancho (auto-fill): cargamos de 2 en 2 filas completas
  const cols = () => Math.max(2, ($('#grid') ? getComputedStyle($('#grid')).gridTemplateColumns.split(' ').length : 3));
  const page = () => cols() * 2;
  let cat = 'all', size = null, shown = 6;

  // Tiendas y horarios: los de mahalovintage.com
  const STORES = [
    ['C/ Trafalgar, 78', '08003', 'h.monsat', '11:00–21:00'],
    ['C/ Comtal, 13', '08002', 'h.monsun', '11:00–21:00'],
    ['Plaça del Diamant, 9', '08012', 'h.monsat', '12:00–21:00'],
    ['C/ Joaquim Costa, 38', '08001', 'h.monsat', '12:00–21:00'],
    ['C/ Tallers, 21', '08001', 'h.monsat', '12:00–21:00'],
    ['C/ Tallers, 63', '08001', 'h.monsat', '12:00–21:00']
  ].map(([street, cp, day, time]) => {
    const q = encodeURIComponent(`Mahalo Vintage, ${street}, ${cp} Barcelona`);
    return { street, cp, day, time, link: `https://www.google.com/maps/search/?api=1&query=${q}`, dir: `https://www.google.com/maps/dir/?api=1&destination=${q}` };
  });
  const hours = s => `${t(s.day)} · ${s.time}`;

  // Envío: tarifas de mahalovintage.com/delivery (por peso y destino). Peso estimado por prenda.
  const FREE_FROM = 100, KG_PER_PIECE = 0.45;
  const RATES = [[0.5, [2, 6, 10]], [1, [5, 13, 22]], [2, [8, 20, 34]], [5, [13, 33, 33]]];
  const COUNTRIES = [
    ['ES', null, ['ES']],
    ['EU', 'cg.EU', ['PT', 'FR', 'IT', 'DE', 'NL', 'BE', 'IE', 'GB']],
    ['WW', 'cg.WW', ['US', 'MX', 'XX']]
  ];

  const HEART = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15.63 3.4575a4.5 4.5 0 0 0-6.365 0L9 4.2525l-.795-.795a4.5 4.5 0 0 0-6.365 6.3675l.795.795L9 15.9225l5.835-5.835.795-.795a4.5 4.5 0 0 0 0-6.3675Z" stroke="#1a1025" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---------- derived ----------
  const newestIds = new Set(P.slice(0, 6).map(p => p.id));
  const badgeFor = p => /RARE/i.test(p.name) ? [t('badge.rare'), 'amber'] : newestIds.has(p.id) ? [t('badge.new'), p.id % 2 ? 'indigo' : 'pink'] : null;
  const filtered = () => P.filter(p => (cat === 'all' || p.cats.includes(cat)) && (!size || p.size === size));
  const byId = id => P.find(p => p.id === id);
  const subtotal = () => cart.reduce((a, id) => a + byId(id).price, 0);
  const acctUser = () => (window.MVAccount && window.MVAccount.user) || null;
  const tr = (k, fb) => { const v = t(k); return v === k ? fb : v; };
  const colorName = c => c ? tr('col.' + c, c) : '';
  const unit = n => t(n === 1 ? 'piece.one' : 'piece.many');
  function shippingCost(zone) {
    if (zone === 'ES' && subtotal() >= FREE_FROM) return 0;
    const kg = cart.length * KG_PER_PIECE, i = ['ES', 'EU', 'WW'].indexOf(zone);
    return (RATES.find(r => kg <= r[0]) || RATES[RATES.length - 1])[1][i];
  }
  const zoneOf = cc => COUNTRIES.find(g => g[2].includes(cc))[0];

  // ---------- static pieces ----------
  document.querySelectorAll('[data-count]').forEach(el => el.textContent = el.dataset.count === 'pieces' ? P.length : '+' + (new Date().getFullYear() - 2015));

  function renderChrome() {
    $('#marquee').innerHTML = [0, 1, 2, 3].map(() => [1, 2, 3, 4, 5, 6, 7].map(i => `<span>${t('m.' + i)}</span>`).join('')).join('');
    $('#cats').innerHTML = CATS.map(k => `<button data-cat="${k}" class="${k === cat ? 'is-on' : ''}">${t('cat.' + k)}</button>`).join('');
    $('#storeList').innerHTML = STORES.map(s => `<li><a href="${s.link}" target="_blank" rel="noopener"><b>${s.street}</b><span>${s.cp} Barcelona · ${hours(s)}</span><em>${t('maps.view')}</em></a></li>`).join('');
  }
  $('#sizes').innerHTML = SIZES.map(s => `<button class="size-pill" data-size="${s}" aria-pressed="false">${s}</button>`).join('');

  // ---------- grid ----------
  function cardHTML(p, i) {
    const b = badgeFor(p), inCart = cart.includes(p.id), fav = favs.has(p.id), sale = p.reg > p.price;
    const len = (p.details.find(d => /Largo|Lenght|Length/i.test(d)) || '').match(/\d+\s?cm/i);
    const meta = [p.color && `${t('card.color')}: ${colorName(p.color)}`, len && `${t('card.length')}: ${len[0]}`].filter(Boolean).join(' · ');
    return `<article class="card" style="animation-delay:${(i % cols()) * 60}ms" data-id="${p.id}">
      <div class="card__media" data-open="${p.id}">
        ${b ? `<span class="badge badge--${b[1]} card__tag">${b[0]}</span>` : ''}
        <img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy">
        ${p.images[1] ? `<img src="${p.images[1]}" alt="" loading="lazy">` : ''}
      </div>
      <button class="heart ${fav ? 'is-on' : ''}" data-fav="${p.id}" aria-label="${t('card.fav')}" aria-pressed="${fav}">${HEART}</button>
      <div class="card__body">
        <div class="card__row"><h3 class="card__title" data-open="${p.id}">${esc(p.name)}</h3>${p.size ? `<span class="size-tag">${p.size}</span>` : ''}</div>
        <p class="card__meta">${meta}</p>
        <div class="card__buy">
          <span class="price">${eur(p.price)}${sale ? `<s>${eur(p.reg)}</s>` : ''}</span>
          <button class="add c${i % 4} ${inCart ? 'in-cart' : ''}" data-add="${p.id}">${inCart ? t('card.in') : t('card.add')}</button>
        </div>
      </div>
    </article>`;
  }

  function updateGridMeta(list) {
    const label = t('cat.' + cat);
    $('#collTitle').textContent = cat === 'all' && !size ? t('coll.title.new') : (cat === 'all' ? t('coll.title.all') : label) + (size ? ` · ${t('coll.size')} ${size}` : '');
    $('#collBadge').textContent = cat === 'all' && !size ? t('coll.new') : t('coll.coll');
    $('#resultLine').textContent = `${list.length} ${t(list.length === 1 ? 'res.one' : 'res.many')}`;
    $('#empty').hidden = list.length > 0;
    $('#moreBtn').parentElement.hidden = list.length <= shown;
    $('#cats').querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b.dataset.cat === cat));
    $('#sizes').querySelectorAll('button').forEach(b => { const on = b.dataset.size === size; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
  }
  function renderGrid(keep) {        // filtros: repinta la rejilla
    const list = filtered(); if (!keep) shown = page();
    $('#grid').innerHTML = list.slice(0, shown).map(cardHTML).join('');
    updateGridMeta(list);
  }
  function showMore() {              // "ver más": solo añade las tarjetas nuevas
    const list = filtered(), from = shown; shown += page();
    $('#grid').insertAdjacentHTML('beforeend', list.slice(from, shown).map(cardHTML).join(''));
    updateGridMeta(list);
  }
  function syncAddButtons() {        // añadir/quitar: solo cambia los botones, sin repintar nada
    document.querySelectorAll('.add[data-add]').forEach(b => {
      const inCart = cart.includes(+b.dataset.add);
      b.classList.toggle('in-cart', inCart);
      b.textContent = inCart ? t('card.in') : t('card.add');
    });
  }

  // ---------- cart ----------
  const saveCart = () => store.set('mv_cart', cart);
  function updateBadge(bump) {
    const c = $('#cartCount'); c.hidden = !cart.length; c.textContent = cart.length;
    if (bump) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
  }
  function addToCart(id) {
    if (cart.includes(id)) { toast(t('toast.exists')); return; }
    cart.push(id); saveCart(); updateBadge(true); renderCart(); syncAddButtons();
    toast(t('toast.added', { name: byId(id).name }));
  }
  function removeFromCart(id) { cart = cart.filter(x => x !== id); saveCart(); updateBadge(); renderCart(); syncAddButtons(); }

  function renderCart() {
    const body = $('#cartBody'), foot = $('#cartFoot');
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty"><span class="big">🌴</span><b>${t('cart.empty')}</b><p class="note">${t('cart.empty.p')}</p><button class="btn btn--pink btn--sm" data-close data-goto="#coleccion">${t('hero.cta1')}</button></div>`;
      foot.innerHTML = ''; foot.hidden = true; return;
    }
    foot.hidden = false;
    body.innerHTML = cart.map(id => {
      const p = byId(id);
      return `<div class="line"><img src="${p.images[0]}" alt=""><div class="line__info"><b>${esc(p.name)}</b><small>${[p.size && `${t('card.size')} ${p.size}`, colorName(p.color)].filter(Boolean).join(' · ')}</small><span class="line__price">${eur(p.price)}</span></div><button class="line__rm" data-rm="${id}">${t('cart.rm')}</button></div>`;
    }).join('');
    const st = subtotal(), left = FREE_FROM - st;
    foot.innerHTML = `<div class="free"><p>${left > 0 ? t('cart.left', { amt: eur(left) }) : t('cart.done')}</p><div class="free__bar"><i style="width:${Math.min(100, st / FREE_FROM * 100)}%"></i></div></div>
      <div class="sum"><span>${t('cart.sub', { n: cart.length, unit: unit(cart.length) })}</span><span>${eur(st)}</span></div>
      <p class="note">${t('cart.note')}</p>
      <button class="btn btn--pink btn--block" data-checkout>${t('cart.checkout')}</button>`;
  }

  const overlay = $('#overlay'), drawer = $('#drawer');
  function openDrawer() { renderCart(); overlay.hidden = false; requestAnimationFrame(() => { overlay.classList.add('on'); drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false'); }); }
  function closeDrawer() { overlay.classList.remove('on'); drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true'); setTimeout(() => overlay.hidden = true, 250); }

  // ---------- modals ----------
  const modal = $('#modal'), card = $('#modalCard');
  const co = $('#co'), checkoutOpen = () => !co.hidden;
  function openModal(html, cls = '') {
    card.className = 'modal__card ' + cls;
    card.innerHTML = `<button class="icon-btn modal__close" data-mclose aria-label="${t('close')}">✕</button>` + html;
    modal.hidden = false; document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.hidden = true; if (!checkoutOpen()) document.body.style.overflow = ''; }

  function quickView(id) {
    const p = byId(id), inCart = cart.includes(id);
    openModal(`<div class="qv">
      <div class="qv__gal"><img class="qv__main" id="qvMain" src="${p.images[0]}" alt="${esc(p.name)}">
        ${p.images.length > 1 ? `<div class="qv__thumbs">${p.images.map((s, i) => `<button class="${i ? '' : 'on'}" data-thumb="${s}" aria-label="${t('qv.photo')} ${i + 1}"><img src="${s}" alt=""></button>`).join('')}</div>` : ''}</div>
      <div class="qv__info">
        <div class="chips">${p.cats.map(c => `<span class="chip">${esc(tr('cat.' + c, c))}</span>`).join('')}${p.size ? `<span class="chip">${t('card.size')} ${p.size}</span>` : ''}${p.color ? `<span class="chip">${colorName(p.color)}</span>` : ''}</div>
        <h2>${esc(p.name)}</h2>
        <div class="qv__price">${eur(p.price)}</div>
        ${p.details.length ? `<ul>${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
        <p class="note">${t('qv.unique')}</p>
        <button class="btn btn--pink btn--block" data-qvadd="${p.id}">${inCart ? t('qv.view') : t('qv.add')}</button>
        <a class="note" href="${p.url}" target="_blank" rel="noopener">${t('qv.site')}</a>
      </div></div>`, 'qvcard');
  }

  function storeDetail(i) {
    const s = STORES[i];
    return `<span class="sm__pin">📍</span><span class="badge badge--cyan">${t('sm.tag', { i: i + 1, n: STORES.length })}</span>
      <h3>${s.street}</h3><p>${s.cp} Barcelona</p><p class="sm__hours">🕐 ${hours(s)}</p>
      <div class="sm__btns"><a class="btn btn--pink" href="${s.link}" target="_blank" rel="noopener">${t('maps.open')}</a><a class="btn btn--outline" href="${s.dir}" target="_blank" rel="noopener">${t('maps.dir')}</a></div>`;
  }
  function storesModal(sel = 0) {
    openModal(`<div class="stores-modal">
      <div class="sm__list"><h2>${t('sm.title')}</h2><p class="note">${t('sm.sub')}</p>
        ${STORES.map((s, i) => `<div class="sm__item ${i === sel ? 'on' : ''}" data-store="${i}"><div><b>${s.street}</b><span>${s.cp} Barcelona</span><span>${hours(s)}</span></div><a class="btn btn--outline btn--sm" href="${s.link}" target="_blank" rel="noopener">${t('maps.dir')}</a></div>`).join('')}
      </div>
      <div class="sm__detail" id="smDetail">${storeDetail(sel)}</div>
    </div>`, 'wide');
  }

  // ---------- checkout (pantalla completa, compra como invitado) ----------
  let coZone = 'ES', coMethod = 'ship';
  const logoHTML = () => `<a class="logo" href="#top" data-co-back aria-label="Mahalo Vintage"><img src="assets/img/logo.png" alt="Mahalo Vintage" width="56" height="56"><span class="logo__text"><b>MAHALO</b><i>VINTAGE</i></span></a>`;

  function summaryHTML() {
    const st = subtotal(), ship = coMethod === 'pickup' ? 0 : shippingCost(coZone);
    return `<h3>${t('co.sum')}</h3>
      <div class="co__lines">${cart.map(id => { const p = byId(id); return `<div class="co__line"><div class="co__thumb"><img src="${p.images[0]}" alt=""><span>1</span></div><div><b>${esc(p.name)}</b><small>${[p.size && `${t('card.size')} ${p.size}`, colorName(p.color)].filter(Boolean).join(' · ')}</small></div><span class="co__p">${eur(p.price)}</span></div>`; }).join('')}</div>
      <div class="sum"><span>${t('co.subtotal')}</span><span>${eur(st)}</span></div>
      <div class="sum"><span>${t('co.shipping')}</span><span>${coMethod === 'pickup' ? t('co.pickfree') : ship === 0 ? t('free') : eur(ship)}</span></div>
      <div class="sum total"><span>${t('co.total')}</span><span id="coTotal">${eur(st + ship)}</span></div>`;
  }

  function checkoutHTML() {
    const opt = c => `<option value="${c}" data-zone="${zoneOf(c)}">${t('cn.' + c)}</option>`;
    const countries = COUNTRIES.map(([, g, list]) => g ? `<optgroup label="${t(g)}">${list.map(opt).join('')}</optgroup>` : list.map(opt).join('')).join('');
    return `<header class="co__bar">${logoHTML()}
        <button class="btn btn--outline btn--sm" data-co-back>${t('co.back')}</button></header>
      <div class="co__wrap">
        <form class="co__form" id="coForm">
          <span class="demo-pill">${t('co.demo')}</span>
          <h1>${t('co.title')}</h1>
          <p class="note">${acctUser() ? t('co.guest.user', { name: esc(acctUser().name) }) : t('co.guest')}</p>

          <fieldset><legend><i>1</i> ${t('co.s1')}</legend>
            <div class="two"><label>${t('co.email')}<input required type="email" name="email" autocomplete="email" value="${acctUser() ? esc(acctUser().email) : ''}"></label>
            <label>${t('co.phone')}<input required type="tel" name="tel" autocomplete="tel"></label></div></fieldset>

          <fieldset><legend><i>2</i> ${t('co.s2')}</legend>
            <label class="opt"><input type="radio" name="method" value="ship" checked><span><b>${t('co.ship')}</b><small>${t('co.ship.d')}</small></span><em id="shipPrice"></em></label>
            <label class="opt"><input type="radio" name="method" value="pickup"><span><b>${t('co.pick')}</b><small>${t('co.pick.d')}</small></span><em>${t('free')}</em></label>
          </fieldset>

          <fieldset id="addrBox"><legend><i>3</i> ${t('co.s3')}</legend>
            <div class="two"><label>${t('co.fn')}<input required name="fn" autocomplete="given-name"></label><label>${t('co.ln')}<input required name="ln" autocomplete="family-name"></label></div>
            <label>${t('co.country')}<select name="country" id="coCountry" autocomplete="country-name">${countries}</select></label>
            <label>${t('co.addr')}<input required name="addr" autocomplete="street-address" placeholder="${t('co.addr.ph')}"></label>
            <div class="two"><label>${t('co.zip')}<input required name="zip" autocomplete="postal-code"></label><label>${t('co.city')}<input required name="city" autocomplete="address-level2"></label></div>
          </fieldset>

          <fieldset><legend><i>4</i> ${t('co.s4')}</legend>
            <div class="paybox">${t('co.pay.t')} <small>${t('co.pay.s')}</small></div>
            <label>${t('co.notes')}<input name="notes" placeholder="${t('co.notes.ph')}"></label>
            <label class="check"><input required type="checkbox" name="terms"> <span>${t('co.terms')}</span></label>
          </fieldset>
          <button class="btn btn--pink btn--block" type="submit" id="coPay"></button>
        </form>
        <aside class="co__sum" id="coSum">${summaryHTML()}</aside>
      </div>`;
  }

  function refreshCheckout() {
    $('#coSum').innerHTML = summaryHTML();
    const ship = shippingCost(coZone);
    $('#shipPrice').textContent = ship === 0 ? t('free') : eur(ship);
    $('#coPay').textContent = t('co.pay', { total: $('#coTotal').textContent });
    $('#addrBox').hidden = coMethod === 'pickup';
    $('#addrBox').querySelectorAll('input').forEach(i => i.disabled = coMethod === 'pickup');
  }

  function mountCheckout(values) {
    co.innerHTML = checkoutHTML(); co.hidden = false;
    const f = $('#coForm');
    if (values) {
      for (const [k, v] of Object.entries(values)) { const el = f.elements[k]; if (el && el.type !== 'radio' && el.type !== 'checkbox') el.value = v; }
      if (values.method) f.elements.method.value = values.method;
      if (values.terms) f.elements.terms.checked = true;
    }
    coMethod = f.elements.method.value;
    coZone = f.elements.country.selectedOptions[0].dataset.zone;
    refreshCheckout();
    f.addEventListener('change', e => {
      if (e.target.name === 'method') coMethod = e.target.value;
      if (e.target.name === 'country') coZone = e.target.selectedOptions[0].dataset.zone;
      refreshCheckout();
    });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const total = $('#coTotal').textContent, pickup = coMethod === 'pickup', email = f.email.value;
      const name = pickup ? t('co.friend') : f.fn.value;
      co.innerHTML = `<div class="co__center"><div class="spin"></div><p style="font-weight:800">${t('co.proc')}</p></div>`;
      setTimeout(() => {
        const no = 'MV-' + Math.floor(10000 + Math.random() * 89999);
        const items = cart.map(byId), totalNum = subtotal() + (pickup ? 0 : shippingCost(coZone));
        store.set('mv_orders', [...store.get('mv_orders', []), { no, total: totalNum, date: new Date().toISOString(), items: items.map(p => p.name) }]);
        cart = []; saveCart(); updateBadge(); renderCart(); syncAddButtons();
        co.innerHTML = `<header class="co__bar">${logoHTML()}</header>
          <div class="co__center done"><span class="big">🌺</span><h1>${t('co.done.h', { name: esc(name) })}</h1>
          <p>${t('co.done.o', { no, total })}</p>
          <p>${t(pickup ? 'co.done.pick' : 'co.done.ship', { email: esc(email) })}</p>
          <div class="done__items">${items.map(p => `<img src="${p.images[0]}" alt="${esc(p.name)}">`).join('')}</div>
          <p class="note">${t('co.done.demo')}</p>
          <button class="btn btn--pink" data-co-back>${t('co.done.btn')}</button></div>`;
        co.scrollTop = 0;
      }, 1500);
    });
  }
  function openCheckout() {
    if (!cart.length) return;
    closeDrawer();
    mountCheckout(); co.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    if (location.hash !== '#checkout') history.pushState({ co: 1 }, '', '#checkout');
  }
  function closeCheckout() { co.hidden = true; co.innerHTML = ''; document.body.style.overflow = ''; }
  window.addEventListener('popstate', () => { if (location.hash !== '#checkout' && checkoutOpen()) closeCheckout(); });

  let tt;
  function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 2400); }

  // ---------- scroll suave al logo (animación propia: el scroll nativo sube a tirones en páginas largas) ----------
  function smoothTop() {
    const root = document.documentElement, from = window.scrollY;
    if (!from) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { window.scrollTo(0, 0); return; }
    const dur = Math.min(900, 350 + from * 0.12), t0 = performance.now();
    root.style.scrollBehavior = 'auto';
    const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, Math.round(from * (1 - ease(k))));
      if (k < 1) requestAnimationFrame(step); else root.style.scrollBehavior = '';
    };
    requestAnimationFrame(step);
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const logo = e.target.closest('a.logo[href="#top"]');
    if (logo && !logo.hasAttribute('data-co-back')) { e.preventDefault(); smoothTop(); return; }
    const tg = e.target.closest('[data-cat],[data-size],[data-add],[data-qvadd],[data-fav],[data-open],[data-rm],[data-thumb],[data-close],[data-mclose],[data-goto],[data-stores],[data-store],[data-checkout],[data-co-back],#openCart,#moreBtn,#clearFilters');
    if (!tg) { if (e.target === modal) closeModal(); if (e.target === overlay) closeDrawer(); return; }
    const d = tg.dataset;
    if (d.cat) { cat = d.cat; renderGrid(); $('#coleccion').scrollIntoView(); }
    else if (d.size) { size = size === d.size ? null : d.size; renderGrid(); }
    else if (d.add) addToCart(+d.add);
    else if (d.qvadd) { const id = +d.qvadd, had = cart.includes(id); closeModal(); if (had) openDrawer(); else addToCart(id); }
    else if (d.fav) { const id = +d.fav; favs.has(id) ? favs.delete(id) : favs.add(id); store.set('mv_favs', [...favs]); tg.classList.toggle('is-on'); tg.setAttribute('aria-pressed', favs.has(id)); if (favs.has(id)) toast(t('toast.fav')); }
    else if (d.open) quickView(+d.open);
    else if (d.rm) removeFromCart(+d.rm);
    else if (d.thumb) { $('#qvMain').src = d.thumb; tg.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === tg)); }
    else if (d.stores !== undefined) storesModal();
    else if (d.store !== undefined) { if (e.target.closest('a')) return; const i = +d.store; $('#smDetail').innerHTML = storeDetail(i); tg.parentElement.querySelectorAll('.sm__item').forEach(x => x.classList.toggle('on', x === tg)); }
    else if (d.checkout !== undefined) openCheckout();
    else if (d.coBack !== undefined) { e.preventDefault(); closeCheckout(); if (location.hash === '#checkout') history.back(); }
    else if (tg.id === 'openCart') openDrawer();
    else if (tg.id === 'moreBtn') showMore();
    else if (tg.id === 'clearFilters') { cat = 'all'; size = null; renderGrid(); }
    if (d.close !== undefined) { closeDrawer(); if (d.goto) setTimeout(() => $(d.goto).scrollIntoView(), 280); }
    if (d.mclose !== undefined) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal(); else if (drawer.classList.contains('on')) closeDrawer();
  });

  // ---------- cambio de idioma: repinta lo que genera JS ----------
  document.addEventListener('langchange', () => {
    renderChrome(); renderGrid(true); renderCart();
    if (!modal.hidden) closeModal();
    if (checkoutOpen() && $('#coForm')) {
      const f = $('#coForm'), vals = {};
      [...f.elements].forEach(el => { if (el.name && el.type !== 'radio') vals[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
      vals.method = coMethod; mountCheckout(vals);
    }
  });

  let resizeSnap;
  window.addEventListener('resize', () => {
    clearTimeout(resizeSnap);
    resizeSnap = setTimeout(() => {
      const c = cols(), want = Math.max(2, Math.ceil(shown / c)) * c;
      if (want !== shown && $('#grid').children.length) { shown = want; renderGrid(true); }
    }, 200);
  });

  // ---------- init ----------
  if (location.hash === '#checkout') history.replaceState(null, '', location.pathname);
  renderChrome(); updateBadge(); renderCart(); renderGrid();
  // enlaces desde otras páginas: index.html?cat=Jerseys / ?cart=1
  const qs = new URLSearchParams(location.search);
  if (CATS.includes(qs.get('cat'))) { cat = qs.get('cat'); renderGrid(); setTimeout(() => $('#coleccion').scrollIntoView(), 50); }
  if (qs.get('cart')) { history.replaceState(null, '', location.pathname); openDrawer(); }
})();
