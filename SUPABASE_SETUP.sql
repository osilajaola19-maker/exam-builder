-- Exam Builder Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Profiles policies
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Create databases table
create table if not exists databases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on databases
alter table databases enable row level security;

-- Databases policies
drop policy if exists "Users can view own databases" on databases;
create policy "Users can view own databases"
  on databases for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create databases" on databases;
create policy "Users can create databases"
  on databases for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own databases" on databases;
create policy "Users can update own databases"
  on databases for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own databases" on databases;
create policy "Users can delete own databases"
  on databases for delete
  using (auth.uid() = user_id);

-- Create exams table
create table if not exists exams (
  id uuid default uuid_generate_v4() primary key,
  database_id uuid references databases on delete cascade not null,
  title text not null,
  status text check (status in ('draft', 'published')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on exams
alter table exams enable row level security;

-- Exams policies
drop policy if exists "Users can view exams from own databases" on exams;
create policy "Users can view exams from own databases"
  on exams for select
  using (
    exists (
      select 1 from databases
      where databases.id = exams.database_id
      and databases.user_id = auth.uid()
    )
  );

drop policy if exists "Users can create exams in own databases" on exams;
create policy "Users can create exams in own databases"
  on exams for insert
  with check (
    exists (
      select 1 from databases
      where databases.id = exams.database_id
      and databases.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update exams in own databases" on exams;
create policy "Users can update exams in own databases"
  on exams for update
  using (
    exists (
      select 1 from databases
      where databases.id = exams.database_id
      and databases.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete exams in own databases" on exams;
create policy "Users can delete exams in own databases"
  on exams for delete
  using (
    exists (
      select 1 from databases
      where databases.id = exams.database_id
      and databases.user_id = auth.uid()
    )
  );

-- Create shared_databases table
create table if not exists shared_databases (
  id uuid default uuid_generate_v4() primary key,
  database_id uuid references databases on delete cascade not null,
  shared_with_email text not null,
  permission text check (permission in ('readonly', 'editable')) not null,
  created_at timestamp with time zone default now(),
  unique(database_id, shared_with_email)
);

-- Enable RLS on shared_databases
alter table shared_databases enable row level security;

-- Shared databases policies
drop policy if exists "Users can view shares for own databases" on shared_databases;
create policy "Users can view shares for own databases"
  on shared_databases for select
  using (
    exists (
      select 1 from databases
      where databases.id = shared_databases.database_id
      and databases.user_id = auth.uid()
    )
  );

drop policy if exists "Users can create shares for own databases" on shared_databases;
create policy "Users can create shares for own databases"
  on shared_databases for insert
  with check (
    exists (
      select 1 from databases
      where databases.id = shared_databases.database_id
      and databases.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete shares for own databases" on shared_databases;
create policy "Users can delete shares for own databases"
  on shared_databases for delete
  using (
    exists (
      select 1 from databases
      where databases.id = shared_databases.database_id
      and databases.user_id = auth.uid()
    )
  );

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_databases_updated_at on databases;
create trigger update_databases_updated_at
  before update on databases
  for each row
  execute function update_updated_at_column();

drop trigger if exists update_exams_updated_at on exams;
create trigger update_exams_updated_at
  before update on exams
  for each row
  execute function update_updated_at_column();

-- Create indexes for better performance
create index if not exists databases_user_id_idx on databases(user_id);
create index if not exists exams_database_id_idx on exams(database_id);
create index if not exists shared_databases_database_id_idx on shared_databases(database_id);
create index if not exists shared_databases_email_idx on shared_databases(shared_with_email);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- Success message
do $$
begin
  raise notice 'Database setup completed successfully!';
  raise notice 'Tables created: profiles, databases, exams, shared_databases';
  raise notice 'RLS policies enabled and configured';
  raise notice 'Triggers and functions created';
end $$;
