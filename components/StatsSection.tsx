"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  {
    value: 142847,
    label: "Documents Archived",
    suffix: "",
    prefix: "",
    color: "#00D4FF",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
      </svg>
    ),
  },
  {
    value: 89,
    label: "Countries Represented",
    suffix: "",
    prefix: "",
    color: "#8B5CF6",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    value: 4.2,
    label: "Terabytes of Data",
    suffix: " TB",
    prefix: "",
    color: "#3B82F6",
    decimals: 1,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    value: 28634,
    label: "Active Contributors",
    suffix: "",
    prefix: "",
    color: "#F59E0B",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
];

function Counter({ value, suffix = "", decimals = 0, color, active }: {
  value: number; suffix?: string; decimals?: number; color: string; active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(interval);
      } else {
        setDisplay(current);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [active, value]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.floor(display).toLocaleString();

  return (
    <span style={{ color, fontFamily: "Orbitron, sans-serif", textShadow: `0 0 20px ${color}50` }}>
      {formatted}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stats" className="py-24 px-4 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.5) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full glass neon-border-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" style={{ boxShadow: "0 0 6px rgba(59,130,246,0.8)" }} />
            <span className="text-[#3B82F6] text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
              Mission Status
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            ARCHIVE AT A
            <span className="gradient-text"> GLANCE</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group rounded-2xl p-6 text-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Glow background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${stat.color}10 0%, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 relative z-10"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30`, color: stat.color }}
              >
                {stat.icon}
              </div>

              {/* Number */}
              <div className="text-4xl font-black mb-2 relative z-10">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={(stat as { decimals?: number }).decimals}
                  color={stat.color}
                  active={inView}
                />
              </div>

              {/* Label */}
              <p className="text-[#94A3B8] text-sm tracking-wide relative z-10">{stat.label}</p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 transition-all duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Mission log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" style={{ boxShadow: "0 0 6px rgba(0,212,255,0.8)" }} />
            <span className="text-xs text-[#94A3B8] tracking-widest uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
              Recent Activity Feed
            </span>
          </div>
          <div className="space-y-2">
            {[
              { time: "2 min ago", action: "New upload", title: "Voyager 1 Plasma Wave Data 2024", country: "🇺🇸" },
              { time: "14 min ago", action: "Download", title: "Webb Telescope CEERS Survey", country: "🇩🇪" },
              { time: "31 min ago", action: "New upload", title: "ISRO MOM-2 Mission Parameters", country: "🇮🇳" },
              { time: "1 hr ago", action: "New upload", title: "Antarctic Ice Shelf Radar Survey", country: "🇦🇺" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1.5" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span className="text-[#475569] text-xs w-20 flex-shrink-0" style={{ fontFamily: "Roboto Mono, monospace" }}>{item.time}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded flex-shrink-0"
                  style={{
                    background: item.action === "New upload" ? "rgba(0,212,255,0.1)" : "rgba(139,92,246,0.1)",
                    color: item.action === "New upload" ? "#00D4FF" : "#8B5CF6",
                    border: `1px solid ${item.action === "New upload" ? "rgba(0,212,255,0.2)" : "rgba(139,92,246,0.2)"}`,
                  }}
                >
                  {item.action}
                </span>
                <span className="text-white text-xs flex-1 truncate">{item.title}</span>
                <span className="text-base flex-shrink-0">{item.country}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
