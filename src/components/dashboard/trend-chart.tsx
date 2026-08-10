"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useStore } from "@/lib/store";
import { formatNaira } from "@/lib/utils";

const chartConfig: ChartConfig = {
  income: { label: "Sales", color: "var(--income)" },
  expense: { label: "Expenses", color: "var(--expense)" },
};

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

  return (
    <Card className="rounded-2xl border-border bg-card shadow-sm w-full overflow-hidden">
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
      <CardContent className="h-60 px-2 pb-4 pt-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full aspect-auto"
        >
          <BarChart
            data={data}
            barGap={2}
            barCategoryGap="15%"
            margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
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
                <stop offset="0%" stopColor="var(--expense)" stopOpacity={1} />
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
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
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
              maxBarSize={18}
            />
            <Bar
              dataKey="expense"
              fill="url(#expenseFill)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
