"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const StarField = dynamic(() => import("./StarField"), { ssr: false });

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center grid-bg overflow-hidden"
    >
      <StarField />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-16">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <div className="w-1 h-1 rounded-full bg-sky" />
          <span className="section-label">Open Access Space Repository</span>
          <div className="w-1 h-1 rounded-full bg-sky" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-display font-bold text-navy mb-6"
        >
          Space knowledge,{" "}
          <br className="hidden sm:block" />
          <span className="text-navy-mid">open to all.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-navy/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Upload and discover space research, mission data, and astronomical
          observations — freely shared with the global community.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a href="#upload" className="btn-primary !py-3.5 !px-8 !text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Data
          </a>
          <a href="#library" className="btn-secondary !py-3.5 !px-8 !text-sm">
            Browse Archive
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>

        {/* Scroll nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-navy/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
