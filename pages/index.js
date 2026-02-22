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

// ✅ Monograma AV (entrelazado / un solo trazo)
function MonogramaAV({ size = 78, stroke = "rgba(19,32,45,0.82)" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", margin: "0 auto 6px" }}
    >
      <path
        d="
          M 18 92
          C 30 62, 42 34, 58 26
          C 72 19, 86 30, 92 52
          C 97 71, 83 84, 66 78
          C 52 73, 44 55, 52 44
          C 59 34, 76 36, 86 49
          C 96 62, 93 84, 78 94
          C 62 105, 44 103, 34 90
        "
        fill="none"
        stroke={stroke}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 38 86 C 50 97, 70 97, 84 84"
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
    </svg>
  );
}

// ✅ Íconos sobrios (línea)
function TimelineIcon({ type = "ceremony" }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(19,32,45,0.85)",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === "ceremony") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M4 10h16" />
        <path d="M6 10V8a6 6 0 0 1 12 0v2" />
        <path d="M7 10v9" />
        <path d="M17 10v9" />
        <path d="M5 19h14" />
        <path d="M12 4v2" />
        <path d="M10.7 5.5 12 4l1.3 1.5" />
      </svg>
    );
  }
  if (type === "reception") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M8 2v9" />
        <path d="M12 2v9" />
        <path d="M16 2v9" />
        <path d="M7 11h10" />
        <path d="M9 22l3-11 3 11" />
      </svg>
    );
  }
  if (type === "dinner") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M7 2v7" />
        <path d="M5 2v7" />
        <path d="M9 2v7" />
        <path d="M7 9v13" />
        <path d="M15 2v20" />
        <path d="M15 2c2 2 2 6 0 8" />
      </svg>
    );
  }
  if (type === "party") {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M12 2v10" />
        <path d="M8 6l8 4" />
        <path d="M8 10l8-4" />
        <path d="M6 22l6-10 6 10" />
      </svg>
    );
  }
  // close
  return (
    <svg {...common} aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M12 7v6l4 2" />
      <path d="M17 3h4v4" />
      <path d="M21 3l-5 5" />
    </svg>
  );
}

function DressIcon() {
  return (
    <svg
      width="120"
      height="44"
      viewBox="0 0 240 88"
      aria-hidden="true"
      style={{ display: "block", margin: "10px auto 10px" }}
    >
      <g
        fill="none"
        stroke="rgba(19,32,45,0.78)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Vestido */}
        <path d="M60 16c6 10 6 14 0 24" />
        <path d="M60 16c-10 6-18 16-22 28" />
        <path d="M60 16c10 6 18 16 22 28" />
        <path d="M38 44c10 10 16 18 22 36" />
        <path d="M82 44c-10 10-16 18-22 36" />
        <path d="M44 62h32" />
        {/* Smoking */}
        <path d="M160 20c-10 10-14 20-14 34v24" />
        <path d="M160 20c10 10 14 20 14 34v24" />
        <path d="M146 54h28" />
        <path d="M152 34h16" />
        <path d="M156 34l4 8 4-8" />
        <path d="M154 78h12" />
      </g>
    </svg>
  );
}

// ✅ Logos sobrios (SVG) como botones
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

  // liverpool
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

  const weddingDateMs = useMemo(() => new Date("2027-04-23T16:00:00").getTime(), []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // ✅ SOBRE
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  // ✅ Forzar reload del embed para intentar autoplay tras el click (user gesture)
  const [spotifyNonce, setSpotifyNonce] = useState(0);

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

  // ✅ Íconos sobrios por etapa (sin emoji)
  const TIMELINE = [
    { time: "4:00 PM", title: "Ceremonia", iconType: "ceremony" },
    { time: "5:00 PM", title: "Recepción", iconType: "reception" },
    { time: "7:30 PM", title: "Cena", iconType: "dinner" },
    { time: "9:00 PM", title: "Fiesta", iconType: "party" },
    { time: "3:00 AM", title: "Cierre", iconType: "close" },
  ];

  const DRESS_CODE = {
    title: "Dress code",
    text:
      "Formal / jardín elegante. Te sugerimos telas frescas y cómodas. Evita tacones muy delgados por el terreno.",
  };

  // ✅ Mesa de regalos (logos)
  const MESA_REGALOS = [
    { type: "liverpool", url: "https://www.liverpool.com.mx/" },
    { type: "amazon", url: "https://www.amazon.com.mx/" },
  ];

  // ✅ Regalo monetario (unido a mesa de regalos, sin encabezado ni beneficiario label)
  const REGALO_MONETARIO = {
    subtitle: "Si deseas apoyarnos en esta nueva etapa:",
    accountLabel: "CLABE / Cuenta",
    accountValue: "000000000000000000",
    nameValue: "Andrés y Vanessa",
  };

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
    },
    smallCaps: {
      fontFamily: '"Cormorant Garamond", serif',
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      fontSize: 12,
      color: "rgba(19, 32, 45, 0.65)",
      marginBottom: 10,
    },
    namesGold: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: 64,
      lineHeight: 1.0,
      margin: "8px 0 10px",
      backgroundImage:
        "linear-gradient(90deg, #7a5b22 0%, #d6b25e 25%, #f3e2a6 50%, #d6b25e 75%, #7a5b22 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      textShadow: "0 8px 22px rgba(0,0,0,0.10)",
    },
    namesBlack: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: 64,
      lineHeight: 1.0,
      margin: "8px 0 10px",
      color: "#0b0f14",
      textShadow: "0 10px 28px rgba(0,0,0,0.10)",
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
    note: {
      marginTop: 14,
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 13,
      color: "rgba(19, 32, 45, 0.55)",
    },

    // RSVP UI
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

    // Secciones
    section: {
      maxWidth: 560,
      margin: "28px auto 0",
      textAlign: "left",
      padding: "0 6px",
    },
    sectionTitle: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 20,
      margin: "0 0 10px",
      color: "rgba(19, 32, 45, 0.88)",
    },
    sectionTitleCenterBig: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 24,
      fontWeight: 700,
      textAlign: "center",
      margin: "0 0 12px",
      color: "rgba(19, 32, 45, 0.90)",
      letterSpacing: "0.01em",
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
    adultsOnly: {
      maxWidth: 560,
      margin: "22px auto 0",
      borderRadius: 16,
      padding: 14,
      border: "1px solid rgba(176,141,87,0.35)",
      background: "rgba(214, 178, 94, 0.10)",
      textAlign: "left",
    },
    adultsOnlyTitle: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 18,
      margin: "0 0 6px",
      color: "rgba(19, 32, 45, 0.90)",
    },

    // ✅ Itinerario centrado y más elegante
    timelineWrap: { maxWidth: 560, margin: "10px auto 0", textAlign: "center" },
    timelineItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: "14px 0",
      borderBottom: "1px solid rgba(31, 65, 95, 0.10)",
    },
    iconCircle: {
      width: 42,
      height: 42,
      borderRadius: "50%",
      background: "rgba(214, 178, 94, 0.14)",
      border: "1px solid rgba(176,141,87,0.30)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
    },
    timeCol: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "rgba(19, 32, 45, 0.70)",
      letterSpacing: "0.04em",
    },
    eventTitle: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 18,
      margin: 0,
      color: "rgba(19, 32, 45, 0.88)",
      lineHeight: 1.25,
      fontWeight: 600,
    },

    // ✅ Regalo monetario box
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
      maxWidth: 520,
      position: "relative",
      borderRadius: 26,
      padding: "22px 16px 16px",
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

    // ✅ Carta que “sale” al abrir
    envelopePaper: {
      position: "absolute",
      left: 18,
      right: 18,
      bottom: 18,
      top: 42,
      borderRadius: 16,
      background: "linear-gradient(180deg, rgba(252,248,240,0.98), rgba(248,242,232,0.98))",
      border: "1px solid rgba(176,141,87,0.25)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 18,
      transform: envelopeOpen ? "translateY(-18px)" : "translateY(28px)",
      transition: "transform 900ms cubic-bezier(0.2, 0.85, 0.2, 1)",
      zIndex: 1,
    },
    envelopePaperText: {
      textAlign: "center",
      fontFamily: '"Cormorant Garamond", serif',
      color: "rgba(19,32,45,0.80)",
      lineHeight: 1.4,
      width: "100%",
      opacity: envelopeOpen ? 0.0 : 1,
      transition: "opacity 240ms ease",
    },

    // ✅ Solapa con contenido “arriba” (encima del sello)
    envelopeFlap: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: 200,
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
    },
    flapNames: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: "0.02em",
      color: "rgba(19,32,45,0.86)",
      textShadow: "0 1px 0 rgba(255,255,255,0.35)",
    },
    flapDate: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 14,
      color: "rgba(19,32,45,0.74)",
      marginTop: 4,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },

    // ✅ Sello “cera realista”
    seal: {
      position: "absolute",
      left: "50%",
      top: 198,
      transform: "translateX(-50%)",
      width: 98,
      height: 98,
      borderRadius: "46% 54% 52% 48% / 48% 50% 50% 52%",
      background:
        "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.40), rgba(255,255,255,0.00) 42%)," +
        "radial-gradient(circle at 70% 75%, rgba(0,0,0,0.20), rgba(0,0,0,0.00) 55%)," +
        "radial-gradient(circle at 40% 60%, rgba(255,255,255,0.14), rgba(255,255,255,0.00) 60%)," +
        "radial-gradient(circle at 52% 52%, rgba(214,178,94,0.96), rgba(176,141,87,0.98) 70%, rgba(122,91,34,0.92) 100%)",
      border: "1px solid rgba(122,91,34,0.40)",
      boxShadow:
        "0 16px 34px rgba(0,0,0,0.22), inset 0 3px 10px rgba(255,255,255,0.22), inset 0 -10px 16px rgba(0,0,0,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: envelopeOpen ? "default" : "pointer",
      userSelect: "none",
      zIndex: 5,
    },
    sealGrain: {
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background:
        "repeating-radial-gradient(circle at 35% 40%, rgba(255,255,255,0.08) 0 2px, rgba(255,255,255,0.0) 2px 6px)",
      opacity: 0.45,
      mixBlendMode: "overlay",
      pointerEvents: "none",
    },
    sealRim: {
      position: "absolute",
      inset: 8,
      borderRadius: "inherit",
      border: "1px solid rgba(0,0,0,0.10)",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
      pointerEvents: "none",
      opacity: 0.8,
    },
    sealText: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: 30,
      color: "rgba(20,20,20,0.88)",
      textShadow: "0 1px 0 rgba(255,255,255,0.30), 0 2px 10px rgba(0,0,0,0.18)",
      transform: "translateY(-1px)",
      zIndex: 2,
    },
    openHint: {
      marginTop: 12,
      textAlign: "center",
      fontFamily: '"Cormorant Garamond", serif',
      color: "rgba(19,32,45,0.70)",
      fontSize: 14,
    },

    // ✅ Botones/logo vertical
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
    logoBtnHover: {
      transform: "translateY(-1px)",
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
    // ✅ user gesture: abrimos y “re-cargamos” el embed para intentar autoplay
    setSpotifyNonce(Date.now());
    setEnvelopeOpen(true);
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
                    (Invitación)
                    <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>
                      Toca el sello para abrir ✨
                    </div>
                  </div>
                </div>

                {/* ✅ Solapa (con monograma y nombres arriba, encima del sello) */}
                <div style={styles.envelopeFlap}>
                  <div style={styles.flapContent}>
                    <MonogramaAV size={70} />
                    <div style={styles.flapNames}>Andrés &amp; Vanessa</div>
                    <div style={styles.flapDate}>23 · abril · 2027</div>
                  </div>
                </div>

                {/* ✅ Sello de cera */}
                <div
                  style={styles.seal}
                  onClick={envelopeOpen ? undefined : abrirSobre}
                  role="button"
                  aria-label="Abrir invitación"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") abrirSobre();
                  }}
                >
                  <div style={styles.sealGrain} />
                  <div style={styles.sealRim} />
                  <div style={styles.sealText}>Abrir</div>
                </div>
              </div>

              <div style={styles.openHint}>Toca el sello para abrir la invitación ✨</div>
            </div>
          </div>
        ) : (
          <div style={styles.card}>
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

            {/* ✅ Spotify: se renderiza tras abrir + nonce para “intentar” autoplay */}
            <div style={styles.spotifyWrap}>
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
            </div>

            <div style={styles.photoStrip}>
              <img alt="Foto 1" src={GALLERY_PHOTOS[0]} style={styles.photo} />
            </div>

            {/* ✅ (5) “Nuestra historia” centrado, bold, más grande */}
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

            <div style={styles.adultsOnly}>
              <div style={styles.adultsOnlyTitle}>Importante</div>
              <div style={styles.sectionText}>
                Evento exclusivo para mayores de <b>16 años</b>. Sin excepciones.
              </div>
            </div>

            {/* ✅ (6)(7) Itinerario centrado, bold, más grande + íconos sobrios */}
            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>Itinerario</div>
              <div style={styles.timelineWrap}>
                {TIMELINE.map((t, i) => (
                  <div key={i} style={styles.timelineItem}>
                    <div style={styles.iconCircle}>
                      <TimelineIcon type={t.iconType} />
                    </div>
                    <div style={styles.timeCol}>{t.time}</div>
                    <p style={styles.eventTitle}>{t.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ (8) Ubicación centrado + botones en vertical */}
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

            <div style={styles.photoStrip}>
              <img alt="Foto 3" src={GALLERY_PHOTOS[2]} style={styles.photo} />
            </div>

            {/* ✅ (9) Dress code centrado + ilustración + descripción centrada */}
            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>{DRESS_CODE.title}</div>
              <div style={styles.softBox}>
                <DressIcon />
                <p style={{ ...styles.sectionText, textAlign: "center" }}>{DRESS_CODE.text}</p>
              </div>
            </div>

            {/* ✅ (10)(11) Mesa de regalos centrado + logos vertical + regalo monetario unido */}
            <div style={styles.section}>
              <div style={styles.sectionTitleCenterBig}>Mesa de regalos</div>
              <div style={styles.softBox}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                  {MESA_REGALOS.map((x, i) => (
                    <a
                      key={i}
                      href={x.url}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.logoBtn}
                    >
                      <BrandLogo type={x.type} />
                    </a>
                  ))}
                </div>

                {/* ✅ Regalo monetario (sin encabezado, sin “Beneficiario”) */}
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

              {rsvpStatus === "ok" && !yaConfirmo && (
                <div style={styles.statusOk}>
                  ¡Listo! Quedó registrado. ✅{" "}
                  {rsvpResult?.updatedRow ? `(Fila ${rsvpResult.updatedRow})` : ""}
                </div>
              )}

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
