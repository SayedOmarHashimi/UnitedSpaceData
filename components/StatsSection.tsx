"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fetchStats } from "@/lib/supabase";
import { formatBytes } from "@/lib/utils";

interface Stats {
  documents: number;
  contributors: number;
  totalBytes: number;
  countries: number;
}

function AnimatedNumber({
  value,
  format,
  active,
}: {
  value: number;
  format: (n: number) => string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active || value === 0) return;
    const duration = 1400;
    const steps = 48;
    const inc = value / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += inc;
      if (cur >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(cur);
    }, duration / steps);
    return () => clearInterval(id);
  }, [active, value]);

  if (value === 0) return <span className="opacity-30">—</span>;
  return <span className="tabular-nums">{format(display)}</span>;
}

const METRICS = [
  {
    key: "documents" as const,
    label: "Documents",
    format: (n: number) => Math.floor(n).toLocaleString(),
    color: "#00D4FF",
  },
  {
    key: "contributors" as const,
    label: "Contributors",
    format: (n: number) => Math.floor(n).toLocaleString(),
    color: "#7C3AED",
  },
  {
    key: "totalBytes" as const,
    label: "Data Stored",
    format: (n: number) => formatBytes(Math.floor(n)),
    color: "#3B82F6",
  },
  {
    key: "countries" as const,
    label: "Countries",
    format: (n: number) => Math.floor(n).toLocaleString(),
    color: "#10B981",
  },
];

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !loading && stats?.documents === 0;

  return (
    <section id="stats" className="py-20 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="divider mb-16" />

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-10 w-24 mx-auto rounded-lg bg-white/6" />
                <div className="h-3 w-16 mx-auto rounded bg-white/6" />
              </div>
            ))}
          </div>
        )}

        {!loading && isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-4"
          >
            <p className="text-[var(--muted)] text-sm" style={{ fontFamily: "Roboto Mono, monospace" }}>
              No data yet — be the first to upload.
            </p>
            <a href="#upload" className="btn-primary mt-5 mx-auto">
              Upload Now
            </a>
          </motion.div>
        )}

        {!loading && stats && stats.documents > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
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
                  className="text-2xl md:text-4xl font-black mb-2"
                  style={{
                    fontFamily: "Orbitron, sans-serif",
                    color: m.color,
                  }}
                >
                  <AnimatedNumber
                    value={stats[m.key]}
                    format={m.format}
                    active={inView}
                  />
                </div>
                <p
                  className="text-xs tracking-wider uppercase"
                  style={{ fontFamily: "Roboto Mono, monospace", color: "var(--muted)" }}
                >
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
