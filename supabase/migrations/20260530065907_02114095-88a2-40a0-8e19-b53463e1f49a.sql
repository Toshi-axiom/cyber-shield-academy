-- ===== Enum for roles =====
create type public.app_role as enum ('admin', 'moderator', 'user');

-- ===== Profiles =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Profiles are publicly viewable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- ===== User stats =====
create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active date,
  updated_at timestamptz not null default now()
);
grant select on public.user_stats to authenticated;
grant all on public.user_stats to service_role;
alter table public.user_stats enable row level security;
create policy "Users can view own stats" on public.user_stats for select to authenticated using (auth.uid() = user_id);

-- ===== User progress (completed modules) =====
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, module_id)
);
grant select on public.user_progress to authenticated;
grant all on public.user_progress to service_role;
alter table public.user_progress enable row level security;
create policy "Users can view own progress" on public.user_progress for select to authenticated using (auth.uid() = user_id);

-- ===== Lab progress =====
create table public.lab_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  completed_steps integer not null default 0,
  flag_captured boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, module_id)
);
grant select, insert, update on public.lab_progress to authenticated;
grant all on public.lab_progress to service_role;
alter table public.lab_progress enable row level security;
create policy "Users can view own lab progress" on public.lab_progress for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own lab progress" on public.lab_progress for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own lab progress" on public.lab_progress for update to authenticated using (auth.uid() = user_id);

-- ===== Quiz results =====
create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phase_id text not null,
  score integer not null,
  total integer not null,
  taken_at timestamptz not null default now()
);
grant select on public.quiz_results to authenticated;
grant all on public.quiz_results to service_role;
alter table public.quiz_results enable row level security;
create policy "Users can view own quiz results" on public.quiz_results for select to authenticated using (auth.uid() = user_id);

-- ===== Achievements (static catalog) =====
create table public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  icon text
);
grant select on public.achievements to anon, authenticated;
grant all on public.achievements to service_role;
alter table public.achievements enable row level security;
create policy "Achievements are publicly viewable" on public.achievements for select using (true);

-- ===== User achievements (earned) =====
create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);
grant select on public.user_achievements to anon, authenticated;
grant all on public.user_achievements to service_role;
alter table public.user_achievements enable row level security;
create policy "Earned achievements are publicly viewable" on public.user_achievements for select using (true);

-- ===== Lab flags (server-only secrets) =====
create table public.lab_flags (
  module_id text primary key,
  flag_value text not null,
  xp_reward integer not null default 50
);
grant all on public.lab_flags to service_role;
alter table public.lab_flags enable row level security;
-- No policies for anon/authenticated: only service_role (server) can read.

-- ===== User roles =====
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- ===== New user trigger: create profile + stats =====
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix integer := 0;
begin
  base_username := lower(regexp_replace(
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1),
      'agent'
    ),
    '[^a-z0-9_]', '', 'g'
  ));
  if base_username is null or length(base_username) < 3 then
    base_username := 'agent' || floor(random() * 100000)::text;
  end if;

  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', final_username),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  insert into public.user_stats (user_id) values (new.id);

  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();