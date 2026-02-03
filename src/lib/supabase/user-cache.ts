import { createClient } from "@/lib/supabase/client";

const nameCache = new Map<string, string>();

export async function getUserDisplayName(userId: string) {
  if (nameCache.has(userId)) {
    return nameCache.get(userId) as string;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return "";
  }

  const name = data?.full_name ?? "";
  if (name) {
    nameCache.set(userId, name);
  }
  return name;
}
