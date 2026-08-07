"use server";

import { revalidatePath } from "next/cache";
import { requireMembership, requireRole } from "@/lib/supabase/membership";
import type { Service } from "@/lib/types";
import { toService } from "./mappers";

type ServiceInput = Omit<Service, "id">;

// Any role, including add_only, can add a new service — the restriction
// is on editing/removing existing ones (see requireRole calls below).
export async function createServiceAction(
  input: ServiceInput,
): Promise<Service> {
  const { supabase, businessId } = await requireMembership();

  const { data, error } = await supabase
    .from("services")
    .insert({ business_id: businessId, name: input.name, price: input.price })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/services");
  revalidatePath("/log");
  return toService(data);
}

export async function updateServiceAction(
  id: string,
  input: ServiceInput,
): Promise<Service> {
  const { supabase, businessId, role } = await requireMembership();
  requireRole(role, ["owner", "full"]);

  const { data, error } = await supabase
    .from("services")
    .update({ name: input.name, price: input.price })
    .eq("id", id)
    .eq("business_id", businessId) // belt-and-braces on top of RLS
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/services");
  revalidatePath("/log");
  return toService(data);
}

export async function deleteServiceAction(id: string): Promise<void> {
  const { supabase, businessId, role } = await requireMembership();
  requireRole(role, ["owner", "full"]);

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) throw new Error(error.message);

  revalidatePath("/services");
  revalidatePath("/log");
}
