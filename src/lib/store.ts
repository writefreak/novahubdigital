"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Entry, Service } from "./types";
import { todayStr } from "./utils";

const seedServices: Service[] = [
  { id: "svc-1", name: "Browsing (1hr)", price: 300 },
  { id: "svc-2", name: "Printing (per page)", price: 100 },
  { id: "svc-3", name: "Scanning (per page)", price: 150 },
  { id: "svc-4", name: "CV / Document Typing", price: 1000 },
  { id: "svc-5", name: "Photocopy (per page)", price: 50 },
];

type Store = {
  services: Service[];
  entries: Entry[];
  addService: (s: Omit<Service, "id">) => void;
  updateService: (id: string, s: Omit<Service, "id">) => void;
  removeService: (id: string) => void;
  addEntry: (e: Omit<Entry, "id" | "createdAt">) => void;
  removeEntry: (id: string) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      services: seedServices,
      entries: [],
      addService: (s) =>
        set((state) => ({
          services: [...state.services, { ...s, id: crypto.randomUUID() }],
        })),
      updateService: (id, s) =>
        set((state) => ({
          services: state.services.map((svc) =>
            svc.id === id ? { ...svc, ...s } : svc
          ),
        })),
      removeService: (id) =>
        set((state) => ({
          services: state.services.filter((svc) => svc.id !== id),
        })),
      addEntry: (e) =>
        set((state) => ({
          entries: [
            { ...e, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
            ...state.entries,
          ],
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((en) => en.id !== id),
        })),
    }),
    { name: "novahub-storage" }
  )
);

export function useTodayEntries() {
  const entries = useStore((s) => s.entries);
  const today = todayStr();
  return entries.filter((e) => e.date === today);
}
