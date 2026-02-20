import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

function clamp(n) {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

async function enviarRSVP({ id, asistencia, mensaje }) {
  const resp = await fetch("/api/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, asistencia, mensaje }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || "Error desconocido");
  return data;
}

export default function Home() {
  const router = useRouter();

  // Fecha boda: 23 abril 2027, ceremonia 4:00pm (hora local de tu navegador)
  const weddingDateMs = useMemo(() => new Date("2027-04-23T16:00:00").getTime(), []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  // RSVP states
  const [guestId, setGuestId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("idle"); // idle | saving | ok | error
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpResult, setRsvpResult] = useState(null);

  // Lee ?id=AV001 de la URL
  useEffect(() => {
    if (!router.isReady) return;
    const id = router.query.id;
    if (typeof id === "string") setGuestId(id.trim());
  }, [router.isReady, router.query.id]);

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

      const result = await enviarRSVP({
        id: guestId,
        asistencia,
        mensaje,
      });

      setRsvpResult(result);
      setRsvpStatus("ok");
    } catch (e) {
      setRsvpStatus("error");
      setRsvpError(e?.message || String(e));
    }
  }

  // ✅ CAMBIA ESTO si quieres nombres en negro:
  // const NAME_STYLE = "gold";
  // opciones: "gold" | "black"
  const NAME_STYLE = "gold";

  // ✅ Spotify: pega aquí tu embed correcto.
  // Si tu link fue: https://open.spotify.com/track/XXXXX
  // entonces aquí debe quedar: https://open.spotify.com/embed/track/XXXXX
  const SPOTIFY_EMBED_URL = "https://open.spotify.com/embed/track/727sZDy6Dlyo4gniOMKUhv";

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
      background: "linear-gradient(90deg, transparent, rgba(176,141,87,0.7), transparent)",
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
    },
    rsvpRow: {
      display: "flex",
      gap: 10,
      marginTop: 10,
      flexWrap: "wrap",
    },
    btn: {
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      padding: "10px 14px",
      background: "white",
      cursor: "pointer",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
    },
    btnPrimary: {
      borderRadius: 12,
      border: "1px solid rgba(31, 65, 95, 0.16)",
      padding: "10px 14px",
      background: "rgba(214, 178, 94, 0.22)",
      cursor: "pointer",
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 16,
    },
    statusOk: {
      marginTop: 10,
      fontFamily: '"Cormorant Garamond", serif',
      color: "rgba(19, 32, 45, 0.85)",
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
      color: "rgba(19, 32, 45, 0.75)",
      marginLeft: 8,
    },
  };

  const nameStyleObj = NAME_STYLE === "black" ? styles.namesBlack : styles.namesGold;

  return (
    <>
      <Head>
        <title>Andrés & Vanessa — 23 abril 2027</title>
        {/* Tipografías: manuscrita elegante + serif formal */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.smallCaps}>Nuestra boda</div>

          <h1 style={nameStyleObj}>Andrés &amp; Vanessa</h1>

          <div style={styles.subtitle}>
            Jiutepec, Morelos · Jardín Maroma
          </div>

          <div style={styles.quote}>
            “El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección.”
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
            <div><b>Ceremonia</b> · 4:00 PM</div>
            <div><b>Recepción</b> · 5:00 PM</div>
            <div><b>Cierre</b> · 3:00 AM</div>
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

          {/* RSVP */}
          <div style={styles.rsvpWrap}>
            <div style={styles.rsvpTitle}>
              Confirmación de asistencia
              <span style={styles.idBadge}>
  {guestId ? `ID: ${guestId}` : "ID no detectado"}
</span>
            </div>

            <textarea
              style={styles.input}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un mensaje de buenos deseos (opcional)"
            />

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

            {rsvpStatus === "saving" && <div style={styles.hint}>Guardando tu confirmación…</div>}
            {rsvpStatus === "ok" && (
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
