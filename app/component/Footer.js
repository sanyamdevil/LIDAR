"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const NAV_LINKS = [
  { label: "LIDAR",   href: "/lidar" },
  { label: "WORKING", href: "/working" },
  { label: "GALLERY", href: "/gallery" },
  { label: "IMPACT",  href: "/Impact" },
];



const METRICS = [
  { label: "ACTIVE SENSORS", value: "2,847", unit: "UNITS" },
  { label: "SCANS TODAY",    value: "14.2K",  unit: "RUNS"  },
  { label: "UPTIME",         value: "99.9",   unit: "%"     },
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        .nav-font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.08em; }
        .nav-font-mono    { font-family: 'Space Mono', monospace; }

        .footer-nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #6b7280;
          transition: color 0.2s ease;
        }
        .footer-nav-link::before {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0, 255, 231, 0.25);
          transition: background 0.2s ease;
          flex-shrink: 0;
        }
        .footer-nav-link:hover { color: #00ffe7; }
        .footer-nav-link:hover::before { background: #00ffe7; }

        .footer-bottom-link {
          text-decoration: none;
          color: #374151;
          transition: color 0.2s ease;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }
        .footer-bottom-link:hover { color: rgba(0, 255, 231, 0.6); }

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.4); opacity: 1; }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        .logo-dot-anim {
          animation: pulseDot 2s ease-in-out infinite;
        }
        .status-dot-anim {
          animation: blinkDot 1.4s ease-in-out infinite;
        }
      `}</style>

      <footer
        ref={ref}
        style={{
          width: "100%",
          backgroundColor: "rgba(8, 10, 14, 0.97)",
          borderTop: "1px solid rgba(0, 255, 231, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top cyan glow line */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,231,0) 15%, rgba(0,255,231,0.55) 50%, rgba(0,255,231,0) 85%, transparent 100%)",
          }}
        />

        {/* Noise texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.03,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Ambient glow blobs */}
        <div
          style={{
            position: "absolute",
            left: "-60px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "220px",
            height: "180px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,255,231,0.055) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-60px",
            bottom: "30px",
            width: "180px",
            height: "150px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,200,255,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Inner content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "52px 32px 28px",
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "40px 32px",
              marginBottom: "48px",
            }}
          >
            {/* ── Brand column ── */}
            <motion.div variants={itemVariants} style={{ gridColumn: "span 1" }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", marginBottom: "16px" }}>
                <motion.div
                  style={{
                    width: "28px", height: "28px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,255,231,0.22)",
                    background: "rgba(0,255,231,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                  whileHover={{ borderColor: "rgba(0,255,231,0.6)", scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="logo-dot-anim"
                    style={{
                      width: "10px", height: "10px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #00ffe7, #00c9ff)",
                    }}
                  />
                </motion.div>
                <span
                  className="nav-font-display"
                  style={{ fontSize: "22px", color: "#ffffff", letterSpacing: "0.1em" }}
                >
                  SEWERSENSE
                </span>
              </Link>

              <p
                className="nav-font-mono"
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  lineHeight: 1.75,
                  maxWidth: "240px",
                  marginBottom: "20px",
                }}
              >
                Advanced underground infrastructure monitoring via real-time LIDAR sensing and intelligent anomaly detection.
              </p>

              {/* Status pill */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(0,255,231,0.2)",
                  background: "rgba(0,255,231,0.06)",
                }}
              >
                <div
                  className="status-dot-anim"
                  style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00ffe7" }}
                />
                <span className="nav-font-mono" style={{ fontSize: "10px", color: "#00ffe7", letterSpacing: "0.15em" }}>
                  SYSTEM LIVE
                </span>
              </div>
            </motion.div>

            {/* ── Navigate column ── */}
            <motion.div variants={itemVariants}>
              <ColHeading label="NAVIGATE" />
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-nav-link nav-font-display" style={{ fontSize: "17px", letterSpacing: "0.08em" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Live Metrics column ── */}
            <motion.div variants={itemVariants}>
              <ColHeading label="LIVE METRICS" />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {METRICS.map((m) => (
                  <div
                    key={m.label}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid rgba(0,255,231,0.09)",
                      background: "rgba(0,255,231,0.04)",
                    }}
                  >
                    <div
                      className="nav-font-mono"
                      style={{ fontSize: "9px", letterSpacing: "0.18em", color: "#4b5563", marginBottom: "4px" }}
                    >
                      {m.label}
                    </div>
                    <div className="nav-font-display" style={{ fontSize: "20px", letterSpacing: "0.06em", color: "#00ffe7" }}>
                      {m.value}
                      <span className="nav-font-mono" style={{ fontSize: "12px", color: "#6b7280", marginLeft: "4px" }}>
                        {m.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(0,255,231,0.1) 30%, rgba(0,255,231,0.1) 70%, transparent)",
              marginBottom: "24px",
            }}
          />

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p className="nav-font-mono" style={{ fontSize: "10px", color: "#374151", letterSpacing: "0.1em" }}>
              © 2025{" "}
              <span style={{ color: "rgba(0,255,231,0.45)" }}>SEWERSENSE</span>
              {" "}— ALL RIGHTS RESERVED
            </p>

            

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "9999px",
                border: "1px solid rgba(0,255,231,0.1)",
                background: "rgba(0,255,231,0.04)",
              }}
            >
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(0,255,231,0.4)" }} />
              <span className="nav-font-mono" style={{ fontSize: "9px", letterSpacing: "0.12em", color: "#4b5563" }}>
                BUILT WITH LIDAR TECH
              </span>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}

// ── Column heading with decorative line ──
function ColHeading({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
        fontFamily: "'Space Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.2em",
        color: "rgba(0,255,231,0.6)",
      }}
    >
      {label}
      <div style={{ flex: 1, height: "1px", background: "rgba(0,255,231,0.12)" }} />
    </div>
  );
}