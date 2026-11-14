# Rutas de las páginas de servicio en cada idioma. La clave es el id del servicio en la cesta
# (el mismo de packs_data.py, services_data.py y contratar.html?servicio=<id>).
BASE={'es':'/servicios/','ca':'/ca/serveis/','en':'/en/services/'}
SLUGS={
 'cuidados-esenciales':           {'es':'cuidados-esenciales','ca':'cures-essencials','en':'essential-care'},
 'cuidados-esenciales-distancia': {'es':'cuidados-esenciales-a-distancia','ca':'cures-essencials-a-distancia','en':'essential-care-remote'},
 'web-una-pagina':                {'es':'web-de-una-pagina','ca':'web-d-una-pagina','en':'one-page-website'},
 'web-completa':                  {'es':'web-completa','ca':'web-completa','en':'full-website'},
 'fotografia':                    {'es':'fotografia-local','ca':'fotografia-local','en':'local-photography'},
 'trastienda':                    {'es':'la-trastienda','ca':'la-trastienda','en':'la-trastienda'},
}
def service_url(sid, lang): return BASE[lang]+SLUGS[sid][lang]+'/'
def page_of(sid): return service_url(sid,'es').lstrip('/')+'index.html'   # archivo en castellano, relativo a la raíz
# página en castellano -> {idioma: URL}
ROUTES={page_of(sid): {l: service_url(sid,l) for l in BASE} for sid in SLUGS}
SERVICE_PAGES=list(ROUTES)
# URL en castellano -> {idioma: URL}, para traducir enlaces
BY_ES_URL={r['es']: r for r in ROUTES.values()}
