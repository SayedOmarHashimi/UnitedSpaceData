-- United Space Data — Supabase schema
-- Run this in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/stjpiqahhpnnmtocbxbr/sql

create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text not null,
  contributor text not null,
  country text,
  file_url text not null,
  file_name text,
  file_size bigint,
  file_type text,
  download_count integer default 0,
  created_at timestamp with time zone default now()
);

alter table documents enable row level security;

-- CREATE POLICY IF NOT EXISTS is not supported in Postgres < 15.
-- Use a DO block to achieve idempotent policy creation.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'documents' and policyname = 'Anyone can read documents'
  ) then
    create policy "Anyone can read documents"
      on documents for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'documents' and policyname = 'Anyone can insert documents'
  ) then
    create policy "Anyone can insert documents"
      on documents for insert with check (true);
  end if;
end $$;

-- Atomically increment download_count (called by the download button)
create or replace function increment_download(doc_id uuid)
returns void
language sql
security definer
as $$
  update documents
  set download_count = download_count + 1
  where id = doc_id;
$$;
