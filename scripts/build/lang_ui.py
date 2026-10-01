# Selector de idioma (cabecera) y enlaces de idioma (pie) para cada página
import re
LANGS=[('es','Español','ES'),('ca','Català','CA'),('en','English','EN')]
CUR=' aria-current="true"'
LABEL={'es':'Idioma','ca':'Idioma','en':'Language'}
def url(lang, page):
    base='/' if lang=='es' else f'/{lang}/'
    return base if page=='index.html' else base+page
def switcher(lang, page):
    cur=[l for l in LANGS if l[0]==lang][0]
    items=''.join(f'<li><a href="{url(c,page)}" lang="{c}" hreflang="{c}"{CUR if c==lang else ""}>{name}</a></li>' for c,name,_ in LANGS)
    return (f'<div class="lang-switch" data-lang-switch>'
            f'<button type="button" class="lang-switch__btn" aria-expanded="false" aria-controls="lang-menu" aria-label="{LABEL[lang]}: {cur[1]}">{cur[2]}</button>'
            f'<ul class="lang-switch__menu" id="lang-menu" hidden>{items}</ul></div>')
def footer_langs(lang, page):
    links=' · '.join(f'<a href="{url(c,page)}" lang="{c}" hreflang="{c}"{CUR if c==lang else ""}>{name}</a>' for c,name,_ in LANGS)
    return f'<p class="footer-langs">{links}</p>'
def apply(html, lang, page):
    html=re.sub(r'<div class="lang-switch" data-lang-switch>.*?</ul></div>\s*','',html,flags=re.S)
    html=re.sub(r'\s*<p class="footer-langs">.*?</p>','',html,flags=re.S)
    html=html.replace('<a class="nav__ig"', switcher(lang,page)+'\n        <a class="nav__ig"',1)
    html=re.sub(r'(<div class="footer-bottom"[^>]*>)', lambda m: m.group(1)+'\n        '+footer_langs(lang,page), html, count=1)
    # hreflang en la cabecera
    html=re.sub(r'\n\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">','',html)
    alts=''.join(f'\n  <link rel="alternate" hreflang="{c}" href="https://www.agenciasingular.es{url(c,page)}">' for c,_,_ in LANGS)
    alts+=f'\n  <link rel="alternate" hreflang="x-default" href="https://www.agenciasingular.es{url("es",page)}">'
    html=re.sub(r'(\n  <link rel="canonical" href="[^"]*">)', lambda m: m.group(1)+alts, html, count=1)
    return html
