(function(){
  'use strict';
  var d=document;

  /* ========= PRECIOS: único sitio donde se cambian =========
     base y antes: euros sin IVA. El total con IVA se calcula aquí.
     Para cambiar un precio, edita solo este objeto. */
  var PRECIOS={
    iva:0.21,
    plazas:{quedan:5,total:5},
    escaparate:{base:600,antes:1140,plazo:'2–3 semanas'},
    puestaEnMarcha:{base:190},
    plantillas:{base:120,nota:'pago único'},
    mantenimiento:{base:129,nota:'mes a mes, sin permanencia',mensual:true}
  };

  function eur(cents){
    var n=cents/100, ent=Math.floor(n), dec=Math.round((n-ent)*100);
    var s=String(ent).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    return s+(dec?','+(dec<10?'0':'')+dec:'')+' €';
  }
  function conIva(base){return Math.round(base*100*(1+PRECIOS.iva))}

  d.querySelectorAll('[data-precio]').forEach(function(card){
    var p=PRECIOS[card.getAttribute('data-precio')]; if(!p)return;
    var pow=card.querySelector('.pow'), info=card.querySelector('.pinfo');
    var baseTxt=eur(p.base*100)+(p.mensual?'/mes':'');
    pow.innerHTML='<span>'+(p.mensual?'<small>al mes</small>':'')+eur(p.base*100)+'</span>';
    pow.setAttribute('aria-label',baseTxt+' más IVA');
    var h='';
    if(p.antes) h+='<span class="was" aria-label="Precio anterior: '+eur(p.antes*100)+'">'+eur(p.antes*100)+'</span>';
    h+='<span class="iva">+ IVA · <b>'+eur(conIva(p.base))+(p.mensual?'/mes':'')+' en total</b></span>';
    var extra=[]; if(p.plazo)extra.push(p.plazo); if(p.nota)extra.push(p.nota);
    if(extra.length)h+='<span class="when">'+extra.join(' · ')+'</span>';
    info.innerHTML=h;
  });
  d.querySelectorAll('[data-plazas]').forEach(function(el){
    el.textContent='quedan '+PRECIOS.plazas.quedan+' de '+PRECIOS.plazas.total+' plazas';
  });

  /* ========= Antes / después (móvil) ========= */
  var ba=d.getElementById('ba'), range=d.getElementById('ba-range');
  if(ba&&range){
    var set=function(){ba.style.setProperty('--p',range.value+'%')};
    range.addEventListener('input',set); set();
  }

  /* ========= Revelados ========= */
  var els=d.querySelectorAll('.reveal,.pop,.pcard');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(el){el.classList.add('in','done')}
  if(reduce||!('IntersectionObserver' in window)){els.forEach(show);return}
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      var el=e.target; el.classList.add('in'); io.unobserve(el);
      if(el.classList.contains('reveal')) el.addEventListener('animationend',function(){el.classList.add('done')},{once:true});
    });
  },{threshold:.15,rootMargin:'0px 0px -5% 0px'});
  els.forEach(function(el){io.observe(el)});
})();
