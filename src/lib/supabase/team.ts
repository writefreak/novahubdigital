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

//   const { data: members, error } = await supabase
//     .from("business_members")
//     .select("user_id, role")
//     .eq("business_id", businessId);

//   if (error) throw new Error(error.message);
//   if (!members?.length) return [];

//   // Fetch Clerk user details batching or looping with Clerk SDK
//   const client = await clerkClient();
//   const rows: MemberRow[] = [];

//   for (const m of members) {
//     let email = "(unknown)";
//     try {
//       const user = await client.users.getUser(m.user_id);
//       email = user.emailAddresses[0]?.emailAddress ?? "(unknown)";
//     } catch {
//       // Handles cases where a user might be deleted in Clerk
//     }

//     rows.push({
//       userId: m.user_id,
//       email,
//       role: m.role as Role,
//     });
//   }

//   return rows;
// }

export async function listMembersAction(): Promise<MemberRow[]> {
  const { supabase, businessId } = await requireMembership();
  const client = await clerkClient();

  // 1. Fetch current rows from Supabase
  const { data: dbMembers, error } = await supabase
    .from("business_members")
    .select("user_id, role")
    .eq("business_id", businessId);

  if (error) throw new Error(error.message);

  const existingUserIds = new Set((dbMembers || []).map((m) => m.user_id));

  // 2. Fetch all users from Clerk
  const clerkUsers = await client.users.getUserList({ limit: 100 });

  const rows: MemberRow[] = [];

  for (const user of clerkUsers.data) {
    const userBusinessId = user.publicMetadata?.invited_business_id;
    const isAlreadyInDb = existingUserIds.has(user.id);

    // If the user belongs to this business
    if (isAlreadyInDb || userBusinessId === businessId) {
      const email = user.emailAddresses[0]?.emailAddress ?? "(unknown)";
      const role =
        (user.publicMetadata?.invited_role as Role) ||
        (dbMembers?.find((m) => m.user_id === user.id)?.role as Role) ||
        "add_only";

      // If they signed up via Clerk invite but haven't been inserted into Supabase yet, insert now
      if (!isAlreadyInDb && userBusinessId === businessId) {
        await supabase.from("business_members").insert({
          business_id: businessId,
          user_id: user.id,
          role: role,
        });
      }

      rows.push({
        userId: user.id,
        email,
        role,
      });
    }
  }

  return rows;
}

export async function inviteMemberAction(
  email: string,
  role: Role,
): Promise<void> {
  const { businessId, role: myRole } = await requireMembership();
  requireRole(myRole, ["owner"]);

  const client = await clerkClient();

  try {
    // Create invitation through Clerk
    await client.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: {
        invited_business_id: businessId,
        invited_role: role,
      },
    });
  } catch (err: any) {
    const isDuplicate = err?.errors?.some(
      (e: any) => e.code === "duplicate_record",
    );

    if (isDuplicate) {
      throw new Error(
        `An invitation has already been sent to ${email}. Please check pending invites.`,
      );
    }

    const message =
      err?.errors?.[0]?.longMessage ||
      err?.message ||
      "Failed to send invitation.";
    throw new Error(message);
  }

  revalidatePath("/team");
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
