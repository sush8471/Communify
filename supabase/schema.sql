-- Communify — Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xmgdihynbjyuaqebbfsj/sql

-- Profiles (extends auth.users)
-- Profiles (decoupled from auth.users for demo/hackathon mode)
create table if not exists profiles (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  username    text unique,
  bio         text,
  location    text,
  avatar_url  text,
  skills      text[] default '{}',
  interests   text[] default '{}',
  role        text default 'member' check (role in ('member', 'organizer', 'admin')),
  ai_summary  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- If table already existed with auth.users foreign key constraint, drop it:
alter table profiles drop constraint if exists profiles_id_fkey;

-- Auto-create profile on signup (optional fallback if auth is re-enabled)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Posts (events, resources, announcements)
create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid references profiles(id) on delete set null,
  type        text not null check (type in ('event', 'resource', 'announcement')),
  title       text not null,
  description text not null,
  ai_summary  text,
  tags        text[] default '{}',
  location    text,
  start_time  timestamptz,
  status      text default 'published' check (status in ('draft', 'published', 'archived')),
  upvotes     int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Registrations
create table if not exists registrations (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid references posts(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  status      text default 'registered',
  created_at  timestamptz default now(),
  unique(post_id, user_id)
);

-- Notifications
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade,
  type        text,
  title       text,
  body        text,
  link        text,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- Row Level Security (Demo Mode: Open read/write for hackathon demo)
alter table profiles enable row level security;
alter table posts enable row level security;
alter table registrations enable row level security;
alter table notifications enable row level security;

-- Drop old restrictive policies if they exist
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Allow demo profiles insert" on profiles;
drop policy if exists "Allow demo profiles all" on profiles;
drop policy if exists "Posts are viewable by everyone" on posts;
drop policy if exists "Authenticated users can create posts" on posts;
drop policy if exists "Authors can update their posts" on posts;
drop policy if exists "Allow demo posts all" on posts;

-- Open policies for demo mode (allows unauthenticated anon key to insert & read)
create policy "Allow demo profiles all" on profiles for all using (true) with check (true);
create policy "Allow demo posts all" on posts for all using (true) with check (true);
create policy "Allow demo registrations all" on registrations for all using (true) with check (true);
create policy "Allow demo notifications all" on notifications for all using (true) with check (true);
