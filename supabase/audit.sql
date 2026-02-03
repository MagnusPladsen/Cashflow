-- Add updated_by tracking for realtime "who updated" toasts

create or replace function public.set_updated_by()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_by := auth.uid();
  return new;
end;
$$;

alter table public.template_incomes add column if not exists updated_by uuid references auth.users(id);
alter table public.template_expenses add column if not exists updated_by uuid references auth.users(id);
alter table public.template_allocations add column if not exists updated_by uuid references auth.users(id);
alter table public.monthly_incomes add column if not exists updated_by uuid references auth.users(id);
alter table public.monthly_expenses add column if not exists updated_by uuid references auth.users(id);
alter table public.monthly_allocations add column if not exists updated_by uuid references auth.users(id);

create or replace trigger template_incomes_set_updated_by
  before insert or update on public.template_incomes
  for each row execute procedure public.set_updated_by();

create or replace trigger template_expenses_set_updated_by
  before insert or update on public.template_expenses
  for each row execute procedure public.set_updated_by();

create or replace trigger template_allocations_set_updated_by
  before insert or update on public.template_allocations
  for each row execute procedure public.set_updated_by();

create or replace trigger monthly_incomes_set_updated_by
  before insert or update on public.monthly_incomes
  for each row execute procedure public.set_updated_by();

create or replace trigger monthly_expenses_set_updated_by
  before insert or update on public.monthly_expenses
  for each row execute procedure public.set_updated_by();

create or replace trigger monthly_allocations_set_updated_by
  before insert or update on public.monthly_allocations
  for each row execute procedure public.set_updated_by();
