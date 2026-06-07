"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 400);
          return 100;
        }
        return p + Math.random() * 18 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Orbit rings */}
          <div className="relative w-32 h-32 mb-8">
            <div
              className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.2)]"
              style={{ animation: "orbitRing 4s linear infinite" }}
            />
            <div
              className="absolute inset-4 rounded-full border border-[rgba(139,92,246,0.3)]"
              style={{ animation: "orbitRing 3s linear infinite reverse" }}
            />
            <div
              className="absolute inset-8 rounded-full border border-[rgba(0,212,255,0.5)]"
              style={{ animation: "orbitRing 2s linear infinite" }}
            />
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-4 h-4 rounded-full bg-[#00D4FF]"
                style={{
                  boxShadow: "0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4)",
                  animation: "pulseGlow 1.5s ease-in-out infinite",
                }}
              />
            </div>
            {/* Orbiting particle */}
            <div
              className="absolute top-1/2 left-1/2 w-2 h-2"
              style={{
                transform: "translate(-50%, -50%)",
                animation: "orbitRing 2.5s linear infinite",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            </div>
          </div>

          {/* Logo text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1
              className="font-orbitron text-2xl font-bold tracking-widest"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              <span style={{ color: "#00D4FF" }}>UNITED</span>{" "}
              <span className="text-white">SPACE</span>{" "}
              <span style={{ color: "#8B5CF6" }}>DATA</span>
            </h1>
            <p className="text-[#94A3B8] text-xs tracking-[0.3em] mt-1 uppercase">
              Initializing Archive Systems
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 h-px bg-[rgba(255,255,255,0.1)] relative overflow-hidden">
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #00D4FF, #8B5CF6)",
                boxShadow: "0 0 10px rgba(0,212,255,0.6)",
                width: `${Math.min(progress, 100)}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-[#94A3B8] text-xs mt-2" style={{ fontFamily: "Roboto Mono, monospace" }}>
            {Math.min(Math.round(progress), 100)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
