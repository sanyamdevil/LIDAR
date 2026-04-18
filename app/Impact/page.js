"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const ENHANCEMENTS = [
  {
    id: 1,
    label: "Phase 01",
    title: "AI Classification",
    subtitle: "Machine learning waste identification",
    color: "#7b61ff",
    desc: "Machine learning models trained on thousands of LiDAR scan profiles to identify waste types — plastics, sediment, grease, and debris — with higher accuracy than rule-based detection.",
    tech: ["TensorFlow Lite", "Edge Inference", "93%+ Accuracy", "Real-Time"],
  },
  {
    id: 2,
    label: "Phase 02",
    title: "Solar Power",
    subtitle: "Self-sustaining remote nodes",
    color: "#ffbe0b",
    desc: "Self-sustaining sensor nodes powered by solar panels and supercapacitor buffers, enabling deployment in remote or off-grid sewer infrastructure without any external power supply.",
    tech: ["15W Solar Panel", "Supercapacitor", "Zero Grid Power", "24/7 Uptime"],
  },
  {
    id: 3,
    label: "Phase 03",
    title: "City-Wide Network",
    subtitle: "Scalable municipal mesh",
    color: "#00c9ff",
    desc: "Scalable LoRaWAN mesh of hundreds of sensor nodes covering entire municipal sewer systems, feeding a unified city dashboard with predictive maintenance scheduling.",
    tech: ["LoRaWAN Mesh", "500+ Nodes", "City Dashboard", "Predictive AI"],
  },
  {
    id: 4,
    label: "Phase 04",
    title: "Environmental Impact",
    subtitle: "Cleaner waterways & lower costs",
    color: "#00ffe7",
    desc: "Proactive blockage prevention reduces plastic pollution reaching rivers and oceans. Cities adopting the system have seen maintenance costs drop by up to 40% within the first deployment year.",
    tech: ["40% Cost Reduction", "Plastic Diversion", "Flood Prevention", "ESG Reporting"],
  },
];

const STATS = [
  { value: "40%",  label: "Cost reduction" },
  { value: "500+", label: "Sensor nodes" },
  { value: "93%",  label: "AI accuracy" },
  { value: "24/7", label: "Monitoring" },
];

const TIMELINE = [
  { year: "2024", title: "Prototype",      desc: "Single-sensor proof of concept in DN600 test pipe.", color: "#ff6b6b" },
  { year: "2025", title: "Pilot City",     desc: "10-node network live across a municipal district.", color: "#7b61ff" },
  { year: "2026", title: "AI Integration", desc: "On-device ML classification at 93%+ accuracy.", color: "#00c9ff" },
  { year: "2027", title: "Solar Mesh",     desc: "Off-grid nodes with LoRaWAN city-wide coverage.", color: "#ffbe0b" },
  { year: "2030", title: "Global Scale",   desc: "Smart sewer infrastructure across 50+ cities.", color: "#00ffe7" },
];

const PILLARS = [
  { color: "#00ffe7", label: "Environmental", value: "Less plastic reaching rivers and oceans." },
  { color: "#7b61ff", label: "Economic",      value: "40% reduction in reactive maintenance costs." },
  { color: "#00c9ff", label: "Social",        value: "Safer cities, fewer flood-related emergencies." },
];

// ─── PARTICLES ────────────────────────────────────────────────────────────────
const PARTICLE_DATA = [
  { id: 0, x: 9.8,  y: 91.0, size: 2.0, duration: 8.2,  delay: 0.3 },
  { id: 1, x: 97.3, y: 14.1, size: 1.4, duration: 11.5, delay: 1.1 },
  { id: 2, x: 30.2, y: 83.5, size: 2.2, duration: 9.0,  delay: 2.4 },
  { id: 3, x: 64.8, y: 50.5, size: 1.2, duration: 6.5,  delay: 1.7 },
  { id: 4, x: 60.9, y: 9.1,  size: 2.6, duration: 10.4, delay: 0.5 },
  { id: 5, x: 87.0, y: 70.1, size: 1.0, duration: 9.6,  delay: 0.2 },
  { id: 6, x: 20.9, y: 55.2, size: 2.3, duration: 11.2, delay: 1.6 },
  { id: 7, x: 8.5,  y: 88.0, size: 2.0, duration: 10.7, delay: 3.5 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
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

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl p-5 sm:p-6 border border-white/[0.07] bg-white/[0.02] text-center overflow-hidden"
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2"
        style={{ background: "linear-gradient(90deg, transparent, #00ffe755, transparent)" }}
      />
      <p className="font-display text-4xl sm:text-5xl text-white mb-1">{stat.value}</p>
      <p className="font-mono text-xs text-gray-500 tracking-widest">{stat.label}</p>
    </motion.div>
  );
}

// ─── ENHANCEMENT CARD ─────────────────────────────────────────────────────────
function EnhancementCard({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, borderColor: item.color + "55" }}
      className="relative rounded-2xl border overflow-hidden p-6 sm:p-8 bg-white/[0.015]"
      style={{ borderColor: item.color + "22", transition: "border-color 0.3s" }}
    >
      {/* Top accent */}
      <motion.div
        className="absolute top-0 left-0 h-px"
        style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
        initial={{ width: 0 }}
        animate={inView ? { width: "60%" } : {}}
        transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Soft glow bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${item.color}07, transparent 50%)` }}
      />

      {/* Label row */}
      <div className="flex items-center gap-3 mb-5 relative">
        <span
          className="font-mono text-xs tracking-widest px-3 py-1 rounded-full border"
          style={{ color: item.color, borderColor: item.color + "45", background: item.color + "0f" }}
        >
          {item.label}
        </span>
        <div className="h-px flex-1 opacity-15" style={{ background: item.color }} />
      </div>

      {/* Title */}
      <motion.h3
        className="font-display leading-none mb-2"
        style={{ color: item.color, fontSize: "clamp(2rem, 5.5vw, 3rem)" }}
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {item.title}
      </motion.h3>

      <motion.p
        className="font-mono text-xs text-gray-500 mb-4 tracking-wide"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        {item.subtitle}
      </motion.p>

      <motion.p
        className="text-gray-300 leading-relaxed mb-6 text-sm sm:text-base"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.28 }}
      >
        {item.desc}
      </motion.p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2">
        {item.tech.map((t, ti) => (
          <motion.span
            key={t}
            className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 bg-white/[0.03]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.36 + ti * 0.07 }}
            whileHover={{ borderColor: item.color + "55", color: item.color, scale: 1.04 }}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── TIMELINE ITEM ────────────────────────────────────────────────────────────
function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-5 pb-10 last:pb-0"
    >
      {/* Dot + connector */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1.5">
        <motion.div
          className="w-3 h-3 rounded-full border-2 relative z-10 flex-shrink-0"
          style={{ borderColor: item.color, background: item.color + "28" }}
          animate={{
            boxShadow: [
              `0 0 0px ${item.color}00`,
              `0 0 10px ${item.color}55`,
              `0 0 0px ${item.color}00`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.35 }}
        />
        {index < TIMELINE.length - 1 && (
          <div
            className="w-px mt-2"
            style={{
              background: `linear-gradient(to bottom, ${item.color}40, transparent)`,
              minHeight: "52px",
            }}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pb-2">
        <span className="font-mono text-xs tracking-widest block mb-1" style={{ color: item.color }}>
          {item.year}
        </span>
        <h4 className="font-display text-2xl sm:text-3xl text-white leading-none mb-1">
          {item.title}
        </h4>
        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ImpactPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY      = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroScale  = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <main
      className="min-h-screen bg-[#080a0e] text-white overflow-x-hidden pt-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Space+Mono:wght@400;700&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .font-mono    { font-family: 'Space Mono', monospace; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080a0e; }
        ::-webkit-scrollbar-thumb { background: #00ffe744; border-radius: 2px; }
        ::selection { background: #00ffe730; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <GridBg />
        <Particles />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[500px] h-[320px] rounded-full bg-cyan-500/5 blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080a0e] to-transparent pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/25 px-4 py-2 rounded-full mb-8 bg-cyan-400/5"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            FUTURE ENHANCEMENTS & IMPACT
          </motion.div>

          <div className="overflow-hidden mb-1">
            <motion.h1
              className="font-display leading-none text-white block"
              style={{ fontSize: "clamp(3.2rem, 12vw, 9rem)" }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              SMARTER
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-1">
            <motion.h1
              className="font-display leading-none block"
              style={{
                fontSize: "clamp(3.2rem, 12vw, 9rem)",
                background: "linear-gradient(135deg, #00ffe7 0%, #00c9ff 50%, #7b61ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              CITIES
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="font-display leading-none text-gray-800 block"
              style={{ fontSize: "clamp(3.2rem, 12vw, 9rem)" }}
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              CLEANER WORLD
            </motion.h1>
          </div>

         
        </motion.div>
      </section>

      {/* ══ STATS ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURE SCOPE ════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 lg:px-16">
        <GridBg />
        <div className="max-w-5xl mx-auto relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <span className="inline-block font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/30 px-3 py-1 rounded-full bg-cyan-400/5 mb-5">
              FEATURE SCOPE
            </span>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display leading-none"
                style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                WHAT&apos;S{" "}
                <span style={{ background: "linear-gradient(135deg,#00ffe7,#7b61ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  NEXT
                </span>
              </motion.h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ENHANCEMENTS.map((item, i) => (
              <EnhancementCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 lg:px-16 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
          >
            <span className="inline-block font-mono text-xs text-purple-400 tracking-widest border border-purple-400/30 px-3 py-1 rounded-full bg-purple-400/5 mb-5">
              DEPLOYMENT ROADMAP
            </span>
            <div className="overflow-hidden">
              <motion.h2
                className="font-display leading-none"
                style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                THE{" "}
                <span style={{ background: "linear-gradient(135deg,#7b61ff,#00c9ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  TIMELINE
                </span>
              </motion.h2>
            </div>
          </motion.div>

          <div className="max-w-lg">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ VISION ════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 lg:px-16 overflow-hidden">
        <GridBg />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[600px] h-[320px] rounded-full bg-cyan-500/5 blur-[130px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <span className="inline-block font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/25 px-3 py-1 rounded-full bg-cyan-400/5">
              THE VISION
            </span>
          </motion.div>

          <div className="overflow-hidden mb-1">
            <motion.h2
              className="font-display leading-none text-white"
              style={{ fontSize: "clamp(2.2rem, 7.5vw, 6rem)" }}
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              A CLEANER, SMARTER CITY —
            </motion.h2>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h2
              className="font-display leading-none"
              style={{
                fontSize: "clamp(2.2rem, 7.5vw, 6rem)",
                background: "linear-gradient(135deg, #00ffe7 0%, #00c9ff 45%, #7b61ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              ONE SEWER AT A TIME.
            </motion.h2>
          </div>

          <motion.p
            className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Every blocked pipe detected, every litre of plastic diverted, every flood prevented —
            adds up to cities that breathe cleaner and run leaner. The sewer system is invisible infrastructure. We&apos;re making it intelligent.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02] overflow-hidden group"
              >
                <motion.div
                  className="absolute top-0 left-0 h-px"
                  style={{ background: `linear-gradient(90deg, ${pillar.color}, transparent)` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "65%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.12 }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${pillar.color}10, transparent 60%)` }}
                />
                <p className="font-mono text-xs tracking-widest mb-3 relative" style={{ color: pillar.color }}>
                  {pillar.label.toUpperCase()}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed relative">{pillar.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}