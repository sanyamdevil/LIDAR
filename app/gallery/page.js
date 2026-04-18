"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight, Grid3X3, Layers, Eye, Radio } from "lucide-react";

// ─── DATA ──────────────────────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  {
    id: 1,
    src: "/lidar1.jpg",
    title: "Point Cloud Mapping",
    subtitle: "360° sewer pipe geometry",
    tag: "Sensing",
    tagColor: "#ff6b6b",
    desc: "High-density LiDAR point cloud rendering of a 600mm diameter concrete sewer pipe. Each point represents a 0.15° angular resolution scan captured at 8000 samples/second.",
  },
  {
    id: 2,
    src: "/lidar2.jpg",
    title: "Blockage Detection",
    subtitle: "Solid waste obstruction",
    tag: "Detection",
    tagColor: "#ffbe0b",
    desc: "Classification output highlighting a 73% cross-sectional blockage caused by compacted plastic debris. The red heat-map overlay indicates critical flow restriction zones.",
  },
  {
    id: 3,
    src: "/lidar3.jpg",
    title: "Pipe Cross-Section",
    subtitle: "Radial distance profile",
    tag: "Analysis",
    tagColor: "#7b61ff",
    desc: "2D radial scan slice showing the internal pipe profile. Deviations from the ideal circular baseline (shown in white) reveal buildup, cracks, and deformation.",
  },
  {
    id: 4,
    src: "/lidar4.jpg",
    title: "3D Corridor Model",
    subtitle: "50m tunnel reconstruction",
    tag: "Mapping",
    tagColor: "#00c9ff",
    desc: "Full 3D tunnel model reconstructed from sequential scan frames. WebGL-rendered in the dashboard for operator inspection without physical entry.",
  },
  {
    id: 5,
    src: "/lidar5.jpg",
    title: "Sensor Assembly",
    subtitle: "IP67 waterproof enclosure",
    tag: "Hardware",
    tagColor: "#00ffe7",
    desc: "RPLidar A1 mounted inside a custom-fabricated stainless steel IP67 housing. The motor drive compensates for water drag, maintaining stable 5.5 Hz rotation.",
  },
  {
    id: 6,
    src: "/lidar6.jpg",
    title: "Real-Time Scan Feed",
    subtitle: "Live dashboard stream",
    tag: "Interface",
    tagColor: "#ff6b6b",
    desc: "Live scan data rendered in the React dashboard via WebSocket at 10 frames/second. Color gradient encodes radial distance from sensor centre (blue = near, red = far).",
  },
  {
    id: 7,
    src: "/lidar7.jpg",
    title: "Sediment Layer Analysis",
    subtitle: "Invert buildup profiling",
    tag: "Analysis",
    tagColor: "#7b61ff",
    desc: "Bottom-of-pipe sediment accumulation mapped over a 200m run. Depth contours calculated by comparing current scan against clean-pipe baseline stored in cloud.",
  },
  {
    id: 8,
    src: "/lidar8.jpg",
    title: "Junction Chamber",
    subtitle: "Multi-inlet detection",
    tag: "Mapping",
    tagColor: "#00c9ff",
    desc: "Complex junction chamber scanned from a single sensor position. Four inlet pipes are correctly identified and spatially registered in the 3D model output.",
  },
  {
    id: 9,
    src: "/lidar9.jpg",
    title: "Alert Trigger Event",
    subtitle: "Critical threshold breach",
    tag: "Detection",
    tagColor: "#ffbe0b",
    desc: "Snapshot captured at the moment a blockage threshold was breached. The ESP32 firmware triggered a GSM push alert within 340ms of classification confidence exceeding 92%.",
  },
  {
    id: 10,
    src: "/lidar10.jpg",
    title: "Deployment Environment",
    subtitle: "Active urban sewer run",
    tag: "Field",
    tagColor: "#00ffe7",
    desc: "System operating in a live DN800 combined sewer during off-peak flow. The sensor robot navigates autonomously along the invert using a brushless drive unit.",
  },
];

const FILTERS = ["All", "Sensing", "Detection", "Analysis", "Mapping", "Hardware", "Interface", "Field"];

const STATS = [
  { value: "10", suffix: "", label: "Field Images" },
  { value: "360", suffix: "°", label: "Scan Coverage" },
  { value: "0.15", suffix: "°", label: "Angular Resolution" },
  { value: "8K", suffix: "", label: "Samples / Second" },
];

// ─── STATIC PARTICLES ─────────────────────────────────────────────────────────
const PARTICLE_DATA = [
  { id: 0,  x: 9.8,  y: 91.0, size: 2.0, duration: 8.2,  delay: 0.3 },
  { id: 1,  x: 97.3, y: 14.1, size: 1.4, duration: 11.5, delay: 1.1 },
  { id: 2,  x: 30.2, y: 83.5, size: 2.2, duration: 9.0,  delay: 2.4 },
  { id: 3,  x: 64.8, y: 50.5, size: 1.2, duration: 6.5,  delay: 1.7 },
  { id: 4,  x: 60.9, y: 9.1,  size: 2.6, duration: 10.4, delay: 0.5 },
  { id: 5,  x: 87.0, y: 70.1, size: 1.0, duration: 9.6,  delay: 0.2 },
  { id: 6,  x: 20.9, y: 55.2, size: 2.3, duration: 11.2, delay: 1.6 },
  { id: 7,  x: 50.7, y: 50.4, size: 3.8, duration: 7.5,  delay: 0.9 },
  { id: 8,  x: 8.5,  y: 88.0, size: 2.0, duration: 10.7, delay: 3.5 },
  { id: 9,  x: 12.6, y: 17.5, size: 3.3, duration: 8.0,  delay: 0.7 },
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

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ items, activeIndex, onClose, onPrev, onNext }) {
  const item = items[activeIndex];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Content */}
      <motion.div
        className="relative w-full max-w-5xl flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${item.tagColor}30`, background: "#0a0c10" }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image pane */}
        <div className="relative flex-1 min-h-[260px] lg:min-h-[420px] overflow-hidden">
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{ filter: "saturate(0.25) brightness(0.45)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${item.tagColor}28 0%, transparent 50%, #000 100%)` }}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `linear-gradient(${item.tagColor} 1px, transparent 1px), linear-gradient(90deg, ${item.tagColor} 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
          <ScanLine color={item.tagColor} />

          {/* Counter */}
          <div className="absolute bottom-3 left-3 font-mono text-xs text-gray-600 tracking-widest">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </div>
        </div>

        {/* Info pane */}
        <div className="lg:w-72 p-7 flex flex-col justify-between">
          <div>
            <motion.span
              className="inline-block font-mono text-xs tracking-widest px-3 py-1 rounded-full border mb-5"
              style={{ color: item.tagColor, borderColor: item.tagColor + "55", background: item.tagColor + "12" }}
            >
              {item.tag}
            </motion.span>
            <h2
              className="font-display leading-none mb-2"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: item.tagColor }}
            >
              {item.title}
            </h2>
            <p className="font-mono text-xs text-gray-500 mb-5 tracking-wide">{item.subtitle}</p>
            <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-3 mt-8">
            <motion.button
              onClick={onPrev}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-gray-400 font-mono text-xs tracking-widest"
              whileHover={{ borderColor: item.tagColor + "70", color: item.tagColor }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={14} /> PREV
            </motion.button>
            <motion.button
              onClick={onNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-gray-400 font-mono text-xs tracking-widest"
              whileHover={{ borderColor: item.tagColor + "70", color: item.tagColor }}
              whileTap={{ scale: 0.95 }}
            >
              NEXT <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>

        {/* Close */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-500"
          whileHover={{ borderColor: "#ff6b6b55", color: "#ff6b6b", scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={15} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── GALLERY CARD ─────────────────────────────────────────────────────────────
function GalleryCard({ item, index, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: (index % 5) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="relative rounded-2xl overflow-hidden border cursor-pointer group"
      style={{ borderColor: hovered ? item.tagColor + "60" : item.tagColor + "20" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(index)}
    >
      {/* Ambient glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: `radial-gradient(circle at 50% 0%, ${item.tagColor}18, transparent 60%)` }}
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      />

      {/* Image */}
      <div className="relative overflow-hidden h-52 sm:h-48 md:h-52">
        <motion.img
          src={item.src}
          alt={item.title}
          className="w-full h-full object-cover"
          style={{ filter: "saturate(0.2) brightness(0.4)" }}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${item.tagColor}28 0%, transparent 50%, #000 100%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(${item.tagColor} 1px, transparent 1px), linear-gradient(90deg, ${item.tagColor} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Scan line on hover */}
        {hovered && <ScanLine color={item.tagColor} />}

        {/* Tag badge */}
        <motion.div
          className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md"
          style={{ background: item.tagColor + "25", border: `1px solid ${item.tagColor}55` }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: item.tagColor }}
            animate={{ scale: [1, 1.7, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="font-mono text-xs" style={{ color: item.tagColor }}>{item.tag.toUpperCase()}</span>
        </motion.div>

        {/* Zoom icon on hover */}
        <motion.div
          className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <ZoomIn size={14} className="text-white" />
        </motion.div>

        {/* Image number */}
        <div className="absolute bottom-3 right-3 font-mono text-xs text-gray-600 tracking-widest">
          {String(item.id).padStart(2, "0")}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3.5 bg-black/70 border-t border-white/5">
        <h3
          className="font-display text-xl leading-none mb-0.5"
          style={{ color: hovered ? item.tagColor : "white", transition: "color 0.3s" }}
        >
          {item.title}
        </h3>
        <p className="font-mono text-xs text-gray-600 tracking-wide">{item.subtitle}</p>
      </div>
    </motion.div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02] text-center"
    >
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2"
        style={{ background: "linear-gradient(90deg, transparent, #00ffe755, transparent)" }}
      />
      <p className="font-display text-4xl text-white mb-1">
        {stat.value}<span className="text-cyan-400">{stat.suffix}</span>
      </p>
      <p className="font-mono text-xs text-gray-600 tracking-widest">{stat.label}</p>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered = activeFilter === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((i) => i.tag === activeFilter);

  const openLightbox = (visibleIndex) => setLightboxIndex(visibleIndex);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);
  const nextImage = () => setLightboxIndex((i) => (i + 1) % filtered.length);

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
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <GridBg />
        <Particles />

        {/* Ambient glows */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[600px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-600/5 blur-3xl pointer-events-none"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#080a0e] to-transparent pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
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
            LIDAR VISUAL DOCUMENTATION
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-display leading-none text-white block"
              style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
            >
              VISUAL
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.95, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-display leading-none block"
              style={{
                fontSize: "clamp(3.5rem, 12vw, 9rem)",
                background: "linear-gradient(135deg, #00ffe7 0%, #00c9ff 50%, #7b61ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GALLERY
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Field captures, point clouds, and system imagery from the LiDAR sewer monitoring project.
          </motion.p>


        </motion.div>
      </section>

      {/* ══ STATS ══════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALLERY GRID ══════════════════════════════════════════════════════ */}
      <section id="gallery" className="relative py-16 px-6 lg:px-16">
        <GridBg />
        <div className="max-w-6xl mx-auto relative z-10">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14"
          >
            <motion.span
              className="inline-block font-mono text-xs text-cyan-400 tracking-widest border border-cyan-400/30 px-3 py-1 rounded-full bg-cyan-400/5 mb-5"
              whileHover={{ scale: 1.05 }}
            >
              FIELD DOCUMENTATION
            </motion.span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="overflow-hidden">
                <motion.h2
                  className="font-display leading-none"
                  style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                >
                  ALL{" "}
                  <span style={{ background: "linear-gradient(135deg,#00ffe7,#7b61ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    CAPTURES
                  </span>
                </motion.h2>
              </div>

              {/* Filter pills */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {FILTERS.map((filter) => (
                  <motion.button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="font-mono text-xs px-3 py-1.5 rounded-lg border tracking-widest transition-colors"
                    style={
                      activeFilter === filter
                        ? { background: "#00ffe715", borderColor: "#00ffe755", color: "#00ffe7" }
                        : { background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#6b7280" }
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GalleryCard item={item} index={i} onClick={openLightbox} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-gray-700 font-mono text-sm tracking-widest"
            >
              NO IMAGES IN THIS CATEGORY
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ ABOUT SECTION ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 lg:px-16 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                icon: Eye,
                color: "#00ffe7",
                title: "Visual Inspection",
                desc: "Every image is a direct export from the RPLidar A1 sensor pipeline — raw point clouds, classified overlays, and hardware stills captured during active field deployments.",
              },
              {
                icon: Layers,
                color: "#7b61ff",
                title: "Multi-Layer Data",
                desc: "Images span all four system layers: raw sensing, edge processing outputs, communication handshake logs, and dashboard screenshots from live events.",
              },
              {
                icon: Radio,
                color: "#00c9ff",
                title: "Live Capture",
                desc: "Field images are captured in real operating conditions — active combined sewers, DN400–DN1200 pipe diameters, and varying flow rates from 0.1 to 2.3 m/s.",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl p-7 border border-white/[0.07] bg-white/[0.02] overflow-hidden group"
                >
                  <motion.div
                    className="absolute top-0 left-0 h-px"
                    style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 0% 0%, ${card.color}12, transparent 60%)` }}
                  />
                  <motion.div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: card.color + "18", border: `1px solid ${card.color}35` }}
                    whileHover={{ rotate: [-8, 8, 0], transition: { duration: 0.4 } }}
                  >
                    <Icon size={20} style={{ color: card.color }} />
                  </motion.div>
                  <h3 className="font-display text-2xl mb-3" style={{ color: card.color }}>{card.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ LIGHTBOX ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filtered}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </main>
  );
}