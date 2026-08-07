"use client";

import { ShieldCheck } from "lucide-react";
import { Role } from "@/lib/supabase/membership";
import { MemberRow } from "@/lib/supabase/team";
import { AccessRole, RoleSwitch } from "./role-switch";
import { RemoveButton } from "./remove-btn";

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
  isOwner,
  pending,
  onRoleChange,
  onRemove,
}: {
  member: MemberRow;
  isOwner: boolean;
  pending: boolean;
  onRoleChange: (role: AccessRole) => void;
  onRemove: () => void;
}) {
  const isTargetOwner = member.role === "owner";
  return (
    <li className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${
            isTargetOwner
              ? "bg-accent text-accent-foreground"
              : "bg-accent-soft text-accent"
          }`}
        >
          {initials(member.email)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{member.email}</p>
          {isTargetOwner && (
            <p className="text-xs text-muted-foreground">
              Owner · full control
            </p>
          )}
        </div>
      </div>

      {isOwner && !isTargetOwner ? (
        <div className="flex min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="w-full sm:w-36">
            <RoleSwitch
              value={member.role as AccessRole}
              onChange={onRoleChange}
              disabled={pending}
              size="sm"
            />
          </div>
          <RemoveButton onConfirm={onRemove} disabled={pending} />
        </div>
      ) : (
        !isTargetOwner && (
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck size={13} />
            {ROLE_LABEL[member.role]}
          </span>
        )
      )}
    </li>
  );
}
