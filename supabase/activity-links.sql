-- Add linkable context to activity logs

alter table public.activity_logs add column if not exists template_id uuid;
alter table public.activity_logs add column if not exists monthly_budget_id uuid;
alter table public.activity_logs add column if not exists year int;
alter table public.activity_logs add column if not exists month int;

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
  tpl_id uuid;
  mb_id uuid;
  mb_year int;
  mb_month int;
begin
  if tg_table_name in ('template_incomes','template_expenses','template_allocations') then
    tpl_id := coalesce(new.template_id, old.template_id);
    select household_id into hid from public.budget_templates where id = tpl_id;
  elsif tg_table_name in ('monthly_incomes','monthly_expenses','monthly_allocations') then
    mb_id := coalesce(new.monthly_budget_id, old.monthly_budget_id);
    select household_id, year, month into hid, mb_year, mb_month from public.monthly_budgets where id = mb_id;
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

  insert into public.activity_logs (
    household_id,
    actor_id,
    action,
    table_name,
    record_id,
    description,
    template_id,
    monthly_budget_id,
    year,
    month
  )
  values (
    hid,
    actor,
    action_name,
    tg_table_name,
    target_id,
    desc,
    tpl_id,
    mb_id,
    mb_year,
    mb_month
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;
