"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { fetchDocuments, incrementDownload, type DbDocument } from "@/lib/supabase";
import { CATEGORIES, type DocumentCategory } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Astronomy:          { bg: "rgba(74,144,217,0.08)",  text: "#2952A3", border: "rgba(74,144,217,0.25)" },
  Missions:           { bg: "rgba(27,58,107,0.08)",   text: "#1B3A6B", border: "rgba(27,58,107,0.2)" },
  Satellites:         { bg: "rgba(41,82,163,0.08)",   text: "#2952A3", border: "rgba(41,82,163,0.2)" },
  "Deep Space":       { bg: "rgba(10,22,40,0.06)",    text: "#0A1628", border: "rgba(10,22,40,0.15)" },
  "Earth Observation":{ bg: "rgba(74,144,217,0.1)",   text: "#2F6BB8", border: "rgba(74,144,217,0.3)" },
  Research:           { bg: "rgba(27,58,107,0.07)",   text: "#1B3A6B", border: "rgba(27,58,107,0.18)" },
};

const FALLBACK_COLORS = { bg: "rgba(10,22,40,0.06)", text: "#1B3A6B", border: "rgba(10,22,40,0.15)" };

function Skeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-5 w-24 rounded bg-navy/6" />
        <div className="h-5 w-12 rounded bg-navy/6" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-navy/6" />
        <div className="h-4 w-3/4 rounded bg-navy/6" />
      </div>
      <div className="mt-auto pt-3 flex justify-between" style={{ borderTop: "1px solid rgba(10,22,40,0.1)" }}>
        <div className="h-4 w-28 rounded bg-navy/6" />
        <div className="h-7 w-24 rounded-lg bg-navy/6" />
      </div>
    </div>
  );
}

export default function DocumentLibrary() {
  const [docs, setDocs] = useState<DbDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | "All">("All");

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchDocuments();
      console.log("[DocumentLibrary] fetched", rows.length, "documents", rows);
      setDocs(rows);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[DocumentLibrary] fetch failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
    // Re-fetch whenever UploadPortal finishes a successful upload
    window.addEventListener("usd:document-uploaded", loadDocuments);
    return () => window.removeEventListener("usd:document-uploaded", loadDocuments);
  }, [loadDocuments]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return docs.filter((doc) => {
      const matchCat = activeCategory === "All" || doc.category === activeCategory;
      const matchSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.contributor.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [docs, search, activeCategory]);

  const handleDownload = async (doc: DbDocument) => {
    incrementDownload(doc.id).catch(() => {});
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
    setDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, download_count: d.download_count + 1 } : d))
    );
  };

  return (
    <section id="library" className="py-20 px-6">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="section-label mb-3">Document Archive</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-headline font-bold text-navy">Browse the Archive</h2>
              <button
                onClick={loadDocuments}
                disabled={loading}
                className="cursor-pointer p-1.5 rounded-lg text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors disabled:opacity-30"
                aria-label="Refresh archive"
                title="Refresh"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="relative max-w-xs w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles, authors…"
                className="input !pl-9 !text-xs"
              />
            </div>
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {(["All", ...CATEGORIES] as (DocumentCategory | "All")[]).map((cat) => {
            const isActive = activeCategory === cat;
            const colors = cat === "All"
              ? { bg: "rgba(74,144,217,0.1)", text: "#2F6BB8", border: "rgba(74,144,217,0.3)" }
              : (CATEGORY_COLORS[cat] ?? FALLBACK_COLORS);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="cursor-pointer text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  background: isActive ? colors.bg : "transparent",
                  border: `1px solid ${isActive ? colors.border : "rgba(10,22,40,0.12)"}`,
                  color: isActive ? colors.text : "rgba(10,22,40,0.45)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 px-4 py-4 rounded-xl"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
          >
            <p className="text-sm font-semibold text-red-600 mb-1">Failed to load documents</p>
            <p className="text-xs text-red-500 font-mono break-all mb-3">{error}</p>
            <button
              onClick={loadDocuments}
              className="text-xs font-semibold text-red-600 underline underline-offset-2 hover:text-red-700 cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {/* Result count */}
        {!loading && !error && (
          <p
            className="text-xs text-navy/40 mb-6"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-navy/45">
              {docs.length === 0
                ? "No documents yet — be the first to upload."
                : "No documents match your search."}
            </p>
            {docs.length === 0 && (
              <a href="#upload" className="btn-primary mt-6 mx-auto">
                Upload Now
              </a>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc, idx) => {
              const colors = CATEGORY_COLORS[doc.category] ?? FALLBACK_COLORS;
              const ftType = doc.file_type ?? "FILE";
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="card group cursor-default p-5 flex flex-col gap-4"
                  style={{ background: "#FDFAF5" }}
                >
                  {/* Top: category + file type */}
                  <div className="flex items-center justify-between">
                    <span
                      className="tag"
                      style={{
                        background: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {doc.category}
                    </span>
                    <span
                      className="tag"
                      style={{
                        background: "rgba(10,22,40,0.05)",
                        color: "rgba(10,22,40,0.5)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {ftType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-navy text-sm font-semibold leading-snug line-clamp-2 group-hover:text-sky transition-colors duration-200">
                    {doc.title}
                  </h3>

                  {/* Footer */}
                  <div
                    className="mt-auto pt-3 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(10,22,40,0.08)" }}
                  >
                    <div>
                      <p className="text-navy text-xs font-medium truncate max-w-[120px]">
                        {doc.contributor}
                      </p>
                      <p className="text-navy/40 text-xs mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="btn-primary !py-1.5 !px-3 !text-xs !gap-1.5"
                      aria-label={`Download ${doc.title}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {doc.file_size ? formatBytes(doc.file_size) : "Download"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
