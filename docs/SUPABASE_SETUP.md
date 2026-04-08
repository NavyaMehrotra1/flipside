# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose your organization, name it (e.g. "flipside"), set a secure database password
4. Select a region close to your users
5. Wait ~2 minutes for the project to spin up

## 2. Run the SQL Schema

Open the **SQL Editor** in your Supabase dashboard and run:

```sql
-- Decks
create table decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  color text,
  emoji text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Cards
create table cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  deck_id uuid references decks(id) on delete cascade,
  front text not null,
  back text not null,
  tags text[],
  bookmarked boolean default false,
  position integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews (SM-2 spaced repetition state)
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
  ease float default 2.5,
  interval integer default 1,
  repetitions integer default 0,
  due_date timestamptz default now(),
  last_reviewed timestamptz,
  unique(card_id, user_id)
);

-- Study sessions
create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  deck_id uuid references decks(id) on delete cascade,
  mode text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  cards_reviewed integer default 0,
  accuracy float
);

-- Streaks
create table streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_study_date date
);
```

## 3. Enable Row Level Security

Run this in the SQL Editor:

```sql
-- Enable RLS
alter table decks enable row level security;
alter table cards enable row level security;
alter table reviews enable row level security;
alter table sessions enable row level security;
alter table streaks enable row level security;

-- Decks policies
create policy "Users can manage their own decks"
  on decks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Cards policies
create policy "Users can manage their own cards"
  on cards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reviews policies
create policy "Users can manage their own reviews"
  on reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Sessions policies
create policy "Users can manage their own sessions"
  on sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Streaks policies
create policy "Users can manage their own streaks"
  on streaks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## 4. Enable OAuth Providers (Optional)

### Google OAuth
1. Go to **Authentication → Providers → Google**
2. Toggle **Enable Google**
3. Create a Google OAuth app at [console.cloud.google.com](https://console.cloud.google.com)
4. Add your Supabase callback URL: `https://<your-project>.supabase.co/auth/v1/callback`
5. Paste the **Client ID** and **Client Secret** into Supabase

### GitHub OAuth
1. Go to **Authentication → Providers → GitHub**
2. Toggle **Enable GitHub**
3. Create a GitHub OAuth app at **GitHub → Settings → Developer settings → OAuth Apps**
4. Set Authorization callback URL: `https://<your-project>.supabase.co/auth/v1/callback`
5. Paste **Client ID** and **Client Secret** into Supabase

## 5. Fill in your .env

1. In Supabase, go to **Project Settings → API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

4. Fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 6. Start the app

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and you're ready to flip! 🃏
