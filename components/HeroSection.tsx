"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/types";

const StarField = dynamic(() => import("./StarField"), { ssr: false });

const LINE_1 = ["Space", "data,"];
const LINE_2 = ["open", "to", "everyone."];
const WORD_BASE_DELAY = 2.1;
const WORD_STAGGER = 0.09;

// Per-category tag colors — mirrors DocumentLibrary's palette (navy/sky/sand tokens)
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Astronomy:           { bg: "rgba(74,144,217,0.08)", text: "#2952A3", border: "rgba(74,144,217,0.25)" },
  Missions:            { bg: "rgba(27,58,107,0.08)",  text: "#1B3A6B", border: "rgba(27,58,107,0.2)" },
  Satellites:          { bg: "rgba(41,82,163,0.08)",  text: "#2952A3", border: "rgba(41,82,163,0.2)" },
  "Deep Space":        { bg: "rgba(10,22,40,0.06)",   text: "#0A1628", border: "rgba(10,22,40,0.15)" },
  "Earth Observation": { bg: "rgba(74,144,217,0.1)",  text: "#2F6BB8", border: "rgba(74,144,217,0.3)" },
  Research:            { bg: "rgba(27,58,107,0.07)",  text: "#1B3A6B", border: "rgba(27,58,107,0.18)" },
};
const TAG_FALLBACK = { bg: "rgba(10,22,40,0.06)", text: "#1B3A6B", border: "rgba(10,22,40,0.15)" };

function RevealWord({ word, index, accent }: { word: string; index: number; accent?: boolean }) {
  return (
    <motion.span
      className={`inline-block ${accent ? "text-gradient-navy" : ""}`}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: WORD_BASE_DELAY + index * WORD_STAGGER,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {word}
      {" "}
    </motion.span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Content drifts up and fades as the user scrolls past the hero
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const starsY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: starsY }}>
        <StarField />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-16"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-8 bg-sky/50 origin-right"
          />
          <span className="section-label">Open Access Space Repository</span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2.0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-8 bg-sky/50 origin-left"
          />
        </motion.div>

        {/* Headline — word-by-word blur reveal */}
        <h1 className="text-display font-bold text-navy mb-6">
          <span className="block">
            {LINE_1.map((word, i) => (
              <RevealWord key={word} word={word} index={i} />
            ))}
          </span>
          <span className="block">
            {LINE_2.map((word, i) => (
              <RevealWord key={word} word={word} index={LINE_1.length + i} accent />
            ))}
          </span>
        </h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-navy/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Browse and share mission files, astronomy datasets, and research
          papers — no account needed.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.a
            href="#upload"
            className="btn-primary !py-3.5 !px-8 !text-sm group"
            whileTap={{ scale: 0.97 }}
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Data
          </motion.a>
          <motion.a
            href="#library"
            className="btn-secondary !py-3.5 !px-8 !text-sm group"
            whileTap={{ scale: 0.97 }}
          >
            Browse Archive
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Category tags */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2 justify-center mt-9"
        >
          {CATEGORIES.map((cat) => {
            const c = TAG_COLORS[cat] ?? TAG_FALLBACK;
            return (
              <span
                key={cat}
                className="tag"
                style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
              >
                {cat}
              </span>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator — capsule with traveling dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.8 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        aria-hidden="true"
      >
        <div
          className="w-[22px] h-[38px] rounded-full flex justify-center pt-2"
          style={{ border: "1.5px solid rgba(10,22,40,0.22)" }}
        >
          <div
            className="w-1 h-1 rounded-full bg-navy/50"
            style={{ animation: "scrollDot 2.2s ease-in-out infinite" }}
          />
        </div>
        <span
          className="text-[0.6rem] tracking-[0.2em] uppercase text-navy/35"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
