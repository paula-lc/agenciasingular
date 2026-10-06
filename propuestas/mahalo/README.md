# Mahalo Vintage · propuesta de rediseño

Propuesta de diseño (concepto no oficial) para la web de **Mahalo Vintage**, tienda de ropa vintage y sportswear de segunda mano de Barcelona.
Es una web estática (HTML + CSS + JavaScript, sin dependencias ni proceso de compilación).

> ⚠️ Es un concepto de diseño hecho con fines de presentación. Los logotipos, fotografías, textos y datos de producto
> pertenecen a Mahalo Vintage ([mahalovintage.com](https://mahalovintage.com)) y se usan solo para la demostración.
> El carrito, el pago, el registro y el formulario de contacto están **simulados**: no se envía ni se cobra nada.

## Qué incluye

- Portada con colección (118 piezas reales), filtros por categoría y talla, ficha rápida, favoritos y cesta.
- Checkout a pantalla completa (simulado), registro / entrar (simulado) y "Mis pedidos".
- Páginas: Sobre nosotras, Contacto, Envíos, Términos y condiciones, Política de privacidad.
- Tres idiomas: español, inglés y catalán (selector en la cabecera).
- Adaptada a móvil, tablet y escritorio.

## Estructura

```
index.html                 Tienda (portada)
sobre-nosotras.html        Sobre nosotras
contacto.html              Contacto
envios.html                Envíos
terminos.html              Términos y condiciones
privacidad.html            Política de privacidad
assets/
  styles.css, pages.css    Estilos (comunes / páginas interiores)
  app.js                   Tienda: rejilla, cesta, checkout simulado
  shell.js                 Menú, cuenta simulada, plantas y flores interactivas
  i18n.js                  Todos los textos en es / en / ca
  slides.js, page.js       Carruseles de fotos, contadores y detalles de las páginas interiores
  products.js, stores.js   Datos de productos y fotos de tienda
  products/, stores/       Fotografías
  deco/, img/, fonts/      Decoración SVG, logotipo y tipografías (Fraunces, Nunito)
```

## Ver la web en local

Basta con abrir `index.html` con doble clic. Si prefieres un servidor local (con Python instalado):

```bash
python -m http.server 5173
```

y abre <http://localhost:5173>.

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `mahalo-vintage-propuesta`).
2. Desde esta carpeta:

```bash
git init
git add .
git commit -m "Propuesta de rediseño Mahalo Vintage"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mahalo-vintage-propuesta.git
git push -u origin main
```

3. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
4. En un par de minutos estará en `https://TU_USUARIO.github.io/mahalo-vintage-propuesta/`.

Las páginas llevan `noindex` y hay un `robots.txt` que pide a los buscadores no indexarlas.

## Editar textos y datos

- **Textos** (en los tres idiomas): `assets/i18n.js`. Las páginas interiores llevan en el HTML el texto en español como valor por defecto.
- **Productos**: `assets/products.js` (nombre, precio, talla, color, fotos).
- **Tarifas de envío y envío gratis**: constantes `RATES` y `FREE_FROM` al principio de `assets/app.js`.
- Si cambias un archivo `.css` o `.js` y no ves el cambio, recarga con `Ctrl+F5`.
