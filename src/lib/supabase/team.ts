"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import {
  requireMembership,
  requireRole,
  type Role,
} from "@/lib/supabase/membership";

export type MemberRow = {
  userId: string;
  email: string;
  role: Role;
};

// export async function listMembersAction(): Promise<MemberRow[]> {
//   const { supabase, businessId } = await requireMembership();
//   const client = await clerkClient();

//   // 1. Get all members for this business directly from Supabase
//   const { data: dbMembers, error } = await supabase
//     .from("business_members")
//     .select("user_id, role")
//     .eq("business_id", businessId);

//   if (error) throw new Error(error.message);
//   if (!dbMembers || dbMembers.length === 0) return [];

//   const dbMemberMap = new Map(
//     dbMembers.map((m) => [m.user_id, m.role as Role]),
//   );
//   const userIds = Array.from(dbMemberMap.keys());

//   // 2. Fetch all matching users directly from Clerk
//   const clerkUsers = await client.users.getUserList({
//     userId: userIds,
//     limit: 100,
//   });

//   // 3. Map user profiles to member rows
//   return clerkUsers.data.map((user) => ({
//     userId: user.id,
//     email: user.emailAddresses[0]?.emailAddress ?? "(unknown)",
//     role: dbMemberMap.get(user.id) || "add_only",
//   }));
// }

export async function listMembersAction(): Promise<MemberRow[]> {
  const { supabase, businessId } = await requireMembership();
  const client = await clerkClient();

  // 1. Fetch ALL users registered in Clerk (up to limit or paginated)
  const clerkUsers = await client.users.getUserList({
    limit: 100,
  });

  // 2. Fetch business roles to overlay permissions if available
  const { data: dbMembers } = await supabase
    .from("business_members")
    .select("user_id, role")
    .eq("business_id", businessId);

  const dbMemberMap = new Map(
    (dbMembers || []).map((m) => [m.user_id, m.role as Role]),
  );

  // 3. Map all Clerk users
  return clerkUsers.data.map((user) => ({
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? "(unknown)",
    role: dbMemberMap.get(user.id) || "add_only",
  }));
}

export async function updateMemberRoleAction(
  targetUserId: string,
  role: Role,
): Promise<void> {
  const {
    supabase,
    businessId,
    role: myRole,
    userId,
  } = await requireMembership();
  requireRole(myRole, ["owner"]);

  if (targetUserId === userId) {
    throw new Error("You can't change your own role.");
  }

  const { error } = await supabase
    .from("business_members")
    .update({ role })
    .eq("business_id", businessId)
    .eq("user_id", targetUserId);

  if (error) throw new Error(error.message);

  revalidatePath("/team");
}

export async function removeMemberAction(targetUserId: string): Promise<void> {
  const {
    supabase,
    businessId,
    role: myRole,
    userId,
  } = await requireMembership();
  requireRole(myRole, ["owner"]);

  if (targetUserId === userId) {
    throw new Error("You can't remove yourself.");
  }

  const { error } = await supabase
    .from("business_members")
    .delete()
    .eq("business_id", businessId)
    .eq("user_id", targetUserId);

  if (error) throw new Error(error.message);

  revalidatePath("/team");
}

export async function deleteSelfAccountAction(): Promise<{ success: boolean }> {
  const { supabase, businessId, userId } = await requireMembership();
  const client = await clerkClient();

  // 1. Remove user from Supabase business records
  const { error } = await supabase
    .from("business_members")
    .delete()
    .eq("business_id", businessId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  // 2. Delete user account completely from Clerk
  await client.users.deleteUser(userId);

  return { success: true };
}
