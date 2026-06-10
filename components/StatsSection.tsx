"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
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
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [active, value]);

  if (value === 0) return <span className="opacity-30">—</span>;
  return <span className="tabular-nums">{format(display)}</span>;
}

const METRICS = [
  {
    key: "documents" as const,
    label: "Documents",
    format: (n: number) => Math.floor(n).toLocaleString(),
  },
  {
    key: "contributors" as const,
    label: "Contributors",
    format: (n: number) => Math.floor(n).toLocaleString(),
  },
  {
    key: "totalBytes" as const,
    label: "Data Stored",
    format: (n: number) => formatBytes(Math.floor(n)),
  },
  {
    key: "countries" as const,
    label: "Countries",
    format: (n: number) => Math.floor(n).toLocaleString(),
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
      <div className="container-wide">
        <div className="divider mb-16" />

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-9 w-20 mx-auto rounded bg-navy/8" />
                <div className="h-3 w-16 mx-auto rounded bg-navy/8" />
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
            <p
              className="text-navy/45 text-sm"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              No data yet — be the first to upload.
            </p>
            <a href="#upload" className="btn-primary mt-5 mx-auto">
              Upload Now
            </a>
          </motion.div>
        )}

        {!loading && stats && stats.documents > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="text-center md:border-r md:last:border-r-0 border-navy/10 md:px-8"
              >
                <div className="text-2xl md:text-4xl font-bold text-navy mb-2 tracking-tight">
                  <AnimatedNumber
                    value={stats[m.key]}
                    format={m.format}
                    active={inView}
                  />
                </div>
                <p
                  className="text-xs tracking-[0.12em] uppercase text-navy/45"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
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
