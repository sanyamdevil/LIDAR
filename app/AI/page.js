"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import gsap from "gsap";

// ─── STATIC PARTICLES ──────────────────────────────────────────────────────────
const PARTICLE_DATA = [
  { id: 0,  x: 9.8,  y: 91.0, size: 2.0, duration: 8.2,  delay: 0.3 },
  { id: 1,  x: 97.3, y: 14.1, size: 1.4, duration: 11.5, delay: 1.1 },
  { id: 2,  x: 30.2, y: 83.5, size: 2.2, duration: 9.0,  delay: 2.4 },
  { id: 3,  x: 28.0, y: 51.7, size: 3.5, duration: 7.8,  delay: 0.8 },
  { id: 4,  x: 64.8, y: 50.5, size: 1.2, duration: 6.5,  delay: 1.7 },
  { id: 5,  x: 60.9, y: 9.1,  size: 2.6, duration: 10.4, delay: 0.5 },
  { id: 6,  x: 6.2,  y: 60.6, size: 3.3, duration: 7.2,  delay: 1.4 },
  { id: 7,  x: 87.0, y: 70.1, size: 1.0, duration: 9.6,  delay: 0.2 },
  { id: 8,  x: 20.9, y: 55.2, size: 2.3, duration: 11.2, delay: 1.6 },
  { id: 9,  x: 50.7, y: 50.4, size: 3.8, duration: 7.5,  delay: 0.9 },
  { id: 10, x: 39.4, y: 10.6, size: 3.9, duration: 14.0, delay: 2.6 },
  { id: 11, x: 12.6, y: 17.5, size: 3.3, duration: 8.0,  delay: 0.7 },
];

// ─── GRID BACKGROUND ───────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div
      className="absolute inset-0 pointer-events-none -z-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,255,231,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,231,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}

// ─── PARTICLES ─────────────────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {PARTICLE_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "#00ffe7",
          }}
          animate={{ y: [0, -40, 0], opacity: [0.1, 0.6, 0.1] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── RADAR PULSE ICON ──────────────────────────────────────────────────────────
function RadarIcon() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      {[1, 0.6, 0.3].map((opacity, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-cyan-400"
          style={{ opacity }}
          animate={{ scale: [1, 1.6 + i * 0.3, 1], opacity: [opacity, 0, opacity] }}
          transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ color: "#00ffe7", fontSize: 18 }}
      >
        ◎
      </div>
    </div>
  );
}

// ─── MAIN CHAT PAGE ────────────────────────────────────────────────────────────
export default function LidarChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "[ LIDAR-BOT ONLINE ] Real-time sewer monitoring assistant active. Ask me about blockage detection, sensor data, pipe health, system alerts, or LiDAR scan results.",
    },
  ]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognizerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // GSAP background fade-in
  useEffect(() => {
    gsap.fromTo(
      ".lidar-bg",
      { opacity: 0 },
      { opacity: 1, duration: 1.6, ease: "power2.out" }
    );
  }, []);

  // Speech synthesis
  const speak = (text) => {
    if (!speaking || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const pushAssistant = (content) => {
    setMessages((m) => [...m, { role: "assistant", content }]);
    speak(content);
  };

  // Send message
  const onSend = async (override) => {
    const text = (override ?? input).trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, newInput: text }),
      });
      const data = await res.json();
      pushAssistant(
        data.reply || "[ ERROR ] No response received from monitoring system."
      );
    } catch {
      pushAssistant(
        "[ NETWORK ERROR ] Unable to reach the LiDAR monitoring backend. Check connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Voice recognition
  const onMic = () => {
    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SR) {
      pushAssistant(
        "[ WARNING ] Voice input not supported. Please use Chrome or Edge."
      );
      return;
    }
    if (!recognizerRef.current) {
      const r = new SR();
      r.lang = "en-US";
      r.interimResults = false;
      r.onresult = (e) => onSend(e.results[0][0].transcript);
      r.onstart = () => setListening(true);
      r.onend = () => setListening(false);
      recognizerRef.current = r;
    }
    try {
      if (listening) recognizerRef.current.stop();
      else recognizerRef.current.start();
    } catch {}
  };

  return (
    <>
      {/* ── Font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-mono-lidar { font-family: 'Space Mono', monospace; }
        .font-sans-lidar  { font-family: 'DM Sans', sans-serif; }
        .messages-scroll::-webkit-scrollbar { width: 3px; }
        .messages-scroll::-webkit-scrollbar-track { background: transparent; }
        .messages-scroll::-webkit-scrollbar-thumb { background: rgba(0,255,231,0.3); border-radius: 2px; }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,255,231,0.15), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cursor-blink { animation: blink 1.1s step-start infinite; }
      `}</style>

      <div
        className="lidar-bg font-sans-lidar min-h-screen relative overflow-hidden flex flex-col items-center justify-start px-4 py-10"
        style={{ background: "#080a0e", color: "#e0f7f4" }}
      >
        {/* ── Background layers ── */}
        <GridBg />
        <Particles />
        <div className="scanline" />

        {/* Ambient glows */}
        <div
          className="absolute pointer-events-none -z-10"
          style={{
            top: "-120px",
            left: "-80px",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,201,255,0.07), transparent 70%)",
          }}
        />
        <div
          className="absolute pointer-events-none -z-10"
          style={{
            bottom: "-80px",
            right: "-60px",
            width: "500px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123,97,255,0.06), transparent 70%)",
          }}
        />

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <motion.header
          className="flex items-center justify-between w-full max-w-3xl mb-6 relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <RadarIcon />
            <div>
              <h1
                className="font-mono-lidar font-bold leading-tight"
                style={{
                  fontSize: "clamp(13px, 3vw, 17px)",
                  letterSpacing: "0.06em",
                  background: "linear-gradient(135deg, #00ffe7 0%, #00c9ff 60%, #7b61ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SEWER-LIDAR · CHATBOT
              </h1>
              <p
                className="font-mono-lidar"
                style={{ fontSize: 9, color: "#4ecdc4", letterSpacing: "0.14em", marginTop: 2 }}
              >
                REAL-TIME MONITORING SYSTEM
              </p>
            </div>
          </div>

          {/* TTS Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSpeaking((s) => !s)}
            className="font-mono-lidar"
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 11,
              letterSpacing: "0.06em",
              border: speaking
                ? "1px solid #00ffe7"
                : "1px solid rgba(0,255,231,0.25)",
              background: speaking
                ? "rgba(0,255,231,0.15)"
                : "transparent",
              color: "#00ffe7",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {speaking ? "▶ AUDIO ON" : "▶ AUDIO OFF"}
          </motion.button>
        </motion.header>

        {/* ══ INFO CARDS SWIPER ════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-3xl mb-5 relative z-10"
        >
          <Swiper spaceBetween={16} slidesPerView={1}>
            {[
              {
                label: "LAYER 1 · SENSING",
                title: "LiDAR Scan Coverage",
                body: "360° rotating RPLidar A1 sensor continuously maps sewer geometry with 0.15° resolution inside IP67 waterproof enclosures.",
                accent: "#00ffe7",
              },
              {
                label: "LAYER 2 · PROCESSING",
                title: "Edge Classification",
                body: "Arduino Mega / ESP32 firmware runs on-device ML to detect blockages, cracks, and foreign objects in real time.",
                accent: "#7b61ff",
              },
              {
                label: "LAYER 3 · COMMS",
                title: "Wi-Fi / LoRa / GSM",
                body: "Classified events are transmitted via MQTT over Wi-Fi, LoRa WAN, or LTE to cloud or local server with minimal latency.",
                accent: "#00c9ff",
              },
              {
                label: "LAYER 4 · DASHBOARD",
                title: "3D Map & Smart Alerts",
                body: "WebGL-powered dashboard renders live 3D pipe maps, alert timelines, and operator insights via REST + WebSocket.",
                accent: "#ff6b6b",
              },
            ].map((card) => (
              <SwiperSlide key={card.label}>
                <div
                  style={{
                    borderRadius: 14,
                    border: `1px solid ${card.accent}22`,
                    background: "rgba(255,255,255,0.025)",
                    backdropFilter: "blur(12px)",
                    padding: "18px 22px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* top accent line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "50%",
                      height: 1,
                      background: `linear-gradient(90deg, ${card.accent}, transparent)`,
                    }}
                  />
                  <p
                    className="font-mono-lidar"
                    style={{ fontSize: 9, color: card.accent, letterSpacing: "0.14em", marginBottom: 6 }}
                  >
                    {card.label}
                  </p>
                  <h2
                    className="font-mono-lidar font-bold"
                    style={{ fontSize: 15, color: card.accent, marginBottom: 6 }}
                  >
                    {card.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                    {card.body}
                  </p>
                  {/* status dot */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                    <motion.div
                      style={{ width: 6, height: 6, borderRadius: "50%", background: card.accent }}
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    <span
                      className="font-mono-lidar"
                      style={{ fontSize: 9, color: card.accent, letterSpacing: "0.1em" }}
                    >
                      ONLINE
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper hint */}
          <p
            className="font-mono-lidar text-center"
            style={{ fontSize: 9, color: "rgba(0,255,231,0.3)", marginTop: 8, letterSpacing: "0.1em" }}
          >
            ← SWIPE TO EXPLORE SYSTEM LAYERS →
          </p>
        </motion.div>

        {/* ══ CHAT PANEL ══════════════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-3xl flex flex-col relative z-10"
          style={{
            borderRadius: 16,
            border: "1px solid rgba(0,255,231,0.15)",
            background: "rgba(8,10,14,0.85)",
            backdropFilter: "blur(16px)",
            overflow: "hidden",
          }}
        >
          {/* Panel top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderBottom: "1px solid rgba(0,255,231,0.08)",
              background: "rgba(0,255,231,0.03)",
            }}
          >
            {["#ff6b6b", "#ffbe0b", "#00ffe7"].map((c, i) => (
              <div
                key={i}
                style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.7 }}
              />
            ))}
            <span
              className="font-mono-lidar"
              style={{ fontSize: 10, color: "rgba(0,255,231,0.4)", letterSpacing: "0.12em", marginLeft: 4 }}
            >
              LIDAR-BOT · TERMINAL
            </span>
            <motion.div
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}
            >
              <motion.div
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ffe7" }}
                animate={{ opacity: [1, 0.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span
                className="font-mono-lidar"
                style={{ fontSize: 9, color: "#00ffe7", letterSpacing: "0.1em" }}
              >
                CONNECTED
              </span>
            </motion.div>
          </div>

          {/* Messages */}
          <div
            className="messages-scroll"
            style={{
              minHeight: 340,
              maxHeight: "60vh",
              overflowY: "auto",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: m.role === "user" ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  flexDirection: m.role === "user" ? "row-reverse" : "row",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    border: m.role === "user"
                      ? "1px solid rgba(123,97,255,0.5)"
                      : "1px solid rgba(0,255,231,0.4)",
                    background: m.role === "user"
                      ? "rgba(123,97,255,0.15)"
                      : "rgba(0,255,231,0.08)",
                    color: m.role === "user" ? "#7b61ff" : "#00ffe7",
                  }}
                >
                  {m.role === "user" ? "OP" : "AI"}
                </div>

                {/* Bubble */}
                <div
                  className="font-mono-lidar"
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    maxWidth: "78%",
                    fontSize: 13,
                    lineHeight: 1.7,
                    border: m.role === "user"
                      ? "1px solid rgba(123,97,255,0.25)"
                      : "1px solid rgba(0,255,231,0.12)",
                    background: m.role === "user"
                      ? "rgba(123,97,255,0.1)"
                      : "rgba(0,255,231,0.04)",
                    color: m.role === "user" ? "#c4b5fd" : "#a7f3ef",
                  }}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 0",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: "1px solid rgba(0,255,231,0.4)",
                    background: "rgba(0,255,231,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontFamily: "'Space Mono', monospace",
                    color: "#00ffe7",
                  }}
                >
                  AI
                </div>
                <div
                  className="font-mono-lidar"
                  style={{
                    fontSize: 12,
                    color: "rgba(0,255,231,0.5)",
                    letterSpacing: "0.06em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    PROCESSING SENSOR DATA
                  </motion.span>
                  <span className="cursor-blink" style={{ color: "#00ffe7" }}>█</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input area ── */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(0,255,231,0.08)",
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "rgba(0,255,231,0.02)",
            }}
          >
            {/* Mic button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onMic}
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                flexShrink: 0,
                border: listening
                  ? "1px solid #ff6b6b"
                  : "1px solid rgba(0,255,231,0.25)",
                background: listening
                  ? "rgba(255,107,107,0.18)"
                  : "rgba(0,255,231,0.06)",
                color: listening ? "#ff6b6b" : "#00ffe7",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              {listening ? "■" : "🎙"}
            </motion.button>

            {/* Text input */}
            <input
              className="font-mono-lidar"
              style={{
                flex: 1,
                height: 42,
                borderRadius: 10,
                border: "1px solid rgba(0,255,231,0.2)",
                background: "rgba(0,255,231,0.04)",
                padding: "0 14px",
                fontSize: 12,
                color: "#e0f7f4",
                outline: "none",
                letterSpacing: "0.04em",
              }}
              placeholder="Query the sewer monitoring system..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) onSend();
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(0,255,231,0.5)";
                e.target.style.background = "rgba(0,255,231,0.07)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(0,255,231,0.2)";
                e.target.style.background = "rgba(0,255,231,0.04)";
              }}
            />

            {/* Send button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSend()}
              className="font-mono-lidar"
              style={{
                height: 42,
                padding: "0 18px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #00ffe7, #00c9ff)",
                color: "#080a0e",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: "0.08em",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
            >
              TRANSMIT ▶
            </motion.button>
          </div>
        </motion.section>
      </div>
    </>
  );
}