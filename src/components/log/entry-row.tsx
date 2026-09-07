"use client";

import * as React from "react";
import { Trash2, ShoppingBag, Wallet, Pencil, Calendar } from "lucide-react";
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

export function EntryRow({
  entry,
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
  const descriptionText = entry.description?.trim() || entry.note?.trim() || "";

  const servicesList =
    entry.serviceNames && entry.serviceNames.length > 0
      ? entry.serviceNames
      : entry.serviceName
        ? [entry.serviceName]
        : [];

  return (
    <>
      <tr
        onClick={() => setDetailsOpen(true)}
        className="cursor-pointer hover:bg-slate-50/80 transition-colors"
      >
        <td className="py-3.5 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
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
            <span className="text-xs font-semibold text-slate-600 capitalize">
              {entry.type}
            </span>
          </div>
        </td>

        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-[180px] truncate">
          {isIncome ? entry.customerName : entry.item}
        </td>

        <td className="py-3.5 px-4 text-xs text-slate-500 max-w-[260px] truncate">
          {descriptionText || "—"}
        </td>

        <td className="py-3.5 px-4 whitespace-nowrap">
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
        </td>

        <td
          className="py-3.5 px-4 text-right whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end gap-1">
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
        </td>
      </tr>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between pr-6 mb-1">
              <span className="text-xs font-bold text-neutral-600">
                {isIncome ? "Customer Sale Report" : "Expense Report"}
              </span>
            </div>
            <DialogTitle className="text-lg md:text-xl font-bold text-slate-900">
              {isIncome ? entry.customerName : entry.item}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Calendar className="h-3.5 w-3.5" /> Recorded on {entry.date}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-slate-900">
            <div className="flex border-b border-b-neutral-200 items-center justify-between">
              <div className="flex justify-between gap-2 w-full py-3">
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
            </div>

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

            {isIncome && servicesList.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-500">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {servicesList.map((svc, i) => (
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

            {descriptionText && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-neutral-800">
                  Work Description / Details
                </p>
                <div className="text-xs text-neutral-600">
                  {descriptionText}
                </div>
              </div>
            )}

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
