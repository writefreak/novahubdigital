export type Service = {
  id: string;
  name: string;
  price: number;
};

export type EntryType = "income" | "expense";

export type Entry = {
  id: string;
  type: EntryType;
  date: string; // yyyy-mm-dd
  amount: number;
  // income fields
  customerName?: string;
  serviceId?: string;
  serviceName?: string;
  // expense fields
  item?: string;
  note?: string;
  createdAt: string; // ISO timestamp
};
