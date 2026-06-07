"use client";

import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Open Access",
    description: "All research is freely accessible to every human on Earth. Science belongs to everyone — from Cape Town to Reykjavik.",
    color: "#00D4FF",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Verified Sources",
    description: "Documents are reviewed for authenticity. We collaborate with space agencies, universities, and research institutions worldwide.",
    color: "#8B5CF6",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Real-Time Collaboration",
    description: "Scientists, students, and enthusiasts contribute and collaborate in real time across disciplines and borders.",
    color: "#F59E0B",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    title: "Permanent Storage",
    description: "Data is archived with redundant backups across multiple geographic regions. Space history preserved for generations.",
    color: "#10B981",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -left-48 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.6) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -right-48 top-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Mission statement */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full glass neon-border-cyan">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" style={{ boxShadow: "0 0 6px rgba(0,212,255,0.8)" }} />
              <span className="text-[#00D4FF] text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
                Our Mission
              </span>
            </div>

            <h2
              className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              KNOWLEDGE HAS
              <span className="block gradient-text">NO BORDERS</span>
            </h2>

            <p className="text-[#94A3B8] text-lg leading-relaxed mb-6">
              United Space Data was founded on a simple belief: the universe belongs to all of us.
              Space research shouldn&apos;t be locked behind paywalls or institutional barriers.
            </p>

            <p className="text-[#94A3B8] leading-relaxed mb-8">
              We&apos;re building the world&apos;s most comprehensive, accessible repository for space-related
              knowledge — from amateur astronomers&apos; observation logs to NASA mission telemetry.
              Every file uploaded here advances humanity&apos;s collective understanding of the cosmos.
            </p>

            {/* Agencies strip */}
            <div>
              <p className="text-xs text-[#475569] tracking-widest uppercase mb-3" style={{ fontFamily: "Roboto Mono, monospace" }}>
                Data from leading agencies
              </p>
              <div className="flex flex-wrap gap-2">
                {["NASA", "ESA", "ISRO", "JAXA", "CNSA", "Roscosmos", "SpaceX", "CSA"].map((agency) => (
                  <span
                    key={agency}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#94A3B8]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {agency}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Pillars grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-5 rounded-2xl cursor-default"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${pillar.color}15`, border: `1px solid ${pillar.color}30`, color: pillar.color }}
                >
                  {pillar.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{pillar.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{pillar.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <div className="text-[#00D4FF] text-4xl mb-4" style={{ fontFamily: "Georgia, serif", lineHeight: 1 }}>&ldquo;</div>
          <p className="text-xl sm:text-2xl text-white font-light italic leading-relaxed mb-4">
            Somewhere, something incredible is waiting to be known.
          </p>

          <footer className="text-[#94A3B8] text-sm">
            — Carl Sagan
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
