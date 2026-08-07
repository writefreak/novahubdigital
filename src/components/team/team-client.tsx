"use client";

import { useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from "@/lib/supabase/membership";
import { Button } from "../ui/button";
import {
  inviteMemberAction,
  MemberRow,
  removeMemberAction,
  updateMemberRoleAction,
} from "@/lib/supabase/team";

const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  full: "Full access",
  add_only: "Add only",
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
  const [role, setRole] = useState<Role>("add_only");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await inviteMemberAction(email, role);
        setEmail("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleRoleChange(userId: string, newRole: Role) {
    startTransition(async () => {
      try {
        await updateMemberRoleAction(userId, newRole);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleRemove(userId: string) {
    startTransition(async () => {
      try {
        await removeMemberAction(userId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Team</h1>

      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.userId}
            className="flex items-center justify-between gap-2 rounded-md border p-3"
          >
            <span>{m.email}</span>
            {isOwner && m.role !== "owner" ? (
              <div className="flex items-center gap-2">
                <select
                  className="rounded-md border bg-transparent px-2 py-1 text-sm"
                  value={m.role}
                  disabled={pending}
                  onChange={(e) =>
                    handleRoleChange(m.userId, e.target.value as Role)
                  }
                >
                  <option value="add_only">Add only</option>
                  <option value="full">Full access</option>
                </select>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => handleRemove(m.userId)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <span className="text-sm opacity-70">{ROLE_LABEL[m.role]}</span>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <form onSubmit={handleInvite} className="space-y-3 border-t pt-4">
          <h2 className="font-medium">Invite someone</h2>
          <div className="space-y-1">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="invite-role">Access level</Label>
            <select
              id="invite-role"
              className="w-full rounded-md border bg-transparent px-2 py-1 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="add_only">
                Add only — can log sales/expenses
              </option>
              <option value="full">Full access — can also edit/delete</option>
            </select>
          </div>
          {error && <p className="text-sm text-expense">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send invite"}
          </Button>
        </form>
      )}
    </div>
  );
}
