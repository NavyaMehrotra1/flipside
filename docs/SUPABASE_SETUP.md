# Supabase Setup Guide

---

## Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Fill in a name (e.g. `flipside`), set a database password, choose a region
4. Wait ~2 minutes for it to spin up

---

## Step 2 — Run the schema SQL

> **Important:** Only paste raw SQL into the SQL editor — never paste this markdown document itself.

1. In your Supabase project, go to **SQL Editor** in the left sidebar
2. Click **New query**
3. Open [schema.sql](./schema.sql) in this repo
4. Copy the **entire contents** of that file
5. Paste it into the Supabase SQL editor
6. Click **Run** (or press `Cmd+Enter`)

You should see: `Success. No rows returned`

This creates all 5 tables and enables Row Level Security automatically.

---

## Step 3 — Get your API keys

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** → looks like `https://abcdefgh.supabase.co`
   - **anon public** key → a long JWT string

---

## Step 4 — Create your .env file

In the `flip_side/` project root:

```bash
cp .env.example .env
```

Open `.env` and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

---

## Step 5 — Start the app

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` — sign up and start flipping! 🃏

---

## Step 6 (Optional) — Enable Google OAuth

1. Go to **Authentication** → **Providers** → **Google** → toggle **Enable**
2. Create a Google OAuth app at [console.cloud.google.com](https://console.cloud.google.com):
   - APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URI: `https://<your-project-id>.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and **Client Secret** into Supabase's Google provider settings
4. Save

---

## Step 7 (Optional) — Enable GitHub OAuth

1. Go to **Authentication** → **Providers** → **GitHub** → toggle **Enable**
2. Create a GitHub OAuth app at **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**:
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `https://<your-project-id>.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and **Client Secret** into Supabase's GitHub provider settings
4. Save

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `syntax error at or near "3."` | You pasted the markdown doc into SQL Editor. Paste only [schema.sql](./schema.sql) |
| `relation "decks" does not exist` | SQL didn't run successfully — check for errors and re-run |
| `Invalid API key` | Double-check `.env` has no extra spaces or quotes around the key |
| OAuth redirect loops | Make sure your Supabase callback URL is exactly `https://<id>.supabase.co/auth/v1/callback` |
| Blank page on `localhost:5173` | Check browser console — usually a missing `.env` file |
