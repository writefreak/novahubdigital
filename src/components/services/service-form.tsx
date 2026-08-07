"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { Service } from "@/lib/types";

export function ServiceForm({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: Service | null;
}) {
  const addService = useStore((s) => s.addService);
  const updateService = useStore((s) => s.updateService);

  const [name, setName] = React.useState(editing?.name ?? "");
  const [price, setPrice] = React.useState(editing ? String(editing.price) : "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numPrice = Number(price);
    if (!name.trim() || !numPrice || numPrice <= 0) return;

    if (editing) {
      updateService(editing.id, { name: name.trim(), price: numPrice });
    } else {
      addService({ name: name.trim(), price: numPrice });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit service" : "New service"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the name or price." : "Add a service customers can pay for."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="service-name">Service name</Label>
            <Input
              id="service-name"
              placeholder="e.g. Laminating (A4)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="service-price">Price (₦)</Label>
            <Input
              id="service-price"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-1">
            {editing ? "Save changes" : "Add service"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
