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
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6"
          style={{ borderTop: "1px solid rgba(10,22,40,0.1)" }}
        >
          {/* Wordmark */}
          <a
            href="#"
            className="cursor-pointer flex items-center gap-2 text-navy/40 hover:text-navy transition-colors duration-200"
            aria-label="United Space Data home"
          >
            <div className="relative w-5 h-5">
              <div
                className="absolute inset-0 rounded-full border border-navy/20"
                style={{ animation: "orbiting 12s linear infinite" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-navy/40" />
              </div>
            </div>
            <span className="text-xs font-semibold tracking-wide">
              United Space Data
            </span>
          </a>

          {/* Nav links */}
          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="cursor-pointer text-xs text-navy/40 hover:text-navy transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-navy/35">
            © {new Date().getFullYear()} United Space Data
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
