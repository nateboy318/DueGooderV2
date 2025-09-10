import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStatNumber(num: number, isPercent = false): string {
  if (isPercent) {
    // Always show as integer percent, max 3 chars (e.g., 94%)
    return `${Math.round(num)}%`;
  }
  if (num >= 1000) {
    // 4 digits or more: show as 1.2k, 12k, 999k, etc. (max 3 chars)
    if (num < 10000) {
      // 1.0k - 9.9k
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    } else if (num < 1000000) {
      // 10k - 999k
      return `${Math.round(num / 1000)}k`;
    } else {
      // 1M+ fallback
      return "999k";
    }
  }
  // 1-999: just show the number
  return num.toString();
}