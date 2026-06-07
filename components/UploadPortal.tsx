"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatBytes } from "@/lib/utils";
import { CATEGORIES, type DocumentCategory } from "@/types";

type UploadState = "idle" | "uploading" | "success" | "error";

interface FileEntry {
  file: File;
  state: UploadState;
  progress: number;
}

export default function UploadPortal() {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("Research");
  const [contributor, setContributor] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    addFiles(dropped);
  }, []);

  const addFiles = (newFiles: File[]) => {
    const entries: FileEntry[] = newFiles.map((f) => ({ file: f, state: "idle", progress: 0 }));
    setFiles((prev) => [...prev, ...entries]);
  };

  const simulateUpload = (idx: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, state: "uploading" } : f))
    );
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f, i) => (i === idx ? { ...f, state: "success", progress: 100 } : f))
        );
      } else {
        setFiles((prev) =>
          prev.map((f, i) => (i === idx ? { ...f, progress } : f))
        );
      }
    }, 150);
  };

  const handleUploadAll = () => {
    files.forEach((f, i) => {
      if (f.state === "idle") {
        setTimeout(() => simulateUpload(i), i * 300);
      }
    });
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const categoryColors: Record<DocumentCategory, string> = {
    Astronomy: "#00D4FF",
    Missions: "#3B82F6",
    Satellites: "#8B5CF6",
    "Deep Space": "#A855F7",
    "Earth Observation": "#10B981",
    Research: "#F59E0B",
  };

  return (
    <section id="upload" className="py-24 px-4 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.6) 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full glass neon-border-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" style={{ boxShadow: "0 0 6px rgba(139,92,246,0.8)" }} />
            <span className="text-[#8B5CF6] text-xs font-semibold tracking-[0.2em] uppercase" style={{ fontFamily: "Roboto Mono, monospace" }}>
              Data Upload Portal
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            SHARE YOUR
            <span className="gradient-text"> DISCOVERY</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-lg mx-auto">
            Contribute to open science. Upload research papers, datasets, images, and mission files for the global space community.
          </p>
        </motion.div>

        {/* Category selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-xs text-[#94A3B8] uppercase tracking-widest mb-3" style={{ fontFamily: "Roboto Mono, monospace" }}>
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background:
                    selectedCategory === cat
                      ? `${categoryColors[cat]}22`
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    selectedCategory === cat ? categoryColors[cat] : "rgba(255,255,255,0.08)"
                  }`,
                  color: selectedCategory === cat ? categoryColors[cat] : "#94A3B8",
                  boxShadow:
                    selectedCategory === cat
                      ? `0 0 12px ${categoryColors[cat]}44`
                      : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Meta fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid sm:grid-cols-2 gap-4 mb-6"
        >
          {[
            { label: "Contributor Name", value: contributor, setValue: setContributor, placeholder: "Dr. Jane Smith" },
            { label: "Description", value: description, setValue: setDescription, placeholder: "Brief description of the data..." },
          ].map(({ label, value, setValue, placeholder }) => (
            <div key={label}>
              <label className="block text-xs text-[#94A3B8] uppercase tracking-widest mb-2" style={{ fontFamily: "Roboto Mono, monospace" }}>
                {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-[#475569] outline-none focus:ring-1 focus:ring-[rgba(0,212,255,0.4)] transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "Exo 2, sans-serif",
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl p-12 text-center transition-all duration-300 ${dragOver ? "drag-active" : ""}`}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "2px dashed rgba(0,212,255,0.2)",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.csv,.json,.txt,.zip,.fits"
            onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}
            >
              <svg className="w-8 h-8 text-[#00D4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.05 11.095H6.75z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg mb-1">Drop files here or click to browse</p>
              <p className="text-[#94A3B8] text-sm">
                PDF · Images · CSV · JSON · FITS · ZIP · Max 500 MB per file
              </p>
            </div>
          </div>
        </motion.div>

        {/* File list */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-3"
            >
              {files.map((entry, idx) => (
                <motion.div
                  key={`${entry.file.name}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {/* File icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${categoryColors[selectedCategory]}15`, border: `1px solid ${categoryColors[selectedCategory]}30` }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={categoryColors[selectedCategory]} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{entry.file.name}</p>
                    <p className="text-xs text-[#94A3B8]">{formatBytes(entry.file.size)}</p>
                    {entry.state === "uploading" && (
                      <div className="mt-1.5 h-1 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #00D4FF, #8B5CF6)", width: `${entry.progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {entry.state === "success" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <svg className="w-5 h-5 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </motion.div>
                    )}
                    {entry.state === "uploading" && (
                      <div className="w-5 h-5 rounded-full border-2 border-[#00D4FF] border-t-transparent animate-spin" />
                    )}
                    {entry.state === "idle" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="cursor-pointer text-[#94A3B8] hover:text-white transition-colors"
                        aria-label="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Upload button */}
              {files.some((f) => f.state === "idle") && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleUploadAll}
                  className="cursor-pointer w-full mt-4 py-4 rounded-2xl font-bold text-black text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #00D4FF 0%, #3B82F6 50%, #8B5CF6 100%)",
                    boxShadow: "0 0 30px rgba(0,212,255,0.3)",
                    fontFamily: "Exo 2, sans-serif",
                  }}
                >
                  Upload {files.filter((f) => f.state === "idle").length} File{files.filter((f) => f.state === "idle").length > 1 ? "s" : ""} to Archive
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
