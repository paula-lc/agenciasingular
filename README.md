# Agencia Singular · Web

Web estática (HTML + CSS + JS, sin dependencias ni build) para **Agencia Singular**, agencia de marketing para pequeños negocios locales. Diseño basado en el Figma `AGENCIA_SINGULAR` (landing, nodo 67:11): paleta azul pizarra / crema / amarillo / carmesí / naranja, tipografías Archivo Black + Montserrat y el logo del leopardo.

## Estructura

```
index.html                              Landing principal
guia-aparecer-en-ia-y-google-maps.html  Guía gratuita (contenido SEO y captación)
contratar.html                          Formulario de contratación: un pack + los servicios que quieran (?servicio=pack-escaparate,sem)
aviso-legal.html · privacidad.html      Plantillas legales (completar datos)
404.html
assets/css/styles.css                   Estilos (tokens de marca en :root)
assets/js/main.js                       Menú, test de visibilidad, pestañas, formulario
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
5. **Packs** con precio “desde”: Que te encuentren · Escaparate · Singular · Siempre visible.
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
| **Dominio** (ahora `https://www.agenciasingular.es`) | `index.html`, la guía, las páginas legales, `sitemap.xml`, `robots.txt`, `llms.txt` |
| **Email** (`hola@agenciasingular.es`) | `assets/js/main.js` (`SITE.email`), HTML, `llms.txt` |
| **WhatsApp** (se oculta si está vacío) | `assets/js/main.js` → `SITE.whatsapp` |
| **Envío del formulario**: sin endpoint abre el correo del usuario. Recomendado: Formspree, Web3Forms o Netlify Forms | `assets/js/main.js` → `SITE.formEndpoint` |
| **Precios de los packs** (propuestos: 290 € / 1.290 € / 2.490 € / 149 €/mes) | `index.html` (tarjetas, FAQ y JSON-LD), `llms.txt` |
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
Qué incluye cada pack está en `assets/js/main.js` → `PACK_INCLUDES`.
