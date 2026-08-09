// src/app/(dashboard)/team/page.tsx
import { TeamClient } from "@/components/team/team-client";
import { requireMembership } from "@/lib/supabase/membership";
import { listMembersAction } from "@/lib/supabase/team";

export default async function TeamPage() {
  const { userId } = await requireMembership();
  const members = await listMembersAction();

  return <TeamClient members={members} currentUserId={userId ?? ""} />;
}
