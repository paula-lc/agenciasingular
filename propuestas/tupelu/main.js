(function(){
  var d=document, b=d.body, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Letras sueltas para las animaciones del menú y del logotipo
  function split(el,i0){var t=el.textContent;el.textContent='';el.setAttribute('aria-label',t);
    t.split('').forEach(function(ch,i){var s=d.createElement('span');s.className='lt';s.style.setProperty('--i',i);s.setAttribute('aria-hidden','true');s.textContent=ch;el.appendChild(s)})}
  d.querySelectorAll('.menu a').forEach(function(a,n){a.style.setProperty('--n',n);split(a)});
  d.querySelectorAll('.wm-main').forEach(function(el){split(el)});
  var top=d.querySelector('.top');
  function onScroll(){top.classList.toggle('stuck',scrollY>12)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  // Sección actual resaltada en el menú
  if('IntersectionObserver' in window){
    var links={};d.querySelectorAll('.menu a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
    var spy=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;
      Object.keys(links).forEach(function(k){links[k].classList.toggle('on',k===e.target.id)});
    })},{rootMargin:'-30% 0px -60% 0px'});
    Object.keys(links).forEach(function(k){var s=d.getElementById(k);if(s)spy.observe(s)});
  }

  // Menú hamburguesa (bocadillo)
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function setMenu(o){menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')}
  burger.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});
  menu.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // Pegatinas: balanceo al tocar en móvil (iOS necesita un listener táctil para :active)
  d.addEventListener('touchstart',function(){},{passive:true});

  // Clic en botones: estallido de cómic
  if(!reduce){
    d.addEventListener('pointerdown',function(e){
      var t=e.target.closest&&e.target.closest('.btn,.dock-tel,.burger');
      if(!t)return;
      var s=d.createElement('span');s.className='burst';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
      b.appendChild(s);setTimeout(function(){s.remove()},550);
    });
  }

  if(!('IntersectionObserver' in window)){
    d.querySelectorAll('.title,.reveal,.reveal-pop,.rv-drop,.rv-l,.rv-r,.pin,.also,.note,.rating-head,.visit-info,.map').forEach(function(el){el.classList.add('in','done')});
    return;
  }

  // Entradas: trama de puntos, cartas y estallidos de precio
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target; el.classList.add('in'); io.unobserve(el);
      if(el.classList.contains('reveal')) el.addEventListener('animationend',function(){el.classList.add('done')},{once:true});
    });
  },{threshold:.2,rootMargin:'0px 0px -6% 0px'});
  d.querySelectorAll('.reveal:not(.hero .reveal),.reveal-pop,.rv-drop,.rv-l,.rv-r,.pin,.also,.note,.rating-head,.visit-info,.map').forEach(function(el){io.observe(el)});
  d.querySelectorAll('.hero .reveal').forEach(function(el){
    el.classList.add('in');
    el.addEventListener('animationend',function(){el.classList.add('done')},{once:true});
  });
  d.querySelectorAll('.wall .polaroid').forEach(function(el,i){el.style.setProperty('--d',(i*.2)+'s')});
  // Títulos: recortados, así que se observan con umbral 0
  var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');tio.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -8% 0px'});
  d.querySelectorAll('.title').forEach(function(el){tio.observe(el)});
  // Los precios (li.svc) usan .reveal-pop + .in para disparar el estallido

  // Barra inferior: aparece al pasar el hero
  var hero=d.getElementById('inicio');
  new IntersectionObserver(function(es){
    b.classList.toggle('past-hero',!es[0].isIntersecting && es[0].boundingClientRect.top<0);
  },{threshold:0}).observe(hero);
})();
