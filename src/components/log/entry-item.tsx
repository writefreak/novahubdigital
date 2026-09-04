"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, Wallet, Pencil, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn, formatNaira } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { Entry } from "@/lib/types";

export function EntryItem({
  entry,
  index = 0,
  onEdit,
}: {
  entry: Entry;
  index?: number;
  onEdit?: (entry: Entry) => void;
}) {
  const removeEntry = useStore((s) => s.removeEntry);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const isIncome = entry.type === "income";

  const paymentStatus = entry.paymentStatus ?? "paid";
  const amountPaid =
    entry.amountPaid ?? (paymentStatus === "paid" ? entry.amount : 0);
  const balance = entry.amount - amountPaid;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
        className="w-full min-w-0"
      >
        <Card
          onClick={() => setDetailsOpen(true)}
          className="p-3.5 sm:p-4 w-full min-w-0 overflow-hidden relative cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all bg-white"
        >
          {/* Mobile UI */}
          <div className="flex flex-col gap-2.5 sm:hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isIncome
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600",
                  )}
                >
                  {isIncome ? (
                    <ShoppingBag className="h-4 w-4" />
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {isIncome ? entry.customerName : entry.item}
                  </p>
                  {isIncome && (
                    <p className="truncate text-[11px] text-slate-500">
                      {entry.serviceNames?.join(", ") ||
                        entry.serviceName ||
                        "Service"}
                    </p>
                  )}
                </div>
              </div>

              <div
                className="flex items-center gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    onClick={() => onEdit(entry)}
                    aria-label="Edit entry"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {isIncome ? "Income" : "Expense"}
                </span>
                {paymentStatus !== "paid" && (
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded",
                      paymentStatus === "part"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200",
                    )}
                  >
                    {paymentStatus === "part" ? "Partially Paid" : "Unpaid"}
                  </span>
                )}
              </div>
              <Badge
                className={cn(
                  "text-xs px-2.5 py-0.5 font-semibold",
                  isIncome
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200",
                )}
              >
                {isIncome ? "+" : "-"}
                {formatNaira(entry.amount)}
              </Badge>
            </div>
          </div>

          {/* Desktop UI */}
          <div className="hidden sm:flex sm:flex-row sm:items-center sm:gap-3 min-w-0">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                isIncome
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600",
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
                <p className="truncate text-sm font-semibold text-slate-900">
                  {entry.customerName}{" "}
                  <span className="font-normal text-slate-500">
                    /{" "}
                    {entry.serviceNames?.join(", ") ||
                      entry.serviceName ||
                      "Service"}
                  </span>
                </p>
              ) : (
                <p className="truncate text-sm font-semibold text-slate-900">
                  {entry.item}
                </p>
              )}
              {(entry.description || entry.note) && (
                <p className="truncate text-xs text-slate-500">
                  {entry.description || entry.note}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {paymentStatus !== "paid" && (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded",
                    paymentStatus === "part"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200",
                  )}
                >
                  {paymentStatus === "part" ? "Part Paid" : "Unpaid"}
                </span>
              )}
              <Badge
                className={cn(
                  "text-xs px-2.5 py-0.5 font-semibold",
                  isIncome
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200",
                )}
              >
                {isIncome ? "+" : "-"}
                {formatNaira(entry.amount)}
              </Badge>

              <div
                className="flex items-center gap-1 border-l border-slate-100 pl-2 ml-1"
                onClick={(e) => e.stopPropagation()}
              >
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                    onClick={() => onEdit(entry)}
                    aria-label="Edit entry"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Delete entry"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Entry Details Modal without explicit DialogFooter dependency */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between pr-6 mb-1">
              <span className="text-xs font-bold text-neutral-600">
                {isIncome ? "Customer Sale Report" : "Expense Report"}
              </span>
              <Badge
                className={cn(
                  "text-xs px-2 py-0.5 font-semibold",
                  isIncome
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800",
                )}
              >
                {isIncome ? "Income" : "Expense"}
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {isIncome ? entry.customerName : entry.item}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Calendar className="h-3.5 w-3.5" /> Recorded on {entry.date}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-slate-900">
            {/* Amount Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Total Charge
                </p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {formatNaira(entry.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">
                  Payment Status
                </p>
                <p
                  className={cn(
                    "text-sm font-bold capitalize",
                    paymentStatus === "paid"
                      ? "text-emerald-600"
                      : paymentStatus === "part"
                        ? "text-amber-600"
                        : "text-rose-600",
                  )}
                >
                  {paymentStatus}
                </p>
              </div>
            </div>

            {/* Split Balances */}
            {paymentStatus !== "paid" && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500">Paid Amount</span>
                  <p className="font-semibold text-slate-900 text-sm mt-0.5">
                    {formatNaira(amountPaid)}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500">Outstanding Balance</span>
                  <p className="font-semibold text-rose-600 text-sm mt-0.5">
                    {formatNaira(balance)}
                  </p>
                </div>
              </div>
            )}

            {/* Services Rendered */}
            {isIncome &&
              entry.serviceNames &&
              entry.serviceNames.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-slate-500">Services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.serviceNames.map((svc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Description Text */}
            {(entry.description || entry.note) && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-500">
                  Work Description / Details
                </p>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {entry.description || entry.note}
                </div>
              </div>
            )}

            {/* Embedded Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              {onEdit && (
                <Button
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-100"
                  onClick={() => {
                    setDetailsOpen(false);
                    onEdit(entry);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Entry
                </Button>
              )}
              <Button
                variant="default"
                className="bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => setDetailsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
