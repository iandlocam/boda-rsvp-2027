// /pages/index.js
import { useEffect, useMemo, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

function clamp(n) {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

async function enviarRSVP({ id, asistencia, mensaje, pasesConfirmados, bebidas, alergias }) {
  const resp = await fetch("/api/guest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, asistencia, mensaje, pasesConfirmados, bebidas, alergias }),
  });

  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error || "Error desconocido");
  return data;
}

// ====================================================
// 🎨 PALETA DE COLORES
// ====================================================
const COLORS = {
  cream: "#f5ede4",
  textDark: "#2c3e4a",
  textMedium: "#6b7b85",
  accentLight: "#b8a99a",
  accentMedium: "#8b7a6a",
  gold: "#c4a882",
  goldLight: "#d4c0a8",
  blueSoft: "#5a7a8a",
  white: "#ffffff",
  text: "#2c3e4a",
  textLight: "#6b7b85",
  borderGray: "#e8e0d6",
};

// ====================================================
// 🖼️ COMPONENTES
// ====================================================

/** ✅ Monograma AV */
function MonogramaAV({ size = 60, color = COLORS.textDark }) {
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
          <stop offset="0" stopColor={COLORS.gold} stopOpacity="0.78" />
          <stop offset="1" stopColor={COLORS.textDark} stopOpacity="0.18" />
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

/** ✅ Sello */
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
            <stop offset="44%" stopColor={COLORS.gold} stopOpacity="1" />
            <stop offset="70%" stopColor="#d6b25e" stopOpacity="1" />
            <stop offset="100%" stopColor="#7a5b22" stopOpacity="1" />
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
            color: COLORS.textDark,
            textShadow: "0 1px 0 rgba(255,255,255,0.25), 0 10px 22px rgba(0,0,0,0.20)",
            letterSpacing: "0.01em",
            opacity: 0.85,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

/** ✅ TimelineIcon */
function TimelineIcon({ type = "ceremony", size = 48 }) {
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
        background: COLORS.accentLight,
        border: `2px solid ${COLORS.accentMedium}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: "bold",
        color: COLORS.textDark,
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

/** ✅ ImageCarousel */
function ImageCarousel({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (touchStart - touchEnd < -50) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    } else if (e.key === "ArrowRight") {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "white",
          fontSize: "30px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          backdropFilter: "blur(5px)",
        }}
      >
        ✕
      </button>

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontSize: "16px",
          background: "rgba(0,0,0,0.5)",
          padding: "8px 16px",
          borderRadius: "20px",
          fontFamily: "'Quicksand', sans-serif",
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }}
        style={{
          position: "absolute",
          left: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          backdropFilter: "blur(5px)",
        }}
      >
        ‹
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((prev) => (prev + 1) % images.length);
        }}
        style={{
          position: "absolute",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          backdropFilter: "blur(5px)",
        }}
      >
        ›
      </button>

      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
          borderRadius: "10px",
          cursor: "default",
        }}
      />
    </div>
  );
}

/** ✅ Botón Flotante de Música */
function MusicFloatingButton({ isPlaying, onClick }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: COLORS.blueSoft,
        border: `3px solid ${COLORS.white}`,
        boxShadow: `0 4px 15px rgba(44,62,74,0.3)`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        transition: "all 0.3s ease",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.8)",
        animation: isVisible ? "pulse 2s infinite" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(90, 122, 138, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(90, 122, 138, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(90, 122, 138, 0);
          }
        }
      `}</style>
      
      {isPlaying ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={COLORS.white}>
          <rect x="6" y="4" width="4" height="16" rx="1" fill={COLORS.white} />
          <rect x="14" y="4" width="4" height="16" rx="1" fill={COLORS.white} />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={COLORS.white}>
          <path d="M8 5v14l11-7z" fill={COLORS.white} />
        </svg>
      )}
    </button>
  );
}

export default function Home() {
  const router = useRouter();
  const audioRef = useRef(null);

  // ====================================================
  // 🖼️ CONFIGURACIÓN DE IMÁGENES
  // ====================================================
  
  const BACKGROUND_IMAGE = "/marco-boda.jpeg";
  const SOBRE_IMAGE = "/sobre-boda.jpg";
  const DRESS_CODE_IMAGE = "/Dress-code.png";
  
  const DIVIDER_IMAGE_1 = "/familia.jpeg";
  const DIVIDER_IMAGE_2 = "/divider-floral-2.png";
  
  const CAROUSEL_3_IMAGES = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
  ];
  
  const LIVERPOOL_LOGO = "/liverpool-logo.png";
  const AMAZON_LOGO = "/amazon-logo.png";
  
  const SONG_URL = "/Post-quimica.mp3";
  
  const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
  ];

  const SECONDARY_GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
  ];
  
  // ====================================================
  // 🎨 OPCIONES DE ESTILO
  // ====================================================
  
  const FLORAL_FRAME_OPACITY = 0.4;
  const TIMELINE_ICON_SIZE = 80;
  
  const COLOR_PALETTE = [
    "#4A6B8A",
    "#6B8FA0",
    "#8BAA7A",
    "#B5A68A",
    "#D4B896",
    "#C49A8A",
  ];
  
  // ====================================================
  // 📋 DRESS CODE - TEXTO CON SALTOS DE LÍNEA
  // ====================================================
  
  const DRESS_CODE = {
    title: "Dress code",
    text: [
      "Formal / jardín elegante",
      "Te sugerimos telas frescas y cómodas. Evita tacones muy delgados por el terreno.",
      "Ayúdanos a que la novia sea la única de blanco. Les pedimos no usar blanco ni tonos similares.",
      "🤍¡Gracias por ser parte de este día! 🤍",
      "Les sugerimos los siguientes colores."
    ],
  };
  
  // ====================================================
  // 📋 DATOS DE HOTELES
  // ====================================================
  
  const HOTELES = [
    {
      nombre: "Hotel Royal Garden",
      web: "https://www.royalgarden.com",
      maps: "https://maps.google.com/?q=Hotel+Royal+Garden+Jiutepec",
      telefono: "+52 777 123 4567",
      whatsapp: "+52 777 123 4567",
    },
    {
      nombre: "Hotel Villa Maroma",
      web: "https://www.villamaroma.com",
      maps: "https://maps.google.com/?q=Hotel+Villa+Maroma+Jiutepec",
      telefono: "+52 777 234 5678",
      whatsapp: "+52 777 234 5678",
    },
    {
      nombre: "Hotel Boutique Casa del Sol",
      web: "https://www.casasol.com",
      maps: "https://maps.google.com/?q=Hotel+Boutique+Casa+del+Sol+Jiutepec",
      telefono: "+52 777 345 6789",
      whatsapp: "+52 777 345 6789",
    },
    {
      nombre: "Hotel Hacienda San Carlos",
      web: "https://www.haciendasan.com",
      maps: "https://maps.google.com/?q=Hotel+Hacienda+San+Carlos+Jiutepec",
      telefono: "+52 777 456 7890",
      whatsapp: "+52 777 456 7890",
    },
  ];
  
  const AIRBNB_DATA = {
    nombre: "Airbnb",
    texto: "Revisa la lista que hicimos para ti",
    link: "https://www.airbnb.com/wishlists/...",
  };
  
  // ====================================================

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [secondaryCarouselOpen, setSecondaryCarouselOpen] = useState(false);
  const [secondaryCarouselIndex, setSecondaryCarouselIndex] = useState(0);
  
  const [carousel3Open, setCarousel3Open] = useState(false);
  const [carousel3Index, setCarousel3Index] = useState(0);
  const [carousel3ImageIndex, setCarousel3ImageIndex] = useState(0);
  const [carousel3TouchStart, setCarousel3TouchStart] = useState(0);
  const [carousel3TouchEnd, setCarousel3TouchEnd] = useState(0);

  const weddingDateMs = useMemo(() => new Date("2027-04-23T16:00:00").getTime(), []);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
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
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  const [bebidasSeleccionadas, setBebidasSeleccionadas] = useState([]);
  const [alergias, setAlergias] = useState("");

  const bebidasOptions = [
    { id: "ron", label: "Ron" },
    { id: "whiskey", label: "Whiskey" },
    { id: "tequila", label: "Tequila" },
    { id: "vodka", label: "Vodka" },
    { id: "cerveza", label: "Cerveza" },
    { id: "vino", label: "Vino" },
  ];

  const toggleBebida = (bebidaId) => {
    setBebidasSeleccionadas(prev => 
      prev.includes(bebidaId)
        ? prev.filter(id => id !== bebidaId)
        : [...prev, bebidaId]
    );
  };

  const handleCarousel3TouchStart = (e) => {
    setCarousel3TouchStart(e.targetTouches[0].clientX);
  };

  const handleCarousel3TouchMove = (e) => {
    setCarousel3TouchEnd(e.targetTouches[0].clientX);
  };

  const handleCarousel3TouchEnd = () => {
    if (carousel3TouchStart - carousel3TouchEnd > 50) {
      setCarousel3ImageIndex((prev) => (prev + 1) % CAROUSEL_3_IMAGES.length);
    } else if (carousel3TouchStart - carousel3TouchEnd < -50) {
      setCarousel3ImageIndex((prev) => (prev - 1 + CAROUSEL_3_IMAGES.length) % CAROUSEL_3_IMAGES.length);
    }
  };

  const openCarousel3 = (index) => {
    setCarousel3Index(index);
    setCarousel3Open(true);
  };

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

        if (g?.bebidas) {
          setBebidasSeleccionadas(g.bebidas);
        }
        if (g?.alergias) {
          setAlergias(g.alergias);
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
        bebidas: asistencia === "Sí" ? bebidasSeleccionadas : [],
        alergias: asistencia === "Sí" ? alergias : "",
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

  // ====================================================
  // 📍 UBICACIONES
  // ====================================================
  
  const MAPS_CEREMONY_URL = "https://maps.google.com/?q=Parroquia%20de%20San%20Miguel%20Arcangel%2C%20Jiutepec%2C%20Morelos";
  const WAZE_CEREMONY_URL = "https://waze.com/ul?q=Parroquia%20de%20San%20Miguel%20Arcangel%20Jiutepec%20Morelos";

  const NUESTRA_HISTORIA = [
    {
      title: "Cómo empezó",
      text: "Un día cualquiera se volvió especial. Entre risas, pláticas largas y complicidad, entendimos que esto iba en serio.",
    },
    {
      title: "Lo que nos une",
      text: "Amor por lo simple, por la familia, por viajar y por crear un hogar donde siempre haya paz (y música).",
    },
    {
      title: "El gran día",
      text: "Nos emociona celebrarlo contigo. Gracias por ser parte de nuestra historia y de este nuevo capítulo.",
    },
  ];

  const TIMELINE = [
    { time: "4:00 PM", title: "Ceremonia", iconType: "ceremony" },
    { time: "5:00 PM", title: "Coctel", iconType: "reception" },
    { time: "7:30 PM", title: "Cena", iconType: "dinner" },
    { time: "9:00 PM", title: "Fiesta", iconType: "party" },
    { time: "3:00 AM", title: "Cierre", iconType: "close" },
  ];
  
  const MESA_REGALOS = [
    { type: "liverpool", url: "https://www.liverpool.com.mx/" },
    { type: "amazon", url: "https://www.amazon.com.mx/wedding/share/VanessaAndres/" },
  ];

  // ====================================================
  // 🎨 ESTILOS
  // ====================================================
  
  const envelopeStyles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: COLORS.cream,
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
      background: COLORS.cream,
      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)`,
      border: `4px solid ${COLORS.white}`,
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
      borderBottom: `2px solid ${COLORS.accentLight}`,
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
      color: COLORS.textDark,
      opacity: 0.7,
      margin: "20px 0 15px 0",
      borderTop: `1px dashed ${COLORS.accentLight}`,
      borderBottom: `1px dashed ${COLORS.accentLight}`,
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
      color: COLORS.textDark,
      opacity: 0.7,
      marginBottom: 5,
    },
    reservedNumber: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 48,
      fontWeight: 700,
      color: COLORS.blueSoft,
      lineHeight: 1,
      margin: "5px 0",
    },
    reservedSubtext: {
      fontFamily: '"Cormorant Garamond", serif',
      fontSize: 14,
      letterSpacing: "2px",
      textTransform: "uppercase",
      color: COLORS.textDark,
      opacity: 0.6,
    },
    seal: {
      position: "absolute",
      bottom: 30,
      right: 30,
      width: 50,
      height: 50,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.accentLight})`,
      border: `2px solid ${COLORS.white}`,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: COLORS.textDark,
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

  const invitationStyles = {
    page: {
      minHeight: "100vh",
      backgroundColor: COLORS.cream,
      fontFamily: "'Quicksand', sans-serif",
      color: COLORS.textDark,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: 800,
      background: COLORS.white,
      borderRadius: 60,
      boxShadow: `0 15px 40px rgba(0,0,0,0.05)`,
      padding: "50px 40px",
      border: `1px solid ${COLORS.accentLight}`,
    },
    names: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: "clamp(3.5rem, 10vw, 5.5rem)",
      fontWeight: 400,
      color: COLORS.gold,
      textAlign: "center",
      marginBottom: 30,
      lineHeight: 1.2,
      textShadow: "0 2px 8px rgba(196, 168, 130, 0.15)",
    },
    subtitle: {
      fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
      color: COLORS.textMedium,
      textAlign: "center",
      marginBottom: 20,
      fontFamily: "'Quicksand', sans-serif",
      fontWeight: 400,
    },
    invitationText: {
      fontSize: "clamp(1rem, 3.5vw, 1.1rem)",
      color: COLORS.textMedium,
      textAlign: "center",
      marginBottom: 25,
      lineHeight: 1.6,
      fontFamily: "'Quicksand', sans-serif",
    },
    familySection: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      margin: "30px 0 40px",
    },
    familyCard: {
      background: COLORS.cream,
      borderRadius: 30,
      padding: "20px 15px",
      textAlign: "center",
      border: `1px solid ${COLORS.accentLight}`,
    },
    familyLabel: {
      fontSize: "0.9rem",
      color: COLORS.gold,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: 10,
    },
    familyName: {
      fontSize: "1.1rem",
      color: COLORS.textDark,
      fontWeight: 500,
    },
    dividerImage: {
      width: "100%",
      maxWidth: "600px",
      height: "auto",
      margin: "40px auto",
      display: "block",
      opacity: 0.7,
    },
    colorPalette: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "6px",
      margin: "15px 0 10px",
      flexWrap: "wrap",
      padding: "0 10px",
    },
    colorDot: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
      border: `2px solid ${COLORS.white}`,
      transition: "transform 0.2s",
      cursor: "default",
    },
    ubicacionesContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "20px",
    },
    ubicacionCard: {
      background: COLORS.white,
      borderRadius: 40,
      padding: "25px 20px",
      textAlign: "center",
      border: `1px solid ${COLORS.accentLight}`,
    },
    ubicacionTitle: {
      fontSize: "1.3rem",
      fontWeight: 600,
      color: COLORS.gold,
      marginBottom: 10,
    },
    ubicacionAddress: {
      fontSize: "1rem",
      color: COLORS.textMedium,
      marginBottom: 15,
    },
    storeLogo: {
      width: "120px",
      height: "auto",
      marginBottom: "10px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
    secondaryGallery: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "15px",
      marginTop: "30px",
    },
    secondaryGalleryImage: {
      width: "100%",
      aspectRatio: "1/1",
      objectFit: "cover",
      borderRadius: 20,
      cursor: "pointer",
      transition: "transform 0.2s",
      border: `2px solid ${COLORS.white}`,
      boxShadow: `0 5px 15px rgba(0,0,0,0.1)`,
      transform: "scale(1.1)",
    },
    bebidasContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "12px",
      marginTop: "20px",
    },
    bebidaOption: {
      background: COLORS.white,
      borderRadius: 40,
      padding: "12px",
      textAlign: "center",
      cursor: "pointer",
      border: `2px solid ${COLORS.borderGray}`,
      transition: "all 0.2s",
      fontSize: "1rem",
      fontWeight: 500,
      color: COLORS.textDark,
    },
    bebidaOptionSelected: {
      background: COLORS.blueSoft,
      borderColor: COLORS.blueSoft,
      color: COLORS.white,
    },
    alergiasInput: {
      width: "100%",
      padding: "15px 20px",
      border: `2px solid ${COLORS.blueSoft}`,
      borderRadius: 50,
      fontSize: "1rem",
      background: COLORS.cream,
      fontFamily: "'Quicksand', sans-serif",
      marginTop: "15px",
      color: COLORS.textDark,
    },
    countdownContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "clamp(8px, 2vw, 15px)",
      width: "100%",
      maxWidth: 500,
      margin: "0 auto 40px",
      background: COLORS.white,
      borderRadius: 100,
      padding: "clamp(15px, 4vw, 25px) clamp(10px, 3vw, 20px)",
      boxShadow: `0 5px 20px rgba(44,62,74,0.08)`,
    },
    countdownItem: {
      textAlign: "center",
    },
    countdownNumber: {
      fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
      fontWeight: 600,
      color: COLORS.gold,
      lineHeight: 1,
    },
    countdownLabel: {
      fontSize: "clamp(0.65rem, 2.5vw, 0.9rem)",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: COLORS.textMedium,
    },
    sectionTitle: {
      fontFamily: '"Great Vibes", cursive',
      fontSize: "clamp(2.2rem, 8vw, 3rem)",
      fontWeight: 400,
      color: COLORS.gold,
      textAlign: "center",
      marginBottom: "clamp(20px, 5vw, 30px)",
      letterSpacing: "1px",
    },
    cardItem: {
      background: COLORS.white,
      borderRadius: 40,
      padding: "clamp(20px, 4vw, 30px) clamp(15px, 3vw, 20px)",
      textAlign: "center",
      boxShadow: `0 8px 25px rgba(44,62,74,0.06)`,
      border: `1px solid ${COLORS.accentLight}`,
    },
    formContainer: {
      background: COLORS.white,
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
      color: COLORS.textMedium,
      marginBottom: 8,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    input: {
      padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
      border: `2px solid ${COLORS.blueSoft}`,
      borderRadius: 50,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      background: COLORS.cream,
      fontFamily: "'Quicksand', sans-serif",
    },
    select: {
      padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
      border: `2px solid ${COLORS.blueSoft}`,
      borderRadius: 50,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      background: COLORS.cream,
      fontFamily: "'Quicksand', sans-serif",
    },
    textarea: {
      padding: "clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)",
      border: `2px solid ${COLORS.blueSoft}`,
      borderRadius: 25,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      background: COLORS.cream,
      fontFamily: "'Quicksand', sans-serif",
      resize: "vertical",
    },
    button: {
      background: COLORS.blueSoft,
      color: COLORS.white,
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
      boxShadow: `0 10px 25px rgba(90,122,138,0.3)`,
      fontFamily: "'Quicksand', sans-serif",
    },
    carouselContainer: {
      width: "100%",
      maxWidth: 800,
      margin: "20px auto 0",
      position: "relative",
      overflow: "hidden",
      borderRadius: 30,
      boxShadow: `0 10px 30px rgba(0,0,0,0.08)`,
    },
    carouselSlide: {
      display: "flex",
      transition: "transform 0.3s ease",
      cursor: "pointer",
    },
    carouselImage: {
      width: "100%",
      flexShrink: 0,
      height: "auto",
      aspectRatio: "1.2/1",
      objectFit: "cover",
      borderRadius: 30,
    },
    carouselDots: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginTop: "15px",
      marginBottom: "10px",
    },
    carouselDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: COLORS.accentLight,
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    carouselDotActive: {
      width: "20px",
      borderRadius: "10px",
      background: COLORS.blueSoft,
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
      color: COLORS.textDark,
      marginBottom: 5,
    },
    timelineTitle: {
      fontWeight: 700,
      fontSize: "clamp(1rem, 4vw, 1.2rem)",
      marginBottom: 5,
      color: COLORS.gold,
    },
    softBox: {
      borderRadius: 40,
      border: `1px solid ${COLORS.borderGray}`,
      background: COLORS.white,
      padding: "clamp(15px, 4vw, 20px)",
    },
    moneyBox: {
      borderRadius: 40,
      border: `1px solid ${COLORS.borderGray}`,
      background: COLORS.white,
      padding: "30px 20px",
      textAlign: "center",
      marginTop: "20px",
    },
    linkBtnPrimary: {
      display: "inline-block",
      padding: "clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px)",
      borderRadius: 50,
      background: COLORS.white,
      color: COLORS.textDark,
      textDecoration: "none",
      fontWeight: 600,
      border: `2px solid ${COLORS.borderGray}`,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      transition: "all 0.2s",
    },
    linkBtn: {
      display: "inline-block",
      padding: "clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px)",
      borderRadius: 50,
      background: COLORS.white,
      color: COLORS.textDark,
      textDecoration: "none",
      fontWeight: 600,
      border: `2px solid ${COLORS.borderGray}`,
      fontSize: "clamp(0.9rem, 3vw, 1rem)",
      transition: "all 0.2s",
    },
    regalosContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      marginTop: "20px",
    },
    regaloItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    regaloLink: {
      background: COLORS.white,
      padding: "15px 30px",
      borderRadius: 60,
      textDecoration: "none",
      color: COLORS.textDark,
      fontWeight: 600,
      fontSize: "1.2rem",
      boxShadow: "0 5px 15px rgba(0,0,0,0.03)",
      border: `1px solid ${COLORS.accentLight}`,
      transition: "all 0.2s",
      width: "100%",
      maxWidth: 300,
      textAlign: "center",
      marginTop: "10px",
    },
    // ====================================================
    // 🏨 ESTILOS PARA LA SECCIÓN DE HOSPEDAJES
    // ====================================================
    hospedajesContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginTop: "10px",
    },
    hotelCard: {
      background: COLORS.white,
      borderRadius: 40,
      padding: "20px 20px",
      border: `1px solid ${COLORS.accentLight}`,
      boxShadow: "0 5px 15px rgba(0,0,0,0.03)",
    },
    hotelNombre: {
      fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
      fontWeight: 700,
      color: COLORS.gold,
      marginBottom: "10px",
      textAlign: "center",
    },
    hotelRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "6px",
      fontSize: "clamp(0.85rem, 3vw, 0.95rem)",
      flexWrap: "wrap",
    },
    hotelIcon: {
      fontSize: "1.1rem",
      opacity: 0.7,
      minWidth: "24px",
      textAlign: "center",
    },
    hotelLink: {
      color: COLORS.blueSoft,
      textDecoration: "none",
      fontWeight: 500,
      wordBreak: "break-all",
    },
    hotelMapsBtn: {
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: 30,
      background: COLORS.white,
      color: COLORS.textDark,
      textDecoration: "none",
      fontSize: "clamp(0.75rem, 2.5vw, 0.85rem)",
      fontWeight: 600,
      border: `2px solid ${COLORS.borderGray}`,
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
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setAudioPlaying(true);
            console.log("Audio reproduciéndose");
          })
          .catch(error => {
            console.log("Autoplay bloqueado por el navegador:", error);
          });
      }
    }, 500);

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  }

  const handleUserInteraction = () => {
    if (envelopeOpen && audioRef.current && !audioPlaying) {
      audioRef.current.play()
        .then(() => setAudioPlaying(true))
        .catch(e => console.log("Error al reproducir:", e));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
        setAudioPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setAudioPlaying(true))
          .catch(e => console.log("Error al reproducir:", e));
      }
    }
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      setCurrentImageIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    } else if (touchStart - touchEnd < -50) {
      setCurrentImageIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  const openCarousel = (index) => {
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

  const openSecondaryCarousel = (index) => {
    setSecondaryCarouselIndex(index);
    setSecondaryCarouselOpen(true);
  };

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
  
      {/* SOBRE CERRADO */}
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

      {/* INVITACIÓN */}
      {envelopeOpen && (
        <div 
          style={invitationStyles.page}
          onClick={handleUserInteraction}
        >
          <div style={invitationStyles.card}>
            <audio
              ref={audioRef}
              src={SONG_URL}
              loop
              preload="auto"
              style={{ display: 'none' }}
            />

            {/* Nombres en dorado */}
            <div style={invitationStyles.names}>
              Vanessa<br />&<br />Andrés
            </div>
            
            <div style={invitationStyles.subtitle}>¡Nos casamos!</div>

            {/* Contador en dorado */}
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

            <div style={invitationStyles.invitationText}>
              Estamos felices de invitarlos a celebrar este momento con nosotros y en compañía de
            </div>

            {/* Familias y padrinos - títulos en dorado */}
            <div style={invitationStyles.familySection}>
              <div style={invitationStyles.familyCard}>
                <div style={invitationStyles.familyLabel}>Papás de la novia</div>
                <div style={invitationStyles.familyName}>María González</div>
                <div style={invitationStyles.familyName}>Juan Pérez</div>
              </div>
              <div style={invitationStyles.familyCard}>
                <div style={invitationStyles.familyLabel}>Papás del novio</div>
                <div style={invitationStyles.familyName}>Laura Martínez</div>
                <div style={invitationStyles.familyName}>Pedro Sánchez</div>
              </div>
              <div style={invitationStyles.familyCard}>
                <div style={invitationStyles.familyLabel}>Padrinos de velación</div>
                <div style={invitationStyles.familyName}>Sofía Ramírez</div>
                <div style={invitationStyles.familyName}>Diego López</div>
              </div>
            </div>

            {/* Galería */}
            <div style={{ marginTop: 30 }}>
              <div style={invitationStyles.sectionTitle}>Galería</div>
              
              <div style={invitationStyles.carouselContainer}>
                <div
                  style={{
                    ...invitationStyles.carouselSlide,
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {GALLERY_IMAGES.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Foto ${idx + 1}`}
                      style={invitationStyles.carouselImage}
                      onClick={() => openCarousel(idx)}
                    />
                  ))}
                </div>
              </div>

              <div style={invitationStyles.carouselDots}>
                {GALLERY_IMAGES.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...invitationStyles.carouselDot,
                      ...(idx === currentImageIndex ? invitationStyles.carouselDotActive : {}),
                    }}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Nuestra historia - títulos en dorado */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Nuestra historia</div>
              <div style={invitationStyles.softBox}>
                {NUESTRA_HISTORIA.map((b, i) => (
                  <div key={i} style={{ marginBottom: i === NUESTRA_HISTORIA.length - 1 ? 0 : 20 }}>
                    <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: "clamp(1.5rem, 6vw, 1.8rem)", color: COLORS.gold, marginBottom: 5, textAlign: "center" }}>
                      {b.title}
                    </div>
                    <p style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)", color: COLORS.textMedium, textAlign: "center", lineHeight: 1.6 }}>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <img 
              src={DIVIDER_IMAGE_1}
              alt="Separador floral 1"
              style={invitationStyles.dividerImage}
            />

            {/* Itinerario - títulos en dorado */}
            <div style={{ marginTop: 20 }}>
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

            {/* Dress code - TEXTO CENTRADO CON SALTOS DE LÍNEA */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Dress code</div>
              <div style={{ ...invitationStyles.softBox, textAlign: "center" }}>
                <img
                  src={DRESS_CODE_IMAGE}
                  alt="Dress code"
                  style={{ width: "min(200px, 60%)", maxWidth: "100%", height: "auto", margin: "0 auto 20px", display: "block" }}
                />
                
                {/* ✅ TEXTO CENTRADO CON SALTOS DE LÍNEA */}
                {DRESS_CODE.text.map((linea, index) => (
                  <p 
                    key={index} 
                    style={{ 
                      fontSize: "clamp(0.9rem, 3vw, 1rem)", 
                      color: COLORS.textDark, 
                      margin: index === 0 ? "0 0 4px 0" : "4px 0",
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                  >
                    {linea}
                  </p>
                ))}
                
                {/* Paleta de colores */}
                <div style={invitationStyles.colorPalette}>
                  {COLOR_PALETTE.map((color, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...invitationStyles.colorDot,
                        backgroundColor: color,
                        marginTop: idx % 2 === 0 ? "0px" : "-12px",
                      }}
                      title={`Color ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Carrusel de 3 imágenes */}
            <div style={{ marginTop: 30 }}>
              <div style={invitationStyles.carouselContainer}>
                <div
                  style={{
                    ...invitationStyles.carouselSlide,
                    transform: `translateX(-${carousel3ImageIndex * 100}%)`,
                  }}
                  onTouchStart={handleCarousel3TouchStart}
                  onTouchMove={handleCarousel3TouchMove}
                  onTouchEnd={handleCarousel3TouchEnd}
                >
                  {CAROUSEL_3_IMAGES.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Carrusel 3 imagen ${idx + 1}`}
                      style={invitationStyles.carouselImage}
                      onClick={() => openCarousel3(idx)}
                    />
                  ))}
                </div>
              </div>

              <div style={invitationStyles.carouselDots}>
                {CAROUSEL_3_IMAGES.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...invitationStyles.carouselDot,
                      ...(idx === carousel3ImageIndex ? invitationStyles.carouselDotActive : {}),
                    }}
                    onClick={() => setCarousel3ImageIndex(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Más momentos */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Más momentos</div>
              <div style={invitationStyles.secondaryGallery}>
                {SECONDARY_GALLERY_IMAGES.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Foto secundaria ${idx + 1}`}
                    style={invitationStyles.secondaryGalleryImage}
                    onClick={() => openSecondaryCarousel(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Ceremonia y recepción */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Ceremonia y recepción</div>
              <div style={invitationStyles.ubicacionesContainer}>
                <div style={invitationStyles.ubicacionCard}>
                  <div style={invitationStyles.ubicacionTitle}>📍 Ceremonia</div>
                  <div style={invitationStyles.ubicacionAddress}>
                    Parroquia de San Miguel Arcángel<br />
                    Jiutepec, Morelos
                  </div>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                    <a href={MAPS_CEREMONY_URL} target="_blank" rel="noreferrer" style={invitationStyles.linkBtnPrimary}>
                      Google Maps
                    </a>
                    <a href={WAZE_CEREMONY_URL} target="_blank" rel="noreferrer" style={invitationStyles.linkBtn}>
                      Waze
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mesa de regalos */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Mesa de regalos</div>
              <div style={invitationStyles.softBox}>
                <div style={invitationStyles.regalosContainer}>
                  <div style={invitationStyles.regaloItem}>
                    <img 
                      src={LIVERPOOL_LOGO}
                      alt="Liverpool"
                      style={invitationStyles.storeLogo}
                    />
                    <a href={MESA_REGALOS[0].url} target="_blank" rel="noreferrer" style={invitationStyles.regaloLink}>
                      Ver lista
                    </a>
                  </div>
                  
                  <div style={invitationStyles.regaloItem}>
                    <img 
                      src={AMAZON_LOGO}
                      alt="Amazon"
                      style={invitationStyles.storeLogo}
                    />
                    <a href={MESA_REGALOS[1].url} target="_blank" rel="noreferrer" style={invitationStyles.regaloLink}>
                      Ver lista
                    </a>
                  </div>
                </div>

                {/* Regalo monetario - con icono de sobre */}
                <div style={invitationStyles.moneyBox}>
                  <div style={{ fontSize: "3rem", marginBottom: "10px" }}>✉️</div>
                  <p style={{ fontSize: "clamp(0.9rem, 3vw, 1rem)", color: COLORS.textMedium, textAlign: "center" }}>
                    Déjanos tu aportación
                  </p>
                </div>
              </div>
            </div>

            {/* Hospedajes */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Hospedajes</div>
              <div style={invitationStyles.hospedajesContainer}>
                {HOTELES.map((hotel, idx) => (
                  <div key={idx} style={invitationStyles.hotelCard}>
                    <div style={invitationStyles.hotelNombre}>{hotel.nombre}</div>
                    
                    <div style={invitationStyles.hotelRow}>
                      <span style={invitationStyles.hotelIcon}>🌐</span>
                      <a 
                        href={hotel.web} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={invitationStyles.hotelLink}
                      >
                        {hotel.web.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                    
                    <div style={invitationStyles.hotelRow}>
                      <span style={invitationStyles.hotelIcon}>📍</span>
                      <a 
                        href={hotel.maps} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={invitationStyles.hotelMapsBtn}
                      >
                        Google Maps
                      </a>
                    </div>
                    
                    <div style={invitationStyles.hotelRow}>
                      <span style={invitationStyles.hotelIcon}>📞</span>
                      <a 
                        href={`tel:${hotel.telefono}`} 
                        style={invitationStyles.hotelLink}
                      >
                        {hotel.telefono}
                      </a>
                    </div>
                    
                    <div style={invitationStyles.hotelRow}>
                      <span style={invitationStyles.hotelIcon}>💬</span>
                      <a 
                        href={`https://wa.me/${hotel.whatsapp.replace(/[+\s]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{
                          ...invitationStyles.hotelLink,
                          color: "#25D366",
                          fontWeight: 600,
                        }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
                
                <div style={invitationStyles.hotelCard}>
                  <div style={invitationStyles.hotelNombre}>{AIRBNB_DATA.nombre}</div>
                  
                  <div style={invitationStyles.hotelRow}>
                    <span style={invitationStyles.hotelIcon}>🏠</span>
                    <span style={{ fontSize: "clamp(0.85rem, 3vw, 0.95rem)", color: COLORS.textMedium }}>
                      {AIRBNB_DATA.texto}
                    </span>
                  </div>
                  
                  <div style={invitationStyles.hotelRow}>
                    <span style={invitationStyles.hotelIcon}>🔗</span>
                    <a 
                      href={AIRBNB_DATA.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={invitationStyles.hotelLink}
                    >
                      Ver lista de Airbnb
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ¿Qué se toman los chicos? */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>¿Qué se toman los chicos?</div>
              <div style={invitationStyles.softBox}>
                <div style={invitationStyles.bebidasContainer}>
                  {bebidasOptions.map((bebida) => (
                    <div
                      key={bebida.id}
                      style={{
                        ...invitationStyles.bebidaOption,
                        ...(bebidasSeleccionadas.includes(bebida.id) ? invitationStyles.bebidaOptionSelected : {}),
                      }}
                      onClick={() => toggleBebida(bebida.id)}
                    >
                      {bebida.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ¿Alergias? */}
            <div style={{ marginTop: 30 }}>
              <div style={invitationStyles.sectionTitle}>¿Alergias?</div>
              <div style={invitationStyles.softBox}>
                <input
                  type="text"
                  style={invitationStyles.alergiasInput}
                  placeholder="Ej. Alergia al marisco, gluten, etc."
                  value={alergias}
                  onChange={(e) => setAlergias(e.target.value)}
                  disabled={yaConfirmo || rsvpStatus === "saving"}
                />
              </div>
            </div>

            {/* Reservaciones */}
            <div style={{ marginTop: 40 }}>
              <div style={invitationStyles.sectionTitle}>Reservaciones</div>
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

            {/* Confirma tu asistencia */}
            <div style={{ marginTop: 30 }}>
              <div style={invitationStyles.sectionTitle}>Confirma tu asistencia</div>
              <div style={invitationStyles.formContainer}>
                <div style={invitationStyles.formGroup}>
                  <div style={invitationStyles.label}>
                    {guestLoading ? "Cargando invitado…" : "Confirmación de asistencia"}
                    <span style={{ marginLeft: 8, padding: "4px 8px", background: COLORS.accentLight, borderRadius: 50, fontSize: "0.8rem" }}>
                      {guestId ? `ID: ${guestId}` : "ID no detectado"}
                    </span>
                  </div>

                  {guestData?.nombre && (
                    <div style={{ fontSize: "clamp(0.85rem, 3vw, 0.9rem)", color: COLORS.textMedium, marginBottom: 10 }}>
                      <b>{guestData.nombre}</b>, nos dará mucho gusto verte.
                      {guestData.pasesAsignados ? (
                        <> · Pases asignados: <b>{guestData.pasesAsignados}</b></>
                      ) : null}
                    </div>
                  )}

                  {guestLoadError && (
                    <div style={{ color: COLORS.blueSoft, marginBottom: 10 }}>No se pudo cargar tu invitación: {guestLoadError}</div>
                  )}

                  {yaConfirmo && (
                    <div style={{ color: COLORS.blueSoft, marginBottom: 10 }}>
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
                          style={{ ...invitationStyles.button, width: "auto", flex: 1, minWidth: "140px", background: COLORS.textMedium }}
                          onClick={() => confirmar("No")}
                          disabled={rsvpStatus === "saving"}
                        >
                          No podré asistir
                        </button>
                      </div>
                    </>
                  )}

                  {rsvpStatus === "saving" && <div style={{ marginTop: 10, color: COLORS.textMedium }}>Guardando tu confirmación…</div>}
                  {rsvpStatus === "error" && <div style={{ marginTop: 10, color: COLORS.blueSoft }}>{rsvpError}</div>}

                  <div style={{ marginTop: 15, fontSize: "0.8rem", color: COLORS.textMedium }}>
                    Tip: tu enlace debe incluir <code>?id=AV001</code> (cada invitado tiene un ID).
                  </div>
                </div>
              </div>
            </div>

            {/* Nota final */}
            <div style={{ marginTop: 30, fontSize: "clamp(0.8rem, 3vw, 0.9rem)", color: COLORS.textMedium, textAlign: "center" }}>
              *No se permiten menores de 16 años · Invitación personal · Sin acompañantes adicionales
            </div>
          </div>
        </div>
      )}

      {/* Botón Flotante de Música */}
      {envelopeOpen && (
        <MusicFloatingButton
          isPlaying={audioPlaying}
          onClick={toggleMusic}
        />
      )}

      {/* Carruseles */}
      {carouselOpen && (
        <ImageCarousel
          images={GALLERY_IMAGES}
          initialIndex={carouselIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}

      {secondaryCarouselOpen && (
        <ImageCarousel
          images={SECONDARY_GALLERY_IMAGES}
          initialIndex={secondaryCarouselIndex}
          onClose={() => setSecondaryCarouselOpen(false)}
        />
      )}

      {carousel3Open && (
        <ImageCarousel
          images={CAROUSEL_3_IMAGES}
          initialIndex={carousel3Index}
          onClose={() => setCarousel3Open(false)}
        />
      )}
    </>
  );
}
