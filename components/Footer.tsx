"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const FOOTER_LINKS = {
  Archive: ["Browse Documents", "Recent Uploads", "Top Downloads", "Categories", "Search"],
  Research: ["Astronomy", "Deep Space", "Earth Observation", "Missions", "Satellites"],
  Community: ["Upload Data", "Contribute", "API Access", "Newsletter", "Forum"],
  About: ["Mission", "Team", "Partners", "Open Source", "Contact"],
};

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.128 18.117a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative pt-20 pb-8 px-4 border-t border-white/[0.06]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top row */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border border-[rgba(0,212,255,0.4)]" />
                <div className="absolute inset-2 rounded-full border border-[rgba(139,92,246,0.4)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" style={{ boxShadow: "0 0 10px rgba(0,212,255,0.8)" }} />
                </div>
              </div>
              <div>
                <div
                  className="font-black text-lg tracking-widest"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  <span style={{ color: "#00D4FF" }}>UNITED</span>{" "}
                  <span className="text-white">SPACE DATA</span>
                </div>
                <div className="text-[#475569] text-xs tracking-widest" style={{ fontFamily: "Roboto Mono, monospace" }}>
                  GLOBAL ARCHIVE
                </div>
              </div>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 max-w-xs">
              Open-access space data for all of humanity. Bridging the cosmos and every curious mind on Earth.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs text-[#94A3B8] uppercase tracking-widest mb-3" style={{ fontFamily: "Roboto Mono, monospace" }}>
                Mission Updates
              </p>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-[#10B981] text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  You&apos;re in — welcome to the mission.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-3 py-2 rounded-xl text-sm text-white placeholder-[#475569] outline-none focus:ring-1 focus:ring-[rgba(0,212,255,0.4)]"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Exo 2, sans-serif" }}
                  />
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold text-black transition-all duration-200 hover:scale-105 flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #00D4FF, #3B82F6)" }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-white text-sm font-bold mb-4 tracking-wider"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="cursor-pointer text-sm text-[#94A3B8] hover:text-[#00D4FF] transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[#475569] text-xs" style={{ fontFamily: "Roboto Mono, monospace" }}>
            © 2024 United Space Data. Open-access under MIT License.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center text-[#94A3B8] hover:text-white transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p className="text-[#475569] text-xs" style={{ fontFamily: "Roboto Mono, monospace" }}>
            v2.4.1 · 99.97% uptime
          </p>
        </div>
      </div>
    </footer>
  );
}
