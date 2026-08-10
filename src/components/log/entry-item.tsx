"use client";

import { motion } from "framer-motion";
import { Trash2, ShoppingBag, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatNaira } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { Entry } from "@/lib/types";

export function EntryItem({
  entry,
  index = 0,
}: {
  entry: Entry;
  index?: number;
}) {
  const removeEntry = useStore((s) => s.removeEntry);
  const isIncome = entry.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
      className="w-full min-w-0"
    >
      <Card className="p-3.5 sm:p-3.5 w-full min-w-0 overflow-hidden relative">
        {/* ================= MOBILE CARD UI ================= */}
        <div className="flex flex-col gap-2.5 sm:hidden">
          {/* Header Row: Icon + Title + Delete Action */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isIncome
                    ? "bg-income-soft text-income"
                    : "bg-expense-soft text-expense",
                )}
              >
                {isIncome ? (
                  <ShoppingBag className="h-4 w-4" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground">
                  {isIncome ? entry.customerName : entry.item}
                </p>
                {isIncome && (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {entry.serviceName ?? "service"}
                  </p>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="no-print h-7 w-7 text-muted-foreground hover:text-expense shrink-0"
              onClick={() => removeEntry(entry.id)}
              aria-label="Delete entry"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Note Section (If present) */}
          {entry.note && (
            <div className="bg-muted/40 rounded-md p-2 min-w-0">
              <p className="text-[11px] text-muted-foreground truncate">
                {entry.note}
              </p>
            </div>
          )}

          {/* Bottom Highlight Row: Amount Badge */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
              {isIncome ? "Income" : "Expense"}
            </span>
            <Badge
              variant={isIncome ? "income" : "expense"}
              className="text-xs px-2.5 py-0.5 font-semibold"
            >
              {isIncome ? "+" : "-"}
              {formatNaira(entry.amount)}
            </Badge>
          </div>
        </div>

        {/* ================= DESKTOP ROW UI ================= */}
        <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-3 min-w-0">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              isIncome
                ? "bg-income-soft text-income"
                : "bg-expense-soft text-expense",
            )}
          >
            {isIncome ? (
              <ShoppingBag className="h-4.5 w-4.5" />
            ) : (
              <Wallet className="h-4.5 w-4.5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            {isIncome ? (
              <p className="truncate text-sm font-semibold">
                {entry.customerName}{" "}
                <span className="font-normal text-muted-foreground">
                  &mdash; {entry.serviceName ?? "service"}
                </span>
              </p>
            ) : (
              <p className="truncate text-sm font-semibold">{entry.item}</p>
            )}
            {entry.note && (
              <p className="truncate text-xs text-muted-foreground">
                {entry.note}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant={isIncome ? "income" : "expense"}
              className="text-xs px-2.5 py-0.5"
            >
              {isIncome ? "+" : "-"}
              {formatNaira(entry.amount)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="no-print h-8 w-8 text-muted-foreground hover:text-expense"
              onClick={() => removeEntry(entry.id)}
              aria-label="Delete entry"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
