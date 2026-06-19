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

create table if not exists push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade unique,
  endpoint   text not null,
  p256dh     text not null,
  auth       text not null,
  updated_at timestamptz default now()
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

alter table push_subscriptions enable row level security;

create policy "push_subscriptions: own rows only"
  on push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 4. SOCIAL TABLES ────────────────────────────────────────

-- Public profile info used by the leaderboard
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  current_streak  integer default 0,
  last_study_date date,
  updated_at      timestamptz default now()
);

-- Study groups
create table if not exists groups (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  code       char(6) unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Group membership
create table if not exists group_members (
  group_id  uuid references groups(id) on delete cascade,
  user_id   uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

-- RLS for social tables
alter table profiles      enable row level security;
alter table groups        enable row level security;
alter table group_members enable row level security;

-- Profiles: any signed-in user can read (for leaderboard); only you write yours
create policy "profiles: authenticated can read"
  on profiles for select
  to authenticated
  using (true);

create policy "profiles: own row only write"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles: own row only update"
  on profiles for update
  using (auth.uid() = id);

-- Groups: any signed-in user can read (needed to look up by code)
create policy "groups: authenticated can read"
  on groups for select
  to authenticated
  using (true);

create policy "groups: creator can insert"
  on groups for insert
  with check (auth.uid() = created_by);

create policy "groups: creator can delete"
  on groups for delete
  using (auth.uid() = created_by);

-- Group members: any authenticated user can read (for leaderboard lookup)
create policy "group_members: authenticated can read"
  on group_members for select
  to authenticated
  using (true);

create policy "group_members: can join"
  on group_members for insert
  with check (auth.uid() = user_id);

create policy "group_members: can leave"
  on group_members for delete
  using (auth.uid() = user_id);
