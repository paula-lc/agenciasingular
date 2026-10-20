# Inserta en index.html el botón "Detalles" de cada servicio a la carta y su ventana con la información completa.
# Los packs (Cuidados esenciales, Web, Planes) no tienen ventana: su tarjeta ya lo cuenta todo.
import re
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
# Total con IVA (21 %) de cada precio publicado
VAT={'250 €':'302,50 €','120 €':'145,20 €'}
def vat(p):
    return VAT[p['price']]+' IVA incl.'
import sys
sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parent))
from services_data import SERVICES
def esc(s): return s.replace('&','&amp;').replace('<','&lt;')
check='<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>'
xicon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
def modal(p):
    inc=''.join(f'<div class="pmodal__group"><h4>{esc(t)}</h4><ul>{"".join(f"<li>{check}<span>{esc(x)}</span></li>" for x in items)}</ul></div>' for t,items in p['incluye'])
    pasos=''.join(f'<li><span class="pmodal__when">{esc(w)}</span><span>{esc(d)}</span></li>' for w,d in p['pasos'])
    nec=''.join(f'<li>{check}<span>{esc(x)}</span></li>' for x in p['necesitamos'])
    llev=''.join(f'<li>{check}<span>{esc(x)}</span></li>' for x in p['llevas'])
    if p.get('price'):
        price=f'<span class="pmodal__price">{p["price"]}<small>+ IVA</small></span><span class="pmodal__vat">{vat(p)}</span>'
    else:
        price='<span class="pmodal__price pmodal__price--quote">Presupuesto a medida en 48 h</span>'
    nota=f'<p class="pmodal__note">{esc(p["nota"])}</p>' if p.get('nota') else ''
    foot=(f'<a class="btn btn--crimson" href="contratar.html?servicio={p["slug"]}" data-track="{p["slug"]}-lo-quiero">Pedir propuesta</a>\n'
          f'                <button type="button" class="add-btn" data-add="{p["slug"]}" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg><span data-add-label>Añadir</span></button>')
    return f"""
          <dialog class="pmodal" id="detalle-{p["slug"]}" aria-labelledby="detalle-{p["slug"]}-title">
            <div class="pmodal__inner">
              <header class="pmodal__head">
                <button type="button" class="pmodal__close" data-pmodal-close aria-label="Cerrar">{xicon}</button>
                <span class="pmodal__kicker">{esc(p["kicker"])}</span>
                <h3 id="detalle-{p["slug"]}-title">{esc(p["title"])}</h3>
                <p class="pmodal__meta">{price}<span class="pmodal__time"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-clock"/></svg>{esc(p["plazo"])}</span></p>
              </header>
              <div class="pmodal__body" tabindex="0" autofocus>
                <section><h4 class="pmodal__h">Es para ti si…</h4><p>{esc(p["para"])}</p></section>
                <section><h4 class="pmodal__h">Qué incluye, en detalle</h4><div class="pmodal__groups">{inc}</div>{nota}</section>
                <section><h4 class="pmodal__h">Cómo lo hacemos</h4><ol class="pmodal__steps">{pasos}</ol></section>
                <div class="pmodal__cols">
                  <section><h4 class="pmodal__h">Qué necesitamos de ti</h4><ul class="pmodal__list">{nec}</ul></section>
                  <section><h4 class="pmodal__h">Qué te llevas</h4><ul class="pmodal__list">{llev}</ul></section>
                </div>
                <section class="pmodal__expect"><h4 class="pmodal__h">Qué puedes esperar</h4><p>{esc(p["esperar"])}</p></section>
                <p class="pmodal__not"><strong>No incluye:</strong> {esc(p["noincluye"])}</p>
              </div>
              <footer class="pmodal__foot">
                {foot}
              </footer>
            </div>
          </dialog>"""

s=open(ROOT+'index.html').read()
# limpiar una ejecución anterior
s=re.sub(r'<button type="button" class="(?:add-btn )?service__more"[^>]*>.*?</button>','',s)
s=re.sub(r'\s*<dialog class="pmodal".*?</dialog>','',s,flags=re.S)
# Servicios: botón "Detalles" en cada tarjeta
for sv in SERVICES:
    pat=re.compile(r'(<article class="service reveal" data-slug="'+sv['slug']+r'">.*?<span class="service__actions">)', re.S)
    s,n=pat.subn(lambda m: m.group(1)+f'<button type="button" class="add-btn service__more" data-pmodal="detalle-{sv["slug"]}" aria-label="Ver detalles de {sv["title"]}">Detalles</button>', s)
    assert n==1, sv['slug']
# Ventanas de los servicios, justo después de la cuadrícula de servicios
grid=s.index('<div class="services ')
grid_end=s.index('          </div>\n', grid)+len('          </div>\n')
s=s[:grid_end]+''.join(modal(sv) for sv in SERVICES).lstrip('\n')+'\n'+s[grid_end:]
open(ROOT+'index.html','w').write(s)
print('ok')
