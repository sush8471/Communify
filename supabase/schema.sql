-- Linkfy AI — Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xmgdihynbjyuaqebbfsj/sql

-- Profiles (extends auth.users)
create table if not exists profiles (
  id          uuid references auth.users on delete cascade primary key,
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

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
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

-- Row Level Security
alter table profiles enable row level security;
alter table posts enable row level security;
alter table registrations enable row level security;
alter table notifications enable row level security;

-- Profiles: public read, own write
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Posts: public read, authenticated create
create policy "Posts are viewable by everyone" on posts for select using (true);
create policy "Authenticated users can create posts" on posts for insert with check (auth.uid() = author_id);
create policy "Authors can update their posts" on posts for update using (auth.uid() = author_id);

-- Registrations: own read/write
create policy "Users can view their own registrations" on registrations for select using (auth.uid() = user_id);
create policy "Users can register" on registrations for insert with check (auth.uid() = user_id);
create policy "Users can cancel their registration" on registrations for delete using (auth.uid() = user_id);

-- Notifications: own only
create policy "Users can view their own notifications" on notifications for select using (auth.uid() = user_id);
