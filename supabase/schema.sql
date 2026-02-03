-- Cashflow core schema + RLS
-- Note: policies are not idempotent. If re-running, drop policies first.
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Households
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency text not null default 'NOK',
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete restrict
);

create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'member',
  invited_email text,
  status text not null default 'invited',
  created_at timestamptz not null default now(),
  constraint household_member_role_check check (role in ('owner', 'member')),
  constraint household_member_status_check check (status in ('invited', 'active')),
  constraint household_member_identity_check check (
    (user_id is not null) or (invited_email is not null)
  ),
  constraint household_member_unique unique (household_id, user_id)
);

-- Budget templates
create table if not exists public.budget_templates (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.template_incomes (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.budget_templates(id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null default 0,
  frequency text not null default 'monthly',
  assigned_user_id uuid references auth.users(id) on delete set null
);

create table if not exists public.template_expenses (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.budget_templates(id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null default 0,
  category text not null,
  frequency text not null default 'monthly'
);

create table if not exists public.template_allocations (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.budget_templates(id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null default 0,
  type text not null,
  assigned_user_id uuid references auth.users(id) on delete set null,
  constraint template_allocations_type_check check (type in ('savings', 'monthly_budget'))
);

-- Monthly budgets
create table if not exists public.monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  template_id uuid references public.budget_templates(id) on delete set null,
  year int not null,
  month int not null,
  created_at timestamptz not null default now(),
  constraint monthly_budgets_month_check check (month between 1 and 12),
  constraint monthly_budgets_unique unique (household_id, year, month)
);

create table if not exists public.monthly_incomes (
  id uuid primary key default gen_random_uuid(),
  monthly_budget_id uuid not null references public.monthly_budgets(id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null default 0,
  frequency text not null default 'monthly',
  assigned_user_id uuid references auth.users(id) on delete set null,
  template_income_id uuid references public.template_incomes(id) on delete set null
);

create table if not exists public.monthly_expenses (
  id uuid primary key default gen_random_uuid(),
  monthly_budget_id uuid not null references public.monthly_budgets(id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null default 0,
  category text not null,
  frequency text not null default 'monthly',
  template_expense_id uuid references public.template_expenses(id) on delete set null
);

create table if not exists public.monthly_allocations (
  id uuid primary key default gen_random_uuid(),
  monthly_budget_id uuid not null references public.monthly_budgets(id) on delete cascade,
  name text not null,
  amount numeric(12, 2) not null default 0,
  type text not null,
  assigned_user_id uuid references auth.users(id) on delete set null,
  template_allocation_id uuid references public.template_allocations(id) on delete set null,
  constraint monthly_allocations_type_check check (type in ('savings', 'monthly_budget'))
);

-- Helper functions
create or replace function public.is_household_member(target_household uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household
      and hm.user_id = auth.uid()
      and hm.status = 'active'
  );
$$;

create or replace function public.is_household_owner(target_household uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm
    where hm.household_id = target_household
      and hm.user_id = auth.uid()
      and hm.status = 'active'
      and hm.role = 'owner'
  );
$$;

create or replace function public.is_same_household(target_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.household_members hm1
    join public.household_members hm2
      on hm1.household_id = hm2.household_id
    where hm1.user_id = auth.uid()
      and hm2.user_id = target_user
      and hm1.status = 'active'
      and hm2.status = 'active'
  );
$$;

-- Profile auto-create on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.budget_templates enable row level security;
alter table public.template_incomes enable row level security;
alter table public.template_expenses enable row level security;
alter table public.template_allocations enable row level security;
alter table public.monthly_budgets enable row level security;
alter table public.monthly_incomes enable row level security;
alter table public.monthly_expenses enable row level security;
alter table public.monthly_allocations enable row level security;

-- Profiles policies
create policy "profiles self read"
  on public.profiles for select
  using (id = auth.uid() or public.is_same_household(id));

create policy "profiles self insert"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles self update"
  on public.profiles for update
  using (id = auth.uid());

-- Households policies
create policy "households member read"
  on public.households for select
  using (public.is_household_member(id));

create policy "households create"
  on public.households for insert
  with check (auth.uid() = created_by);

create policy "households owner update"
  on public.households for update
  using (public.is_household_owner(id));

create policy "households owner delete"
  on public.households for delete
  using (public.is_household_owner(id));

-- Household members policies
create policy "household_members member read"
  on public.household_members for select
  using (public.is_household_member(household_id));

create policy "household_members owner insert"
  on public.household_members for insert
  with check (public.is_household_owner(household_id));

create policy "household_members owner update"
  on public.household_members for update
  using (public.is_household_owner(household_id));

create policy "household_members owner delete"
  on public.household_members for delete
  using (public.is_household_owner(household_id));

-- Budget templates policies
create policy "budget_templates member read"
  on public.budget_templates for select
  using (public.is_household_member(household_id));

create policy "budget_templates member write"
  on public.budget_templates for insert
  with check (public.is_household_member(household_id));

create policy "budget_templates member update"
  on public.budget_templates for update
  using (public.is_household_member(household_id));

create policy "budget_templates member delete"
  on public.budget_templates for delete
  using (public.is_household_member(household_id));

-- Template items policies
create policy "template_incomes member read"
  on public.template_incomes for select
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_incomes member write"
  on public.template_incomes for insert
  with check (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_incomes member update"
  on public.template_incomes for update
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_incomes member delete"
  on public.template_incomes for delete
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_expenses member read"
  on public.template_expenses for select
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_expenses member write"
  on public.template_expenses for insert
  with check (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_expenses member update"
  on public.template_expenses for update
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_expenses member delete"
  on public.template_expenses for delete
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_allocations member read"
  on public.template_allocations for select
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_allocations member write"
  on public.template_allocations for insert
  with check (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_allocations member update"
  on public.template_allocations for update
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

create policy "template_allocations member delete"
  on public.template_allocations for delete
  using (
    public.is_household_member(
      (select household_id from public.budget_templates bt where bt.id = template_id)
    )
  );

-- Monthly budgets policies
create policy "monthly_budgets member read"
  on public.monthly_budgets for select
  using (public.is_household_member(household_id));

create policy "monthly_budgets member write"
  on public.monthly_budgets for insert
  with check (public.is_household_member(household_id));

create policy "monthly_budgets member update"
  on public.monthly_budgets for update
  using (public.is_household_member(household_id));

create policy "monthly_budgets member delete"
  on public.monthly_budgets for delete
  using (public.is_household_member(household_id));

-- Monthly items policies
create policy "monthly_incomes member read"
  on public.monthly_incomes for select
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_incomes member write"
  on public.monthly_incomes for insert
  with check (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_incomes member update"
  on public.monthly_incomes for update
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_incomes member delete"
  on public.monthly_incomes for delete
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_expenses member read"
  on public.monthly_expenses for select
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_expenses member write"
  on public.monthly_expenses for insert
  with check (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_expenses member update"
  on public.monthly_expenses for update
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_expenses member delete"
  on public.monthly_expenses for delete
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_allocations member read"
  on public.monthly_allocations for select
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_allocations member write"
  on public.monthly_allocations for insert
  with check (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_allocations member update"
  on public.monthly_allocations for update
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );

create policy "monthly_allocations member delete"
  on public.monthly_allocations for delete
  using (
    public.is_household_member(
      (select household_id from public.monthly_budgets mb where mb.id = monthly_budget_id)
    )
  );
