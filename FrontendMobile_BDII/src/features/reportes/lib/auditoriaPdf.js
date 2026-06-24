import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { formatFechaHora, formatMoney } from "../../../lib/formatters";

const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const TIPO_COLOR = {
    compra: "#1d4ed8",
    transferencia: "#002b61",
    validacion: "#047857",
};

const buildHtml = (rows, { tipoFiltro } = {}) => {
    const generado = formatFechaHora(new Date().toISOString());
    const filtroLabel = tipoFiltro ? `Filtro: ${escapeHtml(tipoFiltro)}` : "Todos los tipos";
    const totalMonto = rows.reduce((acc, r) => acc + (Number(r.monto) || 0), 0);

    const filas = rows
        .map((r) => {
            const color = TIPO_COLOR[r.tipo] ?? "#434750";
            return `
        <tr>
          <td><span class="tag" style="color:${color};border-color:${color}33;background:${color}11">
            ${escapeHtml(r.tipo)}</span> <span class="ref">#${escapeHtml(r.idReferencia)}</span></td>
          <td class="num">${escapeHtml(formatFechaHora(r.fecha))}</td>
          <td>
            <div class="user">${escapeHtml(r.usuario)}</div>
            ${r.detalle ? `<div class="detail">${escapeHtml(r.detalle)}</div>` : ""}
          </td>
          <td class="center">${r.estado ? escapeHtml(r.estado) : "—"}</td>
          <td class="num right">${r.monto != null ? escapeHtml(formatMoney(r.monto)) : "—"}</td>
        </tr>`;
        })
        .join("");

    return `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; color: #141c28; margin: 0; padding: 28px; }
      .header { border-bottom: 3px solid #00173a; padding-bottom: 14px; margin-bottom: 18px; }
      .brand { display: flex; align-items: center; gap: 10px; }
      .logo { width: 34px; height: 34px; border-radius: 9px; background: #00173a; color: #00e3fd;
              display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; }
      .title { font-size: 20px; font-weight: 800; color: #00173a; }
      .sub { font-size: 12px; color: #747781; margin-top: 2px; }
      .meta { display: flex; justify-content: space-between; margin: 12px 0 16px; font-size: 11px; color: #434750; }
      .meta .chip { background: #f0f3ff; border: 1px solid #dbe3f4; border-radius: 999px; padding: 4px 10px; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; }
      thead th { text-align: left; background: #00173a; color: #fff; padding: 8px 10px; font-size: 10px;
                 text-transform: uppercase; letter-spacing: 0.04em; }
      thead th.right { text-align: right; } thead th.center { text-align: center; }
      tbody td { padding: 8px 10px; border-bottom: 1px solid #e7eeff; vertical-align: top; }
      tbody tr:nth-child(even) { background: #f9f9ff; }
      .num { font-variant-numeric: tabular-nums; white-space: nowrap; }
      .right { text-align: right; } .center { text-align: center; }
      .tag { display: inline-block; border: 1px solid; border-radius: 999px; padding: 1px 8px;
             font-weight: 700; text-transform: capitalize; font-size: 10px; }
      .ref { color: #747781; font-size: 10px; }
      .user { font-weight: 700; } .detail { color: #747781; font-size: 10px; margin-top: 1px; }
      .foot { margin-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #434750;
              border-top: 2px solid #dbe3f4; padding-top: 10px; }
      .foot b { color: #00173a; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">
        <div class="logo">UCU</div>
        <div>
          <div class="title">Registro de auditoría</div>
          <div class="sub">UCU Mundial · Compras, transferencias y validaciones</div>
        </div>
      </div>
    </div>
    <div class="meta">
      <span class="chip">${filtroLabel}</span>
      <span class="chip">Generado: ${escapeHtml(generado)}</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Tipo</th><th>Fecha</th><th>Usuario / detalle</th>
          <th class="center">Estado</th><th class="right">Monto</th>
        </tr>
      </thead>
      <tbody>${filas || `<tr><td colspan="5" class="center">Sin registros</td></tr>`}</tbody>
    </table>
    <div class="foot">
      <span><b>${rows.length}</b> registro(s)</span>
      <span>Total montos: <b>${escapeHtml(formatMoney(totalMonto))}</b></span>
    </div>
  </body>
  </html>`;
};

const esCancelacion = (e) => /dismiss|cancel|user did not share/i.test(e?.message ?? "");

export async function exportarAuditoriaPdf(rows = [], opciones = {}) {
    if (!Print || typeof Print.printToFileAsync !== "function") {
        throw new Error(
            "El módulo de impresión no está disponible en esta build. Corré 'npx expo install expo-print expo-sharing' y reconstruí la app nativa (npx expo run:android). 'expo start -c' NO alcanza."
        );
    }

    const html = buildHtml(rows, opciones);

    let uri;
    try {
        const res = await Print.printToFileAsync({ html });
        uri = res.uri;
    } catch (e) {
        // Si ni siquiera se puede generar el archivo, intentamos imprimir directo desde HTML
        // (diálogo del sistema → "Guardar como PDF").
        try {
            await Print.printAsync({ html });
            return null;
        } catch (e2) {
            throw new Error(`No se pudo generar el PDF: ${e2?.message ?? e?.message ?? e}`);
        }
    }

    try {
        if (Sharing && (await Sharing.isAvailableAsync())) {
            await Sharing.shareAsync(uri, {
                mimeType: "application/pdf",
                dialogTitle: "Compartir auditoría",
                UTI: "com.adobe.pdf",
            });
            return uri;
        }
    } catch (e) {
        if (esCancelacion(e)) return uri; // el usuario cerró la hoja: no es error
        // si falla compartir, seguimos al fallback de impresión
    }

    try {
        await Print.printAsync({ uri });
    } catch (e) {
        if (!esCancelacion(e)) throw e;
    }

    return uri;
}
