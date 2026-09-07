"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useStore, useInitStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/services/service-form";
import { formatNaira } from "@/lib/utils";
import type { Service } from "@/lib/types";

/**
 * Returns a unique Unsplash image based on service properties or service name keywords.
 */
function getServiceImage(service: Service): string {
  if ((service as any).imageUrl) {
    return (service as any).imageUrl;
  }

  // Clean service name to use as a relevant Unsplash search query
  const query = encodeURIComponent(
    service.name ? service.name.toLowerCase() : "service",
  );

  // Adding service.id into the URL seed ensures every card fetches its own unique photo
  return `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80&sig=${service.id}&keyword=${query}`;
}

export default function ServicesPage() {
  useInitStore();
  const services = useStore((s) => s.services);
  const removeService = useStore((s) => s.removeService);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">
            Services
          </h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            What NovaHub offers, and what it costs.
          </p>
        </div>
        <div className="md:hidden pt-5">
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4" />
            <span>Add service</span>
          </Button>
        </div>
        <div className="md:inline hidden">
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add service</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
          >
            <Card className="group relative flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
              {/* Top Content Row */}
              <div className="flex items-start justify-between gap-3">
                {/* LHS: Avatar Thumbnail + Service Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-100">
                    <img
                      src={getServiceImage(service)}
                      alt={service.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0 flex flex-col items-start gap-1">
                    {/* Status/Category Pill Badge */}
                    {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Active
                    </span> */}

                    {/* Title & Price Subtitle */}
                    <h3 className="truncate text-base font-bold text-slate-900 tracking-tight">
                      {service.name}
                    </h3>
                    <p className="truncate text-xs font-medium text-slate-400">
                      {formatNaira(service.price)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Circular Edit & Delete */}
              </div>

              {/* Bottom Footer Details */}
              <div className="mt-5 flex items-center justify-end border-t border-slate-100/80 pt-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-slate-100/80 text-slate-700 hover:bg-slate-200"
                    onClick={() => openEdit(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-slate-100/80 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <ServiceForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />
    </div>
  );
}
