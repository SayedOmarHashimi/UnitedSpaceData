import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Upload security policy ────────────────────────────────────────────────────

export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

/**
 * Extensions that are explicitly allowed.
 * Anything not in this list is rejected, including double-extensions
 * like "malware.pdf.exe" (we only trust the final extension).
 */
const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "jpg", "jpeg", "png", "gif", "webp", "tiff", "tif", "bmp",
  "csv",
  "json",
  "fits", "fit",
  "zip", "tar", "gz", "bz2",
  "txt",
]);

/**
 * MIME types that are explicitly allowed.
 * We check both extension AND MIME so a renamed .exe reported as
 * application/pdf is still caught (browsers set MIME from the file header
 * when the OS can read it, not from the extension).
 */
const ALLOWED_MIME_PREFIXES = [
  "image/",
  "text/plain",
  "text/csv",
  "application/pdf",
  "application/json",
  "application/zip",
  "application/x-zip",
  "application/x-zip-compressed",
  "application/gzip",
  "application/x-gzip",
  "application/x-bzip2",
  "application/x-tar",
  "application/octet-stream", // FITS files have no standard MIME; allow generically
];

/**
 * Sanitize a user-supplied file name so it is safe to store and display:
 * - Strip path separators and null bytes
 * - Collapse consecutive dots (blocks double-extension tricks)
 * - Replace any character that isn't alphanumeric, dash, underscore, or dot
 * - Truncate to 200 characters
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[/\\?%*:|"<>\x00]/g, "") // remove dangerous characters
    .replace(/\.{2,}/g, ".")            // collapse consecutive dots
    .replace(/[^a-zA-Z0-9._-]/g, "_")  // replace remaining unsafe chars
    .slice(0, 200)
    || "upload";
}

/** Throw a descriptive error if the file violates any upload policy. */
export function validateFile(file: File): void {
  // Size check
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 500 MB.`
    );
  }

  // Extension check — use only the final segment after the last dot
  const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!rawExt || !ALLOWED_EXTENSIONS.has(rawExt)) {
    throw new Error(
      `File type ".${rawExt || "unknown"}" is not allowed. Accepted types: PDF, images, CSV, JSON, FITS, ZIP.`
    );
  }

  // MIME type check — browsers read this from the file header, not the name
  const mime = file.type.toLowerCase();
  const mimeAllowed =
    !mime || // empty MIME is acceptable (some FITS/binary files)
    ALLOWED_MIME_PREFIXES.some((prefix) => mime.startsWith(prefix));

  if (!mimeAllowed) {
    throw new Error(
      `File MIME type "${file.type}" is not permitted. This file may be executable or otherwise unsafe.`
    );
  }
}

// ── Row shape from the database ──────────────────────────────────────────────
export interface DbDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  contributor: string;
  country: string | null;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  download_count: number;
  created_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Upload a file to the space-documents bucket and return its public URL. */
export async function uploadFile(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  // Enforce upload policy — throws a descriptive Error on violation
  validateFile(file);

  const safeName = sanitizeFileName(file.name);
  const ext = safeName.split(".").pop() ?? "bin";
  // Storage path: timestamp + random token + safe extension only (no original name)
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("space-documents")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      // @ts-expect-error – onUploadProgress exists in supabase-js v2 storage
      onUploadProgress: (e: { loaded: number; total: number }) => {
        if (onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("space-documents").getPublicUrl(path);
  return data.publicUrl;
}

/** Insert a document metadata row and return the new record.
 *  Only the fields listed in SAFE_INSERT_FIELDS are forwarded to the DB.
 *  This prevents prototype-pollution or extra fields from reaching the insert.
 */
const SAFE_INSERT_FIELDS = [
  "title", "description", "category", "contributor",
  "country", "file_url", "file_name", "file_size", "file_type",
] as const;

type InsertPayload = Omit<DbDocument, "id" | "created_at" | "download_count">;

export async function insertDocument(payload: InsertPayload): Promise<DbDocument> {
  // Whitelist-pick the columns we actually want to write
  const safe = Object.fromEntries(
    SAFE_INSERT_FIELDS
      .filter((k) => k in payload)
      .map((k) => [k, payload[k]])
  );

  const { data, error } = await supabase
    .from("documents")
    .insert(safe)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as DbDocument;
}

/** Increment download_count by 1 for a given document. */
export async function incrementDownload(id: string): Promise<void> {
  await supabase.rpc("increment_download", { doc_id: id });
}

/** Fetch all documents ordered by newest first. */
export async function fetchDocuments(): Promise<DbDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as DbDocument[];
}

/** Fetch aggregate stats for the stats bar. */
export async function fetchStats(): Promise<{
  documents: number;
  contributors: number;
  totalBytes: number;
  countries: number;
}> {
  const [countRes, metaRes] = await Promise.all([
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("contributor, country, file_size"),
  ]);

  const rows = metaRes.data ?? [];
  const contributors = new Set(rows.map((r) => r.contributor)).size;
  const totalBytes = rows.reduce((s, r) => s + (r.file_size ?? 0), 0);
  const countries = new Set(
    rows.map((r) => r.country).filter((c): c is string => Boolean(c))
  ).size;

  return {
    documents: countRes.count ?? 0,
    contributors,
    totalBytes,
    countries,
  };
}
