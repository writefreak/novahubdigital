"use client";

import { motion } from "framer-motion";
import { Trash2, ShoppingBag, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatNaira } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { Entry } from "@/lib/types";

export function EntryItem({ entry, index = 0 }: { entry: Entry; index?: number }) {
  const removeEntry = useStore((s) => s.removeEntry);
  const isIncome = entry.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Card className="flex items-center gap-3 p-3.5">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isIncome ? "bg-income-soft text-income" : "bg-expense-soft text-expense"
          )}
        >
          {isIncome ? <ShoppingBag className="h-[18px] w-[18px]" /> : <Wallet className="h-[18px] w-[18px]" />}
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
          {entry.note && <p className="truncate text-xs text-muted-foreground">{entry.note}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={isIncome ? "income" : "expense"}>
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
      </Card>
    </motion.div>
  );
}
