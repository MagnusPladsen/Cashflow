-- Allow creators to read their newly created household and insert initial owner membership.

drop policy if exists "households member read" on public.households;

create policy "households member read"
  on public.households for select
  using (public.is_household_member(id) or created_by = auth.uid());

drop policy if exists "household_members owner insert" on public.household_members;

create policy "household_members owner insert"
  on public.household_members for insert
  with check (
    public.is_household_owner(household_id)
    or (
      role = 'owner'
      and user_id = auth.uid()
      and exists (
        select 1
        from public.households h
        where h.id = household_id
          and h.created_by = auth.uid()
      )
    )
  );
