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

/** ✅ Monograma AV (nuevo: limpio, elegante, tipo sello) */
function MonogramaAV({ size = 64, color = "rgba(19,32,45,0.86)" }) {
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
          <stop offset="0" stopColor="rgba(176,141,87,0.70)" />
          <stop offset="1" stopColor="rgba(19,32,45,0.22)" />
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
        stroke="rgba(255,255,255,0.28)"
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

/** ✅ Sello de cera “realista” (borde irregular + relieve + brillo) */
function WaxSeal({ onClick, disabled = false, label = "Abrir", size = 100 }) {
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
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.22)" />
          </filter>

          <radialGradient id="wax" cx="30%" cy="25%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="18%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="55%" stopColor="rgba(173,34,44,0.96)" />
            <stop offset="100%" stopColor="rgba(92,14,24,1)" />
          </radialGradient>

          <radialGradient id="shine" cx="22%" cy="18%" r="45%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
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
          <use href="#blob" fill="url(#wax)" />
          <use href="#blob" fill="url(#shine)" opacity="0.55" />
          <use href="#blob" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

          {/* relieve central (grabado AV) */}
          <path
            d="M42 76 L52 44 L62 76"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <path
            d="M47 64 H57"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M66 46 L78 76 L90 46"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
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
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 1px 0 rgba(0,0,0,0.18), 0 10px 24px rgba(0,0,0,0.28)",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/** ✅ Íconos sobrios (línea) */
function TimelineIcon({ type = "ceremony", size = 36 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(19,32,45,0.86)",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "ceremony") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M6 10V8a6 6 0 0 1 12 0v2" />
        <path d="M4 10h16" />
        <path d="M7 10v9" />
        <path d="M17 10v9" />
        <path d="M5 19h14" />
        <path d="M12 4v2" />
      </svg>
    );
  }
  if (type === "reception") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M7 3h10v4a5 5 0 0 1-10 0V3Z" />
        <path d="M12 12v5" />
        <path d="M8.5 21h7" />
      </svg>
    );
  }
  if (type === "dinner") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M7 3v7" />
        <path d="M5.5 3v7" />
        <path d="M8.5 3v7" />
        <path d="M7 10v11" />
        <path d="M14 3v18" />
        <path d="M18.5 3c-1.7 0-3 1.3-3 3v4h3V6" />
      </svg>
    );
  }
  if (type === "party") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M12 8l1.2 2.5L16 12l-2.8 1.5L12 16l-1.2-2.5L8 12l2.8-1.5L12 8Z" />
      </svg>
    );
  }
  // close
  return (
    <svg {...common} aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

/** ✅ Flores primavera elegantes (overlay en esquinas) */
function FloralCorners() {
  return (
    <>
      {/* esquina superior izquierda */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="220"
        height="220"
        viewBox="0 0 220 220"
        style={{
          position: "absolute",
          left: -20,
          top: -30,
          opacity: 0.55,
          pointerEvents: "none",
          filter: "blur(0px)",
        }}
      >
        <defs>
          <linearGradient id="petalA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,200,64,0.95)" />
            <stop offset="1" stopColor="rgba(255,140,64,0.95)" />
          </linearGradient>
          <linearGradient id="petalB" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(80,165,255,0.90)" />
            <stop offset="1" stopColor="rgba(40,110,210,0.90)" />
          </linearGradient>
          <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(75,170,130,0.70)" />
            <stop offset="1" stopColor="rgba(35,120,90,0.70)" />
          </linearGradient>
        </defs>

        {/* ramas */}
        <path
          d="M30 150 C60 120, 92 92, 140 70"
          fill="none"
          stroke="rgba(19,32,45,0.20)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M48 170 C75 140, 110 110, 168 86"
          fill="none"
          stroke="rgba(19,32,45,0.18)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* hojas */}
        <path d="M78 118 C70 98, 92 92, 98 110 C90 124, 84 126, 78 118Z" fill="url(#leaf)" opacity="0.65" />
        <path d="M110 92 C100 74, 124 70, 130 86 C122 100, 116 102, 110 92Z" fill="url(#leaf)" opacity="0.55" />

        {/* flor 1 */}
        <g transform="translate(78 120)">
          <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.70)" />
          <circle cx="0" cy="0" r="4" fill="rgba(176,141,87,0.70)" />
          <ellipse cx="-14" cy="0" rx="16" ry="10" fill="url(#petalA)" opacity="0.85" />
          <ellipse cx="14" cy="0" rx="16" ry="10" fill="url(#petalA)" opacity="0.85" />
          <ellipse cx="0" cy="-14" rx="10" ry="16" fill="url(#petalB)" opacity="0.75" />
          <ellipse cx="0" cy="14" rx="10" ry="16" fill="url(#petalB)" opacity="0.75" />
        </g>

        {/* flor 2 */}
        <g transform="translate(132 84) scale(0.9)">
          <circle cx="0" cy="0" r="7" fill="rgba(255,255,255,0.65)" />
          <circle cx="0" cy="0" r="3.5" fill="rgba(176,141,87,0.65)" />
          <ellipse cx="-12" cy="0" rx="14" ry="9" fill="rgba(255,170,90,0.85)" />
          <ellipse cx="12" cy="0" rx="14" ry="9" fill="rgba(255,170,90,0.85)" />
          <ellipse cx="0" cy="-12" rx="9" ry="14" fill="rgba(255,210,70,0.85)" />
          <ellipse cx="0" cy="12" rx="9" ry="14" fill="rgba(255,210,70,0.85)" />
        </g>
      </svg>

      {/* esquina inferior derecha */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="240"
        height="240"
        viewBox="0 0 240 240"
        style={{
          position: "absolute",
          right: -30,
          bottom: -40,
          opacity: 0.45,
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient id="petalC" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(255,195,80,0.90)" />
            <stop offset="1" stopColor="rgba(255,120,80,0.90)" />
          </linearGradient>
          <linearGradient id="petalD" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(70,170,255,0.85)" />
            <stop offset="1" stopColor="rgba(60,120,220,0.85)" />
          </linearGradient>
          <linearGradient id="leaf2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(85,185,140,0.65)" />
            <stop offset="1" stopColor="rgba(35,120,90,0.65)" />
          </linearGradient>
        </defs>

        <path
          d="M210 80 C180 110, 150 145, 92 175"
          fill="none"
          stroke="rgba(19,32,45,0.18)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path d="M150 150 C165 130, 190 144, 176 166 C160 172, 154 168, 150 150Z" fill="url(#leaf2)" opacity="0.6" />

        <g transform="translate(160 150)">
          <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.65)" />
          <circle cx="0" cy="0" r="4" fill="rgba(176,141,87,0.65)" />
          <ellipse cx="-14" cy="0" rx="16" ry="10" fill="url(#petalC)" opacity="0.80" />
          <ellipse cx="14" cy="0" rx="16" ry="10" fill="url(#petalC)" opacity="0.80" />
          <ellipse cx="0" cy="-14" rx="10" ry="16" fill="url(#petalD)" opacity="0.72" />
          <ellipse cx="0" cy="14" rx="10" ry="16" fill="url(#petalD)" opacity="0.72" />
        </g>
      </svg>
    </>
  );
}

export default function Home() {
  const router = useRouter();

  const weddingDateMs = useMemo(() => new Date("2027-04-23T16:00:00").getTime(), []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // ✅ SOBRE
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // ✅ Spotify: montar después del click (gesto usuario)
  const [spotifyNonce, setSpotifyNonce] = useState(0);
  const [spotifyEnabled, setSpotifyEnabled] = useState(false);

  // RSVP states
  const [guestId, setGuestId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("idle"); // idle | saving | ok | error
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpResult, setRsvpResult] = useState(null);

  const [guestData, setGuestData] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestLoadError, setGuestLoadError] = useState("");
  const [yaConfirmo, setYaConfirmo] = useState(false);
  const [asistenciaActual, setAsistenciaActual] = useState("");

  // ✅ selector de pases
  const [pasesConfirmados, setPasesConfirmados] = useState(1);

  // Lee ?id=AV001
  useEffect(() => {
    if (!router.isReady) return;
    const id = router.query.id;
    if (typeof id === "string") setGuestId(id.trim());
  }, [router.isReady, router.query.id]);

  // Cargar invitado
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestId]);

  // Contador
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

  const GALLERY_PHOTOS = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=70",
  ];

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

  // ✅ Itinerario (layout: icono izquierda, texto y hora debajo)
  const TIMELINE = [
    { time: "4:00 PM", title: "Ceremonia", iconType: "ceremony" },
    { time: "5:00 PM", title: "Recepción", iconType: "reception" },
    { time: "7:30 PM", title: "Cena", iconType: "dinner" },
    { time: "9:00 PM", title: "Fiesta", iconType: "party" },
    { time: "3:00 AM", title: "Cierre", iconType: "close" },
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "72px 18px",
      background:
        "radial-gradient(1200px 600px at 50% -10%, rgba(122, 170, 220, 0.25), rgba(248, 251, 255, 1) 60%)",
      color: "#13202D",
      display: "flex",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      maxWidth: 760,
      background: "rgba(255,255,255,0.78)",
      border: "1px solid rgba(31, 65, 95, 0.12)",
      borderRadius: 22,
      boxShadow: "0 18px 50px rgba(12, 22, 33, 0.10)",
      padding: "52px 22px",
      textAlign: "center",
      backdropFilter: "blur(6px)",

      // ✅ para flores
      position: "relative",
      overflow: "hidden",
    },

    // ✅ “Nuestra boda” más grande
    smallCaps: {
      fontFamily: '"Cormorant Garamond", serif',
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      fontSize: 16,
      color: "rgba(19, 32, 45, 0.70)",
      marginBottom: 10,
    },

    // ✅ Ajustes para que NO se corten letras grandes (A/V)
    namesGold: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: 68,
      lineHeight: 1.10,
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
      lineHeight: 1.10,
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
    infoBlock: {
      fontFamily: '"Cormorant Garamond", serif',
      marginTop: 14,
      color: "rgba(19, 32, 45, 0.78)",
      fontSize: 18,
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

    // Secciones
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

    photoStrip: {
      maxWidth: 560,
      margin: "22px auto 0",
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(31, 65, 95, 0.10)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
    photo: { width: "100%", height: 220, objectFit: "cover", display: "block" },

    // ✅ ITINERARIO: centrado + layout icono izquierda, texto/hora derecha (icono 2.5cm aprox)
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
      width: 96, // ~ 2.5cm
      height: 96, // ~ 2.5cm
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
      fontSize: 19,
      fontWeight: 700,
      margin: 0,
      color: "rgba(19,32,45,0.90)",
    },
    timelineTime: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 14,
      marginTop: 6,
      color: "rgba(19,32,45,0.62)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
    },

    // ✅ Sobre
    envelopeStage: {
      width: "100%",
      maxWidth: 760,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "12px 0",
    },
    envelopeWrap: {
      width: "100%",
      maxWidth: 560,
      position: "relative",
      borderRadius: 26,
      padding: "18px 16px 18px",
      background: "rgba(255,255,255,0.55)",
      border: "1px solid rgba(31,65,95,0.10)",
      boxShadow: "0 18px 50px rgba(12, 22, 33, 0.10)",
      backdropFilter: "blur(6px)",
    },
    envelope: {
      width: "100%",
      height: 340,
      position: "relative",
      borderRadius: 22,
      overflow: "hidden",
      border: "1px solid rgba(31,65,95,0.14)",
      background: "linear-gradient(180deg, rgba(160,176,190,0.92), rgba(140,160,178,0.92))",
      perspective: 1200,
      transformStyle: "preserve-3d",
    },

    // ✅ Flap content (mejor lectura fecha)
    envelopeFlap: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 210,
      transformOrigin: "top center",
      transformStyle: "preserve-3d",
      transform: envelopeOpen ? "rotateX(180deg)" : "rotateX(0deg)",
      transition: "transform 980ms cubic-bezier(0.2, 0.85, 0.2, 1)",
      background: "linear-gradient(180deg, rgba(165,182,198,0.95), rgba(135,156,176,0.95))",
      clipPath: "polygon(0 0, 100% 0, 50% 80%)",
      borderBottom: "1px solid rgba(31,65,95,0.14)",
      backfaceVisibility: "hidden",
      zIndex: 4,
    },
    flapContent: {
      position: "absolute",
      top: 18,
      left: 0,
      right: 0,
      textAlign: "center",
      zIndex: 6,
      pointerEvents: "none",
      display: "grid",
      placeItems: "center",
      gap: 8,
    },
    flapNames: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: "0.04em",
      color: "rgba(19,32,45,0.88)",
      textTransform: "uppercase",
      textShadow: "0 1px 0 rgba(255,255,255,0.35)",
    },
    flapDatePill: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.42)",
      border: "1px solid rgba(31,65,95,0.14)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 13,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "rgba(19,32,45,0.82)",
    },

    // ✅ Carta (leyenda abajo para que NO la tape el sello)
    envelopePaper: {
      position: "absolute",
      left: 18,
      right: 18,
      bottom: 18,
      top: 52,
      borderRadius: 16,
      background: "linear-gradient(180deg, rgba(252,248,240,0.98), rgba(248,242,232,0.98))",
      border: "1px solid rgba(176,141,87,0.25)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 18,
      transform: envelopeOpen ? "translateY(-12px)" : "translateY(26px)",
      transition: "transform 900ms cubic-bezier(0.2, 0.85, 0.2, 1)",
      zIndex: 1,
    },
    envelopePaperText: {
      textAlign: "center",
      fontFamily: '"Cormorant Garamond", serif',
      color: "rgba(19,32,45,0.82)",
      width: "100%",
    },
    envelopeLegend: {
      marginTop: 14,
      fontSize: 14,
      color: "rgba(19,32,45,0.62)",
    },

    // ✅ Sello (posición ajustada para no tapar texto)
    sealStage: {
      position: "absolute",
      left: "50%",
      top: 192,
      transform: "translateX(-50%)",
      zIndex: 8,
    },

    openHint: {
      marginTop: 12,
      textAlign: "center",
      fontFamily: '"Cormorant Garamond", serif',
      color: "rgba(19,32,45,0.70)",
      fontSize: 14,
    },

    // RSVP UI (igual que tu base)
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
    // ✅ gesto del usuario: abrimos el sobre
    setEnvelopeOpen(true);

    // ✅ Autoplay: montamos spotify DESPUÉS del click (y forzamos reload)
    setSpotifyEnabled(false);
    const nonce = Date.now();
    setSpotifyNonce(nonce);

    // mount en el siguiente tick (a veces ayuda en iOS)
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
        <title>Andrés & Vanessa — 23 abril 2027</title>
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
        {!envelopeOpen ? (
          <div style={styles.envelopeStage}>
            <div style={styles.envelopeWrap}>
              <div style={styles.envelope}>
                {/* ✅ Carta */}
                <div style={styles.envelopePaper}>
                  <div style={styles.envelopePaperText}>
                    <div style={{ fontSize: 16, opacity: 0.9 }}>(Invitación)</div>
                    <div style={styles.envelopeLegend}>Toca el sello para abrir ✨</div>
                  </div>
                </div>

                {/* ✅ Solapa (monograma + nombres + FECHA visible) */}
                <div style={styles.envelopeFlap}>
                  <div style={styles.flapContent}>
                    <MonogramaAV size={64} />
                    <div style={styles.flapNames}>Andrés &amp; Vanessa</div>
                    <div style={styles.flapDatePill}>23 · abril · 2027</div>
                  </div>
                </div>

                {/* ✅ Sello de cera realista */}
                <div style={styles.sealStage}>
                  <WaxSeal onClick={abrirSobre} disabled={false} label="Abrir" size={104} />
                </div>
              </div>

              <div style={styles.openHint}> </div>
            </div>
          </div>
        ) : (
          <div style={styles.card}>
            {/* ✅ flores */}
            <FloralCorners />

            <div style={styles.smallCaps}>Nuestra boda</div>

            <h1 style={nameStyleObj}>Andrés &amp; Vanessa</h1>

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

            <div style={styles.infoBlock}>
              <div>
                <b>Ceremonia</b> · 4:00 PM
              </div>
              <div>
                <b>Recepción</b> · 5:00 PM
              </div>
              <div>
                <b>Cierre</b> · 3:00 AM
              </div>
            </div>

            {/* ✅ Spotify: solo se monta después del click */}
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
              <img alt="Foto 1" src={GALLERY_PHOTOS[0]} style={styles.photo} />
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
              <img alt="Foto 2" src={GALLERY_PHOTOS[1]} style={styles.photo} />
            </div>

            {/* ✅ Itinerario: centrado + icono izquierda + texto + hora debajo */}
            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>Itinerario</div>

              <div style={styles.timelineOuter}>
                <div style={styles.timelineCard}>
                  {TIMELINE.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.timelineRow,
                        borderBottom:
                          i === TIMELINE.length - 1 ? "none" : styles.timelineRow.borderBottom,
                      }}
                    >
                      <div style={styles.timelineIconBox}>
                        <TimelineIcon type={t.iconType} size={44} />
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

            {/* RSVP */}
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
