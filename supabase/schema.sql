-- United Space Data — Supabase schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/stjpiqahhpnnmtocbxbr/sql

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

-- Row-level security
alter table documents enable row level security;

create policy if not exists "Anyone can read documents"
  on documents for select using (true);

create policy if not exists "Anyone can insert documents"
  on documents for insert with check (true);

-- Function used by the download button to increment count atomically
create or replace function increment_download(doc_id uuid)
returns void
language sql
security definer
as $$
  update documents
  set download_count = download_count + 1
  where id = doc_id;
$$;
