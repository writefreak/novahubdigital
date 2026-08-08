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

export async function listMembersAction(): Promise<MemberRow[]> {
  const { supabase, businessId } = await requireMembership();

  const { data: members, error } = await supabase
    .from("business_members")
    .select("user_id, role")
    .eq("business_id", businessId);

  if (error) throw new Error(error.message);
  if (!members?.length) return [];

  // Fetch Clerk user details batching or looping with Clerk SDK
  const client = await clerkClient();
  const rows: MemberRow[] = [];

  for (const m of members) {
    let email = "(unknown)";
    try {
      const user = await client.users.getUser(m.user_id);
      email = user.emailAddresses[0]?.emailAddress ?? "(unknown)";
    } catch {
      // Handles cases where a user might be deleted in Clerk
    }

    rows.push({
      userId: m.user_id,
      email,
      role: m.role as Role,
    });
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
