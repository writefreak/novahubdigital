"use server";

import { revalidatePath } from "next/cache";
import {
  requireMembership,
  requireRole,
  type Role,
} from "@/lib/supabase/membership";
import { createAdminClient } from "./admin";

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

  // business_members only stores user_id — emails live in auth.users,
  // which needs the admin client to read.
  const admin = createAdminClient();
  const rows: MemberRow[] = [];
  for (const m of members) {
    const { data } = await admin.auth.admin.getUserById(m.user_id);
    rows.push({
      userId: m.user_id,
      email: data.user?.email ?? "(unknown)",
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

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { invited_business_id: businessId, invited_role: role },
  });

  if (error) throw new Error(error.message);

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
