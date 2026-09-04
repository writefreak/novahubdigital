export { cn } from "cn";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Formats a number as Nigerian Naira currency (₦).
 * Handles string or number inputs safely.
 *
 * Examples:
 * formatNaira(2500) -> "₦2,500"
 * formatNaira(0)    -> "₦0"
 */
export function formatNaira(
  amount: number | string | undefined | null,
): string {
  const num = Number(amount);
  if (isNaN(num)) return "₦0";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Returns today's date formatted as `yyyy-mm-dd` using local time.
 */
export function todayStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
