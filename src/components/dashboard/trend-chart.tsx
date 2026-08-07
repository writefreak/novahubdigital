"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
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
    const income = dayEntries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
    const expense = dayEntries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);
    return {
      label: new Intl.DateTimeFormat("en-NG", { weekday: "short" }).format(new Date(date)),
      income,
      expense,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>This week</CardTitle>
        <CardDescription>Sales vs. expenses over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="h-64 pt-4">
        <ChartContainer config={chartConfig}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={<ChartTooltipContent formatter={(v) => formatNaira(v)} />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
