"use client";

import { motion } from "framer-motion";

const PRINCIPLES = [
  {
    title: "Open by default.",
    body: "Every document is freely accessible to anyone in the world — no account required, no paywall, no embargo.",
    color: "#00D4FF",
  },
  {
    title: "Permanent storage.",
    body: "Files are archived with redundant geographic backups. Contributions made today are preserved for future generations.",
    color: "#7C3AED",
  },
  {
    title: "Community-driven.",
    body: "From amateur astronomers to institutional researchers — anyone can contribute, download, and build on the data here.",
    color: "#3B82F6",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="divider mb-16" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="section-label mb-4">About</p>
            <h2
              className="text-3xl md:text-4xl font-black text-white leading-tight mb-6"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Built for the global<br />
              <span className="gradient-text">space community.</span>
            </h2>
            <p className="text-[var(--muted-light)] text-sm leading-relaxed">
              United Space Data is an open-access repository for space-related knowledge.
              We believe scientific data — from mission telemetry to observation logs — belongs to everyone,
              not just to institutions with subscriptions.
            </p>
          </motion.div>

          {/* Right: 3 principles */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-px"
          >
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex gap-4 py-5"
                style={{ borderBottom: i < PRINCIPLES.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <div
                  className="w-1 rounded-full flex-shrink-0 mt-1 h-4"
                  style={{ background: p.color }}
                />
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1.5">{p.title}</h3>
                  <p className="text-[var(--muted-light)] text-sm leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="divider mt-16" />
      </div>
    </section>
  );
}
