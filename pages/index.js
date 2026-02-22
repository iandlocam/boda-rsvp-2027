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

export default function Home() {
  const router = useRouter();

  const weddingDateMs = useMemo(
    () => new Date("2027-04-23T16:00:00").getTime(),
    []
  );

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // RSVP states
  const [guestId, setGuestId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("idle"); // idle | saving | ok | error
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpResult, setRsvpResult] = useState(null);

  const [guestData, setGuestData] = useState(null); // { id, nombre, pasesAsignados, asistencia, mensaje, pasesConfirmados, ... }
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

        // Precargar mensaje guardado
        if (g?.mensaje && !mensaje) {
          setMensaje(String(g.mensaje));
        }

        // ✅ (3) Precargar Pases Confirmados desde columna J (si existe)
        const maxPases = Math.max(1, Number(g?.pasesAsignados || 1));
        const j = Number(g?.pasesConfirmados || 0); // viene de API: guest.pasesConfirmados (col J)
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

      if (!guestId) {
        throw new Error("Falta el ID en el enlace. Ejemplo: ?id=AV001");
      }

      // Si dicen "No" => 0 pases
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

      // ✅ si el API regresó el número final, sincronizamos
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
  const SPOTIFY_EMBED_URL =
    "https://open.spotify.com/embed/track/727sZDy6Dlyo4gniOMKUhv";

  // =========================
  // ✅ NUEVOS CAMPOS / SECCIONES (SOLO ADICIONES)
  // =========================

  // Mapa (pon aquí tus links reales)
  const MAPS_URL = "https://maps.google.com/?q=Jard%C3%ADn%20Maroma%2C%20Jiutepec%2C%20Morelos";
  const WAZE_URL = "https://waze.com/ul?q=Jard%C3%ADn%20Maroma%20Jiutepec%20Morelos";

  // Fotos (placeholders — luego reemplazas por tus fotos)
  const GALLERY_PHOTOS = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=70",
  ];

  // Nuestra historia (texto placeholder, lo editas)
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

  // Timeline (con iconos tipo “capilla/cena/fiesta”; puedes cambiar emojis por SVG luego)
  const TIMELINE = [
    { time: "4:00 PM", title: "Ceremonia", icon: "⛪" },
    { time: "5:00 PM", title: "Recepción", icon: "🥂" },
    { time: "7:30 PM", title: "Cena", icon: "🍽️" },
    { time: "9:00 PM", title: "Fiesta", icon: "🎶" },
    { time: "3:00 AM", title: "Cierre", icon: "🌙" },
  ];

  // Dress code (texto placeholder)
  const DRESS_CODE = {
    title: "Dress code",
    text:
      "Formal / jardín elegante. Te sugerimos telas frescas y cómodas. Evita tacones muy delgados por el terreno.",
  };

  // Mesa de regalos (links placeholder)
  const MESA_REGALOS = [
    { label: "Liverpool", url: "https://www.liverpool.com.mx/" },
    { label: "Amazon", url: "https://www.amazon.com.mx/" },
  ];

  // Regalo monetario (placeholder)
  const REGALO_MONETARIO = {
    title: "Regalo monetario",
    subtitle: "Si deseas apoyarnos en esta nueva etapa:",
    accountLabel: "CLABE / Cuenta",
    accountValue: "000000000000000000", // <- cámbiala
    nameLabel: "Beneficiario",
    nameValue: "Andrés & Vanessa",
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

    // =========================
    // ✅ NUEVAS SECCIONES (SOLO ADICIONES)
    // =========================
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
    chipsRow: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      marginTop: 10,
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
    },
    photoStrip: {
      maxWidth: 560,
      margin: "22px auto 0",
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(31, 65, 95, 0.10)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
    photo: {
      width: "100%",
      height: 220,
      objectFit: "cover",
      display: "block",
    },
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
    timelineWrap: {
      maxWidth: 560,
      margin: "18px auto 0",
      textAlign: "left",
    },
    timelineItem: {
      display: "grid",
      gridTemplateColumns: "92px 1fr",
      gap: 12,
      alignItems: "start",
      padding: "10px 0",
      borderBottom: "1px solid rgba(31, 65, 95, 0.10)",
    },
    timeCol: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "rgba(19, 32, 45, 0.70)",
      paddingTop: 4,
    },
    eventCol: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
    },
    iconCircle: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "rgba(214, 178, 94, 0.18)",
      border: "1px solid rgba(176,141,87,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "0 0 auto",
      marginTop: 1,
      fontSize: 16,
    },
    eventTitle: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 17,
      margin: 0,
      color: "rgba(19, 32, 45, 0.88)",
      lineHeight: 1.25,
    },
    moneyBox: {
      borderRadius: 16,
      border: "1px solid rgba(31, 65, 95, 0.12)",
      background: "rgba(248, 251, 255, 0.85)",
      padding: 14,
    },
    monoLine: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
      color: "rgba(19, 32, 45, 0.82)",
      margin: "6px 0 0",
      wordBreak: "break-word",
    },
  };

  const nameStyleObj = NAME_STYLE === "black" ? styles.namesBlack : styles.namesGold;
  const maxPases = Math.max(1, Number(guestData?.pasesAsignados || 1));

  // ✅ (1 + 3) Texto bonito de “ya confirmaste” + usar J si existe
  const pasesFromSheet = Number(guestData?.pasesConfirmados || 0);
  const pasesMostrados =
    asistenciaActual === "Sí"
      ? pasesFromSheet > 0
        ? pasesFromSheet
        : Number(pasesConfirmados || 1)
      : 0;

  const nombreMostrado = guestData?.nombre ? String(guestData.nombre) : "¡Gracias!";

  return (
    <>
      <Head>
        <title>Andrés & Vanessa — 23 abril 2027</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`textarea::placeholder { color: #000; opacity: 0.6; }`}</style>
      </Head>

      <div style={styles.page}>
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

          <div style={styles.spotifyWrap}>
            <iframe
              style={{ borderRadius: 14 }}
              src={SPOTIFY_EMBED_URL}
              width="340"
              height="92"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>

          {/* =========================
              ✅ NUEVAS SECCIONES (SOLO ADICIONES)
              ========================= */}

          {/* Mini separador con foto 1 */}
          <div style={styles.photoStrip}>
            <img alt="Foto 1" src={GALLERY_PHOTOS[0]} style={styles.photo} />
          </div>

          {/* Nuestra historia */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Nuestra historia</div>
            <div style={styles.softBox}>
              {NUESTRA_HISTORIA.map((b, i) => (
                <div key={i} style={{ marginBottom: i === NUESTRA_HISTORIA.length - 1 ? 0 : 12 }}>
                  <div style={{ ...styles.sectionTitle, fontSize: 17, margin: "0 0 4px" }}>
                    {b.title}
                  </div>
                  <p style={styles.sectionText}>{b.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mini separador con foto 2 */}
          <div style={styles.photoStrip}>
            <img alt="Foto 2" src={GALLERY_PHOTOS[1]} style={styles.photo} />
          </div>

          {/* Aviso +16 (antes del timeline como pediste) */}
          <div style={styles.adultsOnly}>
            <div style={styles.adultsOnlyTitle}>Importante</div>
            <div style={styles.sectionText}>
              Evento exclusivo para mayores de <b>16 años</b>. Sin excepciones.
            </div>
          </div>

          {/* Timeline con iconos */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Itinerario</div>
            <div style={styles.timelineWrap}>
              {TIMELINE.map((t, i) => (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timeCol}>{t.time}</div>
                  <div style={styles.eventCol}>
                    <div style={styles.iconCircle} aria-hidden="true">
                      {t.icon}
                    </div>
                    <p style={styles.eventTitle}>{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ubicación / mapa / botones */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Ubicación</div>
            <div style={styles.softBox}>
              <p style={styles.sectionText}>
                Jardín Maroma · Jiutepec, Morelos
              </p>
              <div style={styles.chipsRow}>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.linkBtnPrimary}
                >
                  📍 Google Maps
                </a>
                <a
                  href={WAZE_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.linkBtn}
                >
                  🚗 Waze
                </a>
              </div>
            </div>
          </div>

          {/* Mini separador con foto 3 */}
          <div style={styles.photoStrip}>
            <img alt="Foto 3" src={GALLERY_PHOTOS[2]} style={styles.photo} />
          </div>

          {/* Dress code */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>{DRESS_CODE.title}</div>
            <div style={styles.softBox}>
              <p style={styles.sectionText}>{DRESS_CODE.text}</p>
            </div>
          </div>

          {/* Mesa de regalos */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Mesa de regalos</div>
            <div style={styles.softBox}>
              <p style={styles.sectionText} style={{ ...styles.sectionText, marginBottom: 10 }}>
                Estos son enlaces de referencia (puedes cambiarlos):
              </p>
              <div style={styles.chipsRow}>
                {MESA_REGALOS.map((x, i) => (
                  <a
                    key={i}
                    href={x.url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.linkBtn}
                  >
                    🎁 {x.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Regalo monetario */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>{REGALO_MONETARIO.title}</div>
            <div style={styles.moneyBox}>
              <p style={styles.sectionText}>{REGALO_MONETARIO.subtitle}</p>

              <div style={{ marginTop: 10 }}>
                <div style={styles.sectionText}>
                  💰 <b>{REGALO_MONETARIO.accountLabel}:</b>
                </div>
                <div style={styles.monoLine}>{REGALO_MONETARIO.accountValue}</div>
              </div>

              <div style={{ marginTop: 10 }}>
                <div style={styles.sectionText}>
                  👤 <b>{REGALO_MONETARIO.nameLabel}:</b>
                </div>
                <div style={styles.monoLine}>{REGALO_MONETARIO.nameValue}</div>
              </div>
            </div>
          </div>

          {/* =========================
              RSVP (TU BLOQUE ORIGINAL)
              ========================= */}
          <div style={styles.rsvpWrap}>
            <div style={styles.rsvpTitle}>
              {guestLoading ? "Cargando invitado…" : "Confirmación de asistencia"}
              <span style={styles.idBadge}>
                {guestId ? `ID: ${guestId}` : "ID no detectado"}
              </span>
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
              <div style={styles.statusErr}>
                No se pudo cargar tu invitación: {guestLoadError}
              </div>
            )}

            {/* ✅ (1) Mensaje bonito cuando YA confirmó (aunque recargues la página) */}
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

            {/* ✅ Si ya confirmó: ocultamos la UI para que no confunda */}
            {!yaConfirmo && (
              <>
                <textarea
                  style={styles.input}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe un mensaje de buenos deseos (opcional)"
                  disabled={rsvpStatus === "saving"}
                />

                {/* Selector de pases */}
                {guestData?.pasesAsignados &&
                  String(guestData.pasesAsignados).trim() !== "" && (
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

            {rsvpStatus === "saving" && (
              <div style={styles.hint}>Guardando tu confirmación…</div>
            )}

            {/* Cuando acabas de confirmar en ese momento */}
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
      </div>
    </>
  );
}
