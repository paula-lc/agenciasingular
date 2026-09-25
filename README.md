# Agencia Singular · Web

Web estática (HTML + CSS + JS, sin dependencias ni build) para **Agencia Singular**, agencia de marketing para pequeños negocios locales. Diseño basado en el Figma `AGENCIA_SINGULAR` (landing, nodo 67:11): paleta azul pizarra / crema / amarillo / carmesí / naranja, tipografías Archivo Black + Montserrat y el logo del leopardo.

## Estructura

```
index.html                              Landing principal
guia-aparecer-en-ia-y-google-maps.html  Guía gratuita (contenido SEO y captación)
aviso-legal.html · privacidad.html      Plantillas legales (completar datos)
404.html
assets/css/styles.css                   Estilos (tokens de marca en :root)
assets/js/main.js                       Menú, test de visibilidad, pestañas, formulario
assets/img/                             Logo, fotos e iconos exportados del Figma
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
| **Instagram** (`@agenciasingular`) | HTML y JSON-LD (`sameAs`) |
| **Datos legales** (titular, NIF, dirección) | `aviso-legal.html`, `privacidad.html` |
| **Ciudad o zona**: si trabajáis en una ciudad concreta, añadidla al JSON-LD (`address`, `areaServed`) y a los textos para reforzar el SEO local | `index.html` |

## Ver en local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

Se puede publicar tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting estático.
