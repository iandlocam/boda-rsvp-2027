// /pages/index.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

function clamp(n) {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

async function enviarRSVP({ id, asistencia, mensaje, pasesConfirmados }) {
  const resp = await fetch("/api/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, asistencia, mensaje, pasesConfirmados }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || "Error desconocido");
  return data;
}

/** ✅ Monograma AV (limpio, elegante, tipo sello) */
function MonogramaAV({ size = 60, color = "rgba(19,32,45,0.86)" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(176,141,87,0.78)" />
          <stop offset="1" stopColor="rgba(19,32,45,0.18)" />
        </linearGradient>
      </defs>

      {/* anillo */}
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke="url(#ring)"
        strokeWidth="2.2"
        opacity="0.9"
      />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="rgba(255,255,255,0.30)"
        strokeWidth="1.2"
      />

      {/* AV monograma sobrio */}
      <path
        d="M34 78 L46 38 L58 78"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 62 H52"
        fill="none"
        stroke={color}
        strokeWidth="3.0"
        strokeLinecap="round"
      />
      <path
        d="M66 40 L80 78 L94 40"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** ✅ Sello “dorado” (borde irregular + relieve + brillo) */
function WaxSeal({ onClick, disabled = false, label = "Abrir", size = 108 }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Abrir invitación"
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      style={{
        width: size,
        height: size,
        cursor: disabled ? "default" : "pointer",
        userSelect: "none",
        position: "relative",
        display: "grid",
        placeItems: "center",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <filter id="sShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="rgba(0,0,0,0.24)" />
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.18)" />
          </filter>

          {/* dorado realista */}
          <radialGradient id="goldWax" cx="28%" cy="22%" r="85%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.70)" />
            <stop offset="14%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="44%" stopColor="rgba(243,226,166,1)" />
            <stop offset="70%" stopColor="rgba(214,178,94,1)" />
            <stop offset="100%" stopColor="rgba(122,91,34,1)" />
          </radialGradient>

          <radialGradient id="goldShine" cx="20%" cy="18%" r="48%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.90)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* forma irregular tipo cera */}
          <path
            id="blob"
            d="M60 7
               C76 8, 96 16, 107 30
               C118 44, 118 62, 111 79
               C104 96, 88 110, 69 113
               C50 116, 31 111, 19 98
               C7 85, 4 66, 9 49
               C14 32, 27 18, 44 11
               C50 9, 55 7, 60 7Z"
          />
        </defs>

        <g filter="url(#sShadow)">
          <use href="#blob" fill="url(#goldWax)" />
          <use href="#blob" fill="url(#goldShine)" opacity="0.55" />
          <use href="#blob" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <use href="#blob" fill="none" stroke="rgba(122,91,34,0.28)" strokeWidth="1.3" />

          {/* relieve central (grabado AV) */}
          <path
            d="M42 76 L52 44 L62 76"
            fill="none"
            stroke="rgba(60,45,18,0.40)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d="M47 64 H57"
            fill="none"
            stroke="rgba(60,45,18,0.40)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M66 46 L78 76 L90 46"
            fill="none"
            stroke="rgba(60,45,18,0.40)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* highlight fino para “metal” */}
          <path
            d="M26 44 C38 26, 58 18, 78 22"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
          transform: "translateY(-1px)",
        }}
      >
        <div
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: 32,
            color: "rgba(19,32,45,0.85)",
            textShadow: "0 1px 0 rgba(255,255,255,0.25), 0 10px 22px rgba(0,0,0,0.20)",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/** ✅ Componente de íconos personalizables para el itinerario */
function TimelineIcon({ type = "ceremony", size = 48 }) {
  // ====================================================
  // 🖼️ CONFIGURACIÓN DE ÍCONOS DEL ITINERARIO - CÁMBIALOS AQUÍ
  // ====================================================
  
  // Puedes cambiar estas URLs por las imágenes que quieras usar
  // Las imágenes deben estar en la carpeta /public de tu proyecto
  const ICONOS = {
    ceremony: "/iconos/Ceremony.png",     // Ícono para Ceremonia
    reception: "/iconos/Cocteel.png",     // Ícono para Coctel
    dinner: "/iconos/cena.png",             // Ícono para Cena
    party: "/iconos/Fiesta.png",             // Ícono para Fiesta
    close: "/iconos/Cierre.png",             // Ícono para Cierre
  };
  
  // ====================================================

  // Si no se encuentra el ícono, mostrar un círculo con la inicial como fallback
  const iconSrc = ICONOS[type];
  
  if (!iconSrc) {
    // Fallback: mostrar un círculo con la inicial
    const initial = type === "ceremony" ? "C" : 
                    type === "reception" ? "R" : 
                    type === "dinner" ? "N" : 
                    type === "party" ? "F" : "X";
    
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(214, 178, 94, 0.3)",
        border: "2px solid rgba(176,141,87,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: "bold",
        color: "rgba(19,32,45,0.8)",
      }}>
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={iconSrc}
      alt={`Ícono ${type}`}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: "50%",
      }}
    />
  );
}

/** ✅ Logos sobrios (SVG) como botones */
function BrandLogo({ type = "liverpool" }) {
  if (type === "amazon") {
    return (
      <svg width="210" height="56" viewBox="0 0 420 112" aria-hidden="true">
        <rect
          x="1"
          y="1"
          width="418"
          height="110"
          rx="18"
          fill="rgba(255,255,255,0.92)"
          stroke="rgba(31,65,95,0.16)"
        />
        <text
          x="210"
          y="64"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
          fontSize="44"
          fill="rgba(19,32,45,0.88)"
        >
          amazon
        </text>
        <path
          d="M140 78c40 22 100 22 140 0"
          fill="none"
          stroke="rgba(176,141,87,0.95)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M274 76l14 5-9 12"
          fill="none"
          stroke="rgba(176,141,87,0.95)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="210" height="56" viewBox="0 0 420 112" aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="418"
        height="110"
        rx="18"
        fill="rgba(255,255,255,0.92)"
        stroke="rgba(31,65,95,0.16)"
      />
      <text
        x="210"
        y="66"
        textAnchor="middle"
        fontFamily='"Cormorant Garamond", serif'
        fontSize="50"
        fill="rgba(19,32,45,0.88)"
        style={{ letterSpacing: "0.02em" }}
      >
        liverpool
      </text>
      <path
        d="M92 30c10 0 16 6 16 14 0 10-8 18-18 18-8 0-14-6-14-14 0-10 6-18 16-18z"
        fill="rgba(214,178,94,0.18)"
        stroke="rgba(176,141,87,0.50)"
      />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();

  // ====================================================
  // 🖼️ CONFIGURACIÓN DE IMÁGENES - CÁMBIALAS AQUÍ
  // ====================================================
  
  // Imagen de fondo principal (marco floral que aparece en AMBAS pantallas)
  const BACKGROUND_IMAGE = "/marco-boda.jpeg";
  
  // Imagen del sobre (primera pantalla)
  const SOBRE_IMAGE = "/sobre-boda.jpg";
  
  // Imagen del dress code (código de vestimenta)
  const DRESS_CODE_IMAGE = "/Dress-code.png";
  
  // Imágenes de la galería (fotos de la pareja)
  const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=70", // Foto 1
    "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=70", // Foto 2
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=70", // Foto 3
  ];
  
  // ====================================================
  // 🎨 OPCIONES DE ESTILO
  // ====================================================
  
  // Opacidad del marco floral (0.0 = invisible, 1.0 = sólido)
  const FLORAL_FRAME_OPACITY = 0.4;
  
  // Tamaño de los íconos del itinerario (en píxeles)
  const TIMELINE_ICON_SIZE = 80; // Aumentado de 52 a 80
  
  // ====================================================

  const weddingDateMs = useMemo(() => new Date("2027-04-23T16:00:00").getTime(), []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [spotifyNonce, setSpotifyNonce] = useState(0);
  const [spotifyEnabled, setSpotifyEnabled] = useState(false);
  const [guestId, setGuestId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("idle");
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpResult, setRsvpResult] = useState(null);
  const [guestData, setGuestData] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestLoadError, setGuestLoadError] = useState("");
  const [yaConfirmo, setYaConfirmo] = useState(false);
  const [asistenciaActual, setAsistenciaActual] = useState("");
  const [pasesConfirmados, setPasesConfirmados] = useState(1);

  useEffect(() => {
    if (!router.isReady) return;
    const id = router.query.id;
    if (typeof id === "string") setGuestId(id.trim());
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    if (!guestId) return;

    let cancelled = false;

    async function loadGuest() {
      try {
        setGuestLoading(true);
        setGuestLoadError("");

        const resp = await fetch(`/api/guest?id=${encodeURIComponent(guestId)}`);
        const data = await resp.json();

        if (!resp.ok) throw new Error(data?.error || "No se pudo cargar el invitado");
        if (cancelled) return;

        const g = data.guest || null;
        setGuestData(g);

        const a = String(g?.asistencia || "").trim();
        setAsistenciaActual(a);
        const confirmed = a === "Sí" || a === "No";
        setYaConfirmo(confirmed);

        if (g?.mensaje && !mensaje) {
          setMensaje(String(g.mensaje));
        }

        const maxPases = Math.max(1, Number(g?.pasesAsignados || 1));
        const j = Number(g?.pasesConfirmados || 0);
        const precarga = j > 0 ? Math.min(Math.max(1, j), maxPases) : 1;
        setPasesConfirmados(precarga);
      } catch (e) {
        if (cancelled) return;
        setGuestLoadError(e?.message || String(e));
        setGuestData(null);
        setYaConfirmo(false);
        setAsistenciaActual("");
      } finally {
        if (!cancelled) setGuestLoading(false);
      }
    }

    loadGuest();
    return () => {
      cancelled = true;
    };
  }, [guestId]);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const distance = Math.max(0, weddingDateMs - now);

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({
        days: clamp(days),
        hours: clamp(hours),
        minutes: clamp(minutes),
        seconds: clamp(seconds),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [weddingDateMs]);

  async function confirmar(asistencia) {
    try {
      setRsvpStatus("saving");
      setRsvpError("");
      setRsvpResult(null);

      if (!guestId) throw new Error("Falta el ID en el enlace. Ejemplo: ?id=AV001");

      const pasesAEnviar = asistencia === "Sí" ? pasesConfirmados : 0;

      const result = await enviarRSVP({
        id: guestId,
        asistencia,
        mensaje,
        pasesConfirmados: pasesAEnviar,
      });

      setRsvpResult(result);
      setRsvpStatus("ok");
      setYaConfirmo(true);
      setAsistenciaActual(asistencia);

      if (typeof result?.pasesConfirmados !== "undefined") {
        setPasesConfirmados(
          Number(result.pasesConfirmados) || (asistencia === "Sí" ? pasesAEnviar : 0)
        );
      }
    } catch (e) {
      setRsvpStatus("error");
      setRsvpError(e?.message || String(e));
    }
  }

  const NAME_STYLE = "gold";
  const SPOTIFY_EMBED_BASE =
    "https://open.spotify.com/embed/track/727sZDy6Dlyo4gniOMKUhv?autoplay=1";
  const SPOTIFY_EMBED_URL = `${SPOTIFY_EMBED_BASE}&_=${spotifyNonce}`;

  const MAPS_URL =
    "https://maps.google.com/?q=Jard%C3%ADn%20Maroma%2C%20Jiutepec%2C%20Morelos";
  const WAZE_URL = "https://waze.com/ul?q=Jard%C3%ADn%20Maroma%20Jiutepec%20Morelos";

  const NUESTRA_HISTORIA = [
    {
      title: "Cómo empezó",
      text:
        "Un día cualquiera se volvió especial. Entre risas, pláticas largas y complicidad, entendimos que esto iba en serio.",
    },
    {
      title: "Lo que nos une",
      text:
        "Amor por lo simple, por la familia, por viajar y por crear un hogar donde siempre haya paz (y música).",
    },
    {
      title: "El gran día",
      text:
        "Nos emociona celebrarlo contigo. Gracias por ser parte de nuestra historia y de este nuevo capítulo.",
    },
  ];

  const TIMELINE = [
    { time: "4:00 PM", title: "Ceremonia", iconType: "ceremony" },
    { time: "5:00 PM", title: "Coctel", iconType: "reception" },
    { time: "7:30 PM", title: "Cena", iconType: "dinner" },
    { time: "9:00 PM", title: "Fiesta", iconType: "party" },
    { time: "3:00 AM", title: "Cierre", iconType: "close" },
  ];
  
  const DRESS_CODE = {
  title: "Dress code",
  text: [
    "Formal / jardín elegante",
    "Te sugerimos telas frescas y cómodas. Evita tacones muy delgados por el terreno."
  ],
};

  const MESA_REGALOS = [
    { type: "liverpool", url: "https://www.liverpool.com.mx/" },
    { type: "amazon", url: "https://www.amazon.com.mx/wedding/share/VanessaAndres/" },
  ];

  const REGALO_MONETARIO = {
    subtitle: "Si deseas apoyarnos en esta nueva etapa:",
    accountLabel: "CLABE / Cuenta",
    accountValue: "012 180 0152 2563 3524",
    nameValue: "Andrés López",
  };

  // ====================================================
  // 🎨 NUEVOS ESTILOS PARA LA SEGUNDA PANTALLA (inspirados en invboda.com/20/)
  // ====================================================
  
  // Estilos originales del sobre (PRIMERA PANTALLA) - SE MANTIENEN IGUAL
  const envelopeStyles = {
    wrap: {
      width: "100%",
      maxWidth: 600,
      margin: "0 auto",
      cursor: "pointer",
      position: "relative",
      zIndex: 10,
      transition: "transform 0.3s ease",
    },
    envelope: {
      width: "100%",
      aspectRatio: "0.85/1",
      position: "relative",
      borderRadius: 30,
      overflow: "hidden",
      background: "#F9E5D2",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)",
      border: "4px solid #FFFFFF",
      display: "flex",
      flexDirection: "column",
    },
    topImage: {
      width: "calc(100% - 40px)",
      height: "auto",
      maxHeight: "480px",
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
      margin: "20px auto 10px",
      borderBottom: "2px solid rgba(184,107,107,0.2)",
    },
    content: {
      flex: 1,
      padding: "0 20px 20px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
      textAlign: "center",
    },
    clickText: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      letterSpacing: "2px",
      textTransform: "uppercase",
      color: "rgba(19,32,45,0.6)",
      margin: "20px 0 15px 0",
      borderTop: "1px dashed rgba(184,107,107,0.3)",
      borderBottom: "1px dashed rgba(184,107,107,0.3)",
      padding: "12px 0",
      width: "100%",
    },
    reservedSection: {
      marginTop: "auto",
      marginBottom: 10,
      textAlign: "center",
    },
    reservedText: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      letterSpacing: "2px",
      textTransform: "uppercase",
      color: "rgba(19,32,45,0.7)",
      marginBottom: 5,
    },
    reservedNumber: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 48,
      fontWeight: 700,
      color: "#B86B6B",
      lineHeight: 1,
      margin: "5px 0",
    },
    reservedSubtext: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 14,
      letterSpacing: "2px",
      textTransform: "uppercase",
      color: "rgba(19,32,45,0.6)",
    },
    seal: {
      position: "absolute",
      bottom: 30,
      right: 30,
      width: 50,
      height: 50,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #E6C7A8, #D4AF8C)",
      border: "2px solid #FFFFFF",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#13202D",
      fontSize: 20,
      opacity: 0.7,
    },
    floralFrame: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
      pointerEvents: "none",
      zIndex: 1,
      opacity: FLORAL_FRAME_OPACITY,
    },
  };

  // NUEVOS ESTILOS para la segunda pantalla (inspirados en invboda.com/20/)
  const invitationStyles = {
    // Contenedor principal con fondo color crema (sin marco floral)
    page: {
      minHeight: "100vh",
      backgroundColor: "#fef9f0", // Color crema del ejemplo
      fontFamily: "'Quicksand', sans-serif",
      color: "#4a4a4a",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    // Tarjeta principal con fondo blanco y bordes redondeados
    card: {
      width: "100%",
      maxWidth: 800,
      background: "#ffffff",
      borderRadius: 60,
      boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
      padding: "50px 40px",
      border: "1px solid rgba(255,255,255,0.5)",
    },
    // Nombres de los novios (estilo Great Vibes)
    names: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: "clamp(3.5rem, 10vw, 5.5rem)",
      fontWeight: 400,
      color: "#b76e79",
      textAlign: "center",
      marginBottom: 10,
      lineHeight: 1.2,
    },
    // Subtítulo "¡Nos casamos!"
    subtitle: {
      fontSize: "1.3rem",
      color: "#a17a6b",
      textAlign: "center",
      marginBottom: 30,
      fontFamily: "'Quicksand', sans-serif",
      fontWeight: 400,
    },
    // Contenedor del contador
    countdownContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 15,
      maxWidth: 500,
      margin: "0 auto 40px",
      background: "#fff",
      borderRadius: 100,
      padding: "25px 20px",
      boxShadow: "0 5px 20px rgba(183,110,121,0.1)",
    },
    countdownItem: {
      textAlign: "center",
    },
    countdownNumber: {
      fontSize: "2.5rem",
      fontWeight: 600,
      color: "#b76e79",
      lineHeight: 1,
    },
    countdownLabel: {
      fontSize: "0.9rem",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#a17a6b",
    },
    // Títulos de sección
    sectionTitle: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: "3rem",
      fontWeight: 400,
      color: "#b76e79",
      textAlign: "center",
      marginBottom: 30,
      letterSpacing: "1px",
    },
    // Tarjetas para itinerario, padrinos, etc.
    cardItem: {
      background: "#fff",
      borderRadius: 40,
      padding: "30px 20px",
      textAlign: "center",
      boxShadow: "0 8px 25px rgba(183,110,121,0.08)",
      border: "1px solid #f0e4d7",
    },
    // Formulario RSVP
    formContainer: {
      background: "#fff",
      borderRadius: 60,
      padding: "40px 30px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 20,
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "0.9rem",
      color: "#a17a6b",
      marginBottom: 8,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    input: {
      padding: "15px 20px",
      border: "2px solid #f0e4d7",
      borderRadius: 50,
      fontSize: "1rem",
      background: "#fefcf9",
      fontFamily: "'Quicksand', sans-serif",
    },
    select: {
      padding: "15px 20px",
      border: "2px solid #f0e4d7",
      borderRadius: 50,
      fontSize: "1rem",
      background: "#fefcf9",
      fontFamily: "'Quicksand', sans-serif",
    },
    textarea: {
      padding: "15px 20px",
      border: "2px solid #f0e4d7",
      borderRadius: 25,
      fontSize: "1rem",
      background: "#fefcf9",
      fontFamily: "'Quicksand', sans-serif",
      resize: "vertical",
    },
    radioGroup: {
      display: "flex",
      gap: 30,
      alignItems: "center",
    },
    button: {
      background: "#b76e79",
      color: "white",
      border: "none",
      padding: "18px 40px",
      fontSize: "1.3rem",
      borderRadius: 60,
      fontWeight: 600,
      letterSpacing: "2px",
      width: "100%",
      marginTop: 30,
      cursor: "pointer",
      transition: "background 0.3s",
      boxShadow: "0 10px 25px rgba(183,110,121,0.4)",
      fontFamily: "'Quicksand', sans-serif",
    },
    // Confirmaciones
    confirmacionesList: {
      background: "#fff",
      borderRadius: 60,
      padding: 30,
      boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
    },
    confirmacionItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 0",
      borderBottom: "1px dashed #f0e4d7",
    },
    guestName: {
      fontWeight: 600,
      fontSize: "1.1rem",
      color: "#4a4a4a",
    },
    guestDetails: {
      display: "flex",
      gap: 15,
      color: "#b76e79",
    },
    // Timeline/Itinerario
    timelineGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 20,
    },
    timelineIconBox: {
      width: TIMELINE_ICON_SIZE,
      height: TIMELINE_ICON_SIZE,
      margin: "0 auto 20px",
    },
    timelineTime: {
      fontSize: "1.8rem",
      fontWeight: 500,
      color: "#b76e79",
      marginBottom: 5,
    },
    timelineTitle: {
      fontWeight: 700,
      fontSize: "1.2rem",
      marginBottom: 5,
      color: "#4a4a4a",
    },
    timelineDesc: {
      fontSize: "0.95rem",
      color: "#a17a6b",
    },
    // Padrinos
    padrinosGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 25,
    },
    padrinoRol: {
      color: "#b76e79",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      fontSize: "0.9rem",
      marginBottom: 15,
      fontWeight: 600,
    },
    padrinoNombre: {
      fontSize: "1.3rem",
      fontWeight: 500,
      color: "#4a4a4a",
    },
    // Galería
    galleryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 20,
    },
    galleryImage: {
      borderRadius: 30,
      overflow: "hidden",
      aspectRatio: "1 / 1",
      boxShadow: "0 10px 30px rgba(
