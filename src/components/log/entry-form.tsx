"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { useStore } from "@/lib/store";
import { todayStr } from "@/lib/utils";
import type { EntryType } from "@/lib/types";

export function EntryForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const services = useStore((s) => s.services);
  const addEntry = useStore((s) => s.addEntry);

  const [type, setType] = React.useState<EntryType>("income");
  const [customerName, setCustomerName] = React.useState("");
  const [serviceId, setServiceId] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [item, setItem] = React.useState("");
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function reset() {
    setCustomerName("");
    setServiceId("");
    setAmount("");
    setItem("");
    setNote("");
    setError(null);
  }

  function handleServiceChange(id: string) {
    setServiceId(id);
    const svc = services.find((s) => s.id === id);
    if (svc) setAmount(String(svc.price));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    setError(null);
    setIsSubmitting(true);
    try {
      if (type === "income") {
        if (!customerName.trim()) return;
        const svc = services.find((s) => s.id === serviceId);
        await addEntry({
          type: "income",
          date: todayStr(),
          amount: numAmount,
          customerName: customerName.trim(),
          serviceId: svc?.id,
          serviceName: svc?.name,
        });
      } else {
        if (!item.trim()) return;
        await addEntry({
          type: "expense",
          date: todayStr(),
          amount: numAmount,
          item: item.trim(),
          note: note.trim() || undefined,
        });
      }
      reset();
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't save. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log an entry</DialogTitle>
          <DialogDescription>
            Record a customer sale or a business expense for today.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as EntryType)}>
          <TabsList className="w-full">
            <TabsTrigger value="income">Customer sale</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="income" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="customer">Customer name</Label>
                <Input
                  id="customer"
                  placeholder="e.g. Chidi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Service</Label>
                <Select value={serviceId} onValueChange={handleServiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="What did they come to do?" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="income-amount">Amount charged (₦)</Label>
                <Input
                  id="income-amount"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-expense">{error}</p>}
              <Button type="submit" className="mt-1" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save sale"}
              </Button>
            </TabsContent>

            <TabsContent value="expense" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="item">What was it spent on?</Label>
                <Input
                  id="item"
                  placeholder="e.g. Printer ink"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="expense-amount">Amount spent (₦)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Any extra detail"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-expense">{error}</p>}
              <Button
                type="submit"
                variant="destructive"
                className="mt-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving…" : "Save expense"}
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
