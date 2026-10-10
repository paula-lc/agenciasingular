# Genera /ca/ y /en/ a partir de las páginas en español y las traducciones (ca.tsv, en.tsv)
import json, re, os, sys
from bs4 import BeautifulSoup, NavigableString, Comment, Doctype
from bs4.formatter import HTMLFormatter
from bs4.dammit import EntitySubstitution
class KeepOrder(HTMLFormatter):
    def attributes(self, tag):
        return list(tag.attrs.items())
FMT=KeepOrder(entity_substitution=EntitySubstitution.substitute_xml, void_element_close_prefix=None, empty_attributes_are_booleans=True)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lang_ui import switcher, footer_langs, url, LANGS
HERE=os.path.dirname(os.path.abspath(__file__))
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
PAGES=['index.html','contratar.html','guia-aparecer-en-ia-y-google-maps.html']
SITE='https://agenciasingular.es'
ATTRS=['alt','title','aria-label','placeholder','data-typing','data-short','data-price']
LOCALE={'ca':'ca_ES','en':'en_GB','es':'es_ES'}
ROOT_FILES=('favicon.svg','site.webmanifest','llms.txt','aviso-legal.html','privacidad.html')
def norm(s): return re.sub(r'\s+',' ',s).strip()
def load(lang):
    return json.load(open(os.path.join(HERE,'i18n',f'{lang}.json')))
def rel(v):
    if v.startswith('assets/') or v.split('?')[0] in ROOT_FILES: return '../'+v
    return v
def localize_url(u, lang):
    if not isinstance(u,str) or not u.startswith(SITE+'/'): return u
    path=u[len(SITE):]
    if path.startswith('/assets/') or path.split('#')[0].split('?')[0] in ['/'+f for f in ROOT_FILES]: return u
    return SITE+f'/{lang}'+path
SKIP_KEYS={'@type','@context','logo','image','email','sameAs','priceCurrency','price','addressCountry','inLanguage','datePublished','dateModified','unitCode','unitText','knowsLanguage','availableLanguage','contactType','areaServed'}
def tr_json(o, m, lang, parent_type=None):
    if isinstance(o,dict):
        t=o.get('@type'); t=t if isinstance(t,str) else (t[0] if isinstance(t,list) and t else None)
        for k,v in list(o.items()):
            if k in ('url','@id','item','mainEntityOfPage') and t not in ('ProfessionalService','Organization') and isinstance(v,str):
                o[k]=localize_url(v,lang); continue
            if k in SKIP_KEYS and not (k=='areaServed' and not isinstance(v,str)): continue
            o[k]=tr_json(v,m,lang,t)
        if t=='WebSite': o['inLanguage']=lang
        if t in ('Article','WebPage','FAQPage') and 'inLanguage' in o: o['inLanguage']=lang
        return o
    if isinstance(o,list): return [tr_json(v,m,lang,parent_type) for v in o]
    if isinstance(o,str): return m.get(norm(o), o)
    return o
def build(page, lang, m, ver):
    soup=BeautifulSoup(open(ROOT+page).read(),'html.parser')
    soup.html['lang']=lang
    # textos
    for t in list(soup.find_all(string=True)):
        if isinstance(t,(Comment,Doctype)): continue
        if t.parent and t.parent.name in ('script','style'): continue
        s=norm(t)
        if s in m and m[s]!=s:
            lead=t[:len(t)-len(t.lstrip())]; trail=t[len(t.rstrip()):]
            t.replace_with(NavigableString(lead+m[s]+trail))
    # atributos
    for el in soup.find_all(True):
        for a in ATTRS:
            if el.has_attr(a) and norm(el[a]) in m: el[a]=m[norm(el[a])]
        if el.name=='input' and el.get('type') in ('radio','checkbox') and el.get('value') and norm(el['value']) in m:
            el['value']=m[norm(el['value'])]
        if el.name=='meta' and el.get('content') and (el.get('name')=='description' or el.get('property') in ('og:title','og:description')):
            if norm(el['content']) in m: el['content']=m[norm(el['content'])]
        for a in ('href','src'):
            if el.has_attr(a): el[a]=rel(el[a])
        if el.has_attr('srcset'): el['srcset']=', '.join(rel(p.strip()) for p in el['srcset'].split(','))
    # scripts en línea y datos estructurados
    for sc in soup.find_all('script'):
        if sc.get('src'):
            continue
        if sc.get('type')=='application/ld+json':
            data=tr_json(json.loads(sc.string),m,lang)
            txt=json.dumps(data,ensure_ascii=False,indent=2)
            sc.string='\n'+'\n'.join('  '+l for l in txt.split('\n'))+'\n  '
            continue
        code=sc.string or ''
        def lit(mm):
            inner=mm.group(1)
            if inner in m: return json.dumps(m[inner],ensure_ascii=False)
            return mm.group(0)
        code=re.sub(r'"((?:[^"\\]|\\.)*)"', lit, code)
        code=code.replace('"assets/','"../assets/')
        if lang=='en': code=re.sub(r'rating: "(\d),(\d)"', r'rating: "\1.\2"', code)
        sc.string=code
    # i18n.js antes de main.js
    main=soup.find('script', src=re.compile(r'main\.js'))
    if main and not soup.find('script', src=re.compile(r'i18n\.js')):
        tag=soup.new_tag('script', src=f'../assets/js/i18n.js?v={ver}'); tag['defer']=''
        main.insert_before(tag); main.insert_before(NavigableString('\n  '))
    # cabecera: canonical, og, alternates
    canon=soup.find('link', rel='canonical')
    if canon: canon['href']=SITE+url(lang,page)
    ogurl=soup.find('meta', property='og:url')
    if ogurl: ogurl['content']=SITE+url(lang,page)
    ogloc=soup.find('meta', property='og:locale')
    if ogloc: ogloc['content']=LOCALE[lang]
    for l in soup.find_all('link', rel='alternate', hreflang=True): l.decompose()
    if canon:
        anchor=canon
        for c,_,_ in LANGS+[('x-default','','')]:
            tag=soup.new_tag('link', rel='alternate', hreflang=c, href=SITE+url('es' if c=='x-default' else c, page))
            anchor.insert_after(tag); anchor.insert_after(NavigableString('\n  ')); anchor=tag
    # selector de idioma y pie
    for d in soup.select('[data-lang-switch]'): d.replace_with(BeautifulSoup(switcher(lang,page),'html.parser'))
    for p in soup.select('p.footer-langs'): p.replace_with(BeautifulSoup(footer_langs(lang,page),'html.parser'))
    out=soup.decode(formatter=FMT)
    os.makedirs(ROOT+lang, exist_ok=True)
    open(ROOT+lang+'/'+page,'w').write(out)
def write_js():
    data={l: json.load(open(os.path.join(HERE,'i18n',f'js.{l}.json'))) for l in ('ca','en')}
    js='window.I18N='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'  # ya minificado; se genera, no se edita
    open(ROOT+'assets/js/i18n.js','w').write(js)
def missing():
    """Textos en castellano de las páginas que aún no tienen traducción"""
    from extract import strings_of
    out={}
    for lang in ('ca','en'):
        m=load(lang); miss=[]
        for page in PAGES:
            for s in strings_of(open(ROOT+page).read()):
                if s not in m and s not in miss and re.search(r'[a-záéíóúñ]{3,}', s) and not s.startswith('http'): miss.append(s)
        out[lang]=miss
    return out
if __name__=='__main__':
    ver=re.search(r'styles\.css\?v=(\d+)', open(ROOT+'index.html').read()).group(1)
    write_js()
    for lang in ('ca','en'):
        m=load(lang)
        for page in PAGES: build(page, lang, m, ver)
        print(lang,'ok')
