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
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(245,240,232,0.96)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(10,22,40,0.1)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      <div className="container-wide h-16 flex items-center justify-between">
        {/* Wordmark */}
        <a href="#" className="cursor-pointer flex items-center gap-2.5 group" aria-label="United Space Data">
          {/* Minimal orbit glyph */}
          <div className="relative w-6 h-6 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full border border-navy/20 group-hover:border-navy/40 transition-colors duration-300"
              style={{ animation: "orbiting 10s linear infinite" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-1.5 h-1.5 rounded-full bg-navy/60 group-hover:bg-sky transition-colors duration-300"
                style={{ animation: "pulseOpacity 3s ease-in-out infinite" }}
              />
            </div>
          </div>
          <span
            className="font-bold text-sm tracking-wide text-navy"
            style={{ letterSpacing: "0.04em" }}
          >
            United Space Data
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="nav-link cursor-pointer">
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <a href="#upload" className="btn-primary !py-2.5 !px-5 !text-xs">
            Upload Data
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden cursor-pointer w-9 h-9 flex items-center justify-center rounded-lg text-navy hover:bg-navy/6 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{ background: "rgba(245,240,232,0.98)", borderTop: "1px solid rgba(10,22,40,0.1)" }}
          >
            <div className="container-wide py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer py-3 px-2 text-sm font-medium text-navy hover:text-sky transition-colors border-b border-navy/6 last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#upload"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-3 justify-center"
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
