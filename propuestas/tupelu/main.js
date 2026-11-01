(function(){
  var d=document, b=d.body, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menú hamburguesa (bocadillo)
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function setMenu(o){menu.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')}
  burger.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});
  menu.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

  // Pegatinas: balanceo al tocar en móvil (iOS necesita un listener táctil para :active)
  d.addEventListener('touchstart',function(){},{passive:true});

  if(!('IntersectionObserver' in window)){
    d.querySelectorAll('.reveal,.reveal-pop').forEach(function(el){el.classList.add('in','done')});
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
  d.querySelectorAll('.reveal:not(.hero .reveal),.reveal-pop').forEach(function(el){io.observe(el)});
  d.querySelectorAll('.hero .reveal').forEach(function(el){
    el.classList.add('in');
    el.addEventListener('animationend',function(){el.classList.add('done')},{once:true});
  });
  // Los precios (li.svc) usan .reveal-pop + .in para disparar el estallido

  // Barra inferior: aparece al pasar el hero
  var hero=d.getElementById('inicio');
  new IntersectionObserver(function(es){
    b.classList.toggle('past-hero',!es[0].isIntersecting && es[0].boundingClientRect.top<0);
  },{threshold:0}).observe(hero);
})();
