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

/* ================================
   MONOGRAMA ELEGANTE ENTRELAZADO
================================ */

function MonogramaAV({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(176,141,87,0.8)" />
          <stop offset="100%" stopColor="rgba(19,32,45,0.25)" />
        </linearGradient>
      </defs>

      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="2"
      />

      {/* A curva */}
      <path
        d="M34 82 Q60 28 86 82"
        fill="none"
        stroke="rgba(19,32,45,0.9)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* V entrelazada */}
      <path
        d="M46 58 Q60 90 74 58"
        fill="none"
        stroke="rgba(19,32,45,0.9)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ================================
   SELLO DORADO REALISTA
================================ */

function WaxSeal({ onClick, size = 120 }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        cursor: "pointer",
        position: "relative",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        <defs>
          <radialGradient id="goldGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff9d6" />
            <stop offset="40%" stopColor="#e3c46a" />
            <stop offset="70%" stopColor="#c9a44b" />
            <stop offset="100%" stopColor="#8f6b22" />
          </radialGradient>
        </defs>

        <path
          d="M60 6
             C82 8 108 24 112 50
             C116 76 94 104 64 110
             C34 116 8 96 6 66
             C4 36 26 10 60 6Z"
          fill="url(#goldGrad)"
        />

        <text
          x="60"
          y="68"
          textAnchor="middle"
          fontFamily='"Great Vibes", cursive'
          fontSize="32"
          fill="rgba(19,32,45,0.9)"
        >
          Abrir
        </text>
      </svg>
    </div>
  );
}

/* ================================
   FLORES ORGÁNICAS + FONDO MARFIL
================================ */

function FloralBackground() {
  return (
    <>
      {/* Esquina superior izquierda */}
      <img
        src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=60"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 260,
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />

      {/* Esquina superior derecha */}
      <img
        src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=60"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 260,
          opacity: 0.55,
          pointerEvents: "none",
          transform: "scaleX(-1)",
        }}
      />

      {/* Inferior izquierda */}
      <img
        src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=60"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 300,
          opacity: 0.55,
          pointerEvents: "none",
          transform: "scaleY(-1)",
        }}
      />

      {/* Inferior derecha */}
      <img
        src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=60"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 300,
          opacity: 0.55,
          pointerEvents: "none",
          transform: "scale(-1,-1)",
        }}
      />
    </>
  );
}

/* ================================
   COMPONENTE PRINCIPAL
================================ */

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

  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [spotifyEnabled, setSpotifyEnabled] = useState(false);

  const SPOTIFY_URL =
    "https://open.spotify.com/embed/track/727sZDy6Dlyo4gniOMKUhv?autoplay=1";

  function abrirSobre() {
    setEnvelopeOpen(true);
    setTimeout(() => setSpotifyEnabled(true), 100);
  }

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
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "#f8f3ea",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!envelopeOpen ? (
          /* ================================
             SOBRE
          ================================= */
          <div
            style={{
              width: 560,
              height: 400,
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background:
                "linear-gradient(180deg,#9fb2c4,#889fb5)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
            }}
          >
            {/* Papel interno */}
            <div
              style={{
                position: "absolute",
                top: 80,
                left: 30,
                right: 30,
                bottom: 30,
                background: "#f8f3ea",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                transform: envelopeOpen
                  ? "translateY(-20px)"
                  : "translateY(20px)",
                transition: "0.8s ease",
              }}
            >
              <div
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 16,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#13202D",
                }}
              >
                Andrés & Vanessa
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 14,
                  letterSpacing: "0.15em",
                }}
              >
                23 · abril · 2027
              </div>

              <div style={{ marginTop: 20 }}>
                <MonogramaAV size={70} />
              </div>

              <div
                style={{
                  marginTop: 20,
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 14,
                  opacity: 0.7,
                }}
              >
                Toca el sello para abrir ✨
              </div>
            </div>

            {/* Solapa */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: 260,
                background:
                  "linear-gradient(180deg,#a9bbcb,#8fa5ba)",
                clipPath: "polygon(0 0,100% 0,50% 100%)",
                transformOrigin: "top",
                transform: envelopeOpen
                  ? "rotateX(180deg)"
                  : "rotateX(0deg)",
                transition: "transform 1s ease",
                zIndex: 4,
              }}
            />

            {/* Sello */}
            <div
              style={{
                position: "absolute",
                bottom: 60,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 5,
              }}
            >
              <WaxSeal onClick={abrirSobre} />
            </div>
          </div>
        ) : (
          /* ================================
             INVITACIÓN ABIERTA
          ================================= */
          <div
            style={{
              width: 760,
              maxWidth: "95%",
              background: "#ffffffdd",
              borderRadius: 28,
              padding: 50,
              textAlign: "center",
              position: "relative",
              boxShadow: "0 30px 80px rgba(0,0,0,0.15)",
            }}
          >
            <FloralBackground />

            <div
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 26,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Nuestra boda
            </div>

            <div
              style={{
                fontFamily: '"Great Vibes", cursive',
                fontSize: 76,
                marginBottom: 10,
              }}
            >
              Andrés & Vanessa
            </div>

            <div
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 18,
                marginBottom: 30,
              }}
            >
              Jiutepec, Morelos · Jardín Maroma
            </div>

            {/* Contador */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
              {["days", "hours", "minutes", "seconds"].map((k, i) => (
                <div key={i}>
                  <div style={{ fontSize: 30 }}>
                    {timeLeft[k]}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    {k.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            {spotifyEnabled && (
              <div style={{ marginTop: 30 }}>
                <iframe
                  src={SPOTIFY_URL}
                  width="300"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                />
              </div>
            )}


            {/* =========================
                ITINERARIO
            ========================== */}

            <div style={{ marginTop: 60 }}>
              <div
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 26,
                  marginBottom: 30,
                }}
              >
                Itinerario
              </div>

              {[
                { icon: "⛪", title: "Ceremonia", time: "4:00 PM" },
                { icon: "🥂", title: "Recepción", time: "5:00 PM" },
                { icon: "🍽", title: "Cena", time: "7:30 PM" },
                { icon: "🎉", title: "Fiesta", time: "9:00 PM" },
                { icon: "✨", title: "Cierre", time: "3:00 AM" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    marginBottom: 30,
                  }}
                >
                  <div
                    style={{
                      fontSize: 60,
                      textAlign: "center",
                    }}
                  >
                    {item.icon}
                  </div>

                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontFamily: '"Cormorant Garamond", serif',
                        fontSize: 22,
                        fontWeight: 700,
                      }}
                    >
                      {item.title}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 14,
                        letterSpacing: "0.15em",
                      }}
                    >
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* =========================
                UBICACIÓN
            ========================== */}

            <div style={{ marginTop: 60 }}>
              <div
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 26,
                  marginBottom: 20,
                }}
              >
                Ubicación
              </div>

              <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
                <a
                  href="https://maps.google.com/?q=Jard%C3%ADn%20Maroma%2C%20Jiutepec%2C%20Morelos"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "10px 20px",
                    background: "#d6b25e",
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "#000",
                  }}
                >
                  Google Maps
                </a>

                <a
                  href="https://waze.com/ul?q=Jard%C3%ADn%20Maroma%20Jiutepec%20Morelos"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "10px 20px",
                    background: "#eee",
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "#000",
                  }}
                >
                  Waze
                </a>
              </div>
            </div>

            {/* =========================
                MESA DE REGALOS
            ========================== */}

            <div style={{ marginTop: 60 }}>
              <div
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 26,
                  marginBottom: 20,
                }}
              >
                Mesa de regalos
              </div>

              <div style={{ marginBottom: 20 }}>
                <a
                  href="https://www.liverpool.com.mx/"
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginRight: 20 }}
                >
                  Liverpool
                </a>

                <a
                  href="https://www.amazon.com.mx/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Amazon
                </a>
              </div>

              <div
                style={{
                  background: "#f3f3f3",
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <div>Si deseas apoyarnos en esta nueva etapa:</div>
                <div style={{ marginTop: 10, fontWeight: 600 }}>
                  CLABE / Cuenta:
                </div>
                <div>000000000000000000</div>
                <div style={{ marginTop: 10 }}>
                  Andrés y Vanessa
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
