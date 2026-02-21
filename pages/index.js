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
    // Nota: aunque tu API hoy ignore pasesConfirmados, no rompe nada.
    body: JSON.stringify({ id, asistencia, mensaje, pasesConfirmados }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || "Error desconocido");
  return data;
}

export default function Home() {
  const router = useRouter();

  // Fecha boda: 23 abril 2027, ceremonia 4:00pm (hora local de tu navegador)
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

  const [guestData, setGuestData] = useState(null); // { id, nombre, pasesAsignados, asistencia, ... }
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestLoadError, setGuestLoadError] = useState("");
  const [yaConfirmo, setYaConfirmo] = useState(false);
  const [asistenciaActual, setAsistenciaActual] = useState("");

  // ✅ ESTO FALTABA (arregla el crash)
  const [pasesConfirmados, setPasesConfirmados] = useState(1);

  // Lee ?id=AV001 de la URL
  useEffect(() => {
    if (!router.isReady) return;
    const id = router.query.id;
    if (typeof id === "string") setGuestId(id.trim());
  }, [router.isReady, router.query.id]);

  // Carga invitado desde GET /api/guest?id=...
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
        setYaConfirmo(a === "Sí" || a === "No");

        // Precargar mensaje si ya existía y no has escrito nada aún
        if (g?.mensaje && !mensaje) {
          setMensaje(String(g.mensaje));
        }

        // ✅ Ajustar pasesConfirmados al rango 1..pasesAsignados
        const maxPases = Math.max(1, Number(g?.pasesAsignados || 1));
        const maxPases = Math.max(1, Number(g?.pasesAsignados || 1));

        //precargar desde columna J si existe; si no, default =1
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
    // OJO: mensaje NO va en deps para no recargar invitado por cada letra
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

      // Si dicen "No", automáticamente confirmamos 0 pases
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
    } catch (e) {
      setRsvpStatus("error");
      setRsvpError(e?.message || String(e));
    }
  }

  const NAME_STYLE = "gold";
  const SPOTIFY_EMBED_URL =
    "https://open.spotify.com/embed/track/727sZDy6Dlyo4gniOMKUhv";

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
  };

  const nameStyleObj = NAME_STYLE === "black" ? styles.namesBlack : styles.namesGold;

  const maxPases = Math.max(1, Number(guestData?.pasesAsignados || 1));

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
        <style>{`
          textarea::placeholder { color: #000; opacity: 0.6; }
        `}</style>
      </Head>

      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.smallCaps}>Nuestra boda</div>

          <h1 style={nameStyleObj}>Andrés &amp; Vanessa</h1>

          <div style={styles.subtitle}>Jiutepec, Morelos · Jardín Maroma</div>

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

          {/* RSVP */}
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

            <textarea
  style={{
    ...styles.input,
    opacity: yaConfirmo ? 0.7 : 1,
    cursor: yaConfirmo ? "not-allowed" : "text",
  }}
  value={mensaje}
  onChange={(e) => setMensaje(e.target.value)}
  placeholder={
    yaConfirmo
      ? "Tu confirmación ya quedó registrada. Si necesitas cambiar algo, contáctanos."
      : "Escribe un mensaje de buenos deseos (opcional)"
  }
  disabled={yaConfirmo || rsvpStatus === "saving"}
/>

            {/* Selector de pases */}
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
                  disabled={rsvpStatus === "saving" || yaConfirmo}
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
              {yaConfirmo && (
                <div style={styles.hint}>
                  Ya confirmaste: <b>{asistenciaActual}</b>. Si necesitas cambiarlo, contáctanos.
                </div>
              )}

              <button
                style={styles.btnPrimary}
                onClick={() => confirmar("Sí")}
                disabled={rsvpStatus === "saving" || yaConfirmo}
              >
                Sí asistiré
              </button>

              <button
                style={styles.btn}
                onClick={() => confirmar("No")}
                disabled={rsvpStatus === "saving" || yaConfirmo}
              >
                No podré asistir
              </button>
            </div>

            {rsvpStatus === "saving" && (
              <div style={styles.hint}>Guardando tu confirmación…</div>
            )}

            {rsvpStatus === "ok" && (
  <div style={styles.statusOk}>
    {(() => {
      const nombre = guestData?.nombre ? String(guestData.nombre) : "¡Gracias!";
      const a = String(asistenciaActual || "").trim();
      const pases = Number(rsvpResult?.pasesConfirmados ?? (a === "Sí" ? pasesConfirmados : 0));

      if (a === "Sí") {
        return (
          <>
            <b>{nombre}</b>, quedó registrada tu confirmación: <b>Sí</b> —{" "}
            <b>{pases}</b> {pases === 1 ? "pase" : "pases"} ✅
          </>
        );
      }
      if (a === "No") {
        return (
          <>
            <b>{nombre}</b>, gracias por avisarnos, te vamos a extrañar. Quedó registrada tu respuesta. ❤️
          </>
        );
      }
      return <>¡Listo! Quedó registrado. ✅</>;
    })()}
    {rsvpResult?.updatedRow ? ` (Fila ${rsvpResult.updatedRow})` : ""}
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
