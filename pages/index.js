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

export default function Home() {
  // ====================================================
  // 🖼️ CONFIGURACIÓN - ¡CÁMBIALO AQUÍ!
  // ====================================================
  // Nombres de los novios
  const NOMBRES = {
    el: "Ana",
    ella: "Carlos",
  };

  // Fecha de la boda
  const FECHA_BODA = "2027-04-23T16:00:00";

  // Imagen de fondo (marco floral) - DEBE ESTAR EN /public
  const BACKGROUND_IMAGE = "/marco-boda.jpeg";

  // Imagen de la pareja principal (para la sección "Los Novios")
  const COUPLE_MAIN_IMAGE = "/pareja-principal.jpg";

  // Imágenes de la galería (fotos de la pareja)
  const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
  ];

  // Imágenes de las mascotas (PERROS)
  const MASCOT_IMAGES = {
    perro1: "🐕", // 🔴 REEMPLAZA ESTO CON LA URL DE LA IMAGEN DEL PERRO 1
    perro2: "🐩", // 🔴 REEMPLAZA ESTO CON LA URL DE LA IMAGEN DEL PERRO 2
  };

  // Opacidad del marco floral (0.0 a 1.0)
  const FLORAL_FRAME_OPACITY = 0.25;

  // Tamaño de los íconos del itinerario (píxeles)
  const TIMELINE_ICON_SIZE = 80;

  // Itinerario del evento (ajusta horarios y descripciones)
  const ITINERARY = [
    { time: "16:00", icon: "/iconos/Ceremony.png", label: "Ceremonia", desc: "Hacienda Los Olivos" },
    { time: "17:30", icon: "/iconos/Cocteel.png", label: "Cóctel de Bienvenida", desc: "Jardín" },
    { time: "19:00", icon: "/iconos/cena.png", label: "Cena", desc: "Salón Principal" },
    { time: "22:00", icon: "/iconos/Fiesta.png", label: "Fiesta", desc: "Pista de Baile" },
    { time: "00:00", icon: "/iconos/Cierre.png", label: "Cierre", desc: "Despedida" },
  ];

  // Datos de los padrinos
  const PADRINOS = [
    { rol: "Padrinos de Arras", nombres: ["María González", "Juan Pérez"] },
    { rol: "Padrinos de Velación", nombres: ["Laura Martínez", "Pedro Sánchez"] },
    { rol: "Padrinos de Anillos", nombres: ["Sofía Ramírez", "Diego López"] },
  ];

  // Mesas de regalos
  const REGALOS = [
    { nombre: "Amazon", url: "https://amazon.com.mx/wedding-registry", logo: "amazon" },
    { nombre: "Liverpool", url: "https://www.liverpool.com.mx/mesa-de-regalos", logo: "liverpool" },
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

  // Estado para el formulario RSVP (simplificado para el ejemplo)
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
    alert(`¡Gracias por confirmar, familia ${formData.familia || "invitada"}! Te esperamos.`);
    // Aquí iría la lógica real para enviar a la API
  };

  // Datos de ejemplo para confirmaciones
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

      <div style={{
        position: "relative",
        minHeight: "100vh",
        background: "#fef9f0", // Fondo crema
        fontFamily: "'Quicksand', sans-serif",
        color: "#4a4a4a",
      }}>
        {/* Marco Floral de Fondo */}
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${BACKGROUND_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: FLORAL_FRAME_OPACITY,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        {/* Contenido Principal */}
        <main style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "60px",
        }}>

          {/* PORTADA: Nombres y Contador */}
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

            {/* Contador */}
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

          {/* LOS NOVIOS */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Los Novios</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "40px",
              alignItems: "center",
              background: "#fff",
              borderRadius: "50px",
              padding: "40px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto",
                  border: "5px solid #f0d9d0",
                  boxShadow: "0 10px 30px rgba(183,110,121,0.2)",
                }}>
                  <img src={COUPLE_MAIN_IMAGE} alt={`${NOMBRES.el} y ${NOMBRES.ella}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: "1.3rem", lineHeight: 1.8, color: "#5a4e4a" }}>
                  Con mucha emoción y amor, queremos compartir este día tan especial con ustedes. 
                  Nos conocimos hace 7 años en un café y desde entonces hemos construido una historia 
                  llena de aventuras, risas y sueños compartidos. Ahora, queremos dar el siguiente paso 
                  y unir nuestras vidas para siempre, rodeados de las personas que más queremos.
                </p>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: "2.2rem", color: "#b76e79", marginTop: "20px", textAlign: "right" }}>
                  {NOMBRES.el} & {NOMBRES.ella}
                </p>
              </div>
            </div>
          </section>

          {/* ITINERARIO */}
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
                  transition: "transform 0.2s",
                }}>
                  <div style={{
                    width: TIMELINE_ICON_SIZE,
                    height: TIMELINE_ICON_SIZE,
                    margin: "0 auto 20px",
                  }}>
                    <img src={item.icon} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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

          {/* CONFIRMACIÓN RSVP */}
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

          {/* CON CARIÑO, E & J (con imágenes de perros) */}
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Con cariño, {NOMBRES.el} & {NOMBRES.ella}</h2>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              flexWrap: "wrap",
              background: "#fff",
              borderRadius: "60px",
              padding: "40px",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "#f0e4d7",
                  margin: "0 auto 20px",
                  overflow: "hidden",
                  border: "4px solid white",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                }}>
                  {MASCOT_IMAGES.perro1.startsWith('http') ? (
                    <img src={MASCOT_IMAGES.perro1} alt="Mascota 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ fontSize: "5rem", lineHeight: "180px", textAlign: "center" }}>{MASCOT_IMAGES.perro1}</div>
                  )}
                </div>
                <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "#b76e79" }}>Toby</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "#f0e4d7",
                  margin: "0 auto 20px",
                  overflow: "hidden",
                  border: "4px solid white",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                }}>
                  {MASCOT_IMAGES.perro2.startsWith('http') ? (
                    <img src={MASCOT_IMAGES.perro2} alt="Mascota 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ fontSize: "5rem", lineHeight: "180px", textAlign: "center" }}>{MASCOT_IMAGES.perro2}</div>
                  )}
                </div>
                <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "#b76e79" }}>Luna</p>
              </div>
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
    </>
  );
}

// Estilos reutilizables (objetos de JavaScript)
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
