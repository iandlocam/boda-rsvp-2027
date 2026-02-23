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

/** ✅ Monograma AV (limpio, elegante, tipo sello) */
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
        stroke="rgba(255,255,255,0.30)"
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

/** ✅ Sello “dorado” (borde irregular + relieve + brillo) */
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

          {/* dorado realista */}
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
          <use href="#blob" fill="url(#goldWax)" />
          <use href="#blob" fill="url(#goldShine)" opacity="0.55" />
          <use href="#blob" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <use href="#blob" fill="none" stroke="rgba(122,91,34,0.28)" strokeWidth="1.3" />

          {/* relieve central (grabado AV) */}
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

          {/* highlight fino para “metal” */}
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
            color: "rgba(19,32,45,0.85)", // ✅ texto oscuro sobre dorado
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

/** ✅ Íconos sobrios (línea) */
function TimelineIcon({ type = "ceremony", size = 44 }) {
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

/**
 * ✅ Flores MÁS abundantes y “más reales” (sin imágenes externas):
 * - más clusters
 * - más hojas
 * - sombras suaves
 * - 4 esquinas + sprigs laterales
 */
function FloralCorners() {
  const commonStyle = {
    position: "absolute",
    pointerEvents: "none",
    opacity: 0.62,
    filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.10))",
  };

  const defs = (
    <defs>
      <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="rgba(75,170,130,0.85)" />
        <stop offset="1" stopColor="rgba(25,110,80,0.85)" />
      </linearGradient>
      <radialGradient id="centerG" cx="40%" cy="35%" r="70%">
        <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
        <stop offset="30%" stopColor="rgba(255,255,255,0.60)" />
        <stop offset="100%" stopColor="rgba(176,141,87,0.80)" />
      </radialGradient>

      <radialGradient id="petalY" cx="35%" cy="30%" r="85%">
        <stop offset="0" stopColor="rgba(255,255,255,0.75)" />
        <stop offset="22%" stopColor="rgba(255,240,180,0.95)" />
        <stop offset="72%" stopColor="rgba(255,200,64,0.95)" />
        <stop offset="100%" stopColor="rgba(214,178,94,0.95)" />
      </radialGradient>

      <radialGradient id="petalB" cx="35%" cy="30%" r="85%">
        <stop offset="0" stopColor="rgba(255,255,255,0.65)" />
        <stop offset="28%" stopColor="rgba(170,220,255,0.95)" />
        <stop offset="78%" stopColor="rgba(80,165,255,0.95)" />
        <stop offset="100%" stopColor="rgba(40,110,210,0.95)" />
      </radialGradient>

      <radialGradient id="petalO" cx="35%" cy="30%" r="85%">
        <stop offset="0" stopColor="rgba(255,255,255,0.65)" />
        <stop offset="30%" stopColor="rgba(255,210,170,0.95)" />
        <stop offset="80%" stopColor="rgba(255,150,90,0.95)" />
        <stop offset="100%" stopColor="rgba(210,95,55,0.95)" />
      </radialGradient>

      <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
