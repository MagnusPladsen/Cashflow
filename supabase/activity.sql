-- Activity log table + triggers

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  description text,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

create policy "activity_logs member read"
  on public.activity_logs for select
  using (public.is_household_member(household_id));

create policy "activity_logs member write"
  on public.activity_logs for insert
  with check (public.is_household_member(household_id));

create or replace function public.log_item_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  hid uuid;
  desc text;
  actor uuid := auth.uid();
  action_name text;
  target_id uuid;
begin
  if tg_table_name in ('template_incomes','template_expenses','template_allocations') then
    select household_id into hid from public.budget_templates where id = new.template_id;
  elsif tg_table_name in ('monthly_incomes','monthly_expenses','monthly_allocations') then
    select household_id into hid from public.monthly_budgets where id = new.monthly_budget_id;
  else
    return new;
  end if;

  if tg_op = 'INSERT' then
    action_name := 'created';
  elsif tg_op = 'UPDATE' then
    action_name := 'updated';
  elsif tg_op = 'DELETE' then
    action_name := 'deleted';
  end if;

  target_id := coalesce(new.id, old.id);
  desc := coalesce(new.name, old.name, tg_table_name);

  insert into public.activity_logs (household_id, actor_id, action, table_name, record_id, description)
  values (hid, actor, action_name, tg_table_name, target_id, desc);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- Attach triggers
create or replace trigger template_incomes_activity
  after insert or update or delete on public.template_incomes
  for each row execute procedure public.log_item_change();

create or replace trigger template_expenses_activity
  after insert or update or delete on public.template_expenses
  for each row execute procedure public.log_item_change();

create or replace trigger template_allocations_activity
  after insert or update or delete on public.template_allocations
  for each row execute procedure public.log_item_change();

create or replace trigger monthly_incomes_activity
  after insert or update or delete on public.monthly_incomes
  for each row execute procedure public.log_item_change();

create or replace trigger monthly_expenses_activity
  after insert or update or delete on public.monthly_expenses
  for each row execute procedure public.log_item_change();

create or replace trigger monthly_allocations_activity
  after insert or update or delete on public.monthly_allocations
  for each row execute procedure public.log_item_change();
