"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import { CATEGORIES, type DocumentCategory } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Astronomy: "#00D4FF",
  Missions: "#3B82F6",
  Satellites: "#7C3AED",
  "Deep Space": "#A855F7",
  "Earth Observation": "#10B981",
  Research: "#F59E0B",
};

const FILE_TYPE_BG: Record<string, string> = {
  PDF: "rgba(248,113,113,0.12)",
  CSV: "rgba(52,211,153,0.12)",
  JSON: "rgba(251,191,36,0.12)",
  PNG: "rgba(96,165,250,0.12)",
  FITS: "rgba(167,139,250,0.12)",
  ZIP: "rgba(249,115,22,0.12)",
};
const FILE_TYPE_COLOR: Record<string, string> = {
  PDF: "#F87171", CSV: "#34D399", JSON: "#FBBF24",
  PNG: "#60A5FA", FITS: "#A78BFA", ZIP: "#F97316",
};

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

export default function DocumentLibrary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchCat = activeCategory === "All" || doc.category === activeCategory;
      const matchSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.contributor.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <section id="library" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-3">Document Archive</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2
              className="text-3xl md:text-4xl font-black text-white"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              Browse the Archive
            </h2>
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles, authors, tags…"
                className="input !pl-9 !text-xs"
              />
            </div>
          </div>
        </motion.div>

        {/* Category filter row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {(["All", ...CATEGORIES] as (DocumentCategory | "All")[]).map((cat) => {
            const isActive = activeCategory === cat;
            const color = cat === "All" ? "#00D4FF" : CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="cursor-pointer text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  background: isActive ? `${color}18` : "transparent",
                  border: `1px solid ${isActive ? color : "var(--border)"}`,
                  color: isActive ? color : "var(--muted-light)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Result count */}
        <p
          className="text-xs text-[var(--muted)] mb-6"
          style={{ fontFamily: "Roboto Mono, monospace" }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, idx) => {
            const catColor = CATEGORY_COLORS[doc.category] || "#00D4FF";
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="card group cursor-pointer p-5 flex flex-col gap-4"
              >
                {/* Top row: category + file type */}
                <div className="flex items-center justify-between">
                  <span
                    className="tag"
                    style={{
                      background: `${catColor}14`,
                      color: catColor,
                      border: `1px solid ${catColor}28`,
                    }}
                  >
                    {doc.category}
                  </span>
                  <span
                    className="tag"
                    style={{
                      background: FILE_TYPE_BG[doc.fileType] || "rgba(255,255,255,0.06)",
                      color: FILE_TYPE_COLOR[doc.fileType] || "#94A3B8",
                    }}
                  >
                    {doc.fileType}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-[#00D4FF] transition-colors duration-150">
                  {doc.title}
                </h3>

                {/* Meta */}
                <div
                  className="mt-auto pt-3 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div>
                    <p className="text-white text-xs font-medium truncate max-w-[120px]">{doc.contributor}</p>
                    <p className="text-[var(--muted)] text-xs mt-0.5">{formatDate(doc.uploadDate)}</p>
                  </div>
                  <button
                    className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 hover:bg-white/8"
                    style={{
                      color: catColor,
                      border: `1px solid ${catColor}28`,
                      background: `${catColor}0a`,
                    }}
                    aria-label={`Download ${doc.title}`}
                  >
                    <DownloadIcon />
                    {formatBytes(doc.fileSize)}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--muted)]">
            <p className="text-sm">No documents match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
