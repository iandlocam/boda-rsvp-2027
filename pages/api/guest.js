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
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  const xr = req.headers["x-real-ip"];
  if (typeof xr === "string" && xr.length) return xr.trim();
  return "";
}

function normalizeId(id) {
  return String(id || "").trim();
}

function isValidId(id) {
  return /^AV\d{3,6}$/.test(id);
}

function normalizeAsistencia(val) {
  const s = String(val || "").trim().toLowerCase();
  if (!s) return "";
  if (["si", "sí", "s", "yes", "y"].includes(s)) return "Sí";
  if (["no", "n"].includes(s)) return "No";
  if (["pendiente", "pending"].includes(s)) return "Pendiente";
  return String(val).trim();
}

function clampInt(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  const v = Math.floor(x);
  return Math.max(min, Math.min(max, v));
}

export default async function handler(req, res) {
  try {
    const SHEET_ID = process.env.SHEET_ID;
    const SHEET_TAB = process.env.SHEET_TAB; // "Invitados"
    if (!SHEET_ID) throw new Error("Missing SHEET_ID");
    if (!SHEET_TAB) throw new Error("Missing SHEET_TAB");

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // ========= GET (consulta) =========
    // /api/guest?id=AV001
    if (req.method === "GET") {
      const id = normalizeId(req.query?.id);

      if (!id) {
        return res.status(200).json({ ok: true, message: "guest endpoint alive" });
      }

      if (!isValidId(id)) {
        return res.status(400).json({ ok: false, error: "Invalid id format" });
      }

      // A:J (incluye Pases_Confirmados en J)
      const range = `${SHEET_TAB}!A2:J`;
      const resp = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range,
      });

      const rows = resp.data.values || [];
      const idx = rows.findIndex((r) => String(r?.[0] || "").trim() === id);

      if (idx === -1) {
        return res.status(404).json({ ok: false, error: `ID not found: ${id}` });
      }

      const r = rows[idx];

      const guest = {
        id: r[0] || "",
        nombre: r[1] || "",
        telefono: r[2] || "",
        pasesAsignados: r[3] || "",
        asistencia: r[4] || "",
        mensaje: r[5] || "",
        fechaConfirma: r[6] || "",
        ipRegistro: r[7] || "",
        estadoLink: r[8] || "",
        pasesConfirmados: r[9] || "", // J
      };

      const isActive = String(guest.estadoLink || "").trim().toLowerCase() !== "inactivo";

      return res.status(200).json({ ok: true, guest, isActive });
    }

    // ========= POST (actualiza) =========
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const { id: rawId, asistencia, mensaje, pasesConfirmados } = req.body || {};
    const id = normalizeId(rawId);

    if (!id) return res.status(400).json({ ok: false, error: "Missing id" });
    if (!isValidId(id)) return res.status(400).json({ ok: false, error: "Invalid id format" });

    const asistenciaVal = normalizeAsistencia(asistencia);
    if (!asistenciaVal) {
      return res.status(400).json({ ok: false, error: "Missing asistencia" });
    }

    const mensajeVal = mensaje != null ? String(mensaje).trim() : "";
    const now = new Date().toISOString();
    const ip = getClientIp(req);

    // 1) Encontrar la fila por ID leyendo solo la columna A
    const idRange = `${SHEET_TAB}!A2:A`;
    const idResp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: idRange,
    });

    const idRows = idResp.data.values || [];
    const idx = idRows.findIndex((r) => String(r?.[0] || "").trim() === id);

    if (idx === -1) {
      return res.status(404).json({ ok: false, error: `ID not found: ${id}` });
    }

    const sheetRowNumber = idx + 2;

    // 2) Necesitamos saber cuántos pases tiene asignados (col D) para limitar pasesConfirmados
    const rowRange = `${SHEET_TAB}!A${sheetRowNumber}:J${sheetRowNumber}`;
    const rowResp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: rowRange,
    });

    const row = (rowResp.data.values && rowResp.data.values[0]) || [];
    const pasesAsignados = clampInt(row[3], 0, 99); // D

    let pasesFinal = 0;
    if (asistenciaVal === "Sí") {
      // si dicen Sí, limitamos de 1..pasesAsignados
      const wanted = clampInt(pasesConfirmados, 1, Math.max(1, pasesAsignados || 1));
      pasesFinal = Math.min(wanted, pasesAsignados || wanted);
    } else {
      // si dicen No, es 0
      pasesFinal = 0;
    }

    // 3) Actualizamos E-H y J (sin tocar I)
    const valuesEH = [[asistenciaVal, mensajeVal, now, ip]];
    const valuesJ = [[String(pasesFinal)]];

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: `${SHEET_TAB}!E${sheetRowNumber}:H${sheetRowNumber}`,
            values: valuesEH,
          },
          {
            range: `${SHEET_TAB}!J${sheetRowNumber}:J${sheetRowNumber}`,
            values: valuesJ,
          },
        ],
      },
    });

    return res.status(200).json({
      ok: true,
      updatedRow: sheetRowNumber,
      pasesConfirmados: pasesFinal,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
