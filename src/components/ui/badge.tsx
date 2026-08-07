import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "income" | "expense" | "default" }) {
  const styles = {
    default: "bg-muted text-muted-foreground",
    income: "bg-income-soft text-income",
    expense: "bg-expense-soft text-expense",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
