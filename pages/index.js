// /pages/index.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Image from "next/image";

// Función para el contador (sin cambios)
function calcularTiempoRestante(fechaObjetivoMs) {
  const ahora = Date.now();
  const diferencia = fechaObjetivoMs - ahora;

  if (diferencia <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

  const segundos = Math.floor((diferencia / 1000) % 60);
  const minutos = Math.floor((diferencia / 1000 / 60) % 60);
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

  return { dias, horas, minutos, segundos };
}

// ✅ Monograma AV (componente existente)
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

// ✅ Sello de cera (componente existente)
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

// ✅ Componente de íconos personalizables para el itinerario
function TimelineIcon({ type = "ceremony", size = 80 }) {
  const ICONOS = {
    ceremony: "/iconos/Ceremony.png",
    reception: "/iconos/Cocteel.png",
    dinner: "/iconos/cena.png",
    party: "/iconos/Fiesta.png",
    close: "/iconos/Cierre.png",
  };

  const iconSrc = ICONOS[type];

  if (!iconSrc) {
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

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  // ====================================================
  // 🖼️ CONFIGURACIÓN - CÁMBIALO AQUÍ
  // ====================================================
  const NOMBRES = {
    el: "Ana",
    ella: "Carlos",
  };

  const FECHA_BODA = "2027-04-23T16:00:00";

  // Imagen del sobre (primera pantalla)
  const SOBRE_IMAGE = "/sobre-boda.jpg";

  // Imágenes de la galería (fotos de la pareja)
  const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
  ];

  // Itinerario del evento
  const ITINERARY = [
    { time: "16:00", icon: "ceremony", label: "Ceremonia", desc: "Hacienda Los Olivos" },
    { time: "17:30", icon: "reception", label: "Cóctel de Bienvenida", desc: "Jardín" },
    { time: "19:00", icon: "dinner", label: "Cena", desc: "Salón Principal" },
    { time: "22:00", icon: "party", label: "Fiesta", desc: "Pista de Baile" },
    { time: "00:00", icon: "close", label: "Cierre", desc: "Despedida" },
  ];

  // Padrinos
  const PADRINOS = [
    { rol: "Padrinos de Arras", nombres: ["María González", "Juan Pérez"] },
    { rol: "Padrinos de Velación", nombres: ["Laura Martínez", "Pedro Sánchez"] },
    { rol: "Padrinos de Anillos", nombres: ["Sofía Ramírez", "Diego López"] },
  ];

  // Mesas de regalos
  const REGALOS = [
    { nombre: "Amazon", url: "#" },
    { nombre: "Liverpool", url: "#" },
  ];
  // ====================================================

  const weddingDateMs = useMemo(() => new Date(FECHA_BODA).getTime(), []);
  const [timeLeft, setTimeLeft] = useState(() => calcularTiempoRestante(weddingDateMs));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcularTiempoRestante(weddingDateMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDateMs]);

  const [formData, setFormData] = useState({
    familia: "",
    mesa: "",
    adultos: 1,
    ninos: 0,
    asistira: "si",
    nombresAsistentes: "",
    comentarios: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`¡Gracias por confirmar, familia ${formData.familia || "invitada"}!`);
  };

  const confirmacionesEjemplo = [
    { familia: "Familia Rodríguez", adultos: 3, ninos: 1 },
    { familia: "María López", adultos: 1, ninos: 0 },
    { familia: "Juan y Ana García", adultos: 2, ninos: 0 },
    { familia: "Familia Martínez", adultos: 2, ninos: 2 },
  ];

  return (
    <>
      <Head>
        <title>{`${NOMBRES.el} & ${NOMBRES.ella} - Boda`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet" />
      </Head>

      {/* PANTALLA 1: SOBRE (100% original) */}
      {!isOpen && (
        <div style={{
          minHeight: "100vh",
          background: "#faf3ec",
          backgroundImage: `url(${SOBRE_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(3px)",
          }} />
          <WaxSeal onClick={() => setIsOpen(true)} label="Abrir" />
        </div>
      )}

      {/* PANTALLA 2: INVITACIÓN (con ESTILO NUEVO del ejemplo) */}
      {isOpen && (
        <div style={{
          background: "#fef9f0", // Color crema del ejemplo
          minHeight: "100vh",
          fontFamily: "'Quicksand', sans-serif",
          color: "#4a4a4a",
        }}>
          <main style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "60px",
          }}>

            {/* PORTADA INTERIOR: Nombres y Contador */}
            <section style={{
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              borderRadius: "60px",
              padding: "60px 30px",
              boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}>
              <h1 style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: "clamp(4rem, 15vw, 6rem)",
                fontWeight: 400,
                color: "#b76e79",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}>
                {NOMBRES.el} & {NOMBRES.ella}
              </h1>
              <p style={{ fontSize: "1.5rem", color: "#a17a6b", marginBottom: "40px" }}>¡Nos casamos!</p>

              {/* Contador estilo ejemplo */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "15px",
                maxWidth: "500px",
                margin: "0 auto",
                background: "#fff",
                borderRadius: "100px",
                padding: "25px 20px",
                boxShadow: "0 5px 20px rgba(183,110,121,0.1)",
              }}>
                {[
                  { valor: timeLeft.dias, label: "Días" },
                  { valor: timeLeft.horas, label: "Horas" },
                  { valor: timeLeft.minutos, label: "Minutos" },
                  { valor: timeLeft.segundos, label: "Segundos" },
                ].map((item) => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 600, color: "#b76e79", lineHeight: 1 }}>{item.valor}</div>
                    <div style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", color: "#a17a6b" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ITINERARIO (con íconos) */}
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Itinerario</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "20px",
              }}>
                {ITINERARY.map((item, idx) => (
                  <div key={idx} style={{
                    background: "#fff",
                    borderRadius: "40px",
                    padding: "30px 20px",
                    textAlign: "center",
                    boxShadow: "0 8px 25px rgba(183,110,121,0.08)",
                    border: "1px solid #f0e4d7",
                  }}>
                    <div style={{ width: 80, height: 80, margin: "0 auto 20px" }}>
                      <TimelineIcon type={item.icon} size={80} />
                    </div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 500, color: "#b76e79", marginBottom: "5px" }}>{item.time}</div>
                    <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "5px", color: "#4a4a4a" }}>{item.label}</div>
                    <div style={{ fontSize: "0.95rem", color: "#a17a6b" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* PADRINOS */}
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Padrinos</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "25px",
              }}>
                {PADRINOS.map((padrino, idx) => (
                  <div key={idx} style={{
                    background: "#fff",
                    borderRadius: "40px",
                    padding: "30px 20px",
                    textAlign: "center",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.02)",
                    border: "1px solid #f0e4d7",
                  }}>
                    <div style={{ color: "#b76e79", textTransform: "uppercase", letterSpacing: "1.5px", fontSize: "0.9rem", marginBottom: "15px", fontWeight: 600 }}>{padrino.rol}</div>
                    {padrino.nombres.map((nombre, i) => (
                      <div key={i} style={{ fontSize: "1.3rem", fontWeight: 500, color: "#4a4a4a", marginBottom: i === 0 ? "5px" : "0" }}>{nombre}</div>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            {/* GALERÍA */}
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Galería</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}>
                {GALLERY_IMAGES.map((img, idx) => (
                  <div key={idx} style={{
                    borderRadius: "30px",
                    overflow: "hidden",
                    aspectRatio: "1 / 1",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    border: "2px solid white",
                  }}>
                    <img src={img} alt={`Foto ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </section>

            {/* RSVP - Formulario estilo ejemplo */}
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Confirma tu asistencia</h2>
              <form onSubmit={handleSubmit} style={{
                background: "#fff",
                borderRadius: "60px",
                padding: "50px 40px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "25px",
                }}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Nombre(s) / Familia</label>
                    <input type="text" name="familia" value={formData.familia} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Número de mesa (opcional)</label>
                    <input type="text" name="mesa" value={formData.mesa} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Adultos</label>
                    <select name="adultos" value={formData.adultos} onChange={handleInputChange} style={inputStyle}>
                      {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Niños</label>
                    <select name="ninos" value={formData.ninos} onChange={handleInputChange} style={inputStyle}>
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2", ...formGroupStyle }}>
                    <label style={labelStyle}>¿Asistirá?</label>
                    <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="radio" name="asistira" value="si" checked={formData.asistira === "si"} onChange={handleInputChange} /> Sí
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input type="radio" name="asistira" value="no" checked={formData.asistira === "no"} onChange={handleInputChange} /> No
                      </label>
                    </div>
                  </div>
                  <div style={{ gridColumn: "span 2", ...formGroupStyle }}>
                    <label style={labelStyle}>Nombres de las personas que asisten</label>
                    <textarea name="nombresAsistentes" value={formData.nombresAsistentes} onChange={handleInputChange} rows="3" style={{ ...inputStyle, resize: "vertical" }}></textarea>
                  </div>
                  <div style={{ gridColumn: "span 2", ...formGroupStyle }}>
                    <label style={labelStyle}>Felicitaciones o comentarios</label>
                    <textarea name="comentarios" value={formData.comentarios} onChange={handleInputChange} rows="2" style={{ ...inputStyle, resize: "vertical" }}></textarea>
                  </div>
                </div>
                <button type="submit" style={{
                  background: "#b76e79",
                  color: "white",
                  border: "none",
                  padding: "18px 40px",
                  fontSize: "1.3rem",
                  borderRadius: "60px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  width: "100%",
                  marginTop: "30px",
                  cursor: "pointer",
                  transition: "background 0.3s",
                  boxShadow: "0 10px 25px rgba(183,110,121,0.4)",
                }}>Confirmar Asistencia</button>
              </form>
            </section>

            {/* CONFIRMACIONES (Lista de invitados) */}
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Confirmaciones</h2>
              <div style={{
                background: "#fff",
                borderRadius: "60px",
                padding: "40px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
              }}>
                {confirmacionesEjemplo.map((conf, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom: idx < confirmacionesEjemplo.length - 1 ? "1px dashed #f0e4d7" : "none",
                  }}>
                    <span style={{ fontWeight: 600, fontSize: "1.1rem", color: "#4a4a4a" }}>{conf.familia}</span>
                    <div style={{ display: "flex", gap: "15px", color: "#b76e79" }}>
                      <span>{conf.adultos} adulto{conf.adultos !== 1 ? 's' : ''}</span>
                      {conf.ninos > 0 && <span>{conf.ninos} niño{conf.ninos !== 1 ? 's' : ''}</span>}
                      <span style={{ color: "#27ae60", fontWeight: 600 }}>✔ Asistirán</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MESAS DE REGALOS */}
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Mesas de Regalos</h2>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "30px",
                flexWrap: "wrap",
              }}>
                {REGALOS.map((regalo, idx) => (
                  <a key={idx} href={regalo.url} target="_blank" rel="noopener noreferrer" style={{
                    background: "#fff",
                    padding: "20px 50px",
                    borderRadius: "60px",
                    textDecoration: "none",
                    color: "#4a4a4a",
                    fontWeight: 600,
                    fontSize: "1.4rem",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.03)",
                    border: "1px solid #f0e4d7",
                    transition: "all 0.2s",
                  }}>
                    {regalo.nombre}
                  </a>
                ))}
              </div>
            </section>

          </main>
        </div>
      )}
    </>
  );
}

// Estilos reutilizables
const sectionStyle = {
  scrollMarginTop: "80px",
};

const sectionTitleStyle = {
  fontFamily: "'Great Vibes', cursive",
  fontSize: "3.5rem",
  fontWeight: 400,
  color: "#b76e79",
  textAlign: "center",
  marginBottom: "40px",
  letterSpacing: "1px",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  fontSize: "0.9rem",
  color: "#a17a6b",
  marginBottom: "8px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const inputStyle = {
  padding: "15px 20px",
  border: "2px solid #f0e4d7",
  borderRadius: "50px",
  fontSize: "1rem",
  background: "#fefcf9",
  fontFamily: "'Quicksand', sans-serif",
};
