"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

export function RemoveButton({
  onConfirm,
  disabled,
}: {
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      timeoutRef.current = setTimeout(() => setConfirming(false), 2500);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setConfirming(false);
    onConfirm();
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        confirming
          ? "border-expense bg-expense-soft text-expense"
          : "border-border text-muted-foreground hover:border-expense/40 hover:text-expense"
      }`}
    >
      <Trash2 size={13} strokeWidth={2.25} />
      {confirming ? "Confirm?" : "Remove"}
    </button>
  );
}
