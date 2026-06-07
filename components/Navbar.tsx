"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Archive", href: "#library" },
  { label: "Upload", href: "#upload" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[var(--border)] backdrop-blur-xl bg-[rgba(2,4,8,0.85)]" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="#"
          className="cursor-pointer group flex items-center gap-2.5"
          aria-label="United Space Data home"
        >
          {/* Minimal orbit mark */}
          <div className="relative w-7 h-7 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.35)] group-hover:border-[rgba(0,212,255,0.65)] transition-colors duration-200"
              style={{ animation: "orbitRing 8s linear infinite" }}
            />
            <div className="absolute inset-[5px] rounded-full border border-[rgba(0,212,255,0.2)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]"
                style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
              />
            </div>
          </div>
          <span
            className="text-white font-semibold text-sm tracking-wide"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            United Space Data
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-[var(--muted-light)] hover:text-white transition-colors duration-150 cursor-pointer rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#upload"
            className="btn-primary ml-4 !py-2.5 !px-5 text-xs"
          >
            Upload Data
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg text-[var(--muted-light)] hover:text-white hover:bg-white/5 transition-all"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-[var(--border)] bg-[rgba(2,4,8,0.95)] backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 text-sm text-[var(--muted-light)] hover:text-white cursor-pointer rounded-lg hover:bg-white/5 transition-all"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#upload"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-2 justify-center"
              >
                Upload Data
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
