export type Service = {
  id: string;
  name: string;
  price: number; // stored in Naira, whole numbers only (no kobo/decimals)
};

export type EntryType = "income" | "expense";

export type Entry = {
  id: string;
  type: EntryType;
  date: string; // yyyy-mm-dd, local day the entry belongs to
  amount: number;
  // income-only fields
  customerName?: string;
  serviceId?: string;
  serviceName?: string; // denormalized copy of the service name at time of sale
  // expense-only fields
  item?: string;
  note?: string;
  createdAt: string; // ISO timestamp
};

export type ReportShare = {
  id: string;
  rangeLabel: string;
  entries: Entry[];
  createdAt: string;
};

// Row shapes as they come back from Postgres (snake_case) — mapping
// helpers live in src/lib/supabase/mappers.ts.
export type ServiceRow = {
  id: string;
  name: string;
  price: number;
};

export type EntryRow = {
  id: string;
  type: EntryType;
  date: string;
  amount: number;
  customer_name: string | null;
  service_id: string | null;
  service_name: string | null;
  item: string | null;
  note: string | null;
  created_at: string;
};
