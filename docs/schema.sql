-- ============================================================
-- FLIPSIDE — Run this entire file in Supabase SQL Editor
-- Project Settings → SQL Editor → New query → paste → Run
-- ============================================================


-- ── 1. TABLES ──────────────────────────────────────────────

create table if not exists decks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  color       text,
  emoji       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists cards (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  deck_id    uuid references decks(id) on delete cascade,
  front      text not null,
  back       text not null,
  tags       text[],
  bookmarked boolean default false,
  position   integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists reviews (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  card_id      uuid references cards(id) on delete cascade,
  ease         float default 2.5,
  interval     integer default 1,
  repetitions  integer default 0,
  due_date     timestamptz default now(),
  last_reviewed timestamptz,
  unique(card_id, user_id)
);

create table if not exists sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade,
  deck_id        uuid references decks(id) on delete cascade,
  mode           text,
  started_at     timestamptz default now(),
  ended_at       timestamptz,
  cards_reviewed integer default 0,
  accuracy       float
);

create table if not exists streaks (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_study_date date
);


-- ── 2. STORAGE BUCKET (for card images) ────────────────────
-- Run this separately in SQL Editor if the bucket doesn't exist yet:
--
--   insert into storage.buckets (id, name, public)
--   values ('card-images', 'card-images', true);
--
--   create policy "Anyone can upload card images"
--     on storage.objects for insert
--     with check (bucket_id = 'card-images' and auth.role() = 'authenticated');
--
--   create policy "Card images are publicly readable"
--     on storage.objects for select
--     using (bucket_id = 'card-images');
--
-- OR create it in the Supabase dashboard:
--   Storage → New bucket → name: card-images → Public bucket ✓


-- ── 3. ROW LEVEL SECURITY ───────────────────────────────────

alter table decks    enable row level security;
alter table cards    enable row level security;
alter table reviews  enable row level security;
alter table sessions enable row level security;
alter table streaks  enable row level security;

create policy "decks: own rows only"
  on decks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "cards: own rows only"
  on cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reviews: own rows only"
  on reviews for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "sessions: own rows only"
  on sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "streaks: own rows only"
  on streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
