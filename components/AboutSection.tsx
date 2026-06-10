"use client";

import { motion } from "framer-motion";

const PRINCIPLES = [
  {
    title: "Open by default.",
    body: "Every document is freely accessible to anyone in the world — no account required, no paywall, no embargo.",
  },
  {
    title: "Permanent storage.",
    body: "Files are archived with redundant geographic backups. Contributions made today are preserved for future generations.",
  },
  {
    title: "Community-driven.",
    body: "From amateur astronomers to institutional researchers — anyone can contribute, download, and build on the data here.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="container-wide">
        <div className="divider mb-16" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-8 bg-sky/60 origin-left"
              />
              <p className="section-label">About</p>
            </div>
            <h2 className="text-headline font-bold text-navy leading-tight mb-6">
              Built for the global<br />
              space community.
            </h2>
            <p className="text-navy/55 text-sm leading-relaxed">
              United Space Data is an open-access repository for space-related knowledge.
              We believe scientific data — from mission telemetry to observation logs — belongs
              to everyone, not just to institutions with subscriptions.
            </p>
          </motion.div>

          {/* Right: 3 principles */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-px"
          >
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4 }}
                className="group flex gap-5 py-5"
                style={{ borderBottom: i < PRINCIPLES.length - 1 ? "1px solid rgba(10,22,40,0.08)" : "none" }}
              >
                <div
                  className="w-0.5 rounded-full flex-shrink-0 mt-1 self-stretch transition-all duration-300 group-hover:w-1"
                  style={{ background: "linear-gradient(to bottom, #4A90D9, #2952A3)" }}
                />
                <div>
                  <h3 className="text-navy font-semibold text-sm mb-1.5 transition-colors duration-300 group-hover:text-navy-mid">
                    {p.title}
                  </h3>
                  <p className="text-navy/55 text-sm leading-relaxed">{p.body}</p>
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
