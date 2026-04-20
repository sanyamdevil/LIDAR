"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "LIDAR",   href: "/lidar" },
    { label: "WORKING", href: "/working" },

  { label: "GALLERY", href: "/gallery" },
  { label: "IMPACT",      href: "/Impact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        .nav-font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.08em; }
        .nav-font-mono    { font-family: 'Space Mono', monospace; }
      `}</style>

      <motion.header
        className="fixed top-0 left-0 right-0 w-full z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ── Main glass bar ── */}
        <motion.div
          className="relative w-full flex items-center justify-between h-16 px-8 lg:px-16 border-b overflow-hidden"
          animate={{
            backgroundColor: scrolled
              ? "rgba(8, 10, 14, 0.88)"
              : "rgba(8, 10, 14, 0.45)",
            borderColor: scrolled
              ? "rgba(0, 255, 231, 0.15)"
              : "rgba(255, 255, 255, 0.07)",
          }}
          transition={{ duration: 0.4 }}
          style={{
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
          }}
        >
          {/* Noise texture overlay for deeper glass feel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
              backgroundSize: "128px 128px",
            }}
          />

          {/* Cyan glow line — top edge */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(0,255,231,0.0) 20%, rgba(0,255,231,0.55) 50%, rgba(0,255,231,0.0) 80%, transparent 100%)",
            }}
            animate={{ opacity: scrolled ? 1 : 0.4 }}
            transition={{ duration: 0.5 }}
          />

          {/* Ambient left glow blob */}
          <div
            className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-32 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(0,255,231,0.06) 0%, transparent 70%)",
            }}
          />

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              className="w-7 h-7 rounded-lg border flex items-center justify-center"
              style={{ borderColor: "rgba(0,255,231,0.22)", background: "rgba(0,255,231,0.07)" }}
              whileHover={{ borderColor: "rgba(0,255,231,0.6)", scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: "linear-gradient(135deg, #00ffe7, #00c9ff)" }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="nav-font-display text-xl text-white tracking-widest group-hover:text-cyan-400 transition-colors duration-200">
              SEWERSENSE
            </span>
          </Link>

          {/* ── Desktop links — centred absolutely ── */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link, i) => (
              <NavLink key={link.href} link={link} index={i} />
            ))}
          </nav>

          {/* ── Status pill (desktop) ── */}
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] flex-shrink-0"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="nav-font-mono text-[10px] text-cyan-400 tracking-widest">LIVE</span>
          </div>

          {/* ── Mobile hamburger ── */}
          <motion.button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:border-cyan-400/40 hover:text-cyan-400 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* ── Mobile dropdown — full width glass ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full border-b border-white/[0.08] overflow-hidden"
              style={{
                backdropFilter: "blur(28px) saturate(160%)",
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                backgroundColor: "rgba(8, 10, 14, 0.92)",
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-8 py-4 border-b border-white/[0.05] last:border-0 group"
                  >
                    <motion.div className="w-1 h-5 rounded-full bg-cyan-400/25 group-hover:bg-cyan-400 transition-colors duration-200" />
                    <span className="nav-font-display text-2xl text-gray-400 group-hover:text-cyan-400 transition-colors duration-200 tracking-widest">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              <div className="flex items-center gap-2 px-8 py-4">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  animate={{ opacity: [1, 0.15, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span className="nav-font-mono text-[10px] text-cyan-400 tracking-widest">SYSTEM LIVE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

// ── Individual desktop nav link ──
function NavLink({ link, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={link.href}>
      <motion.div
        className="relative px-4 py-2 rounded-lg cursor-pointer"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Hover glass pill */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "rgba(0,255,231,0.07)",
                border: "1px solid rgba(0,255,231,0.20)",
                backdropFilter: "blur(8px)",
              }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.18 }}
            />
          )}
        </AnimatePresence>

        <span
          className="nav-font-mono text-xs tracking-widest relative z-10 transition-colors duration-200"
          style={{ color: hovered ? "#00ffe7" : "#9ca3af" }}
        >
          {link.label}
        </span>

        {/* Bottom glow dot */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
              style={{ boxShadow: "0 0 6px #00ffe7" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}