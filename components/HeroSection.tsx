"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const StarField = dynamic(() => import("./StarField"), { ssr: false });


export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid"
    >
      {/* 3D Star field background */}
      <StarField />

      {/* Radial glow overlays */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(0,212,255,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, transparent 70%)" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass neon-border-cyan"
        >
          <span
            className="w-2 h-2 rounded-full bg-[#00D4FF]"
            style={{ boxShadow: "0 0 8px rgba(0,212,255,0.8)", animation: "pulseGlow 2s ease-in-out infinite" }}
          />
          <span className="text-[#00D4FF] text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
            Open Access · Global Repository
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.8, ease: "easeOut" }}
          className="mb-6"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          <span className="block text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight">
            THE WORLD&apos;S
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight gradient-text">
            SPACE DATA
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight">
            ARCHIVE
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.6 }}
          className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "Exo 2, sans-serif" }}
        >
          Upload, discover, and share space research, mission data, astronomical observations, and scientific papers.
          Open knowledge for humanity — from Earth to the edge of the cosmos.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#upload"
            className="cursor-pointer group flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-black transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #00D4FF 0%, #3B82F6 50%, #8B5CF6 100%)",
              boxShadow: "0 0 30px rgba(0,212,255,0.4), 0 8px 32px rgba(0,0,0,0.3)",
              fontFamily: "Exo 2, sans-serif",
            }}
          >
            <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Your Data
          </a>
          <a
            href="#library"
            className="cursor-pointer flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 glass neon-border-cyan"
            style={{ fontFamily: "Exo 2, sans-serif" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explore Archive
          </a>
        </motion.div>

        {/* Floating stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto"
        >
          {[
            { value: "142K+", label: "Documents" },
            { value: "89", label: "Countries" },
            { value: "4.2 TB", label: "Data Stored" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-black text-[#00D4FF] glow-cyan"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-[#94A3B8] mt-1 tracking-wider uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ delay: 3.8, y: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-[#94A3B8]">
            <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-[#00D4FF] to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
