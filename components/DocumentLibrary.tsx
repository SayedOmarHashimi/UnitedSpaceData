"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

type ViewMode = "console" | "grid" | "reading";
type SortKey = "downloads" | "date" | "size" | "title";
type SortDir = "asc" | "desc";

function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Skeleton({ view }: { view: ViewMode }) {
  if (view === "console") {
    return (
      <div className="animate-pulse" style={{ padding: "14px 28px", borderBottom: "1px solid rgba(10,22,40,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 150px 78px 70px 90px", gap: "14px", alignItems: "center" }}>
          <div className="h-4 w-8 rounded bg-navy/6" />
          <div className="h-4 w-3/4 rounded bg-navy/6" />
          <div className="h-4 w-24 rounded bg-navy/6" />
          <div className="h-4 w-12 rounded bg-navy/6" />
          <div className="h-4 w-8 rounded bg-navy/6" />
          <div className="h-4 w-16 rounded bg-navy/6" />
        </div>
      </div>
    );
  }
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

const VIEW_OPTIONS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "console",
    label: "Console",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8M4 18h6" />
      </svg>
    ),
  },
  {
    id: "grid",
    label: "Cards",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
  {
    id: "reading",
    label: "Reading",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "downloads", label: "Most Downloaded" },
  { key: "date", label: "Newest First" },
  { key: "size", label: "File Size" },
  { key: "title", label: "Alphabetical" },
];

export default function DocumentLibrary() {
  const [docs, setDocs] = useState<DbDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("console");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [activeCategories, setActiveCategories] = useState<Set<DocumentCategory>>(new Set());
  const [activeFileTypes, setActiveFileTypes] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  // Persist view to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("usd:view") as ViewMode | null;
    if (saved && ["console", "grid", "reading"].includes(saved)) setView(saved);
  }, []);
  const setViewPersisted = (v: ViewMode) => {
    setView(v);
    localStorage.setItem("usd:view", v);
  };

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchDocuments();
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
    window.addEventListener("usd:document-uploaded", loadDocuments);
    return () => window.removeEventListener("usd:document-uploaded", loadDocuments);
  }, [loadDocuments]);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const fileTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    docs.forEach((d) => {
      const ft = (d.file_type ?? "FILE").toUpperCase();
      counts[ft] = (counts[ft] ?? 0) + 1;
    });
    return counts;
  }, [docs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return docs.filter((doc) => {
      const matchCat = activeCategories.size === 0 || activeCategories.has(doc.category as DocumentCategory);
      const matchFt = activeFileTypes.size === 0 || activeFileTypes.has((doc.file_type ?? "FILE").toUpperCase());
      const matchSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.contributor.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q);
      return matchCat && matchFt && matchSearch;
    });
  }, [docs, search, activeCategories, activeFileTypes]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "downloads") cmp = a.download_count - b.download_count;
      else if (sortKey === "date") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortKey === "size") cmp = (a.file_size ?? 0) - (b.file_size ?? 0);
      else if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const handleDownload = async (doc: DbDocument) => {
    incrementDownload(doc.id).catch(() => {});
    window.open(doc.file_url, "_blank", "noopener,noreferrer");
    setDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, download_count: d.download_count + 1 } : d))
    );
  };

  const toggleCategory = (cat: DocumentCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const toggleFileType = (ft: string) => {
    setActiveFileTypes((prev) => {
      const next = new Set(prev);
      if (next.has(ft)) next.delete(ft); else next.add(ft);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveCategories(new Set());
    setActiveFileTypes(new Set());
    setSearch("");
  };

  const hasFilters = activeCategories.size > 0 || activeFileTypes.size > 0 || search.length > 0;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <section id="library" className="py-20 px-6">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-8 bg-sky/60 origin-left"
            />
            <p className="section-label">Document Archive</p>
          </div>
          <h2 className="text-headline font-bold text-navy">Browse the Archive</h2>
        </motion.div>

        {/* Command bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/35"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search titles, contributors, categories…"
                className="input !pl-10"
                style={{ fontSize: "0.9rem" }}
                aria-label="Search archive"
              />
            </div>

            {/* View switcher */}
            <div
              className="flex-shrink-0 flex items-center"
              style={{ padding: 3, background: "rgba(10,22,40,0.05)", border: "1px solid rgba(10,22,40,0.1)", borderRadius: 10 }}
            >
              {VIEW_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setViewPersisted(opt.id)}
                  className="cursor-pointer flex items-center transition-all duration-200"
                  style={{
                    padding: "8px 12px",
                    borderRadius: 7,
                    background: view === opt.id ? "#0A1628" : "transparent",
                    color: view === opt.id ? "#FDFAF5" : "rgba(10,22,40,0.45)",
                  }}
                  aria-pressed={view === opt.id}
                  aria-label={`${opt.label} view`}
                  title={opt.label}
                >
                  {opt.icon}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={loadDocuments}
              disabled={loading}
              className="cursor-pointer p-2.5 rounded-lg text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors disabled:opacity-30 flex-shrink-0"
              aria-label="Refresh archive"
              title="Refresh"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-4 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <p className="text-sm font-semibold text-red-600 mb-1">Failed to load documents</p>
            <p className="text-xs text-red-500 font-mono break-all mb-3">{error}</p>
            <button onClick={loadDocuments} className="text-xs font-semibold text-red-600 underline underline-offset-2 hover:text-red-700 cursor-pointer">Try again</button>
          </div>
        )}

        {/* Console layout: facet rail + main */}
        <div className="flex gap-6 items-start">
          {/* Facet rail — console + reading */}
          {(view === "console" || view === "reading") && (
            <motion.aside
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block flex-shrink-0"
              style={{ width: 210, paddingTop: 4 }}
            >
              {/* Categories */}
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.16em", color: "rgba(10,22,40,0.4)", marginBottom: 12, textTransform: "uppercase" }}>
                Categories
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {CATEGORIES.map((cat) => {
                  const checked = activeCategories.has(cat as DocumentCategory);
                  const colors = CATEGORY_COLORS[cat] ?? FALLBACK_COLORS;
                  return (
                    <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                      <span
                        onClick={() => toggleCategory(cat as DocumentCategory)}
                        className="flex-shrink-0 w-[15px] h-[15px] rounded flex items-center justify-center transition-all duration-150 cursor-pointer"
                        style={{
                          background: checked ? "#4A90D9" : "#FDFAF5",
                          border: checked ? "none" : "1px solid rgba(10,22,40,0.25)",
                        }}
                        role="checkbox"
                        aria-checked={checked}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === " " && toggleCategory(cat as DocumentCategory)}
                      >
                        {checked && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span
                        className="text-xs font-medium transition-colors duration-150"
                        style={{ color: checked ? colors.text : "rgba(10,22,40,0.6)" }}
                        onClick={() => toggleCategory(cat as DocumentCategory)}
                      >
                        {cat}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* File types */}
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.16em", color: "rgba(10,22,40,0.4)", marginBottom: 12, textTransform: "uppercase" }}>
                File Type
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {Object.entries(fileTypeCounts).map(([ft, count]) => {
                  const active = activeFileTypes.has(ft);
                  return (
                    <button
                      key={ft}
                      onClick={() => toggleFileType(ft)}
                      className="cursor-pointer transition-all duration-150"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.64rem",
                        padding: "4px 9px",
                        borderRadius: 6,
                        fontWeight: 600,
                        background: active ? "rgba(74,144,217,0.1)" : "rgba(10,22,40,0.04)",
                        color: active ? "#2F6BB8" : "rgba(10,22,40,0.5)",
                        border: `1px solid ${active ? "rgba(74,144,217,0.25)" : "rgba(10,22,40,0.1)"}`,
                      }}
                    >
                      {ft} <span style={{ opacity: 0.6 }}>{count}</span>
                    </button>
                  );
                })}
                {Object.keys(fileTypeCounts).length === 0 && !loading && (
                  <span style={{ fontSize: "0.7rem", color: "rgba(10,22,40,0.3)" }}>—</span>
                )}
              </div>

              {/* Sort */}
              <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.16em", color: "rgba(10,22,40,0.4)", marginBottom: 12, textTransform: "uppercase" }}>
                Sort By
              </p>
              <div className="flex flex-col gap-0.5">
                {SORT_OPTIONS.map((opt) => {
                  const active = sortKey === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => toggleSort(opt.key)}
                      className="cursor-pointer text-left flex items-center justify-between transition-all duration-150"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: active ? 600 : 400,
                        color: active ? "#2952A3" : "rgba(10,22,40,0.55)",
                        background: active ? "rgba(74,144,217,0.08)" : "transparent",
                        borderRadius: 6,
                        padding: "5px 8px",
                      }}
                    >
                      {opt.label}
                      {active && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          {sortDir === "desc"
                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />}
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="cursor-pointer mt-6 w-full text-center text-xs font-semibold transition-colors"
                  style={{ color: "rgba(10,22,40,0.35)", padding: "6px 0" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0A1628")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(10,22,40,0.35)")}
                >
                  Clear all filters
                </button>
              )}
            </motion.aside>
          )}

          {/* Main panel */}
          <div className="flex-1 min-w-0">
            {/* Meta row */}
            {!loading && !error && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.7rem", color: "rgba(10,22,40,0.45)" }}>
                  {sorted.length} result{sorted.length !== 1 ? "s" : ""}
                  {docs.length !== sorted.length ? ` of ${docs.length}` : ""}
                </span>
                {Array.from(activeCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="cursor-pointer flex items-center gap-1 transition-colors"
                    style={{ fontSize: "0.64rem", fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "rgba(74,144,217,0.08)", color: "#2952A3", border: "1px solid rgba(74,144,217,0.2)" }}
                  >
                    {cat}
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                {Array.from(activeFileTypes).map((ft) => (
                  <button
                    key={ft}
                    onClick={() => toggleFileType(ft)}
                    className="cursor-pointer flex items-center gap-1 transition-colors"
                    style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.64rem", fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "rgba(74,144,217,0.1)", color: "#2F6BB8", border: "1px solid rgba(74,144,217,0.25)" }}
                  >
                    {ft}
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="cursor-pointer flex items-center gap-1"
                    style={{ fontSize: "0.64rem", fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "rgba(10,22,40,0.05)", color: "rgba(10,22,40,0.5)", border: "1px solid rgba(10,22,40,0.12)" }}
                  >
                    &ldquo;{search}&rdquo;
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Console / table view */}
            {view === "console" && (
              <div className="card overflow-hidden">
                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr 150px 78px 70px 90px",
                    gap: "14px",
                    padding: "12px 28px",
                    borderBottom: "1px solid rgba(10,22,40,0.08)",
                  }}
                >
                  {[
                    { label: "Type", key: null },
                    { label: "Title", key: "title" as SortKey },
                    { label: "Contributor", key: null },
                    { label: "Size", key: "size" as SortKey },
                    { label: "Downloads", key: "downloads" as SortKey },
                    { label: "Date", key: "date" as SortKey },
                  ].map(({ label, key }) => (
                    <button
                      key={label}
                      onClick={key ? () => toggleSort(key) : undefined}
                      className={key ? "cursor-pointer" : "cursor-default"}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: key && sortKey === key ? "#2952A3" : "rgba(10,22,40,0.35)",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        background: "none",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      {label}
                      {key && sortKey === key && (
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          {sortDir === "desc"
                            ? <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            : <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />}
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Rows */}
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} view="console" />)
                ) : sorted.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-sm text-navy/45">
                      {docs.length === 0 ? "No documents yet — be the first to upload." : "No documents match your filters."}
                    </p>
                    {docs.length === 0 && (
                      <a href="#upload" className="btn-primary mt-6 mx-auto">Upload Now</a>
                    )}
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {sorted.map((doc, idx) => {
                      const colors = CATEGORY_COLORS[doc.category] ?? FALLBACK_COLORS;
                      const ft = (doc.file_type ?? "FILE").toUpperCase();
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, delay: idx < 12 ? idx * 0.02 : 0 }}
                          className="group"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "44px 1fr 150px 78px 70px 90px",
                            gap: "14px",
                            padding: "14px 28px",
                            borderBottom: "1px solid rgba(10,22,40,0.05)",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          whileHover={{ backgroundColor: "rgba(74,144,217,0.04)" }}
                          onClick={() => handleDownload(doc)}
                        >
                          {/* File type chip */}
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.58rem",
                              fontWeight: 700,
                              padding: "3px 6px",
                              borderRadius: 4,
                              background: "rgba(10,22,40,0.05)",
                              color: "rgba(10,22,40,0.45)",
                              display: "inline-block",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {ft}
                          </span>

                          {/* Title + meta chips */}
                          <div className="min-w-0">
                            <p
                              className="text-sm font-semibold text-navy truncate group-hover:text-sky transition-colors duration-150"
                              title={doc.title}
                            >
                              {doc.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span
                                style={{
                                  fontSize: "0.58rem",
                                  background: colors.bg,
                                  padding: "2px 6px",
                                  borderRadius: 3,
                                  fontWeight: 600,
                                  color: colors.text,
                                  border: `1px solid ${colors.border}`,
                                }}
                              >
                                {doc.category}
                              </span>
                              {doc.country && (
                                <span
                                  style={{
                                    fontSize: "0.58rem",
                                    color: "rgba(10,22,40,0.42)",
                                    background: "rgba(10,22,40,0.04)",
                                    padding: "2px 6px",
                                    borderRadius: 3,
                                  }}
                                >
                                  {doc.country}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contributor */}
                          <p
                            className="text-xs text-navy/55 truncate"
                            title={doc.contributor}
                          >
                            {doc.contributor}
                          </p>

                          {/* File size */}
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.7rem",
                              color: "rgba(10,22,40,0.45)",
                            }}
                          >
                            {doc.file_size ? formatBytes(doc.file_size) : "—"}
                          </span>

                          {/* Downloads */}
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              color: "#1B3A6B",
                              fontFamily: "JetBrains Mono, monospace",
                            }}
                          >
                            {doc.download_count}
                          </span>

                          {/* Date */}
                          <span
                            style={{
                              fontFamily: "JetBrains Mono, monospace",
                              fontSize: "0.68rem",
                              color: "rgba(10,22,40,0.4)",
                            }}
                          >
                            {formatShortDate(doc.created_at)}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            )}

            {/* Grid / card view */}
            {(view === "grid" || view === "reading") && (
              <>
                {loading ? (
                  <div className={view === "reading" ? "flex flex-col gap-4" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} view="grid" />)}
                  </div>
                ) : sorted.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-sm text-navy/45">
                      {docs.length === 0 ? "No documents yet — be the first to upload." : "No documents match your filters."}
                    </p>
                    {docs.length === 0 && (
                      <a href="#upload" className="btn-primary mt-6 mx-auto">Upload Now</a>
                    )}
                  </div>
                ) : (
                  <div className={view === "reading" ? "flex flex-col gap-4" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-4"}>
                    <AnimatePresence mode="popLayout">
                      {sorted.map((doc, idx) => {
                        const colors = CATEGORY_COLORS[doc.category] ?? FALLBACK_COLORS;
                        const ftType = doc.file_type ?? "FILE";
                        return (
                          <motion.div
                            key={doc.id}
                            layout
                            initial={{ opacity: 0, y: 16, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
                            className="card group cursor-default p-5 flex flex-col gap-4"
                            style={{ background: "#FDFAF5" }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="tag" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                                {doc.category}
                              </span>
                              <span className="tag" style={{ background: "rgba(10,22,40,0.05)", color: "rgba(10,22,40,0.5)", fontFamily: "JetBrains Mono, monospace" }}>
                                {ftType}
                              </span>
                            </div>
                            <h3 className="text-navy text-sm font-semibold leading-snug line-clamp-2 group-hover:text-sky transition-colors duration-200">
                              {doc.title}
                            </h3>
                            {view === "reading" && doc.description && (
                              <p className="text-xs text-navy/55 leading-relaxed line-clamp-3">{doc.description}</p>
                            )}
                            <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(10,22,40,0.08)" }}>
                              <div>
                                <p className="text-navy text-xs font-medium truncate max-w-[120px]">{doc.contributor}</p>
                                <p className="text-navy/40 text-xs mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                                  {formatDate(doc.created_at)}
                                </p>
                              </div>
                              <motion.button
                                onClick={() => handleDownload(doc)}
                                className="btn-primary !py-1.5 !px-3 !text-xs !gap-1.5 group/dl"
                                whileTap={{ scale: 0.94 }}
                                aria-label={`Download ${doc.title}`}
                              >
                                <svg
                                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover/dl:translate-y-0.5"
                                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {doc.file_size ? formatBytes(doc.file_size) : "Download"}
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
