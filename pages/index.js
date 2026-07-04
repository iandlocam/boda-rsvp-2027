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
  // 📋 DRESS CODE
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
  // =