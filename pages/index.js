import { useEffect, useState } from "react";

export default function Home() {
  const weddingDate = new Date("2027-04-23T16:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      fontFamily: "serif",
      textAlign: "center",
      backgroundColor: "#f8fbff",
      color: "#1c2b39",
      minHeight: "100vh",
      padding: "60px 20px"
    }}>
      <h1 style={{
        fontSize: "48px",
        letterSpacing: "3px",
        color: "#2a5d8f"
      }}>
        Andrés & Vanessa
      </h1>

      <p style={{
        fontSize: "18px",
        marginBottom: "40px",
        color: "#b08d57"
      }}>
        "El amor no consiste en mirarse el uno al otro,
        sino en mirar juntos en la misma dirección."
      </p>

      <h2 style={{ marginBottom: "10px" }}>23 de Abril 2027</h2>
      <p style={{ marginBottom: "40px" }}>4:00 PM</p>

      <div style={{
        fontSize: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "60px"
      }}>
        <div>{timeLeft.days} días</div>
        <div>{timeLeft.hours} hrs</div>
        <div>{timeLeft.minutes} min</div>
        <div>{timeLeft.seconds} seg</div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/track/727sZDy6Dlyo4gniOMKUhv?si=480eaa11f91643e2"
          width="300"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
