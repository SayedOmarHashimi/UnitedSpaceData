"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MOCK_DOCUMENTS } from "@/lib/mock-data";
import { CATEGORIES, type DocumentCategory } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Astronomy: "#00D4FF",
  Missions: "#3B82F6",
  Satellites: "#8B5CF6",
  "Deep Space": "#A855F7",
  "Earth Observation": "#10B981",
  Research: "#F59E0B",
};

const fileTypeColors: Record<string, string> = {
  PDF: "#F87171",
  CSV: "#34D399",
  JSON: "#FBBF24",
  PNG: "#60A5FA",
  FITS: "#A78BFA",
  ZIP: "#F97316",
};

export default function DocumentLibrary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | "All">("All");

  const filtered = useMemo(() => {
    return MOCK_DOCUMENTS.filter((doc) => {
      const matchCat = activeCategory === "All" || doc.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q)) ||
        doc.contributor.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <section id="library" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full glass neon-border-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" style={{ boxShadow: "0 0 6px rgba(0,212,255,0.8)" }} />
            <span className="text-[#00D4FF] text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
              Document Archive
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            EXPLORE THE
            <span className="gradient-text"> COSMOS</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-lg mx-auto">
            Thousands of documents from researchers, agencies, and scientists worldwide.
          </p>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents, authors, tags..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm text-white placeholder-[#475569] outline-none focus:ring-1 focus:ring-[rgba(0,212,255,0.4)] transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "Exo 2, sans-serif",
              }}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory("All")}
              className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: activeCategory === "All" ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeCategory === "All" ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: activeCategory === "All" ? "#00D4FF" : "#94A3B8",
              }}
            >
              All ({MOCK_DOCUMENTS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = MOCK_DOCUMENTS.filter((d) => d.category === cat).length;
              const color = categoryColors[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? `${color}22` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${activeCategory === cat ? color : "rgba(255,255,255,0.08)"}`,
                    color: activeCategory === cat ? color : "#94A3B8",
                    boxShadow: activeCategory === cat ? `0 0 12px ${color}44` : "none",
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-6 text-[#94A3B8] text-sm" style={{ fontFamily: "Roboto Mono, monospace" }}>
          {filtered.length} document{filtered.length !== 1 ? "s" : ""} found
        </div>

        {/* Document grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc, idx) => {
            const color = categoryColors[doc.category] || "#00D4FF";
            const ftColor = fileTypeColors[doc.fileType] || "#94A3B8";
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group cursor-pointer rounded-2xl p-5 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 20px ${color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
                  >
                    {doc.category}
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ background: `${ftColor}18`, color: ftColor, border: `1px solid ${ftColor}30` }}
                  >
                    {doc.fileType}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#00D4FF] transition-colors duration-200">
                  {doc.title}
                </h3>

                {/* Description */}
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-4 line-clamp-3">
                  {doc.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {doc.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs text-[#94A3B8]"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <p className="text-xs font-medium text-white truncate max-w-[140px]">{doc.contributor}</p>
                    <p className="text-xs text-[#475569]">{doc.country} · {formatDate(doc.uploadDate)}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {doc.downloads.toLocaleString()}
                    </span>
                    <span>{formatBytes(doc.fileSize)}</span>
                  </div>
                </div>

                {/* Download button */}
                <button
                  className="cursor-pointer mt-3 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-[1.02]"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    color,
                  }}
                >
                  Download Document
                </button>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#94A3B8]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg">No documents match your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
