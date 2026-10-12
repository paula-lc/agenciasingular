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
hola/                                   Página de destino de los QR impresos (noindex, solo castellano)
d/<slug>/                               Diagnósticos personalizados (generados, noindex)
diagnosticos/ · scripts/diagnostico/    Datos de cada diagnóstico y el generador de página, PDF y QR
scripts/foto-hero.py                    Prepara una foto para la portada (tamaño y tono azul)
robots.txt · sitemap.xml · llms.txt     SEO y visibilidad en IA
site.webmanifest · favicon.svg
```

## Secciones de la landing

1. **Hero**: logo, eslogan, propuesta de valor y una demo animada de “la IA te recomienda”.
2. **Cinta de sectores**.
3. **Problema/empatía** (del Figma) + 3 datos de dolor.
4. **Tres sitios donde te buscan**: Google, Google Maps y las IA (GEO).
5. **Packs** con precio “desde”: Que te encuentren · Arranque · Escaparate · Singular, y **planes mensuales**: Básico · Siempre visible.
6. **Servicios a la carta** (tarjetas del Figma) + banner de La Trastienda.
7. **Test de visibilidad** interactivo (8 preguntas → nota, consejos y pack recomendado).
8. **Sectores** en pestañas, con búsquedas reales de cada tipo de negocio.
9. **Proceso** en 4 pasos + compromisos.
10. **FAQ** (también en datos estructurados FAQPage).
11. **Contacto** “¿Tomamos un café virtual?” (del Figma), ampliado con sector e interés.

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
| **Precios** (packs: 290 € Que te encuentren / 490 € Arranque / 1.290 € Escaparate / 2.490 € Singular; planes: 59 €/mes Básico / 149 €/mes Siempre visible; fotografía desde 250 €, La Trastienda desde 120 €) | `index.html` (tarjetas, FAQ y JSON-LD), `scripts/build/modals.py` y `contratar.py`, `llms.txt` |
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
Qué incluye cada pack está en `assets/src/js/main.js` → `PACK_INCLUDES`.

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

Regenera las ventanas de detalle, `contratar.html`, el selector de idioma, las páginas `/ca/` y `/en/` y el `sitemap.xml`.
Si hay textos nuevos sin traducir, el script los lista: añádelos a `ca.json` y `en.json` y vuelve a ejecutarlo
(mientras tanto se quedan en castellano). Cada página enlaza sus otras versiones con `hreflang`, y el selector de idioma
de la cabecera lleva a la misma página en el otro idioma.

## Captación presencial: /hola/, diagnósticos y medición

**Flujo (menos de 15 minutos por visita):**

1. Mira la ficha de Google Maps del negocio y copia `diagnosticos/_plantilla.json` a `diagnosticos/<slug>.json` (el archivo se llama como el slug). Rellénalo.
2. Una vez: `pip install -r scripts/diagnostico/requirements.txt && playwright install chromium`.
3. `python3 scripts/diagnostico/build.py diagnosticos/<slug>.json` genera `d/<slug>/` (página), `salida/<slug>.pdf` (A4 para imprimir) y `salida/<slug>-qr.png`.
4. Imprime el PDF. Sube `d/<slug>/` a la web **solo si el negocio ya ha dado permiso** (en la tarjeta, el QR lleva a `/hola/?n=<slug>&src=visita`, que enseña el diagnóstico si existe; sin él, muestra la versión genérica).
5. `"dorso": true` en el JSON añade una segunda cara con la oferta. Para los QR de la tarjeta y los flyers usa `/hola/?src=tarjeta` y `/hola/?src=flyer`.

La nota usa los mismos cortes que el test de la web (los lee de `assets/src/js/main.js`) pero solo sobre lo que se ve en la ficha: no puntúa IA ni páginas por servicio. `/hola/` y `/d/` llevan `noindex, nofollow` y no están en el sitemap, pero **cualquiera con el enlace puede verlos**.

**Medición sin cookies (GoatCounter):** crea una cuenta gratis en goatcounter.com y escribe el código de tu panel en `assets/src/js/main.js` → `SITE.goatcounter`; luego `python3 scripts/build/build.py`. Mientras esté vacío no se mide nada. Eventos (pestaña *Events*): `hola/<src>/<slug>`, `whatsapp/<página>`, `formulario/<tipo>`, `test-iniciado`, `test-terminado`, `test-contacto`. Cloudflare Web Analytics no cuenta eventos, por eso no se ha implementado.

**Foto y opiniones de `/hola/`:** guarda tu foto como `assets/img/paula.webp` y pon `fotoPaula: true` en `assets/src/js/hola.js`. El bloque de opiniones sigue oculto hasta que añadas opiniones reales a `OPINIONES` en ese archivo.

**Apps Script:** el script añade las columnas `Origen` y `Slug` (también a una hoja que ya exista). Hay que **volver a implementarlo a mano** (Gestionar implementaciones → editar → Nueva versión).
