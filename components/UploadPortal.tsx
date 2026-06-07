"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatBytes } from "@/lib/utils";
import { CATEGORIES, type DocumentCategory } from "@/types";

type UploadState = "idle" | "uploading" | "success";

interface FileEntry {
  file: File;
  state: UploadState;
  progress: number;
}

const CATEGORY_COLORS: Record<DocumentCategory, string> = {
  Astronomy: "#00D4FF",
  Missions: "#3B82F6",
  Satellites: "#7C3AED",
  "Deep Space": "#A855F7",
  "Earth Observation": "#10B981",
  Research: "#F59E0B",
};

export default function UploadPortal() {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [category, setCategory] = useState<DocumentCategory>("Research");
  const [contributor, setContributor] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...incoming.map((file) => ({ file, state: "idle" as const, progress: 0 })),
    ]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const simulateUpload = (idx: number) => {
    setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, state: "uploading" } : f)));
    let progress = 0;
    const id = setInterval(() => {
      progress += Math.random() * 20 + 8;
      if (progress >= 100) {
        clearInterval(id);
        setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, state: "success", progress: 100 } : f)));
      } else {
        setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, progress } : f)));
      }
    }, 140);
  };

  const uploadAll = () => {
    files.forEach((f, i) => { if (f.state === "idle") setTimeout(() => simulateUpload(i), i * 250); });
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const catColor = CATEGORY_COLORS[category];

  return (
    <section id="upload" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-3">Upload Portal</p>
          <h2
            className="text-3xl md:text-4xl font-black text-white mb-3"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Contribute to Science
          </h2>
          <p className="text-[var(--muted-light)] text-sm leading-relaxed">
            Share research papers, mission files, datasets, and images with the global space community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-5"
        >
          {/* Category */}
          <div>
            <label className="block text-xs text-[var(--muted)] mb-2.5" style={{ fontFamily: "Roboto Mono, monospace" }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                const c = CATEGORY_COLORS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="cursor-pointer text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-150"
                    style={{
                      background: active ? `${c}18` : "transparent",
                      border: `1px solid ${active ? c : "var(--border)"}`,
                      color: active ? c : "var(--muted-light)",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contributor name */}
          <div>
            <label htmlFor="contributor" className="block text-xs text-[var(--muted)] mb-2" style={{ fontFamily: "Roboto Mono, monospace" }}>
              Your Name / Organization
            </label>
            <input
              id="contributor"
              type="text"
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              placeholder="Dr. Jane Smith · MIT"
              className="input"
            />
          </div>

          {/* Drop zone */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl p-10 text-center transition-all duration-200"
              style={{
                background: dragOver ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.02)",
                border: `2px dashed ${dragOver ? "rgba(0,212,255,0.4)" : "var(--border)"}`,
              }}
              role="button"
              tabIndex={0}
              aria-label="Drop files or click to upload"
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.csv,.json,.txt,.zip,.fits"
                onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
              />
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)" }}
                >
                  <svg className="w-5 h-5 text-[#00D4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.05 11.095H6.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Drop files or click to browse</p>
                  <p className="text-xs text-[var(--muted)] mt-1">PDF · Images · CSV · JSON · FITS · ZIP</p>
                </div>
              </div>
            </div>
          </div>

          {/* File list */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {files.map((entry, idx) => (
                  <motion.div
                    key={`${entry.file.name}-${idx}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
                  >
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${catColor}12`, border: `1px solid ${catColor}25` }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={catColor} strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>

                    {/* Info + progress */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{entry.file.name}</p>
                      <p className="text-xs text-[var(--muted)]">{formatBytes(entry.file.size)}</p>
                      {entry.state === "uploading" && (
                        <div className="mt-1.5 h-0.5 rounded-full bg-white/8 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${catColor}, #7C3AED)`,
                              width: `${entry.progress}%`,
                            }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                      )}
                    </div>

                    {/* State indicator */}
                    {entry.state === "success" && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                        <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </motion.div>
                    )}
                    {entry.state === "uploading" && (
                      <div className="w-4 h-4 rounded-full border-2 border-[#00D4FF] border-t-transparent animate-spin flex-shrink-0" />
                    )}
                    {entry.state === "idle" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="cursor-pointer text-[var(--muted)] hover:text-white transition-colors flex-shrink-0"
                        aria-label="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </motion.div>
                ))}

                {files.some((f) => f.state === "idle") && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={uploadAll}
                    className="btn-primary w-full justify-center mt-2 !py-3.5"
                  >
                    Upload {files.filter((f) => f.state === "idle").length} File
                    {files.filter((f) => f.state === "idle").length !== 1 ? "s" : ""}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
