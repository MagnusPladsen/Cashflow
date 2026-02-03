-- Accept household invites for the current authenticated user.

create or replace function public.accept_household_invites()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
  current_email text := auth.email();
  current_id uuid := auth.uid();
begin
  if current_email is null then
    return 0;
  end if;

  update public.household_members
    set user_id = current_id,
        status = 'active'
  where invited_email = current_email
    and status = 'invited'
    and user_id is null;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;
