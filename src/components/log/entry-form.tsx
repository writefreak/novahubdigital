"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CheckIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { todayStr, formatNaira } from "@/lib/utils";
import type { Entry, EntryType, PaymentStatus } from "@/lib/types";

export function EntryForm({
  open,
  onOpenChange,
  initialEntry = null,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEntry?: Entry | null;
}) {
  const services = useStore((s) => s.services || []);
  const addEntry = useStore((s) => s.addEntry);
  const updateEntry = useStore((s) => s.updateEntry);

  const isEditing = Boolean(initialEntry);

  const [type, setType] = React.useState<EntryType>("income");
  const [customerName, setCustomerName] = React.useState("");
  const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>(
    [],
  );
  const [amount, setAmount] = React.useState("");
  const [amountPaid, setAmountPaid] = React.useState("");
  const [paymentStatus, setPaymentStatus] =
    React.useState<PaymentStatus>("paid");
  const [description, setDescription] = React.useState("");

  const [item, setItem] = React.useState("");
  const [note, setNote] = React.useState("");
  const [expensePaymentStatus, setExpensePaymentStatus] =
    React.useState<PaymentStatus>("paid");
  const [expenseAmountPaid, setExpenseAmountPaid] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialEntry) {
      setType(initialEntry.type);
      if (initialEntry.type === "income") {
        setCustomerName(initialEntry.customerName || "");
        setSelectedServiceIds(initialEntry.serviceIds || []);
        setAmount(
          initialEntry.amount !== undefined ? String(initialEntry.amount) : "",
        );
        setAmountPaid(
          initialEntry.amountPaid !== undefined
            ? String(initialEntry.amountPaid)
            : "",
        );
        setPaymentStatus(initialEntry.paymentStatus || "paid");
        setDescription(initialEntry.note || initialEntry.description || "");
      } else {
        setItem(initialEntry.item || "");
        setAmount(
          initialEntry.amount !== undefined ? String(initialEntry.amount) : "",
        );
        setExpenseAmountPaid(
          initialEntry.amountPaid !== undefined
            ? String(initialEntry.amountPaid)
            : "",
        );
        setExpensePaymentStatus(initialEntry.paymentStatus || "paid");
        setNote(initialEntry.note || initialEntry.description || "");
      }
    } else {
      reset();
    }
  }, [initialEntry, open]);

  function reset() {
    setCustomerName("");
    setSelectedServiceIds([]);
    setAmount("");
    setAmountPaid("");
    setPaymentStatus("paid");
    setDescription("");
    setItem("");
    setNote("");
    setExpensePaymentStatus("paid");
    setExpenseAmountPaid("");
    setError(null);
  }

  function handleServiceToggle(id: string) {
    const updated = selectedServiceIds.includes(id)
      ? selectedServiceIds.filter((item) => item !== id)
      : [...selectedServiceIds, id];

    setSelectedServiceIds(updated);

    const totalCalculated = updated.reduce((sum, serviceId) => {
      const svc = services.find((s) => s.id === serviceId);
      return sum + (svc ? svc.price : 0);
    }, 0);

    setAmount(totalCalculated > 0 ? String(totalCalculated) : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (type === "income" && !customerName.trim()) {
      setError("Please enter a customer name.");
      return;
    }

    if (type === "expense" && !item.trim()) {
      setError("Please specify what was spent on.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (type === "income") {
        const selectedServices = services.filter((s) =>
          selectedServiceIds.includes(s.id),
        );

        const payload = {
          type: "income" as const,
          date: initialEntry?.date || todayStr(),
          amount: numAmount,
          customerName: customerName.trim(),
          serviceIds: selectedServiceIds,
          serviceNames: selectedServices.map((s) => s.name),
          note: description.trim(),
          paymentStatus,
          amountPaid:
            paymentStatus === "part"
              ? Number(amountPaid) || 0
              : paymentStatus === "paid"
                ? numAmount
                : 0,
        };

        if (isEditing && initialEntry?.id) {
          await updateEntry(initialEntry.id, payload);
        } else {
          await addEntry(payload);
        }
      } else {
        const payload = {
          type: "expense" as const,
          date: initialEntry?.date || todayStr(),
          amount: numAmount,
          item: item.trim(),
          note: note.trim(),
          paymentStatus: expensePaymentStatus,
          amountPaid:
            expensePaymentStatus === "part"
              ? Number(expenseAmountPaid) || 0
              : expensePaymentStatus === "paid"
                ? numAmount
                : 0,
        };

        if (isEditing && initialEntry?.id) {
          await updateEntry(initialEntry.id, payload);
        } else {
          await addEntry(payload);
        }
      }

      reset();
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save entry. Check database columns.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-screen! max-w-full! sm:w-125! sm:max-w-125! bg-white text-slate-900 flex flex-col h-full p-0 border-l border-slate-200"
      >
        <SheetHeader className="p-6 pb-4 border-b border-slate-100 bg-white">
          <SheetTitle className="text-base md:text-lg">
            {isEditing ? "Edit entry" : "Log an entry"}
          </SheetTitle>
          <SheetDescription className="text-sm md:text-base max-w-xs">
            {isEditing
              ? "Update details or status for this transaction."
              : "Record a customer sale or a business expense"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <Tabs value={type} onValueChange={(v) => setType(v as EntryType)}>
            {!isEditing && (
              <TabsList className="w-full grid grid-cols-2 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="income">Customer sale</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
              </TabsList>
            )}

            <form id="entry-form" onSubmit={handleSubmit} className="mt-4">
              <TabsContent value="income" className="mt-0 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="customer"
                    className="text-slate-700 font-medium"
                  >
                    Customer name
                  </Label>
                  <Input
                    id="customer"
                    placeholder="e.g. Chidi"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Services Done
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {services.map((s) => {
                      const isSelected = selectedServiceIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleServiceToggle(s.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all active:scale-[0.98] ${
                            isSelected
                              ? "border-[#ff5a1f] bg-[#ff5a1f]/20 ring-1 ring-[#ff5a1f] text-[#ff5a1f]"
                              : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                isSelected
                                  ? "border-[#ff5a1f] bg-[#ff5a1f] text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <CheckIcon className="h-3 w-3 stroke-[3]" />
                              )}
                            </div>
                            <span className="text-xs font-medium truncate text-slate-800">
                              {s.name}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-semibold shrink-0 ${
                              isSelected ? "text-[#ff5a1f]" : "text-slate-500"
                            }`}
                          >
                            {formatNaira(s.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="description"
                    className="text-slate-700 font-medium"
                  >
                    Detailed Work Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Details of the job done..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-white border-slate-200 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="income-amount"
                      className="text-slate-700 font-medium"
                    >
                      Total Charged (₦)
                    </Label>
                    <Input
                      id="income-amount"
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white border-slate-200 text-slate-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-700 font-medium">
                      Payment Status
                    </Label>
                    <Select
                      value={paymentStatus}
                      onValueChange={(v) =>
                        setPaymentStatus(v as PaymentStatus)
                      }
                    >
                      <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Fully Paid</SelectItem>
                        <SelectItem value="part">Part Payment</SelectItem>
                        <SelectItem value="unpaid">Unpaid / Owning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {paymentStatus === "part" && (
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="income-amount-paid"
                      className="text-slate-700 font-medium"
                    >
                      Amount Paid So Far (₦)
                    </Label>
                    <Input
                      id="income-amount-paid"
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      className="bg-white border-slate-200 text-slate-900"
                    />
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                )}
              </TabsContent>

              <TabsContent value="expense" className="mt-0 flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="item" className="text-slate-700 font-medium">
                    What was it spent on?
                  </Label>
                  <Input
                    id="item"
                    placeholder="e.g. Printer ink"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="expense-amount"
                      className="text-slate-700 font-medium"
                    >
                      Total Amount (₦)
                    </Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white border-slate-200 text-slate-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-slate-700 font-medium">
                      Payment Status
                    </Label>
                    <Select
                      value={expensePaymentStatus}
                      onValueChange={(v) =>
                        setExpensePaymentStatus(v as PaymentStatus)
                      }
                    >
                      <SelectTrigger className="w-full bg-white border-slate-200 text-slate-900">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Fully Paid</SelectItem>
                        <SelectItem value="part">Part Payment</SelectItem>
                        <SelectItem value="unpaid">Unpaid / Credit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {expensePaymentStatus === "part" && (
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="expense-amount-paid"
                      className="text-slate-700 font-medium"
                    >
                      Amount Paid So Far (₦)
                    </Label>
                    <Input
                      id="expense-amount-paid"
                      type="number"
                      inputMode="numeric"
                      placeholder="0"
                      value={expenseAmountPaid}
                      onChange={(e) => setExpenseAmountPaid(e.target.value)}
                      className="bg-white border-slate-200 text-slate-900"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="note" className="text-slate-700 font-medium">
                    Note (optional)
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Any extra detail"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="bg-white border-slate-200 text-slate-900"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                )}
              </TabsContent>
            </form>
          </Tabs>
        </div>

        <SheetFooter className="p-4 border-t border-slate-100 bg-white shrink-0">
          <Button
            type="submit"
            form="entry-form"
            variant={type === "expense" ? "destructive" : "default"}
            className="w-full py-5 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving…"
              : isEditing
                ? "Update Entry"
                : type === "income"
                  ? "Save Sale"
                  : "Save Expense"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
