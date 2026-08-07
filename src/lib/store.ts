"use client";

import * as React from "react";
import { create } from "zustand";
import type { Entry, Service } from "./types";
import { todayStr } from "./utils";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "./supabase/services";
import { createEntryAction, deleteEntryAction } from "./supabase/entries";
import { getBusinessDataAction } from "./actions/data";

type Store = {
  services: Service[];
  entries: Entry[];
  initialized: boolean;
  loadInitialData: () => Promise<void>;
  addService: (s: Omit<Service, "id">) => Promise<void>;
  updateService: (id: string, s: Omit<Service, "id">) => Promise<void>;
  removeService: (id: string) => Promise<void>;
  addEntry: (e: Omit<Entry, "id" | "createdAt">) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
};

export const useStore = create<Store>()((set, get) => ({
  services: [],
  entries: [],
  initialized: false,

  loadInitialData: async () => {
    if (get().initialized) return;
    const { entries, services } = await getBusinessDataAction();
    set({ entries, services, initialized: true });
  },

  addService: async (s) => {
    const created = await createServiceAction(s);
    set((state) => ({ services: [...state.services, created] }));
  },

  updateService: async (id, s) => {
    const updated = await updateServiceAction(id, s);
    set((state) => ({
      services: state.services.map((svc) => (svc.id === id ? updated : svc)),
    }));
  },

  removeService: async (id) => {
    await deleteServiceAction(id);
    set((state) => ({
      services: state.services.filter((svc) => svc.id !== id),
    }));
  },

  addEntry: async (e) => {
    const created = await createEntryAction(e);
    set((state) => ({ entries: [created, ...state.entries] }));
  },

  removeEntry: async (id) => {
    await deleteEntryAction(id);
    set((state) => ({
      entries: state.entries.filter((en) => en.id !== id),
    }));
  },
}));

// Call once at the top of any page that reads store data. Guarded so
// it only fetches on first mount across the whole app, not per-page.
export function useInitStore() {
  const loadInitialData = useStore((s) => s.loadInitialData);
  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
}

export function useTodayEntries() {
  const entries = useStore((s) => s.entries);
  const today = todayStr();
  return entries.filter((e) => e.date === today);
}
