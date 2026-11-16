# Genera, a partir de precios.json (única fuente de precios):
#   · los 3 menús del día, La sobremesa y La carta de index.html (entre los comentarios <!-- precios:... -->)
#   · los datos de precios que lee el JavaScript (comanda, test): <script type="application/json" id="precios-data">
#   · el JSON-LD de index.html: Service + Offer de los 3 menús y FAQPage con las preguntas visibles de #faq
import json, re, os, sys, html
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from ilustraciones import ILUS
ROOT = str(__import__('pathlib').Path(__file__).resolve().parents[2]) + '/'
D = json.load(open(os.path.join(HERE, 'precios.json')))
IVA = D['iva']

def num(x):
    """1140 -> 1.140 · 423.5 -> 423,50"""
    entero = int(round(x * 100)) // 100; cent = int(round(x * 100)) % 100
    s = f'{entero:,}'.replace(',', '.')
    return s + (f',{cent:02d}' if cent else '')
def eur(x): return f'{num(x)} €'
def con_iva(x): return x * (100 + IVA) / 100
esc = html.escape

def plato(nombre, precio=None, nota=None, desde=False, mensual=False, iva=True, slug=None):
    if isinstance(precio, str): p = f'<span class="menu__precio menu__precio--txt">{esc(precio)}</span>'
    elif precio is None: p = ''
    else:
        unidad = '€/mes' if mensual else '€'
        pre = '<small>desde</small> ' if desde else ''
        tot = f'<small class="menu__iva">{num(con_iva(precio))} {unidad} IVA incl.</small>' if iva and not desde else ''
        p = f'<span class="menu__precio">{pre}{num(precio)} {unidad} <small>+ IVA</small>{tot}</span>'
    n = f'<em class="menu__nota">{esc(nota)}</em>' if nota else ''
    if slug:
        return (f'<li class="menu__plato menu__plato--check"><label class="menu__check"><input type="checkbox" data-add-check="{slug}">'
                f'<span class="menu__caja" aria-hidden="true"></span><span class="menu__linea"><span class="menu__nombre">{esc(nombre)}</span>'
                f'<span class="menu__puntos" aria-hidden="true"></span>{p}</span></label>{n}</li>')
    incl = ' menu__plato--incl' if precio == 'incluido' else ''
    return (f'<li class="menu__plato{incl}"><span class="menu__linea"><span class="menu__nombre">{esc(nombre)}</span>'
            f'<span class="menu__puntos" aria-hidden="true"></span>{p}</span>{n}</li>')

def foto(clave, alt, cls=''):
    return f'<figure class="foto {cls}" role="img" aria-label="{esc(alt)}">{ILUS[clave]}</figure>'

def bloque_precio(precio, iva=True):
    return (f'<p class="menu__total">{num(precio)} €<small> + IVA</small></p>'
            f'<p class="menu__iva-total">{num(con_iva(precio))} € IVA incl.</p>')

def menu_dia(m, modo=None):
    destacado = ' menu--destacado' if m['num'] == 2 else ''
    etiqueta = f' · {esc(m["etiqueta"])}' if m.get('etiqueta') else ''
    platos = ''.join(plato(n, (f'{num(p)} € a la carta' if isinstance(p, (int, float)) else p)) for n, p in m['platos'])
    tachado_txt = esc(m.get('tachadoTexto', '')) + ' ' if m.get('tachadoTexto') else ''
    ahorro = m['tachado'] - m['precio']
    fundador = ('<div class="sx-fundador">' + f'<span class="sx-burst sx-burst--fundador" aria-hidden="true"><b>−{num(ahorro)} €</b><span>Fundador</span></span>'
                + f'<p class="menu__tachado">{tachado_txt}<s>{eur(m["tachado"])}</s></p>'
                + (f'<p class="menu__en">En menú:</p>' if m.get('tachadoTexto') else '')
                + bloque_precio(m['precio'])
                + '<p class="menu__sello" data-founder>Precio fundador</p></div>')
    if m.get('precioSinFundador'):
        cuenta = f'<div data-founder>{fundador}</div><div data-web-price hidden>{bloque_precio(m["precioSinFundador"])}</div>'
    else:
        cuenta = fundador
    sup = ''
    dist = next((x for x in D['menus'] if x.get('suplementoWeb')), None)
    if m['num'] == 2 and dist:
        tot = dist['precio'] + dist['suplementoWeb']
        sup = (f'<p class="menu__distancia" data-solo-dist><strong>¿Fuera de Barcelona?</strong> <span>A distancia y con web:</span> '
               f'<b>{num(tot)} €<small> + IVA</small></b></p>')
    if m.get('suplementoWeb'):
        tot = m['precio'] + m['suplementoWeb']
        sup = (f'<p class="menu__suplemento"><strong>Suplemento web:</strong> +{num(m["suplementoWeb"])} € + IVA '
               f'<span>({num(tot)} € + IVA en total, {num(con_iva(tot))} € IVA incl.)</span></p>')
    return f'''
            <article class="menu menu--dia{destacado}" id="menu-{m["slug"]}" data-menu="{m["num"]}"{f' data-modo="{modo}"' if modo else ''} aria-labelledby="menu-{m["slug"]}-t">
              <header class="menu__head">
                <p class="menu__kicker">Menú {1 if modo == "dist" else m["num"]}{etiqueta}</p>
                <h3 class="menu__title" id="menu-{m["slug"]}-t">{esc(m["nombre"])}</h3>
                <p class="menu__para">{esc(m["para"])}</p>
              </header>
              <div class="menu__body">
                <ul class="menu__platos">{platos}</ul>
                {foto(m["ilustracion"], m["alt"], "menu__foto")}
              </div>
              <div class="menu__cuenta">{cuenta}<p class="menu__plazo"><svg class="icon icon--sm" aria-hidden="true"><use href="#i-clock"/></svg>{esc(m["plazo"])}</p></div>
              {sup}
              <div class="menu__acciones">
                <a class="btn btn--crimson" href="contratar.html?servicio={m["slug"]}" data-track="menu-{m["num"]}">{esc(m["cta"])}</a>
                <button type="button" class="add-btn add-btn--pack" data-add="{m["slug"]}" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg><span data-add-label>Añadir a mi propuesta</span></button>
              </div>
            </article>'''

def sobremesa():
    platos = ''.join(plato(p['nombre'], p['precio'], p['nota'], mensual=True, slug=p['slug']) for p in D['planes'])
    return f'''
          <article class="menu menu--sobremesa" id="sobremesa" aria-labelledby="sobremesa-t">
            <header class="menu__head">
              <p class="menu__kicker">Cada mes · Para clientas de la casa</p>
              <h3 class="menu__title" id="sobremesa-t">La sobremesa</h3>
              <p class="menu__para">Cuando tu escaparate ya esté a punto, podemos seguir cuidándolo cada mes. Sin permanencia.</p>
            </header>
            <ul class="menu__platos">{platos}</ul>
            <div class="menu__acciones"><a class="btn btn--yellow" href="#contacto" data-interes="diagnostico" data-track="sobremesa">Lo hablamos en la sobremesa</a></div>
          </article>'''

def carta():
    grupos = ''
    for g in D['carta']:
        platos = ''.join(plato(p['nombre'], p['precio'], p['nota'], desde=p.get('desde'), slug=p['slug']) for p in g['platos'])
        grupos += f'''
              <section class="menu__grupo">
                <h4 class="menu__grupo-t">{esc(g["grupo"])}</h4>
                <div class="menu__body"><ul class="menu__platos">{platos}</ul>{foto(g["ilustracion"], ALT_CARTA[g["ilustracion"]], "menu__foto menu__foto--sm")}</div>
              </section>'''
    return f'''
          <article class="menu menu--carta" id="carta" aria-labelledby="carta-t">
            <header class="menu__head">
              <p class="menu__kicker">A la carta</p>
              <h3 class="menu__title" id="carta-t">La carta de la casa</h3>
            </header>{grupos}
              <section class="menu__grupo menu__grupo--fuera">
                <h4 class="menu__grupo-t">Fuera de carta</h4>
                <p class="menu__fuera"><strong>¿Buscas otra cosa?</strong> Redes, rebranding o visibilidad en IA: pregúntanos y te respondemos en 48 h laborables.</p>
                <a class="btn btn--crimson" href="#contacto" data-interes="otra" data-track="cta-preguntanos">Pregúntanos</a>
              </section>
          </article>'''
ALT_CARTA = {'cafe': 'Ilustración: taza de café humeante', 'camara': 'Ilustración: cámara de fuelle antigua', 'plano': 'Ilustración: plano dibujado a lápiz'}

def datos_js():
    """Lo que necesita el JavaScript (comanda y test): una sola tabla de productos"""
    prod = {}
    for m in D['menus']:
        prod[m['slug']] = dict(nombre=m['nombre'], tipo='menu', num=m['num'], precio=m['precio'], sinFundador=m.get('precioSinFundador'),
                               incluye=m.get('incluye', []), suplementoWeb=m.get('suplementoWeb'))
    for p in D['planes']:
        prod[p['slug']] = dict(nombre=p['nombre'], tipo='plan', precio=p['precio'], mensual=True)
    for g in D['carta']:
        for p in g['platos']:
            prod[p['slug']] = dict(nombre=p['nombre'], tipo='carta', precio=p['precio'], desde=bool(p.get('desde')))
    return json.dumps({'iva': IVA, 'productos': prod}, ensure_ascii=False, separators=(',', ':'))

def jsonld(s):
    m = re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', s, re.S)
    data = json.loads(m.group(2))
    org = next(x for x in data['@graph'] if 'Organization' in (x['@type'] if isinstance(x['@type'], list) else [x['@type']]))
    org.pop('hasOfferCatalog', None); org.pop('makesOffer', None)
    org['knowsAbout'] = ['Google Business Profile', 'Google Maps', 'Diseño web', 'Fotografía comercial', 'Peluquerías', 'Centros de estética']
    org['slogan'] = 'Que tu escaparate digital trabaje por ti'
    org['description'] = ('Agencia boutique de Barcelona para peluquerías, uñas y centros de estética, y otros comercios de la zona. '
                          'Cuida su ficha de Google, sus fotos y su web para que les encuentren y reserven. Precios cerrados y sin permanencia. '
                          'Trabaja en persona en Barcelona y a distancia en toda España.')
    keep = [x for x in data['@graph'] if x.get('@type') not in ('FAQPage', 'Service', 'OfferCatalog')]
    services = []
    for mm in D['menus']:
        services.append({'@type': 'Service', '@id': f'https://agenciasingular.es/#menu-{mm["slug"]}',
            'name': f'Menú {mm["num"]} · {mm["nombre"]}', 'description': f'{mm["para"]}. ' + '. '.join(p[0] for p in mm['platos']) + '.',
            'provider': {'@id': 'https://agenciasingular.es/#agencia'}, 'areaServed': 'ES',
            'offers': {'@type': 'Offer', 'price': f'{mm["precio"]:.2f}', 'priceCurrency': 'EUR',
                       'priceSpecification': {'@type': 'UnitPriceSpecification', 'price': f'{mm["precio"]:.2f}', 'priceCurrency': 'EUR', 'valueAddedTaxIncluded': False},
                       'url': f'https://agenciasingular.es/#menu-{mm["slug"]}'}})
    # FAQPage: solo las preguntas visibles de #faq
    faq = re.search(r'<section[^>]*id="faq".*?</section>', s, re.S).group(0)
    qa = []
    for q, a in re.findall(r'<summary>(.*?)</summary>\s*<div class="answer">(.*?)</div>', faq, re.S):
        txt = lambda h: html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', h))).strip()
        qa.append({'@type': 'Question', 'name': txt(q), 'acceptedAnswer': {'@type': 'Answer', 'text': txt(a)}})
    faqpage = {'@type': 'FAQPage', '@id': 'https://agenciasingular.es/#faq', 'mainEntity': qa}
    data['@graph'] = keep + services + [faqpage]
    out = json.dumps(data, ensure_ascii=False, indent=2)
    out = '\n'.join('  ' + l for l in out.split('\n'))
    return s[:m.start()] + m.group(1) + '\n' + out + '\n  ' + m.group(3) + s[m.end():]

def put(s, key, content):
    a, b = f'<!-- precios:{key} -->', f'<!-- /precios:{key} -->'
    assert a in s and b in s, key
    i, j = s.index(a) + len(a), s.index(b)
    return s[:i] + content + '\n          ' + s[j:]

if __name__ == '__main__':
    s = open(ROOT + 'index.html').read()
    menus = sorted(D['menus'], key=lambda m: (m['num'] != 2, m['num']))  # en móvil, el Menú 2 primero
    por_num = {m['num']: m for m in D['menus']}
    caja1 = '<div class="menu-slot">' + menu_dia(por_num[1], 'bcn') + menu_dia(por_num[3], 'dist') + '\n          </div>'
    s = put(s, 'menus', menu_dia(por_num[2]) + '\n          ' + caja1 + sobremesa())
    s = put(s, 'sobremesa', '')
    s = put(s, 'carta', carta())
    s = re.sub(r'<script type="application/json" id="precios-data">.*?</script>',
               f'<script type="application/json" id="precios-data">{datos_js()}</script>', s, flags=re.S)
    s = jsonld(s)
    open(ROOT + 'index.html', 'w').write(s)
    print('ok')
