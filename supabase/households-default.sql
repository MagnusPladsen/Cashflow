-- Ensure created_by defaults to current user for households
alter table public.households
  alter column created_by set default auth.uid();

drop policy if exists "households create" on public.households;

create policy "households create"
  on public.households for insert
  with check (auth.uid() is not null and created_by = auth.uid());
