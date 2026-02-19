import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const { codigo } = req.query;

    if (!codigo) {
      return res.status(400).json({ error: "Código requerido" });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Invitados!A2:F1000",
    });

    const rows = response.data.values;

    if (!rows) {
      return res.status(404).json({ error: "No hay datos" });
    }

    const invitado = rows.find((row) => row[0] === codigo);

    if (!invitado) {
      return res.status(404).json({ error: "Código no encontrado" });
    }

    return res.status(200).json({
      nombre: invitado[1],
      pases: invitado[2],
      confirmado: invitado[3],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno" });
  }
}
