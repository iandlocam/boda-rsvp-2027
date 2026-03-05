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

/** ✅ NUEVO: Componente de íconos personalizables para el itinerario */
function TimelineIcon({ type = "ceremony", size = 48 }) {
  // ====================================================
  // 🖼️ CONFIGURACIÓN DE ÍCONOS DEL ITINERARIO - CÁMBIALOS AQUÍ
  // ====================================================
  
  // Puedes cambiar estas URLs por las imágenes que quieras usar
  // Las imágenes deben estar en la carpeta /public de tu proyecto
  const ICONOS = {
    ceremony: "/iconos/Ceremonia.png",     // Ícono para Ceremonia
    reception: "/iconos/Cocteel.png",     // Ícono para Coctel
    dinner: "/iconos/Cena.png",             // Ícono para Cena
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
  const TIMELINE_ICON_SIZE = 52; // Aumentado de 44 a 52
  
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
    text:
      `Formal / jardín elegante
      Te sugerimos telas frescas y cómodas. Evita tacones muy delgados por el terreno.`
  };

  const MESA_REGALOS = [
    { type: "liverpool", url: "https://www.liverpool.com.mx/" },
    { type: "amazon", url: "https://www.amazon.com.mx/" },
  ];

  const REGALO_MONETARIO = {
    subtitle: "Si deseas apoyarnos en esta nueva etapa:",
    accountLabel: "CLABE / Cuenta",
    accountValue: "000000000000000000",
    nameValue: "Vanessa y Andrés",
  };

  const styles = {
    page: {
      position: "relative",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      backgroundImage: `linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.88)), url(${BACKGROUND_IMAGE})`,
      backgroundSize: "contain",
      backgroundPosition: "center top",
      backgroundRepeat: "repeat-y",
      backgroundAttachment: "scroll",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: "100%",
      maxWidth: 760,
      background: "#ffffff",
      border: "1px solid rgba(31, 65, 95, 0.12)",
      borderRadius: 22,
      boxShadow: "0 18px 50px rgba(12, 22, 33, 0.10)",
      padding: "52px 22px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    smallCaps: {
      fontFamily: '"Cormorant Garamond", serif',
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      fontSize: 16,
      color: "rgba(19, 32, 45, 0.70)",
      marginBottom: 10,
    },
    namesGold: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: 68,
      lineHeight: 1.1,
      paddingTop: 10,
      margin: "8px 0 12px",
      backgroundImage:
        "linear-gradient(90deg, #7a5b22 0%, #d6b25e 25%, #f3e2a6 50%, #d6b25e 75%, #7a5b22 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      textShadow: "0 8px 22px rgba(0,0,0,0.10)",
      display: "inline-block",
      overflow: "visible",
    },
    namesBlack: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: 68,
      lineHeight: 1.1,
      paddingTop: 10,
      margin: "8px 0 12px",
      color: "#0b0f14",
      textShadow: "0 10px 28px rgba(0,0,0,0.10)",
      display: "inline-block",
      overflow: "visible",
    },
    subtitle: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 18,
      margin: "0 0 26px",
      color: "rgba(19, 32, 45, 0.70)",
    },
    quote: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 18,
      fontStyle: "italic",
      color: "rgba(176, 141, 87, 0.95)",
      margin: "18px auto 34px",
      maxWidth: 560,
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 10,
      maxWidth: 520,
      margin: "0 auto 28px",
    },
    pill: {
      borderRadius: 16,
      padding: "14px 10px",
      border: "1px solid rgba(31, 65, 95, 0.12)",
      background: "rgba(248, 251, 255, 0.85)",
    },
    pillNum: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 26,
      marginBottom: 2,
      color: "#1f415f",
    },
    pillLbl: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 12,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "rgba(19, 32, 45, 0.60)",
    },
    divider: {
      width: 120,
      height: 1,
      background:
        "linear-gradient(90deg, transparent, rgba(176,141,87,0.7), transparent)",
      margin: "26px auto",
    },
    spotifyWrap: {
      marginTop: 18,
      display: "flex",
      justifyContent: "center",
    },
    section: { maxWidth: 560, margin: "28px auto 0", textAlign: "left", padding: "0 6px" },
    sectionTitleCenterBig: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 24,
      fontWeight: 700,
      textAlign: "center",
      margin: "0 0 12px",
      color: "rgba(19, 32, 45, 0.90)",
    },
    sectionText: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "rgba(19, 32, 45, 0.72)",
      margin: 0,
      lineHeight: 1.5,
    },
    softBox: {
      borderRadius: 16,
      border: "1px solid rgba(31, 65, 95, 0.12)",
      background: "rgba(248, 251, 255, 0.85)",
      padding: 14,
    },
    chipsCol: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: "center",
      marginTop: 12,
    },
    linkBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      background: "white",
      cursor: "pointer",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "#0b0f14",
      textDecoration: "none",
      width: "100%",
      maxWidth: 360,
    },
    linkBtnPrimary: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      background: "rgba(214, 178, 94, 0.22)",
      cursor: "pointer",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "#0b0f14",
      textDecoration: "none",
      width: "100%",
      maxWidth: 360,
    },
    photoStrip: {
      maxWidth: 560,
      margin: "22px auto 0",
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(31, 65, 95, 0.10)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
    photo: { width: "100%", height: 220, objectFit: "cover", display: "block" },
    timelineOuter: { maxWidth: 560, margin: "10px auto 0" },
    timelineCard: {
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(31,65,95,0.10)",
      background: "rgba(255,255,255,0.55)",
    },
    timelineRow: {
      display: "grid",
      gridTemplateColumns: "112px 1fr",
      gap: 14,
      alignItems: "center",
      padding: "16px 16px",
      borderBottom: "1px solid rgba(31,65,95,0.10)",
    },
    timelineIconBox: {
      width: 96,
      height: 96,
      borderRadius: "50%",
      background: "rgba(214, 178, 94, 0.14)",
      border: "1px solid rgba(176,141,87,0.32)",
      display: "grid",
      placeItems: "center",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 10px 24px rgba(0,0,0,0.06)",
    },
    timelineTextCol: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    timelineTitle: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 21, // Aumentado de 19 a 21 (2 puntos más)
      fontWeight: 700,
      margin: 0,
      color: "rgba(19,32,45,0.90)",
    },
    timelineTime: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16, // Aumentado de 14 a 16 (2 puntos más)
      marginTop: 6,
      color: "rgba(19,32,45,0.62)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
    },
    envelopeWrap: {
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
    envelopeTopImage: {
      width: "calc(100% - 40px)",
      height: "auto",
      maxHeight: "480px",
      objectFit: "contain",
      objectPosition: "center",
      display: "block",
      margin: "20px auto 10px",
      borderBottom: "2px solid rgba(184,107,107,0.2)",
    },
    envelopeContent: {
      flex: 1,
      padding: "0 20px 20px 20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
      textAlign: "center",
    },
    envelopeClickText: {
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
    envelopeSeal: {
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
    // Marco floral para ambas pantallas
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
    logoBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none",
      cursor: "pointer",
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
      transform: "translateZ(0)",
    },
    moneyBox: {
      borderRadius: 16,
      border: "1px solid rgba(31, 65, 95, 0.12)",
      background: "rgba(248, 251, 255, 0.85)",
      padding: 14,
      marginTop: 14,
    },
    monoLine: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "rgba(19, 32, 45, 0.82)",
      margin: "6px 0 0",
      wordBreak: "break-word",
      textAlign: "center",
    },
    rsvpWrap: {
      maxWidth: 520,
      margin: "24px auto 0",
      textAlign: "left",
      border: "1px solid rgba(31, 65, 95, 0.12)",
      background: "rgba(248, 251, 255, 0.85)",
      borderRadius: 16,
      padding: 16,
    },
    rsvpTitle: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 18,
      margin: "0 0 10px",
      color: "rgba(19, 32, 45, 0.85)",
    },
    input: {
      width: "100%",
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      padding: "10px 12px",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      background: "rgba(255,255,255,0.85)",
      outline: "none",
      resize: "vertical",
      minHeight: 90,
      color: "#000",
    },
    rsvpRow: {
      display: "flex",
      gap: 10,
      marginTop: 10,
      flexWrap: "wrap",
      alignItems: "center",
    },
    btn: {
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      padding: "10px 14px",
      background: "white",
      cursor: "pointer",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "#000",
    },
    btnPrimary: {
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      padding: "10px 14px",
      background: "rgba(214, 178, 94, 0.22)",
      cursor: "pointer",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "#000",
    },
    statusOk: {
      marginTop: 10,
      fontFamily: '"Cormorant Garamond", serif',
      color: "rgba(19, 32, 45, 0.90)",
    },
    statusErr: {
      marginTop: 10,
      fontFamily: '"Cormorant Garamond", serif',
      color: "#b42318",
    },
    hint: {
      marginTop: 8,
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 13,
      color: "rgba(19, 32, 45, 0.55)",
    },
    idBadge: {
      display: "inline-block",
      borderRadius: 999,
      padding: "6px 10px",
      border: "1px solid rgba(31, 65, 95, 0.12)",
      background: "rgba(255,255,255,0.65)",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 13,
      color: "#000",
      marginLeft: 8,
    },
    select: {
      width: "100%",
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      padding: "10px 12px",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      background: "rgba(255,255,255,0.85)",
      color: "#0b0f14",
      outline: "none",
    },
    note: {
      marginTop: 14,
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 13,
      color: "rgba(19, 32, 45, 0.55)",
    },
  };

  const nameStyleObj = NAME_STYLE === "black" ? styles.namesBlack : styles.namesGold;
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`textarea::placeholder { color: #000; opacity: 0.6; }`}</style>
      </Head>
  
      <div style={styles.page}>
        {/* SOBRE CERRADO - PRIMERA PANTALLA */}
        {!envelopeOpen && (
          <div
            style={styles.envelopeWrap}
            role="button"
            tabIndex={0}
            aria-label="Abrir invitación"
            onClick={abrirSobre}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") abrirSobre();
            }}
          >
            <div style={styles.envelope}>
              {/* MARCO FLORAL EN EL SOBRE */}
              <img 
                src={BACKGROUND_IMAGE}
                alt="Marco floral" 
                style={styles.floralFrame}
              />
              
              <img 
                src={SOBRE_IMAGE}
                alt="Vanessa & Andrés 23/04/2027" 
                style={styles.envelopeTopImage}
              />
              
              <div style={styles.envelopeContent}>
                <div style={styles.envelopeClickText}>
                  CLICK PARA ABRIR LA INVITACIÓN
                </div>
                
                <div style={styles.reservedSection}>
                  <div style={styles.reservedText}>
                    HEMOS RESERVADO
                  </div>
                  <div style={styles.reservedNumber}>
                    {guestData?.pasesAsignados || 2}
                  </div>
                  <div style={styles.reservedSubtext}>
                    LUGARES EN SU HONOR
                  </div>
                </div>
              </div>
              
              <div style={styles.envelopeSeal}>
                ✦
              </div>
            </div>
          </div>
        )}

        {/* INVITACIÓN - SEGUNDA PANTALLA */}
        {envelopeOpen && (
          <div style={styles.card}>
            {/* MARCO FLORAL EN LA INVITACIÓN */}
            <img 
              src={BACKGROUND_IMAGE}
              alt="Marco floral" 
              style={styles.floralFrame}
            />
            
            <div style={styles.smallCaps}>Nuestra boda</div>
            <h1 style={nameStyleObj}>Vanessa &amp; Andrés</h1>
            <div style={styles.subtitle}>Jiutepec, Morelos · Jardín Maroma</div>

            <div style={styles.quote}>
              “El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma
              dirección.”
            </div>

            <div style={styles.divider} />

            <div style={styles.grid}>
              <div style={styles.pill}>
                <div style={styles.pillNum}>{timeLeft.days}</div>
                <div style={styles.pillLbl}>Días</div>
              </div>
              <div style={styles.pill}>
                <div style={styles.pillNum}>{timeLeft.hours}</div>
                <div style={styles.pillLbl}>Horas</div>
              </div>
              <div style={styles.pill}>
                <div style={styles.pillNum}>{timeLeft.minutes}</div>
                <div style={styles.pillLbl}>Min</div>
              </div>
              <div style={styles.pill}>
                <div style={styles.pillNum}>{timeLeft.seconds}</div>
                <div style={styles.pillLbl}>Seg</div>
              </div>
            </div>

            <div style={styles.spotifyWrap}>
              {spotifyEnabled ? (
                <iframe
                  key={spotifyNonce || "spotify"}
                  style={{ borderRadius: 14 }}
                  src={SPOTIFY_EMBED_URL}
                  width="340"
                  height="92"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="eager"
                />
              ) : null}
            </div>

            <div style={styles.photoStrip}>
              <img alt="Foto 1" src={GALLERY_IMAGES[0]} style={styles.photo} />
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>Nuestra historia</div>
              <div style={styles.softBox}>
                {NUESTRA_HISTORIA.map((b, i) => (
                  <div key={i} style={{ marginBottom: i === NUESTRA_HISTORIA.length - 1 ? 0 : 12 }}>
                    <div
                      style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 18,
                        fontWeight: 700,
                        margin: "0 0 4px",
                        color: "rgba(19, 32, 45, 0.88)",
                        textAlign: "center",
                      }}
                    >
                      {b.title}
                    </div>
                    <p style={{ ...styles.sectionText, textAlign: "center" }}>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.photoStrip}>
              <img alt="Foto 2" src={GALLERY_IMAGES[1]} style={styles.photo} />
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>Itinerario</div>
              <div style={styles.timelineOuter}>
                <div style={styles.timelineCard}>
                  {TIMELINE.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.timelineRow,
                        borderBottom: i === TIMELINE.length - 1 ? "none" : styles.timelineRow.borderBottom,
                      }}
                    >
                      <div style={styles.timelineIconBox}>
                        <TimelineIcon type={t.iconType} size={TIMELINE_ICON_SIZE} />
                      </div>
                      <div style={styles.timelineTextCol}>
                        <p style={styles.timelineTitle}>{t.title}</p>
                        <div style={styles.timelineTime}>{t.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ ...styles.section, position: "relative", zIndex: 2 }}>
              <div style={styles.sectionTitleCenterBig}>{DRESS_CODE.title}</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "18px 0 10px",
                }}
              >
                <img
                  src={DRESS_CODE_IMAGE}
                  alt=" "
                  style={{
                    width: 200,
                    maxWidth: "100%",
                    height: "auto",
                    opacity: 0.90,
                    filter: "grayscale(20%) contrast(105%)",
                  }}
                />
              </div>
              <div style={styles.softBox}>
                <p style={{ ...styles.sectionText, textAlign: "center" }}>
                  {DRESS_CODE.text}
                </p>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>Ubicación</div>
              <div style={styles.softBox}>
                <p style={{ ...styles.sectionText, textAlign: "center" }}>
                  Jardín Maroma · Jiutepec, Morelos
                </p>
                <div style={styles.chipsCol}>
                  <a href={MAPS_URL} target="_blank" rel="noreferrer" style={styles.linkBtnPrimary}>
                    Google Maps
                  </a>
                  <a href={WAZE_URL} target="_blank" rel="noreferrer" style={styles.linkBtn}>
                    Waze
                  </a>
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>Mesa de regalos</div>
              <div style={styles.softBox}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                  {MESA_REGALOS.map((x, i) => (
                    <a key={i} href={x.url} target="_blank" rel="noreferrer" style={styles.logoBtn}>
                      <BrandLogo type={x.type} />
                    </a>
                  ))}
                </div>

                <div style={styles.moneyBox}>
                  <p style={{ ...styles.sectionText, textAlign: "center" }}>
                    {REGALO_MONETARIO.subtitle}
                  </p>
                  <div style={{ marginTop: 10, textAlign: "center" }}>
                    <div style={{ ...styles.sectionText, textAlign: "center" }}>
                      <b>{REGALO_MONETARIO.accountLabel}:</b>
                    </div>
                    <div style={styles.monoLine}>{REGALO_MONETARIO.accountValue}</div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={styles.monoLine}>{REGALO_MONETARIO.nameValue}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.rsvpWrap}>
              <div style={styles.rsvpTitle}>
                {guestLoading ? "Cargando invitado…" : "Confirmación de asistencia"}
                <span style={styles.idBadge}>{guestId ? `ID: ${guestId}` : "ID no detectado"}</span>
              </div>

              {guestData?.nombre && (
                <div style={styles.hint}>
                  <b>{guestData.nombre}</b>, nos dará mucho gusto verte. ✨
                  {guestData.pasesAsignados ? (
                    <>
                      {" "}
                      · Pases asignados: <b>{guestData.pasesAsignados}</b>
                    </>
                  ) : null}
                </div>
              )}

              {guestLoadError && (
                <div style={styles.statusErr}>No se pudo cargar tu invitación: {guestLoadError}</div>
              )}

              {yaConfirmo && (
                <div style={styles.statusOk}>
                  {asistenciaActual === "Sí" ? (
                    <>
                      Gracias por confirmar <b>{pasesMostrados}</b>{" "}
                      {pasesMostrados === 1 ? "pase" : "pases"} 🥳
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
                    style={styles.input}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Escribe un mensaje de buenos deseos (opcional)"
                    disabled={rsvpStatus === "saving"}
                  />

                  {guestData?.pasesAsignados && String(guestData.pasesAsignados).trim() !== "" && (
                    <div style={{ marginTop: 10 }}>
                      <div
                        style={{
                          fontFamily: '"Cormorant Garamond", serif',
                          marginBottom: 6,
                          color: "#0b0f14",
                        }}
                      >
                        Pases a confirmar:
                      </div>

                      <select
                        value={Math.min(Math.max(1, pasesConfirmados), maxPases)}
                        onChange={(e) => setPasesConfirmados(Number(e.target.value))}
                        style={styles.select}
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

                  <div style={styles.rsvpRow}>
                    <button
                      style={styles.btnPrimary}
                      onClick={() => confirmar("Sí")}
                      disabled={rsvpStatus === "saving"}
                    >
                      Sí asistiré
                    </button>

                    <button
                      style={styles.btn}
                      onClick={() => confirmar("No")}
                      disabled={rsvpStatus === "saving"}
                    >
                      No podré asistir
                    </button>
                  </div>
                </>
              )}

              {rsvpStatus === "saving" && <div style={styles.hint}>Guardando tu confirmación…</div>}
              {rsvpStatus === "error" && <div style={styles.statusErr}>{rsvpError}</div>}

              <div style={styles.hint}>
                Tip: tu enlace debe incluir <code>?id=AV001</code> (cada invitado tiene un ID).
              </div>
            </div>

            <div style={styles.note}>
              *No se permiten menores de 16 años · Invitación personal · Sin acompañantes adicionales
            </div>
          </div>
        )}
      </div>
    </>
  );
}
