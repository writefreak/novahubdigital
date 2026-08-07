"use client";

import { motion } from "framer-motion";
import { cn, formatNaira } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  amount,
  icon: Icon,
  tone,
  delay = 0,
}: {
  label: string;
  amount: number;
  icon: LucideIcon;
  tone: "accent" | "income" | "expense";
  delay?: number;
}) {
  const toneStyles = {
    accent: "bg-accent-soft text-accent",
    income: "bg-income-soft text-income",
    expense: "bg-expense-soft text-expense",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", toneStyles[tone])}>
            <Icon className="h-4 w-4" strokeWidth={2.25} />
          </div>
        </div>
        <p className="font-display mt-3 text-2xl font-bold tracking-tight lg:text-3xl">
          {formatNaira(amount)}
        </p>
      </Card>
    </motion.div>
  );
}
