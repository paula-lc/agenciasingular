# Portfolio: casos de data/portfolio.json que se enseñan en la sección «Ejemplos» de cada página de servicio.
# Se pintan en el HTML al generar la web (no con JavaScript). Sin casos con permiso no se escribe nada:
# ni título, ni «Próximamente», ni huecos. Cómo añadir un caso: README → «Portfolio».
import json, os, html
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
TIPOS=('ficha','instagram','web')
REAL='Caso real'; FICTICIO='Maqueta de ejemplo — negocio ficticio'
CAMPOS=('id','tipo','negocio','permiso','idioma','antes','despues','que_se_hizo','enlace','etiqueta')
esc=lambda s: html.escape(str(s), quote=True)
def load(path=None):
    """Casos válidos y con permiso. Un caso mal escrito para la generación: mejor que publicar algo a medias."""
    cases=json.load(open(path or ROOT+'data/portfolio.json'))
    assert isinstance(cases,list), 'data/portfolio.json debe ser una lista'
    out=[]
    for c in cases:
        cid=c.get('id','(sin id)')
        falta=[k for k in CAMPOS if k not in c]
        assert not falta, f'portfolio · {cid}: faltan campos {falta}'
        assert c['tipo'] in TIPOS, f'portfolio · {cid}: tipo debe ser uno de {TIPOS}'
        assert c['etiqueta'] in (REAL,FICTICIO), f'portfolio · {cid}: etiqueta debe ser «{REAL}» o «{FICTICIO}»'
        p=c['permiso']
        assert isinstance(p,dict) and isinstance(p.get('ok'),bool), f'portfolio · {cid}: permiso debe ser {{"ok": true|false, "fecha": "AAAA-MM-DD"}}'
        if not p['ok']: continue                       # sin permiso no se muestra
        assert p.get('fecha'), f'portfolio · {cid}: con permiso hace falta la fecha en que se dio'
        out.append(c)
    return out
def lado(titulo, v):
    """antes / despues: un texto, o {"texto": …, "imagen": "/assets/img/portfolio/x.webp", "alt": …, "ancho": n, "alto": n}"""
    if not v: return ''
    if isinstance(v,str): v={'texto':v}
    img=''
    if v.get('imagen'):
        assert v.get('alt'), 'portfolio: cada imagen necesita su texto alternativo (alt)'
        size=''.join(f' {k}="{int(v[a])}"' for k,a in (('width','ancho'),('height','alto')) if v.get(a))
        img=f'<img src="{esc(v["imagen"])}" alt="{esc(v["alt"])}"{size} loading="lazy">'
    txt=f'<p>{esc(v["texto"])}</p>' if v.get('texto') else ''
    return f'<h4>{titulo}</h4>\n{img}{txt}\n' if (img or txt) else ''
def render(cases):
    """HTML de los casos; cadena vacía si no hay ninguno"""
    out=''
    for c in cases:
        enlace=f'<p><a href="{esc(c["enlace"])}" rel="noopener">Ver el resultado</a></p>\n' if c.get('enlace') else ''
        out+=(f'<article class="case" id="caso-{esc(c["id"])}" lang="{esc(c["idioma"])}">\n<p class="case__tag"><strong>{esc(c["etiqueta"])}</strong></p>\n<h3>{esc(c["negocio"])}</h3>\n'
              +lado('Antes',c['antes'])+lado('Después',c['despues'])
              +(f'<h4>Qué se hizo</h4>\n<p>{esc(c["que_se_hizo"])}</p>\n' if c.get('que_se_hizo') else '')+enlace+'</article>\n')
    return out
