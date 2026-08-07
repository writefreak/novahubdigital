"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { EntryForm } from "@/components/log/entry-form";

export function Fab() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        className="no-print fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/30 lg:bottom-8 lg:right-8"
        aria-label="Log a new entry"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </motion.button>
      <EntryForm open={open} onOpenChange={setOpen} />
    </>
  );
}
