"use client";

import { useState, useTransition } from "react";
import { Mail, Send, PlusCircle } from "lucide-react";
import { Role } from "@/lib/supabase/membership";
import {
  inviteMemberAction,
  MemberRow,
  removeMemberAction,
  updateMemberRoleAction,
} from "@/lib/supabase/team";
import { AccessRole, RoleSwitch } from "./role-switch";
import { MemberCard } from "./member-card";

const ROLE_DESCRIPTION: Record<AccessRole, string> = {
  add_only: "Can log sales & expenses",
  full: "Can also edit & delete",
};

export function TeamClient({
  members,
  myRole,
}: {
  members: MemberRow[];
  myRole: Role;
}) {
  const isOwner = myRole === "owner";
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AccessRole>("add_only");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(() => {
      inviteMemberAction(email, role)
        .then(() => {
          setEmail("");
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        });
    });
  }

  function handleRoleChange(userId: string, newRole: AccessRole) {
    setError(null);
    startTransition(() => {
      updateMemberRoleAction(userId, newRole).catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      });
    });
  }

  function handleRemove(userId: string) {
    setError(null);
    startTransition(() => {
      removeMemberAction(userId).catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      });
    });
  }

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-xl font-semibold">Team</h1>
        <span className="text-xs text-muted-foreground">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>

      <ul className="w-full min-w-0 space-y-2">
        {members.map((m) => (
          <MemberCard
            key={m.userId}
            member={m}
            isOwner={isOwner}
            pending={pending}
            onRoleChange={(newRole) => handleRoleChange(m.userId, newRole)}
            onRemove={() => handleRemove(m.userId)}
          />
        ))}
      </ul>

      {/* {isOwner && (
        <form
          onSubmit={handleInvite}
          className="w-full min-w-0 space-y-4 rounded-xl border border-dashed border-border bg-card/50 p-4 sm:p-5"
        >
          <div className="flex items-center gap-2">
            <PlusCircle size={16} className="text-accent" />
            <h2 className="font-display text-sm font-semibold">
              Invite someone
            </h2>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-1.5">
              <label
                htmlFor="invite-email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email address
              </label>
              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                <Mail size={15} className="shrink-0 text-muted-foreground" />
                <input
                  id="invite-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="w-full space-y-1.5 sm:w-40">
              <span className="block text-xs font-medium text-muted-foreground">
                Access level
              </span>
              <RoleSwitch value={role} onChange={setRole} disabled={pending} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {ROLE_DESCRIPTION[role]}
          </p>

          {error && <p className="text-sm text-expense">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent-foreground/30 border-t-accent-foreground" />
            ) : (
              <Send size={14} />
            )}
            {pending ? "Sending…" : "Send invite"}
          </button>
        </form>
      )} */}
    </div>
  );
}
