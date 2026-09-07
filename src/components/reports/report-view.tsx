"use client";

import * as React from "react";
import {
  Printer,
  Share2,
  Check,
  Pencil,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileText,
  User,
  Tag,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { formatNaira } from "@/lib/utils";
import type { Entry } from "@/lib/types";
import { StatCard } from "../dashboard/stat-card";

interface ReportViewProps {
  entries: Entry[];
  rangeLabel: string;
  dateStr?: string;
  onEditEntry?: (entry: Entry) => void;
}

export function ReportView({
  entries,
  rangeLabel,
  dateStr,
  onEditEntry,
}: ReportViewProps) {
  const [copied, setCopied] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<Entry | null>(null);

  const income = entries.filter((e) => e.type === "income");
  const expenses = entries.filter((e) => e.type === "expense");
  const totalIncome = income.reduce((s, e) => s + e.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const netTotal = totalIncome - totalExpense;

  async function handleShare() {
    const targetDate = dateStr || new Date().toISOString().slice(0, 10);
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
        // Fallback if dismissed
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
    <div className="flex flex-col gap-6">
      {/* Header & Controls Bar */}
      {/* <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs"></Card> */}

      {/* Main Transactions Log */}
      <div className="overflow-hidden md:pt-8 pt-4">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Detailed Transaction Log
        </h2>

        {entries.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">
            No financial activity recorded for this period.
          </p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Description / Client</th>
                    <th className="p-3.5">Service / Item</th>
                    <th className="p-3.5 text-right">Amount</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {entries.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEntry(item)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5">
                        {item.type === "income" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />{" "}
                            Income
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                            <ArrowUpRight className="w-3 h-3 text-rose-600" />{" "}
                            Expense
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900">
                        {item.type === "income"
                          ? item.customerName || "Walk-in Customer"
                          : item.item || "Expense Item"}
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {item.type === "income"
                          ? item.serviceName || "General Service"
                          : item.note || "General Expense"}
                      </td>
                      <td
                        className={`p-3.5 text-right font-bold ${
                          item.type === "income"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {formatNaira(item.amount)}
                      </td>
                      <td className="p-3.5 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(item);
                          }}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-2.5 md:hidden">
              {entries.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedEntry(item)}
                  className="p-4 rounded-2xl border border-slate-100 bg-white shadow-2xs hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${
                        item.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {item.type === "income" ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.type === "income"
                          ? item.customerName || "Walk-in Customer"
                          : item.item || "Expense Item"}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {item.type === "income"
                          ? item.serviceName || "General Service"
                          : item.note || "Expense"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs font-bold ${
                        item.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {formatNaira(item.amount)}
                    </p>
                    <span className="text-[10px] text-slate-400">View</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* <div className="no-print flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="rounded-xl bg-[#ff5a1f] text-white hover:bg-[#e04f1a] gap-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Print Statement</span>
            </Button>
          </div> */}
      </div>

      {/* Transaction Details Slide-Over Sheet */}
      <Sheet open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <SheetContent className="w-full max-w-md md:rounded-l-3xl p-6">
          <SheetHeader className="pb-4 border-b border-slate-100">
            <SheetTitle className="text-lg font-bold text-slate-900">
              Transaction Details
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Full record information from report logs.
            </SheetDescription>
          </SheetHeader>

          {selectedEntry && (
            <div className="py-6 flex flex-col gap-5">
              {/* Amount Display */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Amount
                </span>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    selectedEntry.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {formatNaira(selectedEntry.amount)}
                </p>
              </div>

              {/* Key Attributes */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Tag className="w-4 h-4 text-slate-400" /> Type
                  </span>
                  <span className="font-bold text-slate-800 capitalize">
                    {selectedEntry.type}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2 text-slate-500">
                    <User className="w-4 h-4 text-slate-400" /> Name / Item
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedEntry.type === "income"
                      ? selectedEntry.customerName || "N/A"
                      : selectedEntry.item || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2 text-slate-500">
                    <FileText className="w-4 h-4 text-slate-400" /> Service /
                    Details
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedEntry.type === "income"
                      ? selectedEntry.serviceName || "N/A"
                      : selectedEntry.note || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" /> Date
                  </span>
                  <span className="font-bold text-slate-800">
                    {selectedEntry.date || dateStr || "N/A"}
                  </span>
                </div>
              </div>

              {/* Edit Trigger Button */}
              {onEditEntry && (
                <Button
                  onClick={() => {
                    const entryToEdit = selectedEntry;
                    setSelectedEntry(null);
                    onEditEntry(entryToEdit);
                  }}
                  className="w-full mt-4 rounded-xl bg-[#ff5a1f] text-white hover:bg-[#e04f1a] gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Transaction</span>
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
