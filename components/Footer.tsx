"use client";

import { motion } from "framer-motion";

const LINKS = [
  { label: "Archive", href: "#library" },
  { label: "Upload", href: "#upload" },
  { label: "About", href: "#about" },
];

export default function Footer() {
  return (
    <footer className="px-6 pb-8 pt-2">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Wordmark */}
          <a
            href="#"
            className="cursor-pointer flex items-center gap-2 text-[var(--muted)] hover:text-white transition-colors duration-150"
            aria-label="United Space Data home"
          >
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.3)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#00D4FF]" />
              </div>
            </div>
            <span className="text-xs font-medium tracking-wide" style={{ fontFamily: "Orbitron, sans-serif" }}>
              United Space Data
            </span>
          </a>

          {/* 3 links */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="cursor-pointer text-xs text-[var(--muted)] hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: copyright + MIT */}
          <div className="flex items-center gap-3">
            <p className="text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} United Space Data
            </p>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                color: "#10B981",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                fontFamily: "Roboto Mono, monospace",
              }}
            >
              MIT
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
