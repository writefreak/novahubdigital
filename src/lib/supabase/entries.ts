"use server";

import { revalidatePath } from "next/cache";
import { requireMembership, requireRole } from "@/lib/supabase/membership";
import { toEntry } from "@/lib/supabase/mappers";
import type { Entry } from "@/lib/types";

type EntryInput = Omit<Entry, "id" | "createdAt">;

// Any role, including add_only, can log a sale or expense.
export async function createEntryAction(input: EntryInput): Promise<Entry> {
  const { supabase, businessId, userId } = await requireMembership();

  const { data, error } = await supabase
    .from("entries")
    .insert({
      business_id: businessId,
      created_by: userId,
      type: input.type,
      date: input.date,
      amount: input.amount,
      customer_name: input.customerName ?? null,
      service_id: input.serviceId ?? null,
      service_name: input.serviceName ?? null,
      item: input.item ?? null,
      note: input.note ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/reports");
  return toEntry(data);
}

// add_only members can log entries but not remove them — owner/full only.
export async function deleteEntryAction(id: string): Promise<void> {
  const { supabase, businessId, role } = await requireMembership();
  requireRole(role, ["owner", "full"]);

  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/reports");
}

export async function updateEntryAction(
  id: string,
  input: Partial<EntryInput>,
): Promise<Entry> {
  const { supabase, businessId, role } = await requireMembership();

  // Enforce role restrictions if necessary, matching your delete rule
  requireRole(role, ["owner", "full"]);

  const { data, error } = await supabase
    .from("entries")
    .update({
      type: input.type,
      date: input.date,
      amount: input.amount,
      customer_name: input.customerName ?? null,
      service_id: input.serviceId ?? null,
      service_name: input.serviceName ?? null,
      item: input.item ?? null,
      note: input.note ?? null,
    })
    .eq("id", id)
    .eq("business_id", businessId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/reports");

  return toEntry(data);
}
