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

export default async function handler(req, res) {
  // Healthcheck rápido
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "guest endpoint alive" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const SHEET_ID = process.env.SHEET_ID;
    const SHEET_TAB = process.env.SHEET_TAB;

    if (!SHEET_ID) throw new Error("Missing SHEET_ID");
    if (!SHEET_TAB) throw new Error("Missing SHEET_TAB");

    const { name, guests, notes, attending } = req.body || {};

    if (!name) {
      return res.status(400).json({ ok: false, error: "Missing name" });
    }

    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Formato de fila: timestamp, nombre, asistirá, # invitados, notas
    const row = [
      new Date().toISOString(),
      String(name),
      attending === false ? "No" : "Sí",
      guests != null ? String(guests) : "",
      notes != null ? String(notes) : "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: ${SHEET_TAB}!A:E,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || String(err),
    });
  }
}
