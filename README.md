# United Space Data

**The world's open-access archive for space research, mission files, and astronomy data.**

## Description

United Space Data is a web application that serves as an open, public repository for space-related documents — astronomy datasets, mission plans, satellite records, deep-space research, Earth-observation data, and scientific papers. Anyone can browse and download the archive or contribute their own files without needing an account, making it useful for researchers, students, educators, and space enthusiasts who want a single shared home for open space data. It is built with Next.js 14 (App Router) and TypeScript on the frontend, styled with Tailwind CSS and animated with Framer Motion and a Three.js star field, and backed by Supabase (Postgres + Storage) for the document database and file hosting. Uploads are validated by extension and MIME type and stored in a public bucket, while row-level security keeps records read-and-append-only for anonymous visitors.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Testing](#testing)
- [Building & Deployment](#building--deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Browse a searchable, sortable document library with console, grid, and reading views.
- Filter documents across six categories: Astronomy, Missions, Satellites, Deep Space, Earth Observation, and Research.
- Upload files (PDF, images, CSV, JSON, FITS, ZIP/TAR archives, and text) up to 500 MB, with client-side validation and sanitized file names.
- Live aggregate stats: total documents, contributors, storage used, and countries represented.
- Download tracking via a Postgres `increment_download` RPC.
- Anonymous access — no sign-up required to read or contribute.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5 |
| UI | React 18, Tailwind CSS 3.4, Radix UI, Framer Motion, Three.js |
| Icons | lucide-react |
| Backend | Supabase (Postgres + Storage) |
| Linting | ESLint (`eslint-config-next`) |

## Prerequisites

- **Node.js** 18.17 or later (required by Next.js 14).
- **npm** (or yarn/pnpm/bun).
- A **Supabase** project (free tier is sufficient) for the database and file storage.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SayedOmarHashimi/UnitedSpaceData.git
   cd UnitedSpaceData
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create your environment file** by copying the provided example:
   ```bash
   cp .env.example .env.local
   ```

4. **Fill in your Supabase credentials** in `.env.local` (see [Configuration](#configuration) below).

## Configuration

The app needs a Supabase backend. All configuration is done through environment variables and a one-time database setup.

1. **Create a Supabase project** at [supabase.com](https://supabase.com) and open the project dashboard.

2. **Set environment variables.** Edit `.env.local` with the values from your project's **Settings → API** page:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   > Both variables are `NEXT_PUBLIC_*`, so they are exposed to the browser. Use the **anon** (public) key here — never the service-role key.

3. **Create the storage bucket.** In the dashboard, go to **Storage → New Bucket**, name it exactly `space-documents`, and set **Public** to **ON**.

4. **Apply the database schema.** Open **SQL Editor** in the dashboard, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `documents` table, its check constraints, row-level security policies, the `increment_download` RPC, and the storage bucket policies. The script is idempotent and safe to re-run.
   > **Gotcha:** the storage-bucket policy statements at the bottom of the script assume the `space-documents` bucket already exists, so create the bucket (step 3) *before* running the SQL.

## Running the Project

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the app** in your browser at [http://localhost:3000](http://localhost:3000). The page hot-reloads as you edit files.

## Usage

Once the app is running and Supabase is configured:

1. **Browse the library.** Scroll to the Document Library section on the home page. Use the search box, category filters, sort controls, and the console/grid/reading view toggles to explore documents.

2. **Download a document.** Click the download action on any document card. This opens the file's public URL and increments its download counter.

3. **Contribute a document.** Scroll to the Upload Portal and:
   1. Select or drag-and-drop a file (max 500 MB; accepted types include PDF, images, CSV, JSON, FITS, ZIP/TAR, and text).
   2. Fill in the required metadata — **title**, **category**, and **contributor** — plus optional description and country.
   3. Submit. The file is validated, uploaded to the `space-documents` bucket, and a metadata row is inserted into the `documents` table. It then appears in the library.

Programmatic access to the data layer lives in [`lib/supabase.ts`](lib/supabase.ts), which exposes helpers such as `fetchDocuments()`, `uploadFile()`, `insertDocument()`, `incrementDownload()`, and `fetchStats()`.

## Testing

This project does not currently include an automated test suite. The only automated check available is linting:

1. **Run the linter:**
   ```bash
   npm run lint
   ```

## Building & Deployment

1. **Create a production build:**
   ```bash
   npm run build
   ```

2. **Run the production server locally to verify:**
   ```bash
   npm run start
   ```

3. **Deploy to Vercel (recommended).** Push the repository to GitHub and import it at [vercel.com/new](https://vercel.com/new). In the project settings, add the two environment variables from [Configuration](#configuration):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   Vercel auto-detects Next.js and builds with `npm run build`. Any platform that supports Next.js 14 will also work, provided the same environment variables are set.

## Project Structure

```
UnitedSpaceData/
├── app/                  # Next.js App Router pages, layout, and global styles
│   ├── layout.tsx        # Root layout and metadata
│   ├── page.tsx          # Home page composition
│   └── globals.css
├── components/           # UI sections (Hero, DocumentLibrary, UploadPortal, etc.)
├── lib/
│   ├── supabase.ts       # Supabase client, upload validation, and data helpers
│   ├── utils.ts          # Formatting helpers
│   └── mock-data.ts      # Sample document data
├── types/                # Shared TypeScript types and category constants
├── supabase/
│   └── schema.sql        # Database schema, RLS policies, and RPC
├── .env.example          # Environment variable template
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Contributing

Contributions are welcome. To propose a change:

1. **Fork** the repository on GitHub.
2. **Clone** your fork and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and verify they lint cleanly:
   ```bash
   npm run lint
   ```
4. **Commit** with a clear, descriptive message:
   ```bash
   git commit -m "Add your feature"
   ```
5. **Push** the branch to your fork:
   ```bash
   git push -u origin feature/your-feature-name
   ```
6. **Open a pull request** against the main repository describing your change.

## License

No license file is currently included in this repository. Until a license is added, the code is considered "all rights reserved" by default. If you intend for others to reuse it, consider adding a `LICENSE` file (e.g., MIT).
