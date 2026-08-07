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
        className="no-print fixed bottom-20 right-4 z-40 flex md:h-14 md:w-14 h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/30 lg:bottom-8 lg:right-8"
        aria-label="Log a new entry"
      >
        <Plus className="md:h-6 md:w-6 h-4 w-4" strokeWidth={2.5} />
      </motion.button>
      <EntryForm open={open} onOpenChange={setOpen} />
    </>
  );
}
