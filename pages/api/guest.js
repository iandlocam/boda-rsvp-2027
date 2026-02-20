import { google } from "googleapis";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");
  const creds = JSON.parse(raw);

  return new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getClientIp(req) {
  // Vercel suele mandar x-forwarded-for
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  const xr = req.headers["x-real-ip"];
  if (typeof xr === "string" && xr.length) return xr.trim();
  return "";
}

export default async function handler(req, res) {
  // Healthcheck
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "guest endpoint alive" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const SHEET_ID = process.env.SHEET_ID;
    const SHEET_TAB = process.env.SHEET_TAB; // ej: "Invitados"
    if (!SHEET_ID) throw new Error("Missing SHEET_ID");
    if (!SHEET_TAB) throw new Error("Missing SHEET_TAB");

    // Lo que mandará el front:
    // id: "AV001"
    // asistencia: "Sí" | "No" | "Pendiente" | etc.
    // mensaje: string
    // pasesConfirmados: number (opcional)
    const { id, asistencia, mensaje, pasesConfirmados } = req.body || {};

    if (!id) return res.status(400).json({ ok: false, error: "Missing id" });

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Leemos IDs de la columna A (desde A2 para saltarnos headers)
    const idRange = `${SHEET_TAB}!A2:A`;
    const idResp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: idRange,
    });

    const rows = idResp.data.values || []; // [[AV001],[AV002],...]
    const idx = rows.findIndex((r) => String(r?.[0] || "").trim() === String(id).trim());

    if (idx === -1) {
      // Si NO existe el ID, devolvemos error (para no ensuciar la hoja).
      // Si prefieres "crear fila nueva", lo cambiamos mañana.
      return res.status(404).json({ ok: false, error: `ID not found: ${id}` });
    }

    // idx=0 corresponde a la fila 2 en Sheets
    const sheetRowNumber = idx + 2;

    // Valores a escribir (E..I): Asistencia, Mensaje, Fecha_Confirma, IP_Registro, Estado_Link
    const now = new Date().toISOString();
    const ip = getClientIp(req);

    const asistenciaVal =
      asistencia != null ? String(asistencia) : ""; // tú decides valores: "Sí"/"No"/"Pendiente"

    const mensajeVal = mensaje != null ? String(mensaje) : "";

    // Si quieres guardar pases confirmados, lo pondremos en una columna adicional o usaremos D bajo una regla.
    // Por ahora NO tocamos D (Pases_Asignados). Si quieres, mañana añadimos columna "Pases_Confirmados".

    const values = [[asistenciaVal, mensajeVal, now, ip, "Activo"]];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_TAB}!E${sheetRowNumber}:I${sheetRowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return res.status(200).json({ ok: true, updatedRow: sheetRowNumber });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
