import re, json
from bs4 import BeautifulSoup, NavigableString, Comment
ROOT=str(__import__('pathlib').Path(__file__).resolve().parents[2])+'/'
PAGES=['index.html','contratar.html','guia-aparecer-en-ia-y-google-maps.html']
ATTRS=['alt','title','aria-label','placeholder','data-typing','data-short','data-price']
SKIP={'script','style','svg','code'}
def norm(s): return re.sub(r'\s+',' ',s).strip()
def has_words(s): return bool(re.search(r'[A-Za-zÁÉÍÓÚÑáéíóúñü]{2,}', s)) or bool(re.search(r'\d.*€|€.*\d', s))
def strings_of(html):
    soup=BeautifulSoup(html,'html.parser')
    out=[]
    for t in soup.find_all(string=True):
        if isinstance(t, Comment): continue
        if any(p.name in SKIP for p in t.parents if p.name): continue
        if any(('lang-switch' in (p.get('class') or [])) or ('footer-langs' in (p.get('class') or [])) for p in t.parents if p.name): continue
        s=norm(t)
        if s and has_words(s): out.append(s)
    for el in soup.find_all(True):
        for a in ATTRS:
            if el.has_attr(a) and has_words(el[a]): out.append(norm(el[a]))
        if el.name=='meta' and el.get('content') and (el.get('name') in ('description',) or (el.get('property') or '').startswith('og:') and el.get('property') in ('og:title','og:description')):
            out.append(norm(el['content']))
        if el.name=='input' and el.get('type') in ('radio','checkbox') and el.get('value') and has_words(el['value']):
            out.append(norm(el['value']))
        if el.name=='input' and el.has_attr('data-short'): out.append(norm(el['data-short']))
        if el.has_attr('data-price'): out.append(norm(el['data-price']))
    # JSON-LD
    for sc in soup.find_all('script', type='application/ld+json'):
        def walk(o):
            if isinstance(o,dict):
                for k,v in o.items():
                    if k in ('@type','@id','@context','url','logo','image','email','sameAs','priceCurrency','price','addressCountry','item','inLanguage','datePublished','dateModified','unitCode'): continue
                    walk(v)
            elif isinstance(o,list):
                for v in o: walk(v)
            elif isinstance(o,str) and has_words(o): out.append(norm(o))
        walk(json.loads(sc.string))
    # literales de los scripts en línea
    for sc in soup.find_all('script'):
        if sc.get('type')=='application/ld+json' or sc.get('src'): continue
        for m in re.finditer(r'"((?:[^"\\]|\\.)*)"', sc.string or ''):
            s=m.group(1)
            if ' ' in s and has_words(s): out.append(s)
    return out
if __name__=='__main__':
    allstr=[]
    for p in PAGES:
        for s in strings_of(open(ROOT+p).read()):
            if s not in allstr: allstr.append(s)
    print('\n'.join(allstr))
