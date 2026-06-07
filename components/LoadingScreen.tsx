"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 24 + 8;
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setVisible(false), 350);
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#F5F0E8" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Minimal orbit mark */}
          <div className="relative w-16 h-16 mb-8">
            <div
              className="absolute inset-0 rounded-full border border-navy/15"
              style={{ animation: "orbiting 6s linear infinite" }}
            />
            <div
              className="absolute inset-[5px] rounded-full border border-sky/30"
              style={{ animation: "orbiting 4s linear infinite reverse" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-2 h-2 rounded-full bg-navy/50"
                style={{ animation: "pulseOpacity 2s ease-in-out infinite" }}
              />
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="font-bold text-xs tracking-[0.25em] text-navy/60 mb-8 uppercase"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            United Space Data
          </motion.p>

          {/* Progress track */}
          <div className="w-32 h-px overflow-hidden" style={{ background: "rgba(10,22,40,0.1)" }}>
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #4A90D9, #2952A3)",
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
