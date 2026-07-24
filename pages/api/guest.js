// /pages/api/guest.js
import { google } from "googleapis";

// ====================================================
// ⚙️ CONFIGURACIÓN
// ====================================================

const SPREADSHEET_ID = "1xEMmlb5mQT-3cyTickd3m4ykLE7tz65QPMf7EVE9-fo";
const SHEET_NAME = "Invitados";

// ====================================================

export default async function handler(req, res) {
  // Permitir GET para verificar y POST para guardar
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "Falta el ID del invitado" });
      }

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // Obtener TODOS los datos de la hoja
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:Q`,
      });

      const rows = response.data.values || [];
      let guestData = null;

      // Buscar el ID en la columna A (índice 0)
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === id) {
          // Columnas: A=ID(0), B=Nombre(1), C=Teléfono(2), D=Pases_Asignados(3)
          guestData = {
            id: rows[i][0] || "",
            nombre: rows[i][1] || "",
            telefono: rows[i][2] || "",
            pasesAsignados: parseInt(rows[i][3]) || 0, // ✅ COLUMNA D (índice 3)
            asistencia: rows[i][4] || "",
            mensaje: rows[i][5] || "",
            fechaConfirmacion: rows[i][6] || "",
            ipRegistro: rows[i][7] || "",
            estadoLink: rows[i][8] || "",
            pasesConfirmados: parseInt(rows[i][9]) || 0,
            linkInvitacion: rows[i][10] || "",
            qr: rows[i][11] || "",
            checkinAsistio: rows[i][12] || "",
            checkinHora: rows[i][13] || "",
            checkinNotas: rows[i][14] || "",
            bebidas: rows[i][15] || "",
            alergias: rows[i][16] || "",
          };
          break;
        }
      }

      if (!guestData) {
        return res.status(404).json({ error: "Invitado no encontrado" });
      }

      return res.status(200).json({ guest: guestData });
    } catch (error) {
      console.error("Error en GET:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Solo POST para guardar
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { id, asistencia, mensaje, pasesConfirmados, bebidas, alergias } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Falta el ID del invitado" });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Buscar al invitado
    const searchResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
    });

    const rows = searchResponse.data.values || [];
    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === id) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ error: "Invitado no encontrado" });
    }

    // Obtener fila actual para preservar datos existentes
    const currentRowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:Q${rowIndex}`,
    });

    const currentRow = currentRowResponse.data.values?.[0] || [];
    const estadoActual = currentRow[8] || "";

    if (estadoActual === "Activo") {
      return res.status(400).json({
        error: "Ya has confirmado tu asistencia anteriormente.",
      });
    }

    const now = new Date();
    const fechaConfirmacion = now.toISOString();
    const ipRegistro = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const bebidasTexto = Array.isArray(bebidas) ? bebidas.join(", ") : "";

    // ✅ PRESERVAR el valor de pasesAsignados de la columna D (índice 3)
    const pasesAsignadosOriginal = currentRow[3] || "0";

    const newRow = [
      currentRow[0] || id, // A: ID
      currentRow[1] || "", // B: Nombre
      currentRow[2] || "", // C: Teléfono
      pasesAsignadosOriginal, // D: Pases_Asignados (se mantiene igual) ✅
      asistencia || "", // E: Asistencia
      mensaje || "", // F: Mensaje
      fechaConfirmacion, // G: Fecha_Confirmacion
      ipRegistro, // H: IP_Registro
      "Activo", // I: Estado_Link
      pasesConfirmados || 0, // J: Pases_Confirmados
      currentRow[10] || "", // K: Link_Invitacion
      currentRow[11] || "", // L: QR
      currentRow[12] || "", // M: Checkin_Asistio
      currentRow[13] || "", // N: Checkin_Hora
      currentRow[14] || "", // O: Checkin_Notas
      bebidasTexto, // P: Bebidas
      alergias || "", // Q: Alergias
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:Q${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: { values: [newRow] },
    });

    return res.status(200).json({
      success: true,
      message: "Confirmación guardada correctamente",
      data: { id, asistencia, pasesConfirmados, mensaje, bebidas: bebidasTexto, alergias },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Error interno" });
  }
}
