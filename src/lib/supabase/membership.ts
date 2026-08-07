import { auth } from "@clerk/nextjs/server";
import { createClient } from "./server";

export type Role = "owner" | "full" | "add_only";

export type Membership = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  businessId: string;
  role: Role;
};

export async function requireMembership(): Promise<Membership> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not signed in.");
  }

  const supabase = await createClient();

  // 1. Try to fetch existing membership
  let { data, error } = await supabase
    .from("business_members")
    .select("business_id, role")
    .eq("user_id", userId)
    .maybeSingle();

  // 2. If no membership exists (first-time login), create business automatically
  if (!data) {
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .insert({ name: "My Cybercafe" })
      .select("id")
      .single();

    if (bizError || !business) {
      throw new Error("Failed to initialize cybercafe business.");
    }

    await supabase.from("business_members").insert({
      business_id: business.id,
      user_id: userId,
      role: "owner",
    });

    await supabase.from("services").insert([
      { business_id: business.id, name: "Browsing 1hr", price: 300 },
      { business_id: business.id, name: "Printing per page", price: 100 },
      { business_id: business.id, name: "Scanning per page", price: 150 },
      { business_id: business.id, name: "CV/Document Typing", price: 1000 },
      { business_id: business.id, name: "Photocopy per page", price: 50 },
    ]);

    data = {
      business_id: business.id,
      role: "owner",
    };
  }

  return {
    supabase,
    userId,
    businessId: data.business_id as string,
    role: data.role as Role,
  };
}

export function requireRole(role: Role, allowed: Role[]) {
  if (!allowed.includes(role)) {
    throw new Error("You don't have permission to do that.");
  }
}
