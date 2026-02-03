-- Tokenized invite flow

create table if not exists public.household_invite_tokens (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  invited_email text not null,
  token text not null unique,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days'
);

alter table public.household_invite_tokens enable row level security;

create policy "invite_tokens owner create"
  on public.household_invite_tokens for insert
  with check (public.is_household_owner(household_id));

create policy "invite_tokens owner read"
  on public.household_invite_tokens for select
  using (public.is_household_owner(household_id));

create or replace function public.create_invite_token(hid uuid, email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  token_value text := encode(gen_random_bytes(16), 'hex');
begin
  insert into public.household_invite_tokens (household_id, invited_email, token)
  values (hid, email, token_value);
  return token_value;
end;
$$;

create or replace function public.accept_invite_token(token_value text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  hid uuid;
  email text;
  uid uuid := auth.uid();
  user_email text := auth.email();
  existing integer;
begin
  select household_id, invited_email into hid, email
  from public.household_invite_tokens
  where token = token_value and status = 'active' and expires_at > now();

  if hid is null then
    return false;
  end if;

  if user_email is null or lower(user_email) <> lower(email) then
    return false;
  end if;

  select count(*) into existing
  from public.household_members
  where household_id = hid and user_id = uid;

  if existing = 0 then
    insert into public.household_members (household_id, user_id, role, status)
    values (hid, uid, 'member', 'active');
  end if;

  update public.household_invite_tokens
    set status = 'used'
  where token = token_value;

  return true;
end;
$$;
