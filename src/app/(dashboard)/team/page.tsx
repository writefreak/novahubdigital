// import { TeamClient } from "@/components/team/team-client";
// import { requireMembership } from "@/lib/supabase/membership";
// import { listMembersAction } from "@/lib/supabase/team";

// export default async function TeamPage() {
//   const { role } = await requireMembership();
//   const members = await listMembersAction();

//   return <TeamClient members={members} myRole={role} />;
// }

import { TeamClient } from "@/components/team/team-client";
import { requireMembership } from "@/lib/supabase/membership";
import { listMembersAction } from "@/lib/supabase/team";

export default async function TeamPage() {
  try {
    const { role } = await requireMembership();
    const members = await listMembersAction();

    return <TeamClient members={members} myRole={role} />;
  } catch (err) {
    console.error("TeamPage render failed:", err);
    throw err; // still surfaces as #441 to the browser, but now you have the real error in prod logs
  }
}
