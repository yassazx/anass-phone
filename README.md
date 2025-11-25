<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>



This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  
- Node.js 20+  
- A Supabase project with anon/public API access  
- A Gemini API key (for AI blurbs in the shop cards)
=======
>>>>>>> 1ba0cef2156148e316a57ec1a0b1d9c8aa7d72e4

### 1. Configure environment variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
VITE_BACKOFFICE_PASSWORD=OPTIONAL_STRONG_PASSWORD
VITE_WHATSAPP_NUMBER=212XXXXXXXXX
VITE_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET=YOUR_UPLOAD_PRESET
```

- `VITE_BACKOFFICE_PASSWORD` overrides the default guard password (`anass-backoffice-2025`). The backoffice has enhanced security with:
  - **Session timeout**: Auto-logout after 30 minutes of inactivity
  - **Rate limiting**: Account locked for 15 minutes after 5 failed password attempts
  - **Activity tracking**: Session expires on inactivity (mouse, keyboard, scroll events)
- `VITE_WHATSAPP_NUMBER` is the WhatsApp phone number (with country code, no + sign) used for order checkout. Example: `212612345678` for Morocco.
- `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are required for image uploads in the backoffice. Get these from your [Cloudinary dashboard](https://cloudinary.com/console). Create an unsigned upload preset for client-side uploads.

### 2. Prepare Supabase tables

Run the following SQL in the Supabase SQL editor (adjust names if you already have tables):

```sql
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  image text,
  stock integer not null default 0,
  sold integer not null default 0,
  category text not null,
  tags text[] default '{}',
  colors text[] default '{}',
  storage_options text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table if not exists colors (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz default now()
);

create table if not exists storage_options (
  id uuid primary key default gen_random_uuid(),
  label text unique not null,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  items jsonb not null,
  total numeric not null,
  date timestamptz not null default now(),
  status text not null default 'Pending',
  created_at timestamptz default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  featured_image text,
  author text not null default 'Admin',
  published_at timestamptz,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

> ✅ The front-end expects `tags`, `colors`, and `storage_options` to be `text[]` columns and `orders.items` to be a JSON array shaped like `CartItem[]`.

Seed data quickly with `insert into products (...) values (...)` or by using the Supabase Table Editor.

### 3. Install dependencies

```
npm install
```

### 4. Run the dev server

```
npm run dev
```

The Store/Backoffice views will now read and write directly to your Supabase tables. Without valid Supabase credentials the UI automatically falls back to the in-memory sample catalog so you can still demo the experience.

## Deploy to AWS Amplify

1. **Push the repo to GitHub (or another Git provider)** so Amplify can pull from a branch.
2. **Create a new Amplify Hosting app** in the AWS console, choose “Host web app”, and connect the repository + branch.
3. **Set build settings** when prompted: build command `npm run build`, output directory `dist`. Amplify auto-detects Vite projects but you can edit `amplify.yml` if needed.
4. **Add environment variables** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `VITE_WHATSAPP_NUMBER`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, optional `VITE_BACKOFFICE_PASSWORD`) under *App settings → Environment variables*. These populate `import.meta.env` during the build.
5. **Deploy**. Amplify installs dependencies (`npm install`), runs the build, and serves the static assets from a managed CDN with HTTPS out of the box.
6. (Optional) **Custom domain**: connect Route53 or any domain registrar via Amplify’s “Domain management” tab. Amplify provisions SSL certificates automatically.

Every push to the tracked branch triggers a new build + deploy, so Supabase schema/API changes can be rolled out by updating environment variables or redeploying. If you later migrate off Supabase, update the env vars or API calls and re-run the Amplify build.
