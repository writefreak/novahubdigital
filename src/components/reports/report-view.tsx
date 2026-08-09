"use client";

import * as React from "react";
import { Printer, Share2, Check } from "lucide-react";
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
  dateStr, // e.g., "2026-08-09" passed from parent
}: {
  entries: Entry[];
  rangeLabel: string;
  dateStr?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const income = entries.filter((e) => e.type === "income");
  const expenses = entries.filter((e) => e.type === "expense");
  const totalIncome = income.reduce((s, e) => s + e.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  async function handleShare() {
    const targetDate = dateStr || new Date().toISOString().slice(0, 10);

    // Force https on your exact current host and path
    const protocol = "https:";
    const host = window.location.host;
    const pathname = window.location.pathname;

    const shareUrl = `${protocol}//${host}${pathname}/share?date=${targetDate}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `NovaHub Report - ${rangeLabel}`,
          text: `Financial report for ${rangeLabel}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback if user cancels
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy share link:", err);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="">
        <CardHeader className="flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base md:text-lg">
              {rangeLabel}'s report
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-muted-foreground">
              Plain summary for NovaHub, ready to read or print.
            </CardDescription>
          </div>
          <div className="no-print flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="p-4 bg-muted/30 border-border/60 shadow-none">
            <p className="text-xs text-muted-foreground">Total sales</p>
            <p className="font-display mt-1 text-lg font-bold text-income">
              {formatNaira(totalIncome)}
            </p>
          </Card>
          <Card className="p-4 bg-muted/30 border-border/60 shadow-none">
            <p className="text-xs text-muted-foreground">Total spent</p>
            <p className="font-display mt-1 text-lg font-bold text-expense">
              {formatNaira(totalExpense)}
            </p>
          </Card>
          <Card className="p-4 bg-muted/30 border-border/60 shadow-none">
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="font-display mt-1 text-lg font-bold text-accent">
              {formatNaira(totalIncome - totalExpense)}
            </p>
          </Card>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-2.5 font-display text-sm md:text-base font-semibold">
          Customers served
        </h2>
        {income.length === 0 ? (
          <p className="text-xs md:text-sm text-muted-foreground">
            No customer sales in this period.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {income.map((e) => (
              <p
                key={e.id}
                className="rounded-lg border border-border bg-card px-4 py-3 text-xs md:text-sm"
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
        <h2 className="mb-2.5 font-display text-sm md:text-base font-semibold">
          Money spent
        </h2>
        {expenses.length === 0 ? (
          <p className="text-xs md:text-sm text-muted-foreground">
            No expenses in this period.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {expenses.map((e) => (
              <p
                key={e.id}
                className="rounded-lg border border-border bg-card px-4 py-3 text-xs md:text-sm"
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
