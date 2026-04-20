"use client";

import { useEffect, useRef } from "react";

// ─── PARTICLE DATA ────────────────────────────────────────────────────────────
const PARTICLE_DATA = [
  { id: 0,  x: 9.8,  y: 91.0, size: 2.0, duration: 8.2,  delay: 0.3 },
  { id: 1,  x: 97.3, y: 14.1, size: 1.4, duration: 11.5, delay: 1.1 },
  { id: 2,  x: 30.2, y: 83.5, size: 2.2, duration: 9.0,  delay: 2.4 },
  { id: 3,  x: 28.0, y: 51.7, size: 3.5, duration: 7.8,  delay: 0.8 },
  { id: 4,  x: 64.8, y: 50.5, size: 1.2, duration: 6.5,  delay: 1.7 },
  { id: 5,  x: 60.9, y: 9.1,  size: 2.6, duration: 10.4, delay: 0.5 },
  { id: 6,  x: 87.0, y: 70.1, size: 1.0, duration: 9.6,  delay: 0.2 },
  { id: 7,  x: 20.9, y: 55.2, size: 2.3, duration: 11.2, delay: 1.6 },
  { id: 8,  x: 47.8, y: 57.6, size: 2.6, duration: 8.4,  delay: 3.0 },
  { id: 9,  x: 50.7, y: 50.4, size: 3.8, duration: 7.5,  delay: 0.9 },
  { id: 10, x: 6.2,  y: 60.6, size: 3.3, duration: 7.2,  delay: 1.4 },
  { id: 11, x: 39.4, y: 10.6, size: 3.9, duration: 14.0, delay: 2.6 },
];

// ─── SEVERITY DATA ────────────────────────────────────────────────────────────
const SEVERITY_LEVELS = [
  { color: "#00c84a", label: "SAFE",   range: "0 – 50%",   width: "50%",  delay: "0.3s", action: "No action",           bg: "linear-gradient(90deg,#00c84a,#00c84a)" },
  { color: "#ffbe0b", label: "YELLOW", range: "50 – 70%",  width: "70%",  delay: "0.5s", action: "Schedule within 48h", bg: "linear-gradient(90deg,#ffbe0b,#ffbe0b)" },
  { color: "#ff8c00", label: "ORANGE", range: "70 – 85%",  width: "85%",  delay: "0.7s", action: "Dispatch within 6h",  bg: "linear-gradient(90deg,#ffbe0b,#ff8c00)" },
  { color: "#ff6b6b", label: "RED",    range: "85 – 100%", width: "100%", delay: "0.9s", action: "Emergency crew now",  bg: "linear-gradient(90deg,#ff8c00,#ff6b6b)" },
];

// ─── STEP DATA ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "1", accentColor: "#00c9ff",
    borderDefault: "rgba(0,201,255,0.15)", borderHover: "rgba(0,201,255,0.4)",
    iconBg: "rgba(0,201,255,0.1)",
    title: "Instant Message",
    desc: "SMS or app notification sent to maintenance team leads the moment the threshold is crossed — no delay, no polling.",
    tags: ["SMS", "Push notification", "<2 sec delivery"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="#00c9ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    tagStyle: {},
  },
  {
    num: "2", accentColor: "#7b61ff",
    borderDefault: "rgba(123,97,255,0.15)", borderHover: "rgba(123,97,255,0.4)",
    iconBg: "rgba(123,97,255,0.1)",
    title: "Map Snapshot",
    desc: "Current 3D LiDAR map is attached to the alert, giving the team full situational awareness before they even reach the site.",
    tags: ["3D point cloud", "GPS coords", "Pipe cross-section"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"
                 stroke="#7b61ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="9" y1="3" x2="9" y2="18" stroke="#7b61ff" strokeWidth="1.5"/>
        <line x1="15" y1="6" x2="15" y2="21" stroke="#7b61ff" strokeWidth="1.5"/>
      </svg>
    ),
    tagStyle: {},
  },
  {
    num: "3", accentColor: "#ff6b6b",
    borderDefault: "rgba(255,107,107,0.15)", borderHover: "rgba(255,107,107,0.4)",
    iconBg: "rgba(255,107,107,0.1)",
    title: "Priority Level",
    desc: "Alerts are color-coded by severity. Yellow for early warning, orange for elevated risk, and red for immediate action required.",
    tags: ["Yellow", "Orange", "Red"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="13" stroke="#ff6b6b" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    tagStyle: (tag) => {
      if (tag === "Yellow") return { color: "#ffbe0b", borderColor: "rgba(255,190,11,0.3)" };
      if (tag === "Orange") return { color: "#ff8c00", borderColor: "rgba(255,140,0,0.3)" };
      if (tag === "Red")    return { color: "#ff6b6b", borderColor: "rgba(255,107,107,0.3)" };
      return {};
    },
  },
];

// ─── GRID BACKGROUND ──────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,255,231,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,231,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_DATA.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `particleFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── PING DOT ─────────────────────────────────────────────────────────────────
function PingDot({ color = "#ff6b6b", size = 12 }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: color.replace(")", ",0.3)").replace("rgb", "rgba"), animation: "ping 1.5s ease-out infinite" }}
      />
      <div className="relative rounded-full z-10" style={{ width: size * 0.6, height: size * 0.6, background: color }} />
    </div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ children, color = "#00ffe7" }) {
  return (
    <span
      className="inline-block font-mono text-xs tracking-widest border px-3 py-1 rounded-full mb-5"
      style={{ color, borderColor: color + "44", background: color + "18" }}
    >
      {children}
    </span>
  );
}

// ─── MAP CANVAS ───────────────────────────────────────────────────────────────
function MapCanvas() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R  = Math.min(W, H) * 0.38;

    const pts = Array.from({ length: 120 }, (_, i) => {
      const a     = (i / 120) * Math.PI * 2;
      const deg   = i * 3;
      const noise = Math.sin(deg * 0.07) * 12 + Math.cos(deg * 0.13) * 8 + Math.sin(deg * 0.22) * 5;
      const block = deg > 200 && deg < 260 ? -30 : 0;
      return { angle: a, dist: R + noise + block };
    });

    let scanAngle = 0;
    const trail   = [];
    const TRAIL   = 60;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(0,255,231,0.05)";
      for (let x = 30; x < W; x += 30)
        for (let y = 20; y < H; y += 20) {
          ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
        }

      ctx.beginPath();
      pts.forEach((p, i) => {
        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle   = "rgba(0,8,6,0.7)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,255,231,0.2)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      ctx.beginPath();
      pts.slice(66, 87).forEach((p, i) => {
        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "rgba(255,107,107,0.7)";
      ctx.lineWidth   = 3;
      ctx.stroke();

      ctx.beginPath();
      pts.slice(66, 87).forEach((p, i) => {
        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;
        if (i === 0) { ctx.moveTo(cx, cy); ctx.lineTo(x, y); } else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(255,107,107,0.07)";
      ctx.fill();

      const hit = pts.reduce((b, p) => {
        const da = Math.abs(p.angle - scanAngle);
        const db = Math.abs(b.angle - scanAngle);
        return da < db ? p : b;
      }, pts[0]);
      const hx = cx + Math.cos(hit.angle) * hit.dist;
      const hy = cy + Math.sin(hit.angle) * hit.dist;

      trail.push({ x: hx, y: hy });
      if (trail.length > TRAIL) trail.shift();
      trail.forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,231,${(i / TRAIL) * 0.5})`;
        ctx.fill();
      });

      const g = ctx.createLinearGradient(cx, cy, hx, hy);
      g.addColorStop(0, "rgba(0,255,231,0.5)");
      g.addColorStop(1, "rgba(0,255,231,0.01)");
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy);
      ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();

      const g2 = ctx.createRadialGradient(hx, hy, 0, hx, hy, 10);
      g2.addColorStop(0, "rgba(0,255,231,0.8)");
      g2.addColorStop(1, "rgba(0,255,231,0)");
      ctx.beginPath(); ctx.arc(hx, hy, 10, 0, Math.PI * 2); ctx.fillStyle = g2; ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, Math.PI * 2); ctx.fillStyle = "#00ffe7"; ctx.fill();

      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fillStyle = "#7b61ff"; ctx.fill();

      [R * 0.35, R * 0.65, R * 0.9].forEach((r) => {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,231,0.05)"; ctx.lineWidth = 1; ctx.stroke();
      });

      ctx.font = "9px 'Space Mono', monospace";
      ctx.fillStyle = "rgba(255,107,107,0.7)";
      ctx.fillText("BLOCKAGE", cx + 28, cy + 48);
      ctx.fillStyle = "rgba(0,255,231,0.35)";
      ctx.fillText("PIPE WALL", cx - 56, cy - R * 0.72);

      scanAngle += 0.04;
      if (scanAngle > Math.PI * 2) scanAngle -= Math.PI * 2;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={340}
      height={200}
      style={{ display: "block", width: "100%", height: "auto" }}
    />
  );
}

// ─── STEP CARD ────────────────────────────────────────────────────────────────
function StepCard({ step }) {
  const tagStyle = typeof step.tagStyle === "function" ? step.tagStyle : () => step.tagStyle;

  return (
    <div
      className="rounded-2xl p-7 border relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: step.borderDefault }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = step.borderHover)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = step.borderDefault)}
    >
      {/* Background number */}
      <div
        className="absolute top-4 right-5 font-mono leading-none select-none"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", color: step.accentColor, opacity: 0.15 }}
      >
        {step.num}
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: step.iconBg }}
      >
        {step.icon}
      </div>

      {/* Title */}
      <div
        className="mb-2"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.02em", color: step.accentColor }}
      >
        {step.title}
      </div>

      {/* Desc */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#6b7280" }}>
        {step.desc}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {step.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[9px] tracking-wider px-2.5 py-1 rounded-full border"
            style={{
              color: "#4b5563",
              borderColor: "rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
              ...tagStyle(tag),
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function WasteAlertPage() {
  return (
    <main
      className="min-h-screen bg-[#080a0e] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Space+Mono:wght@400;700&display=swap');

        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .font-mono    { font-family: 'Space Mono', monospace; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080a0e; }
        ::-webkit-scrollbar-thumb { background: #00ffe744; border-radius: 2px; }
        ::selection { background: #00ffe730; }

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0);     opacity: 0.15; }
          50%       { transform: translateY(-38px); opacity: 0.65; }
        }
        @keyframes blinkDot  { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes pulseGlow { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.12);opacity:1} }
        @keyframes ping      { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fillBar   { from{width:0} to{width:var(--target-w)} }

        .hero-content { animation: fadeUp 0.8s ease forwards; }

        .sev-fill {
          height: 100%;
          border-radius: 999px;
          width: 0;
          animation: fillBar 1.8s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        .meter-fill {
          height: 100%;
          border-radius: 999px;
          width: 0;
          animation: fillBar 2s 0.5s cubic-bezier(0.23,1,0.32,1) forwards;
          position: relative;
        }
        .meter-fill::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0; width: 4px;
          background: rgba(255,255,255,0.6);
          border-radius: 999px;
        }
        .phone-notif-slide { animation: slideIn 0.6s 1s both; }
        .sms-notif-slide   { animation: slideIn 0.6s 1.4s both; opacity: 0; }

        @media (max-width: 640px) {
          .section-px { padding-left: 1rem !important; padding-right: 1rem !important; }
        }
        @media (max-width: 480px) {
          .hero-stat-val { font-size: 2.2rem !important; }
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <GridBg />
        <Particles />

        {/* Glow orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full"
            style={{
              width: "min(700px,90vw)", height: 460,
              background: "radial-gradient(ellipse, rgba(123,97,255,0.08) 0%, transparent 70%)",
              animation: "pulseGlow 8s ease-in-out infinite",
            }}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080a0e] to-transparent pointer-events-none z-[5]" />

        <div className="hero-content relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/25 px-4 py-2 rounded-full mb-8 bg-cyan-400/5 text-center"
            style={{ wordBreak: "break-word" }}
          >
            <span
              className="w-[7px] h-[7px] rounded-full bg-cyan-400 flex-shrink-0"
              style={{ animation: "blinkDot 1.4s ease-in-out infinite" }}
            />
            AUTOMATED ALERT SYSTEM — ACTIVE
          </div>

          {/* Headline */}
          <h1
            className="font-display text-white leading-none mb-5"
            style={{ fontSize: "clamp(2.6rem, 11vw, 8rem)" }}
          >
            WHEN WASTE REACHES
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00ffe7 0%, #00c9ff 50%, #7b61ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CRITICAL LEVELS…
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-[560px] mx-auto mb-12 leading-relaxed px-2">
            The system automatically sends an alert the moment waste accumulation crosses
            a predefined threshold — no human monitoring required.
          </p>

          {/* Live status row */}
          <div
            className="inline-flex items-center flex-wrap justify-center gap-5 px-7 py-4 rounded-2xl"
            style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)" }}
          >
            <PingDot color="#ff6b6b" size={12} />
            <span className="font-mono text-xs tracking-widest" style={{ color: "#ff6b6b" }}>
              THRESHOLD EXCEEDED
            </span>
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="font-mono text-xs" style={{ color: "#6b7280" }}>
              LEVEL <span style={{ color: "#ff6b6b" }}>87%</span> / LIMIT{" "}
              <span style={{ color: "#22d3ee" }}>70%</span>
            </span>
            <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="font-mono text-xs" style={{ color: "#6b7280" }}>
              ALERT SENT <span style={{ color: "#00c84a" }}>✓</span>
            </span>
          </div>
        </div>
      </section>

      {/* ══ THRESHOLD METER ═══════════════════════════════════════════════════ */}
      <section className="section-px relative py-20 px-6 lg:px-16 overflow-hidden">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#ff6b6b">THRESHOLD MONITORING</SectionLabel>
          <h2 className="font-display leading-none mb-4" style={{ fontSize: "clamp(2rem, 7vw, 5.5rem)" }}>
            WASTE LEVEL <span style={{ color: "#ff6b6b" }}>TRACKER</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg leading-relaxed mb-10">
            Real-time accumulation data from sewer sensors, updated every 180ms.
            Alert fires automatically when readings breach the configured threshold.
          </p>

          {/* Meter card */}
          <div
            className="rounded-2xl p-8 mb-8"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex justify-between items-end mb-5 flex-wrap gap-3">
              <div>
                <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: "#6b7280" }}>
                  CURRENT ACCUMULATION
                </div>
                <div className="font-display" style={{ fontSize: "3.5rem", lineHeight: 1, color: "#ff6b6b" }}>
                  87%
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: "#6b7280" }}>
                  THRESHOLD LIMIT
                </div>
                <div className="font-mono text-2xl" style={{ color: "#22d3ee" }}>70%</div>
              </div>
            </div>

            {/* Bar track */}
            <div
              className="w-full h-3.5 rounded-full overflow-hidden mb-2"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="meter-fill"
                style={{
                  "--target-w": "87%",
                  background: "linear-gradient(90deg,#ffbe0b,#ff6b6b)",
                }}
              />
            </div>

            {/* Threshold marker */}
            <div className="relative h-5 mt-1">
              <div className="absolute flex flex-col items-center" style={{ left: "70%" }}>
                <div className="w-px h-2.5" style={{ background: "rgba(0,255,231,0.5)" }} />
                <span className="font-mono text-[8px] tracking-wider whitespace-nowrap" style={{ color: "#22d3ee" }}>
                  LIMIT 70%
                </span>
              </div>
            </div>

            {/* Zone tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: "SAFE 0–50%",      color: "#00c84a" },
                { label: "YELLOW 50–70%",   color: "#ffbe0b" },
                { label: "ORANGE 70–85%",   color: "#ff8c00" },
                { label: "RED 85–100%",     color: "#ff6b6b" },
              ].map((z) => (
                <div
                  key={z.label}
                  className="flex items-center gap-1.5 font-mono text-[9px] tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    color: z.color,
                    borderColor: z.color + "55",
                    background: z.color + "18",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: z.color }} />
                  {z.label}
                </div>
              ))}
            </div>
          </div>

          {/* Alert visual — 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

            {/* Phone notification mockup */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="font-mono text-[9px] tracking-widest mb-4" style={{ color: "#6b7280" }}>
                NOTIFICATION PREVIEW
              </div>
              <div
                className="rounded-3xl p-5 max-w-[260px] mx-auto"
                style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="font-mono text-[9px] text-center mb-3 tracking-wider" style={{ color: "#4b5563" }}>
                  9:41 AM
                </div>

                <div
                  className="phone-notif-slide rounded-2xl p-3"
                  style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.25)" }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: "#ff6b6b" }}
                    >
                      ⚠
                    </div>
                    <span className="font-mono text-[9px] tracking-wider" style={{ color: "#ff6b6b" }}>
                      SEWER MONITOR
                    </span>
                    <span className="font-mono text-[9px] ml-auto" style={{ color: "#4b5563" }}>now</span>
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">Critical Waste Level Alert</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: "#9ca3af" }}>
                    Sector 7B reached 87%. Threshold: 70%. Immediate inspection required. Map attached.
                  </div>
                </div>

                <div
                  className="sms-notif-slide mt-2.5 rounded-xl p-2"
                  style={{ background: "rgba(0,255,231,0.06)", border: "1px solid rgba(0,255,231,0.15)" }}
                >
                  <div className="font-mono text-[9px] mb-1 tracking-wider" style={{ color: "#22d3ee" }}>
                    SMS BACKUP
                  </div>
                  <div className="text-[11px]" style={{ color: "#9ca3af" }}>
                    ALERT S7B 87% — dispatch team to grid ref 28.4°N 77.1°E
                  </div>
                </div>
              </div>
            </div>

            {/* Map snapshot */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="font-mono text-[9px] tracking-widest mb-4" style={{ color: "#6b7280" }}>
                3D MAP SNAPSHOT ATTACHED
              </div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <MapCanvas />
              </div>
              <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                <span className="font-mono text-[9px] tracking-wider" style={{ color: "#4b5563" }}>
                  SECTOR 7B · GRID 28.4°N 77.1°E
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[9px]" style={{ color: "#ff6b6b" }}>
                  <PingDot color="#ff6b6b" size={10} />
                  BLOCKAGE DETECTED
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ THREE STEPS ═══════════════════════════════════════════════════════ */}
      <section className="section-px relative py-0 pb-20 px-6 lg:px-16 overflow-hidden">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#00ffe7">ALERT PIPELINE</SectionLabel>
          <h2 className="font-display leading-none mb-4" style={{ fontSize: "clamp(2rem, 7vw, 5.5rem)" }}>
            THREE-STEP <span style={{ color: "#00ffe7" }}>RESPONSE</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg leading-relaxed mb-12">
            From detection to action in under two seconds — fully automated, zero manual intervention needed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map((step) => (
              <StepCard key={step.num} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ SEVERITY BREAKDOWN ════════════════════════════════════════════════ */}
      <section className="section-px relative py-0 pb-20 px-6 lg:px-16 overflow-hidden">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#ffbe0b">SEVERITY LEVELS</SectionLabel>
          <h2 className="font-display leading-none mb-4" style={{ fontSize: "clamp(2rem, 7vw, 5.5rem)" }}>
            COLOR-CODED <span style={{ color: "#ffbe0b" }}>ALERTS</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg leading-relaxed mb-10">
            Each severity tier triggers a different escalation path — from routine maintenance
            scheduling to emergency crew dispatch.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {SEVERITY_LEVELS.map((s) => (
              <div key={s.label} className="grid items-center gap-5" style={{ gridTemplateColumns: "140px 1fr auto" }}>
                {/* Label */}
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <div>
                    <div className="font-mono text-[10px] tracking-wider" style={{ color: s.color }}>{s.label}</div>
                    <div className="font-mono text-[8px] tracking-wider mt-0.5" style={{ color: "#374151" }}>{s.range}</div>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="sev-fill"
                    style={{
                      "--target-w": s.width,
                      background: s.bg,
                      animationDelay: s.delay,
                    }}
                  />
                </div>

                {/* Action */}
                <div className="font-mono text-[10px] whitespace-nowrap" style={{ color: "#4b5563" }}>
                  {s.action}
                </div>
              </div>
            ))}
          </div>

          {/* Live status callout */}
          <div
            className="flex items-center gap-4 flex-wrap px-6 py-5 rounded-2xl"
            style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.25)" }}
          >
            <PingDot color="#ff6b6b" size={10} />
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-1"
                style={{ color: "#ff6b6b" }}
              >
                CURRENT STATUS — SECTOR 7B
              </div>
              <div className="text-sm text-white">
                Level 87% —{" "}
                <span style={{ color: "#ff6b6b", fontWeight: 500 }}>RED alert</span> active ·
                Emergency crew dispatched at 09:43
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BOTTOM STATS ══════════════════════════════════════════════════════ */}
      <section className="section-px relative py-20 px-6 lg:px-16 overflow-hidden text-center">
        <GridBg />

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full"
            style={{
              width: 600, height: 400,
              background: "radial-gradient(ellipse, rgba(255,107,107,0.06) 0%, transparent 70%)",
              animation: "pulseGlow 6s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          <div
            className="rounded-3xl px-10 py-12"
            style={{ border: "1px solid rgba(255,107,107,0.2)", background: "rgba(255,107,107,0.04)" }}
          >
            <SectionLabel color="#00ffe7">SYSTEM PERFORMANCE</SectionLabel>
            <h2
              className="font-display leading-none mb-4"
              style={{ fontSize: "clamp(1.6rem,5vw,3.5rem)" }}
            >
              ZERO MISSED <span style={{ color: "#00ffe7" }}>ALERTS</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-sm mx-auto mb-8" style={{ color: "#6b7280" }}>
              Every threshold breach is caught, classified, and communicated — 24 hours a day,
              no human oversight required.
            </p>

            <div className="flex justify-center gap-10 flex-wrap">
              {[
                { val: "<2s",   lbl: "ALERT LATENCY"       },
                { val: "99.9%", lbl: "UPTIME"              },
                { val: "3",     lbl: "SEVERITY TIERS"      },
                { val: "0",     lbl: "HUMAN CHECKS NEEDED" },
              ].map((s) => (
                <div key={s.lbl} className="text-center">
                  <div
                    className="font-display leading-none"
                    style={{ fontSize: "2.8rem", color: "#22d3ee" }}
                  >
                    {s.val}
                  </div>
                  <div className="font-mono text-[9px] tracking-widest mt-1" style={{ color: "#4b5563" }}>
                    {s.lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}