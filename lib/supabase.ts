import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const ext = file.name.split(".").pop() ?? "bin";
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

/** Insert a document metadata row and return the new record. */
export async function insertDocument(
  payload: Omit<DbDocument, "id" | "created_at" | "download_count">
): Promise<DbDocument> {
  const { data, error } = await supabase
    .from("documents")
    .insert(payload)
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
