// /pages/api/guest.js
import { google } from "googleapis";

// ====================================================
// ⚙️ CONFIGURACIÓN
// ====================================================

const SPREADSHEET_ID = "1xEMmlb5mQT-3cyTickd3m4ykLE7tz65QPMf7EVE9-fo";
const SHEET_NAME = "Invitados";

// ====================================================

export default async function handler(req, res) {
  // 🔥 PERMITIR TANTO GET COMO POST
  // GET: Para verificar que la API funciona
  // POST: Para guardar la confirmación
  
  // Si es GET, responder con un mensaje de éxito
  if (req.method === "GET") {
    return res.status(200).json({ 
      message: "✅ API de invitaciones funcionando correctamente. Usa POST para confirmar asistencia." 
    });
  }

  // Solo permitir POST para guardar datos
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST para confirmar asistencia." });
  }

  try {
    // Obtener datos del cuerpo de la solicitud
    const { id, asistencia, mensaje, pasesConfirmados, bebidas, alergias } = req.body;

    // Validar que el ID esté presente
    if (!id) {
      return res.status(400).json({ error: "Falta el ID del invitado" });
    }

    // Configurar autenticación con Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // 1. Buscar al invitado por ID en la columna A
    const searchResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Q`,
    });

    const rows = searchResponse.data.values || [];
    let rowIndex = -1;

    // Buscar el ID (columna A)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === id) {
        rowIndex = i + 1; // Google Sheets es 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ error: "Invitado no encontrado. Verifica tu ID." });
    }

    // 2. Verificar si ya confirmó (columna I = Estado_Link)
    const currentRowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:Q${rowIndex}`,
    });

    const currentRow = currentRowResponse.data.values?.[0] || [];
    const estadoActual = currentRow[8] || ""; // Columna I = Estado_Link

    // Si ya confirmó, no permitir otra confirmación
    if (estadoActual === "Activo") {
      return res.status(400).json({
        error: "Ya has confirmado tu asistencia anteriormente. No se puede modificar.",
      });
    }

    // 3. Obtener datos automáticos
    const now = new Date();
    const fechaConfirmacion = now.toISOString();
    const ipRegistro = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    // 4. Formatear bebidas (array a texto)
    const bebidasTexto = Array.isArray(bebidas) ? bebidas.join(", ") : "";

    // 5. Crear la nueva fila con los datos actualizados
    const newRow = [
      currentRow[0] || id, // A: ID
      currentRow[1] || "", // B: Nombre
      currentRow[2] || "", // C: Teléfono
      currentRow[3] || "", // D: Pases_Asignados
      asistencia || "", // E: Asistencia (invitado)
      mensaje || "", // F: Mensaje (invitado)
      fechaConfirmacion, // G: Fecha_Confirmacion (automático)
      ipRegistro, // H: IP_Registro (automático)
      "Activo", // I: Estado_Link (cambia a Activo al confirmar)
      pasesConfirmados || 0, // J: Pases_Confirmados (invitado)
      currentRow[10] || "", // K: Link_Invitacion
      currentRow[11] || "", // L: QR (manual)
      currentRow[12] || "", // M: Checkin_Asistio
      currentRow[13] || "", // N: Checkin_Hora
      currentRow[14] || "", // O: Checkin_Notas
      bebidasTexto, // P: Bebidas (invitado)
      alergias || "", // Q: Alergias (invitado)
    ];

    // 6. Actualizar la fila completa
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:Q${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: { values: [newRow] },
    });

    // 7. (OPCIONAL) Guardar en hoja "Respuestas" para historial
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Respuestas!A:Q",
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              id,
              currentRow[1] || "",
              currentRow[2] || "",
              currentRow[3] || "",
              asistencia || "",
              mensaje || "",
              fechaConfirmacion,
              ipRegistro,
              "Activo",
              pasesConfirmados || 0,
              currentRow[10] || "",
              currentRow[11] || "",
              currentRow[12] || "",
              currentRow[13] || "",
              currentRow[14] || "",
              bebidasTexto,
              alergias || "",
            ],
          ],
        },
      });
    } catch (e) {
      console.log("No se pudo guardar en Respuestas:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: "✅ Confirmación guardada correctamente",
      data: {
        id,
        asistencia,
        pasesConfirmados,
        mensaje,
        bebidas: bebidasTexto,
        alergias,
        fecha: fechaConfirmacion,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ 
      error: error.message || "Error interno del servidor" 
    });
  }
}