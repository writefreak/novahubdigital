"use client";

import { useState, useTransition } from "react";
import { useClerk } from "@clerk/nextjs";
import { AlertTriangle, Trash2 } from "lucide-react";
import { deleteSelfAccountAction, MemberRow } from "@/lib/supabase/team";
import { MemberCard } from "./member-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TeamClient({
  members,
  currentUserId,
}: {
  members: MemberRow[];
  currentUserId: string;
}) {
  const { signOut } = useClerk();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirmDeleteSelf, setConfirmDeleteSelf] = useState(false);

  // function handleDeleteSelf() {
  //   setConfirmDeleteSelf(false);
  //   setError(null);

  //   startTransition(async () => {
  //     try {
  //       await deleteSelfAccountAction();
  //       await signOut({ redirectUrl: "/signin" });
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "Something went wrong.");
  //     }
  //   });
  // }

  function handleDeleteSelf() {
    setConfirmDeleteSelf(false);
    setError(null);

    startTransition(async () => {
      try {
        await deleteSelfAccountAction();
        // Clear local Clerk session state without waiting for internal route re-evaluations
        await signOut();
        // Force a clean hard navigation to dump all stale in-memory session states
        window.location.href = "/signin";
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
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

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ul className="w-full min-w-0 space-y-2">
        {members.map((m) => {
          const keyId =
            m.userId ||
            (m as unknown as { user_id?: string }).user_id ||
            (m as unknown as { id?: string }).id ||
            "";

          return (
            <MemberCard
              key={keyId || m.email}
              member={m}
              currentUserId={currentUserId}
              pending={pending}
              onDeleteSelf={() => setConfirmDeleteSelf(true)}
            />
          );
        })}
      </ul>

      <Dialog open={confirmDeleteSelf} onOpenChange={setConfirmDeleteSelf}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Your Account?</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. Your user profile
              and access will be completely deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmDeleteSelf(false)}
              className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteSelf}
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
            >
              {pending ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-destructive-foreground/30 border-t-destructive-foreground" />
              ) : (
                <Trash2 size={14} />
              )}
              {pending ? "Deleting…" : "Confirm Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
