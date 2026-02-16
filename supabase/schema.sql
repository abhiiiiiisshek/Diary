-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  invite_code text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Relationships table
create table relationships (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now()
);

-- Relationship Members table (Junction)
create table relationship_members (
  relationship_id uuid references relationships(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  entry_permission text default 'write', -- strictly equal permissions, but good to have
  joined_at timestamptz default now(),
  primary key (relationship_id, user_id)
);

-- Entries table
create table entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  relationship_id uuid references relationships(id) on delete cascade,
  content text not null,
  is_private boolean default false,
  word_count int,
  character_count int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Themes table
create table themes (
  user_id uuid references profiles(id) on delete cascade not null primary key,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Indexes
create index entries_user_id_idx on entries(user_id);
create index entries_relationship_id_idx on entries(relationship_id);
create index entries_created_at_idx on entries(created_at);

-- RLS Policies

-- Profiles: Users can view/edit their own profile
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Relationships: Users can view relationships they are a member of
alter table relationships enable row level security;
create policy "Users can view own relationships" on relationships
  for select using (
    exists (
      select 1 from relationship_members
      where relationship_members.relationship_id = relationships.id
      and relationship_members.user_id = auth.uid()
    )
  );

-- Relationship Members: View members of your relationships
alter table relationship_members enable row level security;
create policy "Users can view members of own relationships" on relationship_members
  for select using (
    exists (
      select 1 from relationship_members as my_membership
      where my_membership.relationship_id = relationship_members.relationship_id
      and my_membership.user_id = auth.uid()
    )
  );
  
-- Entries
alter table entries enable row level security;

-- View: Own entries OR shared entries in your relationship (if not private)
create policy "Users can view own entries" on entries
  for select using (auth.uid() = user_id);

create policy "Users can view partner entries" on entries
  for select using (
    (not is_private) and exists (
      select 1 from relationship_members
      where relationship_members.relationship_id = entries.relationship_id
      and relationship_members.user_id = auth.uid()
    )
  );

-- Insert: Can only create for self
create policy "Users can create own entries" on entries
  for insert with check (auth.uid() = user_id);

-- Update: Can only update own entries
create policy "Users can update own entries" on entries
  for update using (auth.uid() = user_id);

-- Delete: Can only delete own entries
create policy "Users can delete own entries" on entries
  for delete using (auth.uid() = user_id);

-- Themes: Full access to own theme
alter table themes enable row level security;
create policy "Users can manage own theme" on themes
  for all using (auth.uid() = user_id);

-- Trigger to create profile on signup (Supabase specific)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, invite_code)
  values (new.id, new.email, substring(md5(random()::text), 0, 9));
  
  insert into public.themes (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
