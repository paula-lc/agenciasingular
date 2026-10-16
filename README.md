# Agencia Singular · Web

Web estática (HTML + CSS + JS, sin dependencias ni build) para **Agencia Singular**, agencia de marketing para pequeños negocios locales. Diseño basado en el Figma `AGENCIA_SINGULAR` (landing, nodo 67:11): paleta azul pizarra / crema / amarillo / carmesí / naranja, tipografías Archivo Black + Montserrat y el logo del leopardo.

## Estructura

```
index.html                              Landing principal
guia-aparecer-en-ia-y-google-maps.html  Guía gratuita (contenido SEO y captación)
contratar.html                          Formulario de contratación: un pack + los servicios que quieran (?servicio=pack-escaparate,redes-sociales)
ca/ · en/                               Versiones en catalán e inglés (generadas, no se editan a mano)
scripts/build/                          Generador de la web: ventanas de detalle, contratar, idiomas y sitemap
aviso-legal.html · privacidad.html      Plantillas legales (completar datos)
404.html
assets/src/css/styles.css               Estilos: FUENTE (tokens de marca en :root). Se edita aquí
assets/src/js/main.js                   Menú, test de visibilidad, pestañas, formulario: FUENTE. Se edita aquí
assets/css/ · assets/js/                Salida minificada que carga la web (generada, no se edita)
assets/img/                             Logo, fotos e iconos exportados del Figma
assets/img/hero/                        Fotos de los negocios que rotan en la portada
scripts/foto-hero.py                    Prepara una foto para la portada (tamaño y tono azul)
robots.txt · sitemap.xml · llms.txt     SEO y visibilidad en IA
site.webmanifest · favicon.svg
```

## Secciones de la landing

1. **Hero**: logo, eslogan, propuesta de valor y una demo animada de “la IA te recomienda”.
2. **Cinta de sectores**.
3. **Problema/empatía** (del Figma) + 3 datos de dolor.
4. **Tres sitios donde te buscan**: Google, Google Maps y las IA (GEO).
5. **Packs** con precio “desde” y el total con IVA debajo: Que te encuentren · Arranque · Escaparate (con la línea «¿Fuera de Barcelona?» que abre el **Escaparate remoto**, sin sesión de fotos) · Singular, y los **planes mensuales** Básico · Siempre visible, que están en **«Próximamente»** (botón «Avísame», no se pueden contratar).
6. **Servicios a la carta** (tarjetas del Figma) + banner de La Trastienda.
7. **Test de visibilidad** interactivo (8 preguntas → nota, consejos y pack recomendado).
8. **Sectores** en pestañas, con búsquedas reales de cada tipo de negocio.
9. **Proceso** en 4 pasos + compromisos.
10. **FAQ** (también en datos estructurados FAQPage).
11. **Contacto** “¿Tomamos un café virtual?” (del Figma), ampliado con sector, ciudad, enlace a la ficha de Google, WhatsApp e interés. Los botones «Diagnóstico gratis» y «Avísame» lo abren con la opción ya marcada (`data-interes="diagnostico"` o `"plan"`; también `?interes=diagnostico#contacto`). Con el diagnóstico elegido se envía como formulario «Diagnóstico».

## SEO y posicionamiento en IA incluidos

- Títulos, descripciones, canonical, Open Graph e imagen para compartir.
- Datos estructurados JSON-LD: `ProfessionalService`, `OfferCatalog` con los packs, `FAQPage`, `Article` y `BreadcrumbList`.
- `robots.txt` que permite explícitamente a Google, Bing y a los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot…).
- `llms.txt`: resumen en texto plano de la agencia para asistentes de IA.
- HTML semántico, contenido en formato pregunta-respuesta, imágenes WebP con `width/height`, accesibilidad (skip link, ARIA en pestañas, foco visible, `prefers-reduced-motion`).

## Antes de publicar: qué hay que revisar

| Qué | Dónde |
| --- | --- |
| **Dominio** (ahora `https://agenciasingular.es`) | `index.html`, la guía, las páginas legales, `sitemap.xml`, `robots.txt`, `llms.txt` |
| **Email** (`hola@agenciasingular.es`) | `assets/src/js/main.js` (`SITE.email`), HTML, `llms.txt` |
| **WhatsApp** (se oculta si está vacío) | `assets/src/js/main.js` → `SITE.whatsapp` |
| **Envío del formulario**: sin endpoint abre el correo del usuario. Recomendado: Google Apps Script (ver abajo) | `assets/src/js/main.js` → `SITE.formEndpoint` |
| **Precios** (packs: 290 € Que te encuentren / 490 € Arranque / 1.290 € Escaparate / 990 € Escaparate remoto / 2.490 € Singular; planes «Próximamente»: 59 €/mes Básico / 149 €/mes Siempre visible; fotografía desde 250 €, La Trastienda desde 120 €). Todos con el total con IVA al 21 % (tabla `VAT` en `modals.py` y `contratar.py`, y las tarjetas de `index.html`) | `index.html` (tarjetas, FAQ y JSON-LD), `scripts/build/modals.py` y `contratar.py`, `llms.txt` |
| **Analítica sin cookies** (GoatCounter): código de tu sitio en goatcounter.com; vacío = no se carga nada | `assets/src/js/main.js` → `SITE.goatcounter` |
| **Instagram** (`@agenciasingular.es`) | HTML y JSON-LD (`sameAs`) |
| **Datos legales** (titular, NIF, dirección) | `aviso-legal.html`, `privacidad.html` |
| **Ciudad o zona**: si trabajáis en una ciudad concreta, añadidla al JSON-LD (`address`, `areaServed`) y a los textos para reforzar el SEO local | `index.html` |

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

Se puede publicar tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting estático.

## Negocio de ejemplo de la portada (rota en cada visita)

La foto, la ficha de Maps y la conversación con la IA de la portada cambian en cada visita
entre floristería, taller, peluquería, estudio de uñas, cafetería y tienda de ropa. Solo se
muestran los negocios que tienen foto. Para activar uno:

1. `python3 scripts/foto-hero.py foto.jpg taller` (crea `assets/img/hero/taller.webp` y `.jpg`).
2. En `index.html`, en la lista de negocios del hero, cambia `photo: null` por `photo: "taller"`.

Si la conversación con la IA tapa lo importante de la foto, recórtala para subir el sujeto:
`python3 scripts/foto-hero.py foto.jpg ceramica --recorte 0.22,0.49,0.62` (izquierda, arriba y ancho, en
fracciones de la foto original). Al cambiar una foto, sube el número `v` del script del hero en
`index.html` para que los navegadores la recarguen.

## Mi propuesta (cesta)

En la portada, cada servicio y cada pack tiene un botón **Añadir**; lo elegido se guarda en el navegador
del visitante y aparece un contador en el menú que lleva a `contratar.html`. Allí se combinan un pack
(solo uno) con los servicios a la carta que quieran: los que ya incluye el pack salen como "incluido", las
preguntas comunes no se repiten y, si varios servicios sueltos forman un pack, se sugiere cambiar al pack.
Qué incluye cada pack está en `assets/src/js/main.js` → `PACK_INCLUDES`. Los planes mensuales no están en la cesta ni en `contratar.html` mientras sean «Próximamente».

## Recibir los formularios por email (informe en PDF + hoja de cálculo)

Con `scripts/formularios-google-apps-script.gs` cada solicitud llega a `hola@agenciasingular.es` como un
informe (en el cuerpo del email y en PDF adjunto) y se guarda como una fila en una hoja de Google
(Archivo → Descargar → Microsoft Excel para tenerla en Excel). Es gratis (hasta 100 emails al día).

1. En Google Drive, crea una hoja de cálculo nueva, por ejemplo "Solicitudes web".
2. En la hoja: **Extensiones → Apps Script**. Borra lo que haya y pega el contenido de
   `scripts/formularios-google-apps-script.gs`. Guarda.
3. **Implementar → Nueva implementación** → tipo **Aplicación web**. Ejecutar como: **Yo**.
   Quién tiene acceso: **Cualquier usuario**. Pulsa Implementar y acepta los permisos
   (Google avisará de que la app no está verificada: *Configuración avanzada → Ir a…*).
4. Copia la URL que termina en `/exec` y ponla en `assets/src/js/main.js` → `SITE.formEndpoint`.

Si cambias el script, vuelve a implementarlo (Gestionar implementaciones → editar → Nueva versión)
para que la URL siga siendo la misma.

Los diagnósticos gratis llegan con el asunto `[Diagnóstico] …` y las columnas `Ficha Google` y `WhatsApp`
(al final de la hoja; el script añade los encabezados que falten).

## Analítica sin cookies (GoatCounter)

1. Crea tu sitio gratis en goatcounter.com y copia el código (`micodigo` en `micodigo.goatcounter.com`).
2. Ponlo en `assets/src/js/main.js` → `SITE.goatcounter` y ejecuta `python3 scripts/build/build.py`.
3. `main.js` carga `count.js` en todas las páginas públicas (también `ca/` y `en/`). Los eventos se anotan con
   `track("nombre")` o con `data-track="nombre"` en un enlace o botón: `whatsapp`, `cta-diagnostico`,
   `pack-<id>-lo-quiero`, `plan-avisame`, `test-iniciado`, `test-terminado` y `form-<formulario>-enviado`.

Sin cookies no hace falta banner. `/propuestas/` y `/d/` no cargan `main.js`, así que no llevan analítica.

## Idiomas (castellano, catalán e inglés) y cómo regenerar la web

El castellano es el original (`index.html`, `contratar.html`, la guía). Las versiones en catalán (`/ca/`) e
inglés (`/en/`) se **generan** con las traducciones de `scripts/build/i18n/`:

- `ca.json` y `en.json`: texto en castellano → traducción (textos de las páginas).
- `js.ca.json` y `js.en.json`: textos del JavaScript (test, cesta, avisos del formulario). Se vuelcan en `assets/js/i18n.js` (generado).

Después de cambiar algo en castellano (o el contenido de las ventanas en `scripts/build/services_data.py` y `modals.py`, o
el formulario en `contratar.py`), ejecuta:

```bash
python3 scripts/build/build.py
```

(En Windows: `python` en vez de `python3`, y `set PYTHONUTF8=1` antes. Hace falta `pip install beautifulsoup4` y Node.js.)

Regenera las ventanas de detalle, `contratar.html`, el selector de idioma, las páginas `/ca/` y `/en/` y el `sitemap.xml`.
Si hay textos nuevos sin traducir, el script los lista: añádelos a `ca.json` y `en.json` y vuelve a ejecutarlo
(mientras tanto se quedan en castellano). Cada página enlaza sus otras versiones con `hreflang`, y el selector de idioma
de la cabecera lleva a la misma página en el otro idioma.
