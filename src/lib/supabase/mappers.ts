import type { Entry, EntryRow, Service, ServiceRow } from "@/lib/types";

export function toService(row: ServiceRow): Service {
  return { id: row.id, name: row.name, price: row.price };
}

export function toEntry(row: EntryRow): Entry {
  return {
    id: row.id,
    type: row.type,
    date: row.date,
    amount: row.amount,
    customerName: row.customer_name ?? undefined,
    serviceId: row.service_id ?? undefined,
    serviceName: row.service_name ?? undefined,
    item: row.item ?? undefined,
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}
