"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// In a live app these would come from Supabase.
// For now: null means "not yet loaded"; 0 means genuinely empty.
interface LiveStats {
  documents: number | null;
  contributors: number | null;
  countries: number | null;
}

function useStats(): LiveStats {
  const [stats, setStats] = useState<LiveStats>({
    documents: null,
    contributors: null,
    countries: null,
  });

  useEffect(() => {
    // Replace this with a real Supabase query:
    // const { count } = await supabase.from('documents').select('*', { count: 'exact', head: true });
    // Returning 0 to show "Be the first to upload" state cleanly.
    setStats({ documents: 0, contributors: 0, countries: 0 });
  }, []);

  return stats;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || value === 0) return;
    const duration = 1600;
    const steps = 50;
    const inc = value / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(id);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value === 0 ? "—" : display.toLocaleString()}{value > 0 ? suffix : ""}
    </span>
  );
}

const METRICS = [
  { key: "documents" as const, label: "Documents archived", suffix: "" },
  { key: "contributors" as const, label: "Contributors", suffix: "" },
  { key: "countries" as const, label: "Countries", suffix: "" },
];

export default function StatsSection() {
  const stats = useStats();
  const isEmpty = stats.documents === 0 && stats.contributors === 0;

  return (
    <section id="stats" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="divider mb-16" />

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <p className="text-[var(--muted)] text-sm" style={{ fontFamily: "Roboto Mono, monospace" }}>
              No data yet — be the first to upload.
            </p>
            <a href="#upload" className="btn-primary mt-6 mx-auto">
              Upload Now
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div
                  className="text-3xl md:text-5xl font-black text-white mb-2"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  {stats[m.key] === null ? (
                    <span className="opacity-20">—</span>
                  ) : (
                    <AnimatedNumber value={stats[m.key]!} suffix={m.suffix} />
                  )}
                </div>
                <p className="text-[var(--muted)] text-xs tracking-wider uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="divider mt-16" />
      </div>
    </section>
  );
}
