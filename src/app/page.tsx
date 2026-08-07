"use client";

import { TrendingUp, TrendingDown, Scale } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { EntryItem } from "@/components/log/entry-item";
import { useTodayEntries, useInitStore } from "@/lib/store";
import Link from "next/link";

export default function DashboardPage() {
  useInitStore();
  const todayEntries = useTodayEntries();
  const income = todayEntries
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.amount, 0);
  const expense = todayEntries
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.amount, 0);
  const net = income - expense;
  const recent = todayEntries.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div className="-mx-4 rounded-b-2xl px-4 pb-6 pt-1 lg:mx-0 lg:rounded-2xl lg:px-6 lg:py-6">
        <h1 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">
          Hello, Welcome Back 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of how NovaHub is doing today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Today's sales"
          amount={income}
          icon={TrendingUp}
          tone="income"
          delay={0}
          className="order-2 sm:order-1"
        />
        <StatCard
          label="Today's expenses"
          amount={expense}
          icon={TrendingDown}
          tone="expense"
          delay={0.05}
          className="order-3 sm:order-2"
        />
        <StatCard
          label="Net today"
          amount={net}
          icon={Scale}
          tone="accent"
          emphasis
          delay={0.1}
          className="order-1 col-span-2 sm:order-3 sm:col-span-1"
        />
      </div>

      <TrendChart />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Today&apos;s activity
          </h2>
          <Link
            href="/log"
            className="text-sm font-semibold text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-accent/30 bg-accent-soft/30 p-6 text-center text-sm text-muted-foreground">
            Nothing logged yet today. Tap the + button to add your first entry.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recent.map((entry, i) => (
              <EntryItem key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
