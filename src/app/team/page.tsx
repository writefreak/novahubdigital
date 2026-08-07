import { TeamClient } from "@/components/team/team-client";
import { requireMembership } from "@/lib/supabase/membership";
import { listMembersAction } from "@/lib/supabase/team";

export default async function TeamPage() {
  const { role } = await requireMembership();
  const members = await listMembersAction();

  return <TeamClient members={members} myRole={role} />;
}
