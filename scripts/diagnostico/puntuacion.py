"""Nota y semáforo de un diagnóstico.

Usa las mismas reglas que el test de visibilidad de la web (assets/src/js/main.js):
  · cada apartado vale 0, 1 o 2 puntos (como las opciones de cada pregunta del test);
  · nota = puntos / (2 × apartados) × 100, redondeada;
  · los tramos de la nota y sus títulos ("Eres casi invisible"…) se LEEN de main.js, no se copian.
Los umbrales de reseñas (10 y 50) y de fotos (10) salen de las propias preguntas y consejos del test.
Si main.js cambia de forma que ya no se pueden leer, el script falla con un aviso en vez de inventarse otros criterios.
"""
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAIN_JS = os.path.join(RAIZ, "assets", "src", "js", "main.js")

# Umbrales tomados de las preguntas del test: "Más de 50" = 2, "Entre 10 y 50" = 1, "Menos de 10" = 0
RESENAS_VERDE, RESENAS_AMBAR = 50, 10
# Consejo del test: "al menos 10 fotos reales"
FOTOS_VERDE, FOTOS_AMBAR = 10, 3
# Reseñas sin responder (el consejo del test: "responde a todas, también a las malas")
SIN_RESPONDER_VERDE, SIN_RESPONDER_AMBAR = 20, 50
# Posición en Google Maps: el "paquete local" muestra 3 negocios
POSICION_VERDE, POSICION_AMBAR = 3, 10


def tramos_del_test():
    """Lee de main.js los cortes de la nota y sus títulos: [(corte, título), …, (None, título)]."""
    js = open(MAIN_JS, encoding="utf-8").read()
    bloque = re.search(r"if \(score < (\d+)\) \{\s*title = t\(\"([^\"]+)\"\);.*?"
                       r"else if \(score < (\d+)\) \{\s*title = t\(\"([^\"]+)\"\);.*?"
                       r"else \{\s*title = t\(\"([^\"]+)\"\);", js, re.S)
    if not bloque:
        raise SystemExit("No puedo leer los tramos de la nota en assets/src/js/main.js (¿ha cambiado showResult?). "
                         "Actualiza scripts/diagnostico/puntuacion.py.")
    a, ta, b, tb, tc = bloque.groups()
    return [(int(a), ta), (int(b), tb), (None, tc)]


# El test de la web habla en singular y es más directo ("Eres casi invisible"); en la hoja que se deja en el local
# se usa el mismo tramo (mismos cortes) con un titular más suave.
FRASES = [
    "Hay mucho margen, y los primeros cambios se notan rápido",
    "Buena base, con huecos fáciles de cerrar",
    "Lo estáis haciendo muy bien: toca mantenerlo",
]


def titulo_de(nota):
    for i, (corte, _) in enumerate(tramos_del_test()):
        if corte is None or nota < corte:
            return FRASES[i]


def color(pts):
    return {2: "verde", 1: "ambar", 0: "rojo"}[pts]


def evaluar(d):
    """Devuelve (apartados, nota, titulo). Cada apartado: dict(id, nombre, pts, color, detalle)."""
    f = d["ficha"]
    a = []

    # 1. Ficha de Google completa (pregunta 1 del test)
    checks = [("foto principal", f["foto_principal_ok"]), ("horario completo", f["horario_completo"]),
              ("servicios con precio", f["servicios_con_precio"]), ("categorías secundarias", f["categorias_secundarias"] > 0)]
    hechas = [n for n, ok in checks if ok]
    faltan = [n for n, ok in checks if not ok]
    pts = 2 if not faltan else (1 if hechas else 0)
    a.append(dict(id="ficha", nombre="Ficha de Google completa", pts=pts,
                  detalle=("Está todo: foto principal, horario, servicios con precio y categorías." if not faltan
                           else "Falta: " + ", ".join(faltan) + ".")))

    # 2. Reseñas: cuántas (pregunta 2) y si se responden
    n = f["resenas"]
    por_cantidad = 2 if n > RESENAS_VERDE else (1 if n >= RESENAS_AMBAR else 0)
    sin = f["resenas_sin_responder_pct"]
    por_respuesta = 2 if sin <= SIN_RESPONDER_VERDE else (1 if sin <= SIN_RESPONDER_AMBAR else 0)
    pts = (por_cantidad + por_respuesta) // 2  # media hacia abajo: 57 reseñas (2) con casi todas sin responder (0) = ámbar
    pendientes = int(n * sin / 100)
    txt = f"{n} reseñas con {str(f['valoracion']).replace('.', ',')} de media."
    if por_respuesta < 2:
        txt += f" Sin responder: {sin} % (unas {pendientes})."
    elif por_cantidad < 2:
        txt += " Pedir alguna más ayuda."
    a.append(dict(id="resenas", nombre="Reseñas", pts=pts, detalle=txt))

    # 3. Web o reservas enlazadas (preguntas 3 y 4)
    ok = f["web_o_reservas_enlazado"]
    a.append(dict(id="web", nombre="Web o reservas enlazadas", pts=2 if ok else 0,
                  detalle="El botón lleva a vuestra web o sistema de reservas." if ok
                  else "Quien os encuentra no tiene un botón claro para reservar o saber más."))

    # 4. Fotos (pregunta 7)
    n = f["fotos"]
    pts = 2 if n >= FOTOS_VERDE else (1 if n >= FOTOS_AMBAR else 0)
    a.append(dict(id="fotos", nombre="Fotos", pts=pts,
                  detalle=f"{n} fotos subidas." + ("" if pts == 2 else f" Lo ideal son {FOTOS_VERDE} o más, reales y de vuestro trabajo.")))

    # 5. Constancia (pregunta 8)
    ok = f["publicaciones_ultimo_mes"]
    a.append(dict(id="constancia", nombre="Novedades en la ficha", pts=2 if ok else 0,
                  detalle="Hay publicaciones del último mes." if ok else "Ninguna publicación en el último mes."))

    total = sum(x["pts"] for x in a)
    nota = round(total / (len(a) * 2) * 100)
    for x in a:
        x["color"] = color(x["pts"])
    return a, nota, titulo_de(nota)


def color_posicion(pos):
    if pos is not None and pos <= POSICION_VERDE:
        return "verde"
    if pos is not None and pos <= POSICION_AMBAR:
        return "ambar"
    return "rojo"
