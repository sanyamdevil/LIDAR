"use client";

import { useEffect, useRef, useState } from "react";

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

// ─── FLOW STEPS DATA ──────────────────────────────────────────────────────────
const FLOW_STEPS = [
  {
    num: "01", color: "#ff6b6b",
    title: "LIDAR SCAN",
    desc: "RPLidar A1 fires 8,000 laser pulses per second across 360°. Each pulse returns a (distance, angle, quality) tuple over UART serial at 115200 baud.",
    tags: ["RPLidar A1", "115200 baud", "8000 pts/s", "UART serial"],
  },
  {
    num: "02", color: "#7b61ff",
    title: "ARDUINO PARSE",
    desc: "Arduino Mega processes raw bytes using the RPLidar SDK. Frames are validated, distance outliers filtered using a moving-average buffer, and polar coordinates converted to Cartesian.",
    tags: ["Arduino Mega", "RPLidar SDK", "Moving avg", "Polar → XY"],
  },
  {
    num: "03", color: "#00c9ff",
    title: "CLASSIFY",
    desc: "A lightweight edge-ML model (or threshold logic) compares the live scan profile against a stored baseline. Events are classified as CLEAR, PARTIAL BLOCKAGE, or FULL BLOCKAGE with confidence scores.",
    tags: ["Baseline diff", "Edge ML", "Threshold logic", "Confidence score"],
  },
  {
    num: "04", color: "#00ffe7",
    title: "TRANSMIT",
    desc: "Classified events are packaged as JSON and pushed over Wi-Fi / GSM using MQTT to a cloud broker. The dashboard subscribes to the topic and renders updates in real time via WebSocket.",
    tags: ["MQTT", "JSON payload", "Wi-Fi / GSM", "WebSocket push"],
  },
];

// ─── SPECS DATA ───────────────────────────────────────────────────────────────
const SPECS = [
  { icon: "⚡", key: "SCAN RATE",      val: "5.5",  unit: "Hz rotational speed" },
  { icon: "📡", key: "SAMPLE RATE",    val: "8K",   unit: "samples per second" },
  { icon: "📏", key: "MAX RANGE",      val: "12",   unit: "metres (indoor)" },
  { icon: "🎯", key: "ANGULAR RES.",   val: "0.15°",unit: "degrees per sample" },
  { icon: "🔌", key: "INTERFACE",      val: "UART", unit: "115200 baud serial" },
  { icon: "💧", key: "ENCLOSURE",      val: "IP67", unit: "waterproof rated" },
];

// ─── COMPARE TABLE DATA ───────────────────────────────────────────────────────
const COMPARE_ROWS = [
  { feature: "RPLidar UART Support", mega: true,   esp: true,   rpi: true   },
  { feature: "Built-in Wi-Fi",       mega: false,  esp: true,   rpi: true   },
  { feature: "Real-time RTOS",       mega: true,   esp: true,   rpi: false  },
  { feature: "Deep Sleep (<100 µA)", mega: true,   esp: true,   rpi: false  },
  { feature: "Edge ML Inference",    mega: false,  esp: true,   rpi: true   },
  { feature: "Cost",                 mega: "~$10", esp: "~$5",  rpi: "~$15" },
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

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "", decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const end = parseFloat(target);
          const duration = 1800;
          const startTime = performance.now();
          const step = (now) => {
            const prog = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - prog, 3);
            setVal(parseFloat((eased * end).toFixed(decimals)));
            if (prog < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? val.toFixed(decimals) : val}
      {suffix}
    </span>
  );
}

// ─── LIDAR CANVAS ─────────────────────────────────────────────────────────────
function LidarCanvas() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R  = Math.min(W, H) * 0.4;

    // Build irregular sewer cross-section
    const sewerPts = Array.from({ length: 120 }, (_, i) => {
      const a   = (i / 120) * Math.PI * 2;
      const deg = i * 3;
      const noise    = Math.sin(deg * 0.07) * 14 + Math.cos(deg * 0.13) * 9 + Math.sin(deg * 0.22) * 6;
      const blockage = deg > 200 && deg < 260 ? -28 : 0;
      return { angle: a, dist: R + noise + blockage };
    });

    let scanAngle = 0;
    const trail   = [];
    const TRAIL   = 80;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Grid dots
      ctx.fillStyle = "rgba(0,255,231,0.06)";
      for (let x = 40; x < W; x += 40)
        for (let y = 30; y < H; y += 30) {
          ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
        }

      // Sewer wall fill
      ctx.beginPath();
      sewerPts.forEach((p, i) => {
        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(0,10,8,0.5)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,255,231,0.25)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      // Blockage highlight
      ctx.beginPath();
      sewerPts.slice(66, 87).forEach((p, i) => {
        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "rgba(255,107,107,0.6)";
      ctx.lineWidth   = 3;
      ctx.stroke();

      // Hit point
      const hitPt = sewerPts.reduce((best, p) => {
        const diff     = Math.abs(p.angle - scanAngle);
        const bestDiff = Math.abs(best.angle - scanAngle);
        return diff < bestDiff ? p : best;
      }, sewerPts[0]);

      const hx = cx + Math.cos(hitPt.angle) * hitPt.dist;
      const hy = cy + Math.sin(hitPt.angle) * hitPt.dist;

      trail.push({ x: hx, y: hy });
      if (trail.length > TRAIL) trail.shift();

      // Trail dots
      trail.forEach((pt, i) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,231,${(i / TRAIL) * 0.65})`;
        ctx.fill();
      });

      // Beam
      const grad = ctx.createLinearGradient(cx, cy, hx, hy);
      grad.addColorStop(0, "rgba(0,255,231,0.55)");
      grad.addColorStop(1, "rgba(0,255,231,0.02)");
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(hx, hy);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();

      // Hit glow
      const g2 = ctx.createRadialGradient(hx, hy, 0, hx, hy, 12);
      g2.addColorStop(0, "rgba(0,255,231,0.9)");
      g2.addColorStop(1, "rgba(0,255,231,0)");
      ctx.beginPath(); ctx.arc(hx, hy, 12, 0, Math.PI * 2);
      ctx.fillStyle = g2; ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00ffe7"; ctx.fill();

      // Center dot
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
      cg.addColorStop(0, "rgba(123,97,255,0.9)");
      cg.addColorStop(1, "rgba(123,97,255,0)");
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = cg; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#7b61ff"; ctx.fill();

      // Rings
      [R * 0.35, R * 0.6, R * 0.85].forEach((r) => {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,255,231,0.06)"; ctx.lineWidth = 1; ctx.stroke();
      });

      // Labels
      ctx.font = "10px 'Space Mono', monospace";
      ctx.fillStyle = "rgba(255,107,107,0.75)";
      ctx.fillText("BLOCKAGE ZONE", cx + 55, cy + 68);
      ctx.fillStyle = "rgba(0,255,231,0.4)";
      ctx.fillText("PIPE WALL", cx - 72, cy - R * 0.74);

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
      width={520}
      height={280}
      style={{ display: "block", maxWidth: "100%" }}
    />
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ children, color = "#00ffe7" }) {
  return (
    <span
      className="inline-block font-mono text-xs tracking-widest border px-3 py-1 rounded-full mb-5"
      style={{ color, borderColor: color + "44", background: color + "10" }}
    >
      {children}
    </span>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function LidarPage() {
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
          0%, 100% { transform: translateY(0);    opacity: 0.15; }
          50%       { transform: translateY(-38px); opacity: 0.65; }
        }
        @keyframes blinkDot { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes pulseGlow { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.12);opacity:1} }
        @keyframes boardBlink { 0%,100%{opacity:1} 50%{opacity:.2} }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      {/*
        pt-16 adds 64px top padding — matches a typical fixed navbar height.
        Increase to pt-20 (80px) or pt-24 (96px) if your navbar is taller.
      */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <GridBg />
        <Particles />

        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[700px] h-[460px] rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(123,97,255,0.08) 0%, transparent 70%)",
              animation: "pulseGlow 8s ease-in-out infinite",
            }}
          />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080a0e] to-transparent pointer-events-none z-[5]" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/25 px-4 py-2 rounded-full mb-8 bg-cyan-400/5 backdrop-blur-sm"
          >
            <span
              className="w-[7px] h-[7px] rounded-full bg-cyan-400 flex-shrink-0"
              style={{ animation: "blinkDot 1.4s ease-in-out infinite" }}
            />
            LIDAR &amp; ARDUINO — CORE TECHNOLOGY
          </div>

          {/* Headline */}
          <h1
            className="font-display text-white leading-none mb-5"
            style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)" }}
          >
            THE EYES<br />
            <span
              style={{
                background: "linear-gradient(135deg, #00ffe7 0%, #00c9ff 50%, #7b61ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BENEATH THE STREET
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-[560px] mx-auto mb-12 leading-relaxed">
            RPLidar A1 spinning at 5.5 Hz, generating 8,000 distance points per second —
            processed by Arduino in real time to map every obstruction underground.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-10 flex-wrap">
            {[
              { target: "8000", suffix: "",   decimals: 0, label: "POINTS / SEC"       },
              { target: "0.15", suffix: "°",  decimals: 2, label: "DEGREE RESOLUTION"  },
              { target: "12",   suffix: "m",  decimals: 0, label: "METRE RANGE"        },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-cyan-400" style={{ fontSize: "3rem", lineHeight: 1 }}>
                  <Counter target={s.target} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="font-mono text-[10px] text-gray-500 tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW LIDAR WORKS ════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 lg:px-16">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#00ffe7">HOW IT WORKS</SectionLabel>
          <h2 className="font-display leading-none mb-4" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            LIDAR EXPLAINED
          </h2>
          <p className="text-gray-500 text-base max-w-lg leading-relaxed mb-14">
            Light Detection and Ranging uses rapid laser pulses to build centimetre-accurate 3D models
            of enclosed environments — including sewer pipes.
          </p>

          {/* 4-step grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {[
              { step: "STEP 01 — EMIT",    title: "Laser Pulse",   desc: "A 785 nm infrared diode fires a focused laser beam outward. The RPLidar A1 rotates its emitter 360° using a compact servo motor inside an IP67-rated housing." },
              { step: "STEP 02 — REFLECT", title: "Surface Bounce",desc: "When the beam strikes a surface — pipe wall, debris, water — a portion of the photons scatter back toward the sensor aperture. Reflectivity varies with material." },
              { step: "STEP 03 — MEASURE", title: "Time of Flight", desc: "The sensor timestamps emission and return. Since light travels at a known speed, distance = (Δt × c) / 2. At 8000 readings/sec, this builds a dense point cloud instantly." },
              { step: "STEP 04 — MAP",     title: "Point Cloud",   desc: "Each (angle, distance) pair becomes a 2D polar coordinate. Stacked frames reconstruct a full 3D cross-section of the sewer, updated every 180 ms." },
            ].map((c) => (
              <div
                key={c.step}
                className="relative rounded-2xl p-8 border bg-white/[0.02] overflow-hidden group cursor-default transition-all duration-300 hover:-translate-y-1"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,255,231,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div
                  className="absolute top-0 left-0 h-px transition-all duration-700"
                  style={{ background: "linear-gradient(90deg, #00ffe7, transparent)", width: "0%", opacity: 0.5 }}
                />
                <div className="font-mono text-[10px] tracking-widest text-cyan-400 mb-3">{c.step}</div>
                <div className="font-display text-2xl text-cyan-400 mb-2">{c.title}</div>
                <div className="text-gray-400 text-sm leading-relaxed">{c.desc}</div>
              </div>
            ))}
          </div>

          {/* Canvas visualizer */}
          <div
            className="relative rounded-2xl border overflow-hidden p-10 text-center"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex justify-center">
              <LidarCanvas />
            </div>
            <p className="font-mono text-[11px] text-gray-600 tracking-widest mt-4">
              LIVE SIMULATION — ROTATING LIDAR BEAM IN SEWER CROSS-SECTION
            </p>
          </div>
        </div>
      </section>

      {/* ══ RPLIDAR SPECS ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 lg:px-16 pt-0">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#00c9ff">HARDWARE</SectionLabel>
          <h2 className="font-display leading-none mb-12" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            RPLIDAR A1{" "}
            <span style={{ color: "#00c9ff" }}>SPECS</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SPECS.map((s) => (
              <div
                key={s.key}
                className="rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,201,255,0.3)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div className="text-xl mb-3">{s.icon}</div>
                <div className="font-mono text-[10px] text-gray-500 tracking-widest mb-1">{s.key}</div>
                <div className="font-display text-[2.2rem] leading-none" style={{ color: "#00c9ff" }}>{s.val}</div>
                <div className="font-mono text-[10px] text-gray-600 mt-1">{s.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ARDUINO SECTION ════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 lg:px-16">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#7b61ff">PROCESSING</SectionLabel>
          <h2 className="font-display leading-none mb-4" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            ARDUINO{" "}
            <span style={{ color: "#7b61ff" }}>INTELLIGENCE</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl leading-relaxed mb-14">
            The Arduino Mega 2560 (or ESP32 for Wi-Fi) acts as the edge processor — parsing raw UART
            data from the RPLidar, classifying anomalies, and triggering alerts without cloud round-trips.
          </p>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Board + code */}
            <div
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: "#0a1f0a",
                border: "1px solid rgba(0,200,74,0.15)",
              }}
            >
              {/* Subtle green glow */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(0,200,60,0.06), transparent 60%)" }} />

              <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-green-400 mb-6 relative">
                <span className="w-[7px] h-[7px] rounded-full bg-green-400" style={{ animation: "boardBlink 1.6s infinite" }} />
                ARDUINO MEGA 2560 — ACTIVE
              </div>

              {/* Pins */}
              <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">DIGITAL PINS</div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["D0","D1","TX0","RX0","D2","D3~","D4","D5~","D6~","D7","TX1","RX1"].map((p) => {
                  const isSerial = p.startsWith("T") || p.startsWith("R");
                  return (
                    <span
                      key={p}
                      className="font-mono text-[9px] px-2 py-1 rounded border tracking-wider"
                      style={
                        isSerial
                          ? { color: "#00c9ff", borderColor: "rgba(0,201,255,0.35)", background: "rgba(0,201,255,0.08)" }
                          : { color: "#00c84a", borderColor: "rgba(0,200,74,0.35)",  background: "rgba(0,200,74,0.08)" }
                      }
                    >
                      {p}
                    </span>
                  );
                })}
              </div>

              <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">ANALOG + POWER</div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {["A0","A1","A2","A3"].map((p) => (
                  <span key={p} className="font-mono text-[9px] px-2 py-1 rounded border tracking-wider" style={{ color: "#ffbe0b", borderColor: "rgba(255,190,11,0.35)", background: "rgba(255,190,11,0.08)" }}>{p}</span>
                ))}
                {["5V","3.3V","GND","RESET"].map((p) => (
                  <span key={p} className="font-mono text-[9px] px-2 py-1 rounded border tracking-wider" style={{ color: "#ff6b6b", borderColor: "rgba(255,107,107,0.35)", background: "rgba(255,107,107,0.08)" }}>{p}</span>
                ))}
              </div>

              <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">FIRMWARE SNIPPET</div>
              <pre
                className="rounded-xl p-5 text-[11px] leading-relaxed overflow-x-auto"
                style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,200,74,0.12)", fontFamily: "'Space Mono', monospace", color: "#888" }}
              >
{`// RPLidar → Arduino parsing loop
`}<span style={{ color: "#7b61ff" }}>#include</span>{` `}<span style={{ color: "#00ffe7" }}>"RPLidar.h"</span>{`

RPLidar lidar;

`}<span style={{ color: "#00c9ff" }}>void</span>{` setup() {
  Serial.`}<span style={{ color: "#00c9ff" }}>begin</span>{`(`}<span style={{ color: "#ffbe0b" }}>115200</span>{`);
  lidar.`}<span style={{ color: "#00c9ff" }}>begin</span>{`(Serial1);
  lidar.`}<span style={{ color: "#00c9ff" }}>startScan</span>{`();
}

`}<span style={{ color: "#00c9ff" }}>void</span>{` loop() {
  `}<span style={{ color: "#7b61ff" }}>if</span>{` (lidar.`}<span style={{ color: "#00c9ff" }}>waitPoint</span>{`()) {
    float dist  = lidar.getCurrentPoint().distance;
    float angle = lidar.getCurrentPoint().angle;

    `}<span style={{ color: "#7b61ff" }}>if</span>{` (dist < `}<span style={{ color: "#ffbe0b" }}>150</span>{`) {
      `}<span style={{ color: "#00c9ff" }}>triggerAlert</span>{`(`}<span style={{ color: "#00ffe7" }}>"BLOCKAGE"</span>{`, angle);
    }
  }
}`}
              </pre>
            </div>

            {/* Feature list */}
            <ul className="space-y-0 divide-y divide-white/[0.05]">
              {[
                { title: "Real-time Serial Parsing",     desc: "UART Serial1 on the Mega reads the RPLidar data stream at 115200 baud, extracting distance and angle fields from each frame without blocking execution." },
                { title: "Edge Anomaly Classification",  desc: "A threshold algorithm compares radial distances against a calibrated baseline pipe profile. When variance exceeds ±15%, a blockage event is flagged locally." },
                { title: "Interrupt-driven Alerting",    desc: "Hardware interrupts on D2/D3 allow the Arduino to respond to critical thresholds in under 50 µs, independent of the main scan loop." },
                { title: "MQTT Packet Transmission",     desc: "Classified events are serialised to JSON and sent via Wi-Fi (ESP32) or GSM module over MQTT, keeping payloads under 256 bytes per alert." },
                { title: "Low-power Deep Sleep",         desc: "Between scan cycles the microcontroller enters deep sleep, reducing idle draw to 10 µA — extending battery life to 6+ weeks in the field." },
                { title: "Watchdog & Self-healing",      desc: "A hardware watchdog timer resets firmware if the main loop stalls, ensuring 99.9%+ uptime in unmonitored sewer environments." },
              ].map((f) => (
                <li key={f.title} className="flex gap-4 py-5">
                  <span style={{ color: "#00ffe7", flexShrink: 0, marginTop: 2 }}>▶</span>
                  <div>
                    <span className="block text-white font-medium text-sm mb-1">{f.title}</span>
                    <span className="text-gray-500 text-sm leading-relaxed">{f.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ SIGNAL FLOW ════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 lg:px-16 pt-0">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#00ffe7">DATA PIPELINE</SectionLabel>
          <h2 className="font-display leading-none mb-14" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            SIGNAL{" "}
            <span style={{ color: "#00ffe7" }}>FLOW</span>
          </h2>

          <div className="flex flex-col gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-6 items-stretch">
                {/* Left: circle + line */}
                <div className="flex flex-col items-center w-12 flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 relative z-10"
                    style={{ borderColor: step.color, background: step.color + "18", color: step.color, backgroundColor: "#080a0e" }}
                  >
                    {step.num}
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="w-px flex-1 min-h-[24px]" style={{ background: `linear-gradient(to bottom, ${step.color}, ${FLOW_STEPS[i + 1].color})` }} />
                  )}
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-2xl p-6 mb-4 border transition-all duration-300 hover:translate-x-1"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: step.color + "25" }}
                >
                  <div className="font-display text-2xl mb-2" style={{ color: step.color }}>{step.title}</div>
                  <div className="text-gray-400 text-sm leading-relaxed mb-3">{step.desc}</div>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2.5 py-1 rounded border tracking-wider text-gray-500"
                        style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MCU COMPARISON ═════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 lg:px-16 pt-0">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionLabel color="#ff6b6b">HARDWARE SELECTION</SectionLabel>
          <h2 className="font-display leading-none mb-12" style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
            MCU{" "}
            <span style={{ color: "#ff6b6b" }}>COMPARISON</span>
          </h2>

          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                  {["FEATURE", "ARDUINO MEGA", "ESP32", "RASPBERRY PI ZERO"].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[11px] tracking-widest text-gray-500 px-5 py-4 border-b text-left"
                      style={{ borderColor: "rgba(255,255,255,0.07)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr key={row.feature} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-400" style={{ borderBottom: ri < COMPARE_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>{row.feature}</td>
                    {[row.mega, row.esp, row.rpi].map((val, vi) => (
                      <td key={vi} className="px-5 py-4 text-center text-sm" style={{ borderBottom: ri < COMPARE_ROWS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        {val === true  && <span style={{ color: "#00c84a", fontSize: 16 }}>✓</span>}
                        {val === false && <span style={{ color: "#ff4a4a", fontSize: 16 }}>✗</span>}
                        {typeof val === "string" && (
                          <span className="font-mono text-xs" style={{ color: vi === 1 ? "#00c9ff" : "#666" }}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Recommended row */}
                <tr>
                  <td className="px-5 py-4 text-sm text-gray-400">Recommended For</td>
                  <td className="px-5 py-4 text-center"><span className="text-xs text-gray-600">Prototyping, wired</span></td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg" style={{ color: "#00ffe7", background: "rgba(0,255,231,0.08)", border: "1px solid rgba(0,255,231,0.2)" }}>
                      Production ★
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center"><span className="text-xs text-gray-600">Research / compute</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      
    </main>
  );
}