"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Archive", href: "#library" },
  { label: "Upload", href: "#upload" },
  { label: "Stats", href: "#stats" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 1.8, ease: "easeOut" }}
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          : "glass"
      }`}
      style={{ fontFamily: "Exo 2, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.4)] group-hover:border-[rgba(0,212,255,0.8)] transition-colors duration-200" />
            <div className="absolute inset-1.5 rounded-full border border-[rgba(139,92,246,0.4)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#00D4FF]" style={{ boxShadow: "0 0 8px rgba(0,212,255,0.8)" }} />
            </div>
          </div>
          <span
            className="font-bold tracking-widest text-sm"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            <span style={{ color: "#00D4FF" }}>USD</span>
            <span className="text-white/60 text-xs ml-1">ARCHIVE</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#94A3B8] hover:text-[#00D4FF] transition-colors duration-200 tracking-wide cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#upload"
            className="cursor-pointer flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-black transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #00D4FF, #3B82F6)",
              boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Data
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden cursor-pointer text-[#94A3B8] hover:text-white transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/8 px-6 pb-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[#94A3B8] hover:text-[#00D4FF] transition-colors cursor-pointer tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#upload"
              onClick={() => setMenuOpen(false)}
              className="block mt-2 text-center px-5 py-2 rounded-xl text-sm font-semibold text-black cursor-pointer"
              style={{ background: "linear-gradient(135deg, #00D4FF, #3B82F6)" }}
            >
              Upload Data
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
