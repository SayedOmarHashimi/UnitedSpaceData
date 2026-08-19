"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatBytes } from "@/lib/utils";
import { uploadFile, insertDocument, validateFile, sanitizeFileName } from "@/lib/supabase";
import { CATEGORIES, type DocumentCategory } from "@/types";

type UploadState = "idle" | "uploading" | "success" | "error";

interface FileEntry {
  file: File;
  state: UploadState;
  progress: number;
  error?: string;
}

function getFileType(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

export default function UploadPortal() {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("Research");
  const [contributor, setContributor] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [showMore, setShowMore] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: File[]) => {
    const entries = incoming.map((file) => {
      try {
        validateFile(file);
        return { file, state: "idle" as const, progress: 0 };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Invalid file";
        return { file, state: "error" as const, progress: 0, error: msg };
      }
    });
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const uploadOne = async (idx: number) => {
    const entry = files[idx];
    if (!entry || entry.state !== "idle") return;

    setFiles((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, state: "uploading", progress: 0 } : f))
    );

    try {
      const publicUrl = await uploadFile(entry.file, (pct) => {
        setFiles((prev) =>
          prev.map((f, i) => (i === idx ? { ...f, progress: pct } : f))
        );
      });

      const safeName = sanitizeFileName(entry.file.name);
      const autoTitle = safeName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      await insertDocument({
        title: title.trim() || autoTitle,
        description: description.trim() || null,
        category,
        contributor: contributor.trim() || "Anonymous",
        country: country.trim() || null,
        file_url: publicUrl,
        file_name: safeName,
        file_size: entry.file.size,
        file_type: getFileType(safeName),
      });

      setFiles((prev) =>
        prev.map((f, i) => (i === idx ? { ...f, state: "success", progress: 100 } : f))
      );
      // Notify DocumentLibrary to refresh its list
      window.dispatchEvent(new CustomEvent("usd:document-uploaded"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setFiles((prev) =>
        prev.map((f, i) => (i === idx ? { ...f, state: "error", error: msg } : f))
      );
    }
  };

  const uploadAll = () => {
    files.forEach((f, i) => {
      if (f.state === "idle") setTimeout(() => uploadOne(i), i * 400);
    });
  };

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const pendingCount = files.filter((f) => f.state === "idle").length;

  return (
    <section id="upload" className="py-20 px-6">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-8 bg-sky/60 origin-left"
            />
            <p className="section-label">Upload Portal</p>
          </div>
          <h2 className="text-headline font-bold text-navy mb-3">
            Share a document
          </h2>
          <p className="text-navy/55 text-sm leading-relaxed">
            Anyone can contribute — no sign-up required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          {/* Drop zone */}
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            animate={{ scale: dragOver ? 1.015 : 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.005 }}
            className="cursor-pointer rounded-2xl p-10 text-center transition-colors duration-200"
            style={{
              background: dragOver ? "rgba(74,144,217,0.05)" : "rgba(10,22,40,0.02)",
              border: `2px dashed ${dragOver ? "rgba(74,144,217,0.5)" : "rgba(10,22,40,0.18)"}`,
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
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.tiff,.tif,.bmp,.csv,.json,.txt,.zip,.tar,.gz,.bz2,.fits,.fit"
              onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
            />
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(74,144,217,0.08)", border: "1px solid rgba(74,144,217,0.2)" }}
              >
                <svg className="w-5 h-5 text-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.05 11.095H6.75z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">Drop files or click to browse</p>
                <p className="text-xs text-navy/40 mt-1">PDF · Images · CSV · JSON · FITS · ZIP</p>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-xs text-navy/45 mb-2"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Voyager 1 trajectory data"
              className="input"
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-xs text-navy/45 mb-2.5"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="cursor-pointer text-xs font-semibold px-3.5 py-2 rounded-lg transition-all duration-150"
                    style={{
                      background: active ? "rgba(74,144,217,0.1)" : "transparent",
                      border: `1px solid ${active ? "rgba(74,144,217,0.4)" : "rgba(10,22,40,0.12)"}`,
                      color: active ? "#2F6BB8" : "rgba(10,22,40,0.45)",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contributor */}
          <div>
            <label
              htmlFor="contributor"
              className="block text-xs text-navy/45 mb-2"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
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

          {/* Optional details — hidden by default to keep the primary flow simple */}
          <div>
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              aria-expanded={showMore}
              className="cursor-pointer flex items-center gap-1.5 text-xs text-navy/45 hover:text-navy transition-colors"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: showMore ? "rotate(90deg)" : "none" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              Add more details
            </button>

            {showMore && (
              <div className="space-y-5 mt-4">
                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs text-navy/45 mb-2"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does this document contain?"
                    rows={3}
                    className="input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="block text-xs text-navy/45 mb-2"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. USA"
                    className="input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* File list */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {files.map((entry, idx) => (
                  <motion.div
                    key={`${entry.file.name}-${idx}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl"
                    style={{
                      background: entry.state === "error"
                        ? "rgba(239,68,68,0.04)"
                        : "#FDFAF5",
                      border: `1px solid ${entry.state === "error" ? "rgba(239,68,68,0.2)" : "rgba(10,22,40,0.1)"}`,
                    }}
                  >
                    {/* File icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(74,144,217,0.08)", border: "1px solid rgba(74,144,217,0.2)" }}
                    >
                      <svg className="w-4 h-4 text-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-navy truncate">{entry.file.name}</p>
                      {entry.state === "error" ? (
                        <p className="text-xs text-red-500 mt-0.5">{entry.error}</p>
                      ) : (
                        <p className="text-xs text-navy/40 mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {formatBytes(entry.file.size)}
                        </p>
                      )}
                      {entry.state === "uploading" && (
                        <div className="mt-1.5 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(10,22,40,0.08)" }}>
                          <motion.div
                            className="h-full rounded-full bg-sky"
                            style={{ width: `${entry.progress}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                      )}
                    </div>

                    {/* State badge */}
                    {entry.state === "success" && (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
                          />
                        </svg>
                      </motion.div>
                    )}
                    {entry.state === "uploading" && (
                      <div className="w-4 h-4 rounded-full border-2 border-sky border-t-transparent animate-spin flex-shrink-0" />
                    )}
                    {entry.state === "error" && (
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    )}
                    {entry.state === "idle" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="cursor-pointer text-navy/30 hover:text-navy transition-colors flex-shrink-0"
                        aria-label="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </motion.div>
                ))}

                {pendingCount > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={uploadAll}
                    className="btn-primary w-full justify-center mt-2 !py-3.5"
                  >
                    Upload {pendingCount} File{pendingCount !== 1 ? "s" : ""} to Archive
                  </motion.button>
                )}

                {files.every((f) => f.state === "success") && files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)" }}
                  >
                    <p className="text-sm text-green-700 font-medium">
                      {files.length} file{files.length !== 1 ? "s" : ""} uploaded successfully
                    </p>
                    <button
                      onClick={() => setFiles([])}
                      className="cursor-pointer text-xs text-green-700 hover:text-navy transition-colors"
                    >
                      Clear
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
