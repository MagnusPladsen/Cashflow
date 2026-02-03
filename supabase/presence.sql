-- Enable Realtime on budget/template tables
alter publication supabase_realtime add table public.template_incomes;
alter publication supabase_realtime add table public.template_expenses;
alter publication supabase_realtime add table public.template_allocations;
alter publication supabase_realtime add table public.monthly_incomes;
alter publication supabase_realtime add table public.monthly_expenses;
alter publication supabase_realtime add table public.monthly_allocations;
