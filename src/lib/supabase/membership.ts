import { createClient } from "@/lib/supabase/server";

export type Role = "owner" | "full" | "add_only";

export type Membership = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  businessId: string;
  role: Role;
};

// Every current user belongs to exactly one business (they either created
// one on signup or were invited into one). If you ever let one person
// belong to multiple cybercafes, this is the function to change — it'd
// need a businessId argument instead of assuming "the" business.
export async function requireMembership(): Promise<Membership> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { data, error } = await supabase
    .from("business_members")
    .select("business_id, role")
    .eq("user_id", user.id)
    .single();

  if (error || !data) throw new Error("No business membership found.");

  return {
    supabase,
    userId: user.id,
    businessId: data.business_id as string,
    role: data.role as Role,
  };
}

export function requireRole(role: Role, allowed: Role[]) {
  if (!allowed.includes(role)) {
    throw new Error("You don't have permission to do that.");
  }
}
