"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/utils";

export function TrendChart() {
  const entries = useStore((s) => s.entries);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const data = days.map((date) => {
    const dayEntries = entries.filter((e) => e.date === date);
    const income = dayEntries
      .filter((e) => e.type === "income")
      .reduce((s, e) => s + e.amount, 0);
    const expense = dayEntries
      .filter((e) => e.type === "expense")
      .reduce((s, e) => s + e.amount, 0);
    return {
      label: new Intl.DateTimeFormat("en-NG", { weekday: "short" }).format(
        new Date(date),
      ),
      income,
      expense,
    };
  });

  // Calculate maximum value across all days to scale mobile relative progress bars accurately
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);

  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm w-full min-w-0 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
        <div>
          <CardTitle className="font-display text-sm md:text-base font-semibold">
            This week
          </CardTitle>
          <CardDescription className="text-xs">
            Sales vs. expenses, last 7 days
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 font-semibold uppercase pt-2 sm:pt-0 text-muted-foreground">
          <span className="flex text-xs md:text-sm items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-income shrink-0" />
            Sales
          </span>
          <span className="flex text-xs md:text-sm items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-expense shrink-0" />
            Expenses
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:px-6 sm:pb-4 sm:pt-2">
        {/* MOBILE VIEW (< sm): Horizontal comparative breakdown */}
        <div className="flex flex-col gap-3 sm:hidden w-full">
          {data.map((day, idx) => {
            const incomePct = Math.min(
              100,
              Math.round((day.income / maxVal) * 100),
            );
            const expensePct = Math.min(
              100,
              Math.round((day.expense / maxVal) * 100),
            );

            return (
              <div
                key={idx}
                className="flex flex-col gap-1 border-b border-border/40 pb-2 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground w-10">
                    {day.label}
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-income font-medium">
                      {formatNaira(day.income)}
                    </span>
                    <span className="text-muted-foreground/40">|</span>
                    <span className="text-expense font-medium">
                      {formatNaira(day.expense)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 w-full pt-0.5">
                  {/* Sales Bar */}
                  <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-income rounded-full transition-all duration-300"
                      style={{ width: `${incomePct}%` }}
                    />
                  </div>
                  {/* Expense Bar */}
                  <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-expense rounded-full transition-all duration-300"
                      style={{ width: `${expensePct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP/TABLET VIEW (>= sm): Recharts BarChart */}
        <div className="hidden sm:block h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              barGap={4}
              barCategoryGap="25%"
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--income)" stopOpacity={1} />
                  <stop
                    offset="100%"
                    stopColor="var(--income)"
                    stopOpacity={0.7}
                  />
                </linearGradient>
                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--expense)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--expense)"
                    stopOpacity={0.7}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", radius: 6 }}
                content={
                  <ChartTooltipContent formatter={(v) => formatNaira(v)} />
                }
              />
              <Bar
                dataKey="income"
                fill="url(#incomeFill)"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
              />
              <Bar
                dataKey="expense"
                fill="url(#expenseFill)"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
