-- Add spending transfer support to expenses
alter table public.template_expenses
  add column if not exists type text not null default 'expense',
  add column if not exists spending_account text;

alter table public.template_expenses
  drop constraint if exists template_expenses_type_check;

alter table public.template_expenses
  add constraint template_expenses_type_check
  check (type in ('expense', 'spending_transfer'));

alter table public.monthly_expenses
  add column if not exists type text not null default 'expense',
  add column if not exists spending_account text;

alter table public.monthly_expenses
  drop constraint if exists monthly_expenses_type_check;

alter table public.monthly_expenses
  add constraint monthly_expenses_type_check
  check (type in ('expense', 'spending_transfer'));
