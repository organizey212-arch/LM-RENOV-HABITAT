-- À exécuter dans Supabase → SQL Editor (rôle avec droits suffisants).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  full_name text,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Création automatique d’un profil "user" à l’inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    'user',
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Promouvoir un compte en admin (remplacer l’UUID, id visible dans Authentication → Users) :
-- update public.profiles set role = 'admin', updated_at = now() where id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
