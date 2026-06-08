-- United Space Data — Supabase schema
-- Run this in the Supabase SQL editor.
-- Idempotent: safe to re-run on an existing database.

-- ── documents table ───────────────────────────────────────────────────────────

create table if not exists documents (
  id            uuid         default gen_random_uuid() primary key,
  title         text         not null check (char_length(title)       between 1 and 500),
  description   text                  check (char_length(description) <= 2000),
  -- Only the six categories the application recognises are accepted.
  category      text         not null check (category in (
                               'Astronomy', 'Missions', 'Satellites',
                               'Deep Space', 'Earth Observation', 'Research'
                             )),
  contributor   text         not null check (char_length(contributor) between 1 and 200),
  country       text                  check (char_length(country)     <= 100),
  file_url      text         not null check (char_length(file_url)    <= 2000),
  file_name     text                  check (char_length(file_name)   <= 255),
  file_size     bigint                check (file_size > 0 and file_size <= 524288000), -- 500 MB max
  file_type     text                  check (file_type in (
                               'PDF', 'JPG', 'JPEG', 'PNG', 'GIF', 'WEBP',
                               'TIFF', 'TIF', 'BMP', 'CSV', 'JSON', 'TXT',
                               'ZIP', 'TAR', 'GZ', 'BZ2', 'FITS', 'FIT', 'FILE'
                             )),
  download_count integer      not null default 0 check (download_count >= 0),
  created_at    timestamptz  not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table documents enable row level security;

-- Anyone (including anonymous visitors) may read all rows.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'documents' and policyname = 'anon_select'
  ) then
    create policy "anon_select"
      on documents
      for select
      using (true);
  end if;
end $$;

-- Anonymous users may insert new rows. The CHECK constraints above enforce
-- data integrity; the application also validates before calling insertDocument.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'documents' and policyname = 'anon_insert'
  ) then
    create policy "anon_insert"
      on documents
      for insert
      with check (true);
  end if;
end $$;

-- No UPDATE or DELETE policies are defined. Because RLS is enabled, Postgres
-- denies those operations for the anon role by default. This means:
--   • Public visitors cannot edit or delete any document.
--   • Deletes / corrections must be performed via the Supabase dashboard or
--     a service-role key (never exposed to the browser).

-- ── increment_download RPC ────────────────────────────────────────────────────
-- SECURITY DEFINER lets the anon role call this function even though it lacks
-- a direct UPDATE policy. search_path is pinned to prevent schema-hijacking.

create or replace function increment_download(doc_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update documents
  set    download_count = download_count + 1
  where  id = doc_id;
$$;

-- Revoke direct execute from PUBLIC; only the authenticated roles that need it
-- should be able to call it. Supabase's anon role is granted execute separately
-- via the PostgREST RPC surface — this just tightens the default.
revoke execute on function increment_download(uuid) from public;
grant  execute on function increment_download(uuid) to anon, authenticated;

-- ── Storage bucket policies ───────────────────────────────────────────────────
-- Run these statements AFTER creating the 'space-documents' bucket in the
-- Supabase dashboard (Storage → New Bucket → name: space-documents, Public: ON).
--
-- They allow:
--   • Anyone to read/download objects  (public bucket, no auth required)
--   • The anon role to upload new objects
--   • Nobody (anon/authenticated) to delete or overwrite existing objects
--     (only the service-role key or a dashboard admin can do that)

-- Allow public read of all objects in the bucket.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects'
      and schemaname = 'storage'
      and policyname = 'storage_anon_select'
  ) then
    create policy "storage_anon_select"
      on storage.objects
      for select
      using (bucket_id = 'space-documents');
  end if;
end $$;

-- Allow anon to upload (INSERT) new objects. upsert:false in the app means
-- this will never silently overwrite existing files.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects'
      and schemaname = 'storage'
      and policyname = 'storage_anon_insert'
  ) then
    create policy "storage_anon_insert"
      on storage.objects
      for insert
      to anon
      with check (bucket_id = 'space-documents');
  end if;
end $$;

-- Explicitly deny UPDATE on storage objects for anon (no policy = deny when RLS
-- is on, but an explicit denial is clearer intent).
-- No storage_anon_update or storage_anon_delete policies are created,
-- so those operations are denied by default.
