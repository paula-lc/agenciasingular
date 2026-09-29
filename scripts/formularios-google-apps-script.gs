/**
 * Agencia Singular · Receptor de los formularios de la web
 *
 * Cada vez que alguien envía un formulario (contratar o café virtual):
 *   1. Guarda una fila en la pestaña "Solicitudes" de esta hoja de cálculo (se puede descargar como Excel).
 *   2. Envía un email a DESTINO con el informe y el mismo informe en PDF adjunto.
 *      Al pulsar "Responder" en el email se contesta directamente al cliente.
 *
 * Instalación (5 minutos): ver README.md → "Recibir los formularios por email".
 */

const DESTINO = "hola@agenciasingular.es";
const HOJA = "Solicitudes";
const COLUMNAS = ["Fecha", "Formulario", "Nombre", "Negocio", "Email", "Teléfono", "Servicios", "Sector", "Ciudad o barrio", "Respuestas"];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.web_hp) return respuesta_(); // bot

  const limpio = (v, max) => String(v || "").trim().slice(0, max || 300);
  const datos = {
    formulario: limpio(p.formulario, 60) || "Formulario web",
    asunto: limpio(p.asunto, 200) || "Nueva solicitud desde la web",
    nombre: limpio(p.nombre, 120),
    negocio: limpio(p.negocio, 160),
    email: limpio(p.email, 160),
    telefono: limpio(p.telefono, 40),
    servicios: limpio(p.servicios, 400),
    sector: limpio(p.sector, 80),
    ciudad: limpio(p.ciudad, 120),
    pagina: limpio(p.pagina, 300),
  };
  let secciones = [];
  try {
    secciones = JSON.parse(p.secciones || "[]")
      .slice(0, 20)
      .map((s) => ({
        titulo: limpio(s.titulo, 120),
        filas: (s.filas || []).slice(0, 40).map((f) => [limpio(f[0], 200), limpio(f[1], 3000)]),
      }));
  } catch (err) { /* sin detalle */ }
  const fecha = new Date();

  // 1. Hoja de cálculo
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(HOJA);
    hoja.appendRow(COLUMNAS);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold").setBackground("#3e6083").setFontColor("#ffffff");
    hoja.setFrozenRows(1);
  }
  const texto = secciones.map((s) => s.titulo + "\n" + s.filas.map((f) => "· " + f[0] + ": " + f[1]).join("\n")).join("\n\n");
  // Evita que un texto que empiece por = + - @ se interprete como fórmula
  const celda = (v) => (/^[=+\-@]/.test(v) ? "'" + v : v);
  hoja.appendRow([fecha, datos.formulario, datos.nombre, datos.negocio, datos.email, datos.telefono,
    datos.servicios, datos.sector, datos.ciudad, texto].map((v) => (v instanceof Date ? v : celda(v))));

  // 2. Informe por email + PDF
  const html = informe_(datos, secciones, fecha, libro.getUrl());
  const nombrePdf = ("Solicitud " + (datos.negocio || datos.nombre || "web") + " " +
    Utilities.formatDate(fecha, "Europe/Madrid", "yyyy-MM-dd HH.mm")).replace(/[\\/:*?"<>|]/g, "") + ".pdf";
  const pdf = Utilities.newBlob(html, MimeType.HTML, "informe.html").getAs(MimeType.PDF).setName(nombrePdf);
  const opciones = { to: DESTINO, subject: datos.asunto, htmlBody: html, attachments: [pdf], name: "Web Agencia Singular" };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) opciones.replyTo = datos.email;
  MailApp.sendEmail(opciones);

  return respuesta_();
}

// Para comprobar que la implementación funciona: abre la URL en el navegador
function doGet() {
  return ContentService.createTextOutput("Formulario de Agencia Singular activo ✔");
}

function respuesta_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function esc_(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, "<br>");
}

function informe_(d, secciones, fecha, urlHoja) {
  const azul = "#3e6083", crema = "#f4f1e2", amarillo = "#fab419", carmesi = "#bf2e59";
  const fila = (k, v) => v ? `<tr><td style="padding:7px 12px 7px 0;color:${azul};font-weight:bold;vertical-align:top;width:38%">${esc_(k)}</td><td style="padding:7px 0;vertical-align:top">${esc_(v)}</td></tr>` : "";
  const bloque = (titulo, filas) => `
    <h2 style="font-family:Arial Black,Arial,sans-serif;font-size:14px;text-transform:uppercase;color:${carmesi};margin:26px 0 8px;letter-spacing:.5px">${esc_(titulo)}</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:2px solid ${azul}">${filas}</table>`;
  const cuando = Utilities.formatDate(fecha, "Europe/Madrid", "dd/MM/yyyy 'a las' HH:mm");
  return `<!doctype html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;background:${crema};font-family:Arial,Helvetica,sans-serif;color:#1f3349">
    <div style="max-width:680px;margin:0 auto;padding:28px">
      <div style="background:${azul};color:#fff;padding:22px 24px;border-radius:12px;border-bottom:5px solid ${amarillo}">
        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.85">Agencia Singular · ${esc_(d.formulario)}</div>
        <div style="font-family:Arial Black,Arial,sans-serif;font-size:22px;margin-top:6px;color:${amarillo}">${esc_(d.negocio || d.nombre || "Nueva solicitud")}</div>
        <div style="font-size:13px;margin-top:6px">${esc_(cuando)}</div>
      </div>
      ${bloque("Resumen", fila("Servicios", d.servicios) + fila("Nombre", d.nombre) + fila("Negocio", d.negocio) +
        fila("Email", d.email) + fila("Teléfono", d.telefono) + fila("Sector", d.sector) + fila("Ciudad o barrio", d.ciudad))}
      ${secciones.map((s) => bloque(s.titulo, s.filas.map((f) => fila(f[0], f[1])).join(""))).join("")}
      <p style="margin-top:28px;font-size:12px;color:#5b6b7c">Enviado desde ${esc_(d.pagina || "la web")}. Responde a este email para contestar al cliente.
      ${urlHoja ? `<br>Todas las solicitudes: <a href="${esc_(urlHoja)}" style="color:${azul}">hoja de solicitudes</a>.` : ""}</p>
    </div>
  </body></html>`;
}
