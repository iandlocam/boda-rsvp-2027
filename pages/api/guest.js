// /pages/api/guest.js - VERSIÓN COMPLETA CORREGIDA
import { google } from "googleapis";

// ====================================================
// ⚙️ CONFIGURACIÓN
// ====================================================

const SPREADSHEET_ID = "1xEMmlb5mQT-3cyTickd3m4ykLE7tz65QPMf7EVE9-fo";
const SHEET_NAME = "Invitados";

// ====================================================

export default async function handler(req, res) {
  console.log("🚀 API ejecutándose - Método:", req.method);
  
  // GET - Obtener datos del invitado
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

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:Q`,
      });

      const rows = response.data.values || [];
      let guestData = null;

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === id) {
          guestData = {
            id: rows[i][0] || "",
            nombre: rows[i][1] || "",
            telefono: rows[i][2] || "",
            pasesAsignados: parseInt(rows[i][3]) || 0,
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

  // PATCH - Actualizar SOLO ciertas columnas (NUEVO MÉTODO)
  if (req.method === "PATCH") {
    try {
      console.log("📝 PATCH recibido - Actualización parcial");
      
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

      // Obtener fila actual
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

      // ====================================================
      // 🔥 ACTUALIZAR SOLO COLUMNAS ESPECÍFICAS
      // ====================================================
      
      // Columnas a actualizar (índice 0-based)
      const updates = [
        { col: 4, value: asistencia || "" },      // E: Asistencia
        { col: 5, value: mensaje || "" },         // F: Mensaje
        { col: 6, value: fechaConfirmacion },     // G: Fecha_Confirmacion
        { col: 7, value: ipRegistro },            // H: IP_Registro
        { col: 8, value: "Activo" },              // I: Estado_Link
        { col: 9, value: String(pasesConfirmados || 0) }, // J: Pases_Confirmados
        { col: 15, value: bebidasTexto },         // P: Bebidas
        { col: 16, value: alergias || "" },       // Q: Alergias
      ];

      // Actualizar CADA CELDA individualmente
      for (const update of updates) {
        const colLetter = String.fromCharCode(65 + update.col); // 0=A, 1=B, etc.
        const range = `${SHEET_NAME}!${colLetter}${rowIndex}`;
        
        console.log(`📝 Actualizando ${range} = "${update.value}"`);
        
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: range,
          valueInputOption: "RAW",
          requestBody: {
            values: [[update.value]],
          },
        });
      }

      // Obtener los valores actualizados para la respuesta
      const qrValue = currentRow[11] || "";
      const checkinValue = currentRow[12] || "";

      console.log("✅ PATCH completado - QR preservado:", qrValue);
      console.log("✅ PATCH completado - Checkin preservado:", checkinValue);

      return res.status(200).json({
        success: true,
        message: "Confirmación guardada correctamente",
        data: { 
          id, 
          asistencia, 
          pasesConfirmados, 
          mensaje, 
          bebidas: bebidasTexto, 
          alergias,
          qrPreservado: qrValue,
          checkinPreservado: checkinValue,
        },
      });
      
    } catch (error) {
      console.error("Error en PATCH:", error);
      return res.status(500).json({ error: error.message || "Error interno" });
    }
  }

  // POST - Método alternativo (mantener por compatibilidad)
  if (req.method === "POST") {
    try {
      console.log("⚠️ POST recibido - Usando método alternativo");
      
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

      // Obtener fila actual para preservar datos
      const currentRowResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex}:Q${rowIndex}`,
      });

      const currentRow = currentRowResponse.data.values?.[0] || [];
      
      // 🛡️ PRESERVAR valores importantes
      const qrValue = currentRow[11] || "";
      const checkinValue = currentRow[12] || "";
      const pasesAsignadosValue = currentRow[3] || "0";
      const linkValue = currentRow[10] || "";
      const checkinHoraValue = currentRow[13] || "";
      const checkinNotasValue = currentRow[14] || "";

      const now = new Date();
      const fechaConfirmacion = now.toISOString();
      const ipRegistro = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
      const bebidasTexto = Array.isArray(bebidas) ? bebidas.join(", ") : "";

      // ====================================================
      // 🔥 CONSTRUIR LA NUEVA FILA PRESERVANDO TODO
      // ====================================================
      const newRow = [
        currentRow[0] || id,              // A: ID
        currentRow[1] || "",               // B: Nombre
        currentRow[2] || "",               // C: Teléfono
        pasesAsignadosValue,               // D: Pases_Asignados (PRESERVADO)
        asistencia || "",                  // E: Asistencia
        mensaje || "",                     // F: Mensaje
        fechaConfirmacion,                 // G: Fecha_Confirmacion
        ipRegistro,                        // H: IP_Registro
        "Activo",                          // I: Estado_Link
        String(pasesConfirmados || 0),     // J: Pases_Confirmados
        linkValue,                         // K: Link (PRESERVADO)
        qrValue,                           // L: QR (PRESERVADO) 🛡️
        checkinValue,                      // M: Checkin (PRESERVADO) 🛡️
        checkinHoraValue,                  // N: Checkin_Hora (PRESERVADO)
        checkinNotasValue,                 // O: Checkin_Notas (PRESERVADO)
        bebidasTexto,                      // P: Bebidas
        alergias || "",                    // Q: Alergias
      ];

      console.log("📝 POST - QR preservado:", qrValue);
      console.log("📝 POST - Checkin preservado:", checkinValue);

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rowIndex}:Q${rowIndex}`,
        valueInputOption: "RAW",
        requestBody: { values: [newRow] },
      });

      return res.status(200).json({
        success: true,
        message: "Confirmación guardada correctamente",
        data: { 
          id, 
          asistencia, 
          pasesConfirmados, 
          mensaje, 
          bebidas: bebidasTexto, 
          alergias,
          qrPreservado: qrValue,
          checkinPreservado: checkinValue,
        },
      });
      
    } catch (error) {
      console.error("Error en POST:", error);
      return res.status(500).json({ error: error.message || "Error interno" });
    }
  }

  // Si no es GET, POST ni PATCH
  return res.status(405).json({ error: "Método no permitido" });
}
