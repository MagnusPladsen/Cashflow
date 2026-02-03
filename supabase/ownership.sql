-- Prevent removing/demoting the last owner

create or replace function public.prevent_last_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_count integer;
  target_household uuid := coalesce(new.household_id, old.household_id);
begin
  select count(*) into owner_count
  from public.household_members
  where household_id = target_household
    and role = 'owner'
    and status = 'active';

  if tg_op = 'DELETE' then
    if old.role = 'owner' and owner_count <= 1 then
      raise exception 'Cannot remove last owner';
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    if old.role = 'owner' and new.role <> 'owner' and owner_count <= 1 then
      raise exception 'Cannot demote last owner';
    end if;
    return new;
  end if;

  return new;
end;
$$;

create or replace trigger household_members_prevent_last_owner
  before update or delete on public.household_members
  for each row execute procedure public.prevent_last_owner();
