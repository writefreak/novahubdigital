"use server";

import { requireMembership } from "@/lib/supabase/membership";
import { toEntry, toService } from "@/lib/supabase/mappers";
import type { Entry, Service } from "@/lib/types";

export async function getBusinessDataAction(): Promise<{
  entries: Entry[];
  services: Service[];
}> {
  const { supabase, businessId } = await requireMembership();

  const [
    { data: entryRows, error: entryErr },
    { data: serviceRows, error: serviceErr },
  ] = await Promise.all([
    supabase
      .from("entries")
      .select("*")
      .eq("business_id", businessId)
      .order("date", { ascending: false }),
    supabase.from("services").select("*").eq("business_id", businessId),
  ]);

  if (entryErr) throw new Error(entryErr.message);
  if (serviceErr) throw new Error(serviceErr.message);

  return {
    entries: (entryRows ?? []).map(toEntry),
    services: (serviceRows ?? []).map(toService),
  };
}
