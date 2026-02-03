import { createClient } from "@/lib/supabase/client";

export async function fetchCurrentUserName() {
  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) return "";
  if (!user) return "";
  return (
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    ""
  );
}
