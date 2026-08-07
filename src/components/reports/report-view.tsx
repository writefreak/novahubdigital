"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import type { Entry } from "@/lib/types";

export function ReportView({
  entries,
  rangeLabel,
}: {
  entries: Entry[];
  rangeLabel: string;
}) {
  const income = entries.filter((e) => e.type === "income");
  const expenses = entries.filter((e) => e.type === "expense");
  const totalIncome = income.reduce((s, e) => s + e.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Report &mdash; {rangeLabel}</CardTitle>
            <CardDescription>
              Plain summary for NovaHub, ready to read or print.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="no-print shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Total sales</p>
            <p className="font-display text-lg font-bold text-income">
              {formatNaira(totalIncome)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total spent</p>
            <p className="font-display text-lg font-bold text-expense">
              {formatNaira(totalExpense)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="font-display text-lg font-bold text-accent">
              {formatNaira(totalIncome - totalExpense)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-2.5 font-display text-base font-semibold">
          Customers served
        </h2>
        {income.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No customer sales in this period.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {income.map((e) => (
              <p
                key={e.id}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="font-semibold">{e.customerName}</span> came{" "}
                {rangeLabel === "Today" ? "today" : "in"} to do{" "}
                <span className="font-semibold">
                  {e.serviceName ?? "a service"}
                </span>
                , for{" "}
                <span className="font-semibold text-income">
                  {formatNaira(e.amount)}
                </span>
                .
              </p>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2.5 font-display text-base font-semibold">
          Money spent
        </h2>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No expenses in this period.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {expenses.map((e) => (
              <p
                key={e.id}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
              >
                I spent{" "}
                <span className="font-semibold text-expense">
                  {formatNaira(e.amount)}
                </span>{" "}
                {rangeLabel === "Today" ? "today" : ""} for{" "}
                <span className="font-semibold">{e.item}</span>
                {e.note ? ` (${e.note})` : ""}.
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
