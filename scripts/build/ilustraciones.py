# Ilustraciones de los menús y de la carta: SVG en línea, solo con la paleta (clases .f-* de styles.css)
# y el semitono compartido (#semitono, definido una sola vez en el sprite de index.html).
# Sin texto dentro: todo lo que se lee va en HTML.
SEMITONO = ('<pattern id="semitono" width="6" height="6" patternUnits="userSpaceOnUse">'
            '<circle class="f-p" cx="3" cy="3" r="1.2"/></pattern>')

def svg(cuerpo, vb='0 0 200 160'):
    return f'<svg class="ilus" viewBox="{vb}" aria-hidden="true" focusable="false">{cuerpo}</svg>'

ILUS = {
 # Polaroid de un salón con un teléfono de disco; su «pantalla» es una ficha de Google con estrellas y botón
 'telefono': svg(
   '<rect class="f-c" x="0" y="0" width="200" height="160"/>'
   '<rect class="f-ht" x="0" y="112" width="200" height="48" stroke="none"/>'
   '<path class="f-n" d="M0 112H200"/>'
   '<path class="f-m" d="M18 20h44v70H18z"/><path class="f-c" d="M24 26h32v58H24z"/>'
   '<path class="f-n" d="M150 18v40M140 58h20"/><circle class="f-m" cx="150" cy="64" r="7"/>'
   '<path class="f-r" d="M64 136l8-46h76l8 46z"/>'
   '<path class="f-r" d="M58 92c0-14 104-14 104 0v8c0 6-12 6-12 0v-4H70v4c0 6-12 6-12 0z"/>'
   '<rect class="f-c" x="84" y="100" width="52" height="32"/>'
   '<path class="f-m" d="M90 108l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" stroke-width="1.5"/>'
   '<path class="f-m" d="M104 108l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" stroke-width="1.5"/>'
   '<path class="f-m" d="M118 108l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" stroke-width="1.5"/>'
   '<rect class="f-p" x="92" y="122" width="36" height="7"/>'
   '<path class="f-n" d="M150 104c18 4 24 20 14 34"/>'),
 # Escaparate con rótulo de neón y televisor de tubo con la web; el jaguar asoma
 'escaparate': svg(
   '<rect class="f-c" x="0" y="0" width="200" height="160"/>'
   '<path class="f-r" d="M10 14h180l-8 22H18z"/>'
   '<path class="f-c" d="M40 14l-4 22M70 14l-2 22M100 14v22M130 14l2 22M160 14l4 22" />'
   '<rect class="f-ht" x="18" y="44" width="164" height="104"/>'
   '<rect class="f-n" x="18" y="44" width="164" height="104"/>'
   '<rect class="f-n neon" x="34" y="52" width="70" height="20" rx="10"/>'
   '<path class="f-n neon" d="M44 62c6-8 10 8 16 0s10 8 16 0 10 8 16 0"/>'
   '<rect class="f-p" x="96" y="80" width="70" height="56" rx="6"/>'
   '<rect class="f-c" x="104" y="87" width="46" height="40" rx="8"/>'
   '<path class="f-r" d="M110 94h34v8h-34z" stroke-width="2"/><path class="f-n" d="M110 108h26M110 114h20" stroke-width="2"/>'
   '<rect class="f-m" x="128" y="118" width="16" height="6" stroke-width="2"/>'
   '<circle class="f-m" cx="158" cy="94" r="3"/><circle class="f-m" cx="158" cy="104" r="3"/>'
   '<path class="f-n" d="M112 136l-6 10M150 136l6 10"/>'
   '<path class="f-m" d="M30 148c0-26 12-40 30-40s30 14 30 40z"/>'
   '<path class="f-m" d="M38 116l-4-14 14 8M82 116l4-14-14 8"/>'
   '<circle class="f-p" cx="50" cy="126" r="3.5"/><circle class="f-p" cx="70" cy="126" r="3.5"/>'
   '<path class="f-r" d="M56 134h8l-4 5z" stroke-width="2"/>'
   '<circle class="f-p" cx="42" cy="140" r="2"/><circle class="f-p" cx="78" cy="140" r="2"/><circle class="f-p" cx="60" cy="116" r="2"/>'),
 # Sobre con sellos, mapa de España con chincheta y móvil con la guía de fotos
 'sobre': svg(
   '<rect class="f-c" x="0" y="0" width="200" height="160"/>'
   '<path class="f-ht" d="M104 30l40-10 34 6 12 20-10 22-6 26-30 10-34-6-14-22 4-24z"/>'
   '<path class="f-n" d="M104 30l40-10 34 6 12 20-10 22-6 26-30 10-34-6-14-22 4-24z"/>'
   '<path class="f-r" d="M150 40c-8 0-12 6-12 11 0 8 12 20 12 20s12-12 12-20c0-5-4-11-12-11z"/><circle class="f-c" cx="150" cy="51" r="4"/>'
   '<rect class="f-c" x="12" y="62" width="104" height="70" transform="rotate(-6 64 97)"/>'
   '<path class="f-n" d="M16 70l50 34 50-44" transform="rotate(-6 64 97)"/>'
   '<rect class="f-r" x="84" y="66" width="20" height="24" stroke-dasharray="3 2" transform="rotate(-6 64 97)"/>'
   '<rect class="f-m" x="62" y="70" width="18" height="22" stroke-dasharray="3 2" transform="rotate(-6 64 97)"/>'
   '<rect class="f-p" x="146" y="92" width="34" height="58" rx="5"/>'
   '<rect class="f-c" x="150" y="100" width="26" height="38"/>'
   '<rect class="f-n" x="156" y="112" width="14" height="10" rx="2" stroke-width="2"/><circle class="f-n" cx="163" cy="117" r="2.5" stroke-width="2"/>'),
 # Cámara de fuelle antigua
 'camara': svg(
   '<rect class="f-c" x="0" y="0" width="200" height="160"/>'
   '<rect class="f-ht" x="0" y="124" width="200" height="36" stroke="none"/>'
   '<rect class="f-p" x="40" y="44" width="44" height="64"/>'
   '<path class="f-r" d="M84 50l14 4v48l-14 4zM98 54l14 4v40l-14 4zM112 58l14 4v32l-14 4z"/>'
   '<rect class="f-p" x="126" y="58" width="16" height="44"/><circle class="f-m" cx="150" cy="80" r="14"/><circle class="f-c" cx="150" cy="80" r="6"/>'
   '<rect class="f-m" x="52" y="34" width="20" height="10"/>'
   '<path class="f-n" d="M62 108v22M50 130l12-22 12 22"/>'),
 # Taza de café humeante
 'cafe': svg(
   '<rect class="f-c" x="0" y="0" width="200" height="160"/>'
   '<ellipse class="f-ht" cx="100" cy="132" rx="70" ry="14"/><ellipse class="f-n" cx="100" cy="132" rx="70" ry="14"/>'
   '<path class="f-r" d="M58 70h84l-8 56H66z"/><path class="f-n" d="M142 82c18 0 18 30-4 30"/>'
   '<ellipse class="f-p" cx="100" cy="70" rx="42" ry="8"/>'
   '<path class="f-n" d="M84 56c-8-8 8-14 0-24M100 54c-8-8 8-14 0-24M116 56c-8-8 8-14 0-24"/>'
   '<path class="f-c" d="M76 96h48" stroke-dasharray="4 4"/>'),
 # Plano a lápiz
 'plano': svg(
   '<rect class="f-c" x="0" y="0" width="200" height="160"/>'
   '<rect class="f-c" x="26" y="22" width="130" height="110" transform="rotate(-4 91 77)"/>'
   '<path class="f-n" d="M34 50h120M34 78h120M34 106h120M62 26v104M96 26v104M130 26v104" stroke-width="1" transform="rotate(-4 91 77)"/>'
   '<path class="f-n" d="M44 40h60v40H44zM104 60h40v50h-40zM44 80h40v30H44z" stroke-width="3" transform="rotate(-4 91 77)"/>'
   '<path class="f-m" d="M150 40l30 80-8 4-30-80z"/><path class="f-r" d="M142 44l8-4-4-10z"/><path class="f-p" d="M172 124l8-4 2 10z"/>'),
}
