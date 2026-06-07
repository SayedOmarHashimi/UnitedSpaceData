"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 22 + 6;
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setVisible(false), 300);
          return 100;
        }
        return next;
      });
    }, 110);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020408]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Minimal orbit mark */}
          <div className="relative w-20 h-20 mb-8">
            <div
              className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.2)]"
              style={{ animation: "orbitRing 5s linear infinite" }}
            />
            <div
              className="absolute inset-3 rounded-full border border-[rgba(0,212,255,0.1)]"
              style={{ animation: "orbitRing 3s linear infinite reverse" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]"
                style={{
                  boxShadow: "0 0 16px rgba(0,212,255,0.7)",
                  animation: "pulseGlow 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white font-semibold text-sm tracking-widest mb-6"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            UNITED SPACE DATA
          </motion.p>

          {/* Progress track */}
          <div className="w-40 h-px bg-white/8 overflow-hidden rounded-full">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #00D4FF, #7C3AED)",
                width: `${Math.min(progress, 100)}%`,
              }}
              transition={{ duration: 0.08 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
