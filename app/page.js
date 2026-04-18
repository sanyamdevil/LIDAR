"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  AlertTriangle,
  Wifi,
  Cpu,
  Scan,
  LayoutDashboard,
  Shield,
} from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const LAYERS = [
  {
    id: 1,
    label: "Layer 1",
    title: "Sensing",
    subtitle: "Lidar sensor scans sewer",
    icon: Scan,
    color: "#ff6b6b",
    desc: "Rotating LiDAR sensor (e.g., RPLidar A1) mounted on a waterproof enclosure, continuously scanning sewer geometry with 360° precision.",
    tech: ["RPLidar A1", "IP67 Enclosure", "360° Rotation", "0.15° Resolution"],
    img: "/land.jpeg",
  },
  {
    id: 2,
    label: "Layer 2",
    title: "Processing",
    subtitle: "Arduino data analysis & classification",
    icon: Cpu,
    color: "#7b61ff",
    desc: "Arduino Mega or ESP32 running detection and classification firmware, transforming raw sensor data into structured events.",
    tech: ["Arduino Mega", "ESP32", "Edge ML", "RTOS Firmware"],
    img: null,
  },
  {
    id: 3,
    label: "Layer 3",
    title: "Communication",
    subtitle: "Wi-Fi / GSM cloud transmission",
    icon: Wifi,
    color: "#00c9ff",
    desc: "Wi-Fi, LoRa, or GSM module transmitting classified data to cloud or local server with low-latency reliability.",
    tech: ["Wi-Fi 802.11", "LoRa WAN", "GSM / LTE", "MQTT Protocol"],
    img: null,
  },
  {
    id: 4,
    label: "Layer 4",
    title: "Interface Dashboard",
    subtitle: "3D map visualization & smart alerts",
    icon: LayoutDashboard,
    color: "#00ffe7",
    desc: "Web dashboard and mobile app displaying real-time 3D maps, managing alerts, and providing actionable insights to operators.",
    tech: ["React / Next.js", "WebGL / Three.js", "Push Notifications", "REST + WebSocket"],
    img: null,
  },
];

const PROBLEMS = [
  {
    icon: AlertTriangle,
    title: "Blockages",
    desc: "Plastic and solid waste clog pipes, causing costly backups and flooding in urban areas.",
    color: "#ff6b6b",
    stat: "73",
    statSuffix: "%",
    statLabel: "of urban floods caused by blockages",
  },
  {
    icon: Shield,
    title: "Invisible Threat",
    desc: "Underground waste buildup goes undetected until it's too late — reactive maintenance is expensive.",
    color: "#ffbe0b",
    stat: "4",
    statSuffix: "x",
    statLabel: "costlier to fix vs. prevent",
  },
];

// ─── STATIC PARTICLES ─────────────────────────────────────────────────────────
const PARTICLE_DATA = [
  { id: 0,  x: 9.8,  y: 91.0, size: 2.0, duration: 8.2,  delay: 0.3 },
  { id: 1,  x: 97.3, y: 14.1, size: 1.4, duration: 11.5, delay: 1.1 },
  { id: 2,  x: 30.2, y: 83.5, size: 2.2, duration: 9.0,  delay: 2.4 },
  { id: 3,  x: 28.0, y: 51.7, size: 3.5, duration: 7.8,  delay: 0.8 },
  { id: 4,  x: 31.7, y: 3.0,  size: 3.8, duration: 13.1, delay: 3.2 },
  { id: 5,  x: 64.8, y: 50.5, size: 1.2, duration: 6.5,  delay: 1.7 },
  { id: 6,  x: 60.9, y: 9.1,  size: 2.6, duration: 10.4, delay: 0.5 },
  { id: 7,  x: 97.8, y: 32.2, size: 1.8, duration: 8.9,  delay: 2.9 },
  { id: 8,  x: 6.2,  y: 60.6, size: 3.3, duration: 7.2,  delay: 1.4 },
  { id: 9,  x: 42.9, y: 52.7, size: 1.8, duration: 12.0, delay: 3.7 },
  { id: 10, x: 87.0, y: 70.1, size: 1.0, duration: 9.6,  delay: 0.2 },
  { id: 11, x: 94.3, y: 27.6, size: 2.0, duration: 6.8,  delay: 2.1 },
  { id: 12, x: 20.9, y: 55.2, size: 2.3, duration: 11.2, delay: 1.6 },
  { id: 13, x: 47.8, y: 57.6, size: 2.6, duration: 8.4,  delay: 3.0 },
  { id: 14, x: 50.7, y: 50.4, size: 3.8, duration: 7.5,  delay: 0.9 },
  { id: 15, x: 39.4, y: 10.6, size: 3.9, duration: 14.0, delay: 2.6 },
  { id: 16, x: 35.3, y: 39.6, size: 1.1, duration: 9.1,  delay: 1.3 },
  { id: 17, x: 8.5,  y: 88.0, size: 2.0, duration: 10.7, delay: 3.5 },
  { id: 18, x: 12.6, y: 17.5, size: 3.3, duration: 8.0,  delay: 0.7 },
  { id: 19, x: 6.6,  y: 16.5, size: 2.3, duration: 6.3,  delay: 2.3 },
];

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const end = parseInt(target, 10);
    const step = Math.ceil(end / (1800 / 16));
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(current);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

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

// ─── SCAN LINE ─────────────────────────────────────────────────────────────────
function ScanLine({ color }) {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── ORBITING RINGS ───────────────────────────────────────────────────────────
function OrbitRings({ color }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[80, 115, 150].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border"
          style={{ width: size, height: size, borderColor: color + "35" }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
        />
      ))}
      <motion.div
        className="w-4 h-4 rounded-full"
        style={{ background: color }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0.3, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

// ─── PARTICLES ────────────────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── LAYER CARD ───────────────────────────────────────────────────────────────
function LayerCard({ layer, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;
  const Icon = layer.icon;

  return (
    <div ref={ref} className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${!isLeft ? "lg:flex-row-reverse" : ""}`}>

      {/* ── Text ── */}
      <motion.div
        className="flex-1 min-w-0"
        initial={{ opacity: 0, x: isLeft ? -80 : 80, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-5">
          <motion.span
            className="font-mono text-xs tracking-widest px-3 py-1 rounded-full border flex-shrink-0"
            style={{ color: layer.color, borderColor: layer.color + "55", background: layer.color + "12" }}
            whileHover={{ scale: 1.05 }}
          >
            {layer.label}
          </motion.span>
          <motion.div
            className="h-px flex-1"
            style={{ background: `linear-gradient(90deg, ${layer.color}, transparent)`, opacity: 0.4 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
          />
        </div>

        <motion.h3
          className="font-display leading-none tracking-tight mb-3"
          style={{ color: layer.color, fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {layer.title}
        </motion.h3>

        <motion.p
          className="font-mono text-sm text-gray-500 mb-5 tracking-wide"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {layer.subtitle}
        </motion.p>

        <motion.p
          className="text-gray-300 leading-relaxed mb-7 text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.32 }}
        >
          {layer.desc}
        </motion.p>

        <div className="flex flex-wrap gap-2">
          {layer.tech.map((t, ti) => (
            <motion.span
              key={t}
              className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 bg-white/[0.03]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.42 + ti * 0.07 }}
              whileHover={{ borderColor: layer.color + "70", color: layer.color, scale: 1.05 }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* ── Visual ── */}
      <motion.div
        className="flex-shrink-0 w-full lg:w-[380px]"
        initial={{ opacity: 0, scale: 0.85, x: isLeft ? 80 : -80 }}
        animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative rounded-2xl overflow-hidden border"
          style={{ borderColor: layer.color + "30" }}
          whileHover={{ borderColor: layer.color + "70", scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{ background: `radial-gradient(circle at 50% 0%, ${layer.color}20, transparent 60%)` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {layer.img ? (
            <div className="relative h-60">
              <img
                src={layer.img}
                alt={layer.title}
                className="w-full h-full object-cover"
                style={{ filter: "saturate(0.2) brightness(0.4)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${layer.color}28 0%, transparent 50%, #000 100%)` }}
              />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `linear-gradient(${layer.color} 1px, transparent 1px), linear-gradient(90deg, ${layer.color} 1px, transparent 1px)`,
                  backgroundSize: "28px 28px",
                }}
              />
              <ScanLine color={layer.color} />
              <motion.div
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md"
                style={{ background: layer.color + "25", border: `1px solid ${layer.color}55` }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: layer.color }}
                  animate={{ scale: [1, 1.7, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                <Icon size={13} style={{ color: layer.color }} />
                <span className="font-mono text-xs" style={{ color: layer.color }}>ACTIVE</span>
              </motion.div>
            </div>
          ) : (
            <div className="h-60 bg-black/40 relative overflow-hidden">
              <OrbitRings color={layer.color} />
              <ScanLine color={layer.color} />
              <motion.div
                className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md"
                style={{ background: layer.color + "25", border: `1px solid ${layer.color}55` }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div className="w-1.5 h-1.5 rounded-full" style={{ background: layer.color }}
                  animate={{ scale: [1, 1.7, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                <Icon size={13} style={{ color: layer.color }} />
                <span className="font-mono text-xs" style={{ color: layer.color }}>ACTIVE</span>
              </motion.div>
            </div>
          )}

          {/* Status bar */}
          <div className="px-4 py-3 bg-black/70 border-t border-white/5 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-600 tracking-widest">SYSTEM STATUS</span>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: layer.color }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="font-mono text-xs tracking-widest" style={{ color: layer.color }}>ONLINE</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function SewerMonitor() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <main
      className="min-h-screen bg-[#080a0e] text-white overflow-x-hidden pt-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=Space+Mono:wght@400;700&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .font-mono    { font-family: 'Space Mono', monospace; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080a0e; }
        ::-webkit-scrollbar-thumb { background: #00ffe744; border-radius: 2px; }
        ::selection { background: #00ffe730; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GridBg />
        <Particles />

        {/* Ambient glows */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[700px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/5 blur-3xl pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#080a0e] to-transparent pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/25 px-4 py-2 rounded-full mb-8 bg-cyan-400/5 backdrop-blur-sm"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            REAL-TIME SEWER MONITORING SYSTEM
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-display leading-none text-white block"
              style={{ fontSize: "clamp(4rem, 13vw, 11rem)" }}
            >
              SEE WHAT&apos;S
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-display leading-none block"
              style={{
                fontSize: "clamp(4rem, 13vw, 11rem)",
                background: "linear-gradient(135deg, #00ffe7 0%, #00c9ff 50%, #7b61ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              UNDERGROUND
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            LiDAR-powered sewer intelligence that detects blockages before they become disasters.
            From pipe to dashboard — in real time.
          </motion.p>

          {/* ── Buttons with next/link ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-20"
          >
            <Link href="/about">
              <motion.span
                whileHover={{ scale: 1.06, boxShadow: "0 0 50px rgba(0,255,231,0.35)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-block font-mono text-sm px-8 py-4 rounded-xl bg-cyan-400 text-black font-bold tracking-widest cursor-pointer"
              >
                EXPLORE SYSTEM
              </motion.span>
            </Link>
            <Link href="/gallery">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block font-mono text-sm px-8 py-4 rounded-xl border border-white/15 text-gray-400 tracking-widest hover:border-cyan-400/50 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                VIEW DOCS
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ PROBLEM ═══════════════════════════════════════════════════════════ */}
      <section id="problem" className="relative py-32 px-6 lg:px-16">
        <GridBg />
        <div className="max-w-6xl mx-auto relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <motion.span
              className="inline-block font-mono text-xs text-red-400 tracking-widest border border-red-400/30 px-3 py-1 rounded-full bg-red-400/5 mb-5"
              whileHover={{ scale: 1.05 }}
            >
              THE PROBLEM
            </motion.span>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display leading-none"
                style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                WASTE ACCUMULATION
                <br />
                <span className="text-gray-800">IN SEWERS</span>
              </motion.h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {PROBLEMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 50, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl p-8 border border-white/[0.07] bg-white/[0.02] overflow-hidden group cursor-default"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 0% 0%, ${p.color}18, transparent 65%)` }}
                  />
                  <motion.div
                    className="absolute top-0 left-0 h-px"
                    style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                      style={{ background: p.color + "18", border: `1px solid ${p.color}35` }}
                      whileHover={{ rotate: [-8, 8, 0], transition: { duration: 0.4 } }}
                    >
                      <Icon size={22} style={{ color: p.color }} />
                    </motion.div>

                    <h3 className="font-display text-4xl mb-3" style={{ color: p.color }}>{p.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-lg mb-8">{p.desc}</p>

                    <div className="flex items-end gap-3 pt-6 border-t border-white/[0.06]">
                      <motion.span
                        className="font-display text-6xl"
                        style={{ color: p.color }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.15, type: "spring", bounce: 0.4 }}
                      >
                        <Counter target={p.stat} suffix={p.statSuffix} />
                      </motion.span>
                      <span className="font-mono text-xs text-gray-600 pb-2 leading-tight max-w-[130px]">
                        {p.statLabel}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ ARCHITECTURE ══════════════════════════════════════════════════════ */}
      <section id="architecture" className="relative py-32 px-6 lg:px-16 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block font-mono text-xs text-purple-400 tracking-widest border border-purple-400/30 px-3 py-1 rounded-full bg-purple-400/5 mb-5"
              whileHover={{ scale: 1.05 }}
            >
              SYSTEM DESIGN
            </motion.span>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display leading-none"
                style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                ARCHITECTURE &amp;{" "}
                <span style={{ background: "linear-gradient(135deg,#7b61ff,#00c9ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  COMPONENTS
                </span>
              </motion.h2>
            </div>
            <motion.p
              className="text-gray-500 mt-6 max-w-xl mx-auto text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              End-to-end system designed for low power, high reliability, and easy deployment in existing sewer infrastructure.
            </motion.p>
          </motion.div>

          <div className="relative max-w-2xl mx-auto">
            <motion.div
              className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2"
              style={{ background: "linear-gradient(to bottom, #00ffe755, #00c9ff55, #7b61ff55, #ff6b6b55)" }}
              initial={{ scaleY: 0, originY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            />

            {[...LAYERS].reverse().map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-center gap-6 mb-5 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <motion.div
                    className="flex-1 p-5 rounded-2xl border bg-white/[0.025] backdrop-blur-sm"
                    style={{ borderColor: layer.color + "30" }}
                    whileHover={{ borderColor: layer.color + "70", backgroundColor: "rgba(255,255,255,0.04)", scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={15} style={{ color: layer.color }} />
                      <span className="font-mono text-xs tracking-widest" style={{ color: layer.color }}>{layer.label}</span>
                    </div>
                    <h4 className="font-display text-2xl text-white">{layer.title}</h4>
                    <p className="font-mono text-xs text-gray-600 mt-1">{layer.subtitle}</p>
                  </motion.div>

                  <motion.div
                    className="relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: layer.color, background: layer.color + "15" }}
                    whileHover={{ scale: 1.25, boxShadow: `0 0 20px ${layer.color}55` }}
                  >
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ background: layer.color }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    />
                  </motion.div>

                  <div className="flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ LAYERS DEEP DIVE ══════════════════════════════════════════════════ */}
      <section id="layers" className="relative py-32 px-6 lg:px-16">
        <GridBg />
        <div className="max-w-6xl mx-auto relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-24"
          >
            <motion.span
              className="inline-block font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/30 px-3 py-1 rounded-full bg-cyan-400/5 mb-5"
              whileHover={{ scale: 1.05 }}
            >
              DEEP DIVE
            </motion.span>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display leading-none"
                style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                LAYER BY{" "}
                <span className="text-gray-800">LAYER</span>
              </motion.h2>
            </div>
          </motion.div>

          <div className="space-y-32">
            {LAYERS.map((layer, i) => (
              <LayerCard key={layer.id} layer={layer} index={i} />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}