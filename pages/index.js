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
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=70",
  ];
  
  // ====================================================
  // 🎨 OPCIONES DE ESTILO
  // ====================================================
  
  // Opacidad del marco floral (0.0 = invisible, 1.0 = sólido)
  const FLORAL_FRAME_OPACITY = 0.4;
  
  // Tamaño de los íconos del itinerario (en píxeles)
  const TIMELINE_ICON_SIZE = 80;
  
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
  // 🎨 ESTILOS CORREGIDOS - con fondo crema para el sobre
  // ====================================================
  
  // Estilos del sobre (PRIMERA PANTALLA)
  const envelopeStyles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: "#fef9f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    },
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
      maxHeight: "350px",
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
      margin: "15px auto 10px",
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
      marginTop: 40,
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

  // Estilos para la segunda pantalla
  const invitationStyles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#fef9f0",
      fontFamily: "'Quicksand', sans-serif",
      color: "#4a4a4a",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: 800,
      background: "#ffffff",
      borderRadius: 60,
      boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
      padding: "50px 40px",
      border: "1px solid rgba(255,255,255,0.5)",
    },
    names: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: "clamp(3.5rem, 10vw, 5.5rem)",
      fontWeight: 400,
      color: "#b76e79",
      textAlign: "center",
      marginBottom: 10,
      lineHeight: 1.2,
    },
    subtitle: {
      fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
      color: "#a17a6b",
      textAlign: "center",
      marginBottom: 30,
      fontFamily: "'Quicksand', sans-serif",
      fontWeight: 400,
    },
    countdownContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "clamp(8px, 2vw, 15px)",
      width: "100%",
      maxWidth: 500,
      margin: "0 auto 40px",
      background: "#fff",
      borderRadius: 100,
      padding: "clamp(15px, 4vw, 25px) clamp(10px, 3vw, 20px)",
      boxShadow: "0 5px 20px rgba(183,110,121,0.1)",
    },
    countdownItem: {
      textAlign: "center",
    },
    countdownNumber: {
      fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
      fontWeight: 600,
      color: "#b76e79",
      lineHeight: 1,
    },
    countdownLabel: {
      fontSize: "clamp(0.65rem, 2.5vw, 0.9rem)",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: "#a17a6b",
    },
    sectionTitle: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: "clamp(2.2rem, 8vw, 3rem)",
      fontWeight: 400,
      color: "#b76e79",
      textAlign: "center",
      marginBottom: "clamp(20px, 5vw, 30px)",
      letterSpacing: "1px",
    },
    cardItem: {
      background: "#fff",
      borderRadius: 40,
      padding: "clamp(20px, 4vw, 30px) clamp(15px, 3vw, 20px)",
      textAlign: "center",
      boxShadow: "0 8px 25px rgba(183,110,121,0.08)",
      border: "1px solid #f0e4d7",
    },
    formContainer: {
      background: "#fff",
      borderRadius: 60,
      padding: "clamp(25px, 5vw, 40px) clamp(20px, 4vw, 30px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "clamp(0.8rem, 3vw, 0.9rem)",
      color: "#a17a6b",
      marginBottom: 8,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    input: {
      padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
      border: "2px solid #f0e4d7",
      borderRadius: 50,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      background: "#fefcf9",
      fontFamily: "'Quicksand', sans-serif",
    },
    select: {
      padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
      border: "2px solid #f0e4d7",
      borderRadius: 50,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      background: "#fefcf9",
      fontFamily: "'Quicksand', sans-serif",
    },
    textarea: {
      padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
      border: "2px solid #f0e4d7",
      borderRadius: 25,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      background: "#fefcf9",
      fontFamily: "'Quicksand', sans-serif",
      resize: "vertical",
    },
    button: {
      background: "#b76e79",
      color: "white",
      border: "none",
      padding: "clamp(15px, 4vw, 18px) clamp(25px, 6vw, 40px)",
      fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
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
    galleryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "clamp(10px, 3vw, 20px)",
      marginTop: 20,
    },
    galleryImage: {
      borderRadius: 30,
      overflow: "hidden",
      aspectRatio: "1 / 1",
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      border: "2px solid white",
    },
    timelineGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "clamp(10px, 3vw, 20px)",
    },
    timelineIconBox: {
      width: "clamp(60px, 15vw, 80px)",
      height: "clamp(60px, 15vw, 80px)",
      margin: "0 auto 15px",
    },
    timelineTime: {
      fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
      fontWeight: 500,
      color: "#b76e79",
      marginBottom: 5,
    },
    timelineTitle: {
      fontWeight: 700,
      fontSize: "clamp(1rem, 4vw, 1.2rem)",
      marginBottom: 5,
      color: "#4a4a4a",
    },
    softBox: {
      borderRadius: 40,
      border: "1px solid #f0e4d7",
      background: "#fff",
      padding: "clamp(15px, 4vw, 20px)",
    },
    linkBtnPrimary: {
      display: "inline-block",
      padding: "clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px)",
      borderRadius: 50,
      background: "rgba(183,110,121,0.1)",
      color: "#b76e79",
      textDecoration: "none",
      fontWeight: 600,
      border: "1px solid #b76e79",
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
    },
    linkBtn: {
      display: "inline-block",
      padding: "clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px)",
      borderRadius: 50,
      background: "#fff",
      color: "#4a4a4a",
      textDecoration: "none",
      fontWeight: 600,
      border: "1px solid #f0e4d7",
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
    },
    regalosContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "clamp(15px, 4vw, 30px)",
      flexWrap: "wrap",
    },
    regaloLink: {
      background: "#fff",
      padding: "clamp(15px, 4vw, 20px) clamp(25px, 8vw, 50px)",
      borderRadius: 60,
      textDecoration: "none",
      color: "#4a4a4a",
      fontWeight: 600,
      fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
      boxShadow: "0 5px 15px rgba(0,0,0,0.03)",
      border: "1px solid #f0e4d7",
      transition: "all 0.2s",
    },
  };

  const maxPases = Math.max(1, Number(guestData?.pasesAsignados || 1));
  const pasesFromSheet = Number(guestData?.pasesConfirmados || 0);
  const pasesMostrados =
    asistenciaActual === "Sí"
      ? pasesFromSheet > 0
        ? pasesFromSheet
        : Number(pasesConfirmados || 1)
      : 0;

  function abrirSobre() {
    setEnvelopeOpen(true);
    setSpotifyEnabled(false);
    const nonce = Date.now();
    setSpotifyNonce(nonce);

    setTimeout(() => {
      setSpotifyEnabled(true);
    }, 30);

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  }

  return (
    <>
      <Head>
        <title>Vanessa &amp; Andrés — 23 Abril 2027</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          textarea::placeholder { 
            color: #000; 
            opacity: 0.6; 
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </Head>
  
      {/* SOBRE CERRADO - PRIMERA PANTALLA */}
      {!envelopeOpen && (
        <div style={envelopeStyles.pageContainer}>
          <div style={envelopeStyles.wrap}>
            <div style={envelopeStyles.envelope}>
              <img 
                src={BACKGROUND_IMAGE}
                alt="Marco floral" 
                style={envelopeStyles.floralFrame}
              />
              
              <img 
                src={SOBRE_IMAGE}
                alt="Vanessa & Andrés 23/04/2027" 
                style={envelopeStyles.topImage}
              />
              
              <div style={envelopeStyles.content}>
                <div 
                  style={envelopeStyles.clickText}
                  role="button"
                  tabIndex={0}
                  aria-label="Abrir invitación"
                  onClick={abrirSobre}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") abrirSobre();
                  }}
                >
                  CLICK PARA ABRIR LA INVITACIÓN
                </div>
                
                <div style={envelopeStyles.reservedSection}>
                  <div style={envelopeStyles.reservedText}>
                    HEMOS RESERVADO
                  </div>
                  <div style={envelopeStyles.reservedNumber}>
                    {guestData?.pasesAsignados || 2}
                  </div>
                  <div style={envelopeStyles.reservedSubtext}>
                    LUGARES EN SU HONOR
                  </div>
                </div>
              </div>
              
              <div style={envelopeStyles.seal}>
                ✦
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVITACIÓN - SEGUNDA PANTALLA */}
      {envelopeOpen && (
        <div style={invitationStyles.page}>
          <div style={invitationStyles.card}>
            <div style={invitationStyles.names}>Vanessa & Andrés</div>
            <div style={invitationStyles.subtitle}>¡Nos casamos!</div>

            {/* Contador - CORREGIDO Y CENTRADO */}
            <div style={invitationStyles.countdownContainer}>
              <div style={invitationStyles.countdownItem}>
                <div style={invitationStyles.countdownNumber}>{timeLeft.days}</div>
                <div style={invitationStyles.countdownLabel}>Días</div>
              </div>
              <div style={invitationStyles.countdownItem}>
                <div style={invitationStyles.countdownNumber}>{timeLeft.hours}</div>
                <div style={invitationStyles.countdownLabel}>Horas</div>
              </div>
              <div style={invitationStyles.countdownItem}>
                <div style={invitationStyles.countdownNumber}>{timeLeft.minutes}</div>
                <div style={invitationStyles.countdownLabel}>Minutos</div>
              </div>
              <div style={invitationStyles.countdownItem}>
                <div style={invitationStyles.countdownNumber}>{timeLeft.seconds}</div>
                <div style={invitationStyles.countdownLabel}>Segundos</div>
              </div>
            </div>

            {/* Spotify */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              {spotifyEnabled ? (
                <iframe
                  key={spotifyNonce || "spotify"}
                  style={{ borderRadius: 14, maxWidth: "100%" }}
                  src={SPOTIFY_EMBED_URL}
                  width="340"
                  height="92"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="eager"
                />
              ) : null}
            </div>

            {/* Galería */}
            <div style={invitationStyles.galleryGrid}>
              {GALLERY_IMAGES.slice(0, 3).map((img, idx) => (
                <div key={idx} style={invitationStyles.galleryImage}>
                  <img src={img} alt={`Foto ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>

            {/* Nuestra historia */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Nuestra historia</div>
              <div style={invitationStyles.softBox}>
                {NUESTRA_HISTORIA.map((b, i) => (
                  <div key={i} style={{ marginBottom: i === NUESTRA_HISTORIA.length - 1 ? 0 : 20 }}>
                    <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: "clamp(1.5rem, 6vw, 1.8rem)", color: "#b76e79", marginBottom: 5, textAlign: "center" }}>
                      {b.title}
                    </div>
                    <p style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)", color: "#4a4a4a", textAlign: "center", lineHeight: 1.6 }}>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerario */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Itinerario</div>
              <div style={invitationStyles.timelineGrid}>
                {TIMELINE.map((t, i) => (
                  <div key={i} style={invitationStyles.cardItem}>
                    <div style={invitationStyles.timelineIconBox}>
                      <TimelineIcon type={t.iconType} size={80} />
                    </div>
                    <div style={invitationStyles.timelineTime}>{t.time}</div>
                    <div style={invitationStyles.timelineTitle}>{t.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dress code */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Dress code</div>
              <div style={{ ...invitationStyles.softBox, textAlign: "center" }}>
                <img
                  src={DRESS_CODE_IMAGE}
                  alt="Dress code"
                  style={{ width: "min(200px, 60%)", maxWidth: "100%", height: "auto", margin: "0 auto 20px", display: "block" }}
                />
                <div style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)", color: "#b76e79", marginBottom: 5 }}>{DRESS_CODE.text[0]}</div>
                <div style={{ fontSize: "clamp(0.85rem, 3vw, 0.95rem)", color: "#4a4a4a" }}>{DRESS_CODE.text[1]}</div>
              </div>
            </div>

            {/* Ubicación */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Ubicación</div>
              <div style={invitationStyles.softBox}>
                <p style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)", color: "#4a4a4a", textAlign: "center", marginBottom: 20 }}>
                  Jardín Maroma · Jiutepec, Morelos
                </p>
                <div style={{ display: "flex", gap: "clamp(10px, 3vw, 15px)", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={MAPS_URL} target="_blank" rel="noreferrer" style={invitationStyles.linkBtnPrimary}>
                    Google Maps
                  </a>
                  <a href={WAZE_URL} target="_blank" rel="noreferrer" style={invitationStyles.linkBtn}>
                    Waze
                  </a>
                </div>
              </div>
            </div>

            {/* Mesa de regalos */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Mesa de regalos</div>
              <div style={invitationStyles.softBox}>
                <div style={invitationStyles.regalosContainer}>
                  {MESA_REGALOS.map((x, i) => (
                    <a key={i} href={x.url} target="_blank" rel="noreferrer" style={invitationStyles.regaloLink}>
                      {x.type === "amazon" ? "Amazon" : "Liverpool"}
                    </a>
                  ))}
                </div>

                <div style={{ ...invitationStyles.softBox, marginTop: 20 }}>
                  <p style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)", color: "#4a4a4a", textAlign: "center" }}>
                    {REGALO_MONETARIO.subtitle}
                  </p>
                  <div style={{ marginTop: 10, textAlign: "center" }}>
                    <div style={{ fontSize: "clamp(0.8rem, 3vw, 0.9rem)", color: "#a17a6b" }}>
                      <b>{REGALO_MONETARIO.accountLabel}:</b>
                    </div>
                    <div style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)", color: "#4a4a4a", wordBreak: "break-word" }}>
                      {REGALO_MONETARIO.accountValue}
                    </div>
                  </div>
                  <div style={{ marginTop: 10, fontSize: "clamp(0.9rem, 3vw, 1rem)", color: "#4a4a4a", textAlign: "center" }}>
                    {REGALO_MONETARIO.nameValue}
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Confirma tu asistencia</div>
              <div style={invitationStyles.formContainer}>
                <div style={invitationStyles.formGroup}>
                  <div style={invitationStyles.label}>
                    {guestLoading ? "Cargando invitado…" : "Confirmación de asistencia"}
                    <span style={{ marginLeft: 8, padding: "4px 8px", background: "#f0e4d7", borderRadius: 50, fontSize: "0.8rem" }}>
                      {guestId ? `ID: ${guestId}` : "ID no detectado"}
                    </span>
                  </div>

                  {guestData?.nombre && (
                    <div style={{ fontSize: "clamp(0.85rem, 3vw, 0.9rem)", color: "#a17a6b", marginBottom: 10 }}>
                      <b>{guestData.nombre}</b>, nos dará mucho gusto verte.
                      {guestData.pasesAsignados ? (
                        <> · Pases asignados: <b>{guestData.pasesAsignados}</b></>
                      ) : null}
                    </div>
                  )}

                  {guestLoadError && (
                    <div style={{ color: "#b76e79", marginBottom: 10 }}>No se pudo cargar tu invitación: {guestLoadError}</div>
                  )}

                  {yaConfirmo && (
                    <div style={{ color: "#b76e79", marginBottom: 10 }}>
                      {asistenciaActual === "Sí" ? (
                        <>
                          Gracias por confirmar <b>{pasesMostrados}</b> {pasesMostrados === 1 ? "pase" : "pases"} 🥳
                          <br />
                          Los esperamos con toda la actitud ✨
                        </>
                      ) : (
                        <>Gracias por avisarnos, te vamos a extrañar 💔</>
                      )}
                    </div>
                  )}

                  {!yaConfirmo && (
                    <>
                      <textarea
                        style={invitationStyles.textarea}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe un mensaje de buenos deseos (opcional)"
                        disabled={rsvpStatus === "saving"}
                        rows="3"
                      />

                      {guestData?.pasesAsignados && String(guestData.pasesAsignados).trim() !== "" && (
                        <div style={{ marginTop: 15 }}>
                          <div style={invitationStyles.label}>Pases a confirmar:</div>
                          <select
                            value={Math.min(Math.max(1, pasesConfirmados), maxPases)}
                            onChange={(e) => setPasesConfirmados(Number(e.target.value))}
                            style={invitationStyles.select}
                            disabled={rsvpStatus === "saving"}
                          >
                            {Array.from({ length: maxPases }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n} {n === 1 ? "pase" : "pases"}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "clamp(10px, 3vw, 15px)", marginTop: 20, flexWrap: "wrap" }}>
                        <button
                          style={{ ...invitationStyles.button, width: "auto", flex: 1, minWidth: "140px" }}
                          onClick={() => confirmar("Sí")}
                          disabled={rsvpStatus === "saving"}
                        >
                          Sí asistiré
                        </button>

                        <button
                          style={{ ...invitationStyles.button, width: "auto", flex: 1, minWidth: "140px", background: "#a17a6b" }}
                          onClick={() => confirmar("No")}
                          disabled={rsvpStatus === "saving"}
                        >
                          No podré asistir
                        </button>
                      </div>
                    </>
                  )}

                  {rsvpStatus === "saving" && <div style={{ marginTop: 10, color: "#a17a6b" }}>Guardando tu confirmación…</div>}
                  {rsvpStatus === "error" && <div style={{ marginTop: 10, color: "#b76e79" }}>{rsvpError}</div>}

                  <div style={{ marginTop: 15, fontSize: "0.8rem", color: "#a17a6b" }}>
                    Tip: tu enlace debe incluir <code>?id=AV001</code> (cada invitado tiene un ID).
                  </div>
                </div>
              </div>
            </div>

            {/* Nota final */}
            <div style={{ marginTop: 30, fontSize: "clamp(0.8rem, 3vw, 0.9rem)", color: "#a17a6b", textAlign: "center" }}>
              *No se permiten menores de 16 años · Invitación personal · Sin acompañantes adicionales
            </div>
          </div>
        </div>
      )}
    </>
  );
}
