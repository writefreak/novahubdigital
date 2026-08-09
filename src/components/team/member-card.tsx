"use client";

import { ShieldCheck, Trash2 } from "lucide-react";
import { Role } from "@/lib/supabase/membership";
import { MemberRow } from "@/lib/supabase/team";

const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  full: "Full access",
  add_only: "Add only",
};

function initials(email: string) {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

export function MemberCard({
  member,
  currentUserId,
  pending,
  onDeleteSelf,
}: {
  member: MemberRow;
  currentUserId: string;
  pending: boolean;
  onDeleteSelf: () => void;
}) {
  const memberId =
    member.userId ||
    (member as unknown as { user_id?: string }).user_id ||
    (member as unknown as { id?: string }).id ||
    "";

  const isMe =
    Boolean(currentUserId) &&
    Boolean(memberId) &&
    String(memberId).toLowerCase() === String(currentUserId).toLowerCase();

  return (
    <li className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-semibold text-accent">
          {initials(member.email)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{member.email}</p>
            {isMe && (
              <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                You
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABEL[member.role] || "Member"}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2 sm:w-auto">
        {/* Render Delete Account ONLY for the logged-in user's own card */}
        {isMe ? (
          <button
            type="button"
            onClick={onDeleteSelf}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
          >
            <Trash2 size={13} />
            <span>Delete Account</span>
          </button>
        ) : (
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck size={13} />
            {ROLE_LABEL[member.role] || "Member"}
          </span>
        )}
      </div>
    </li>
  );
}
