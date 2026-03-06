import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatSol(lamports: number): string {
  const sol = lamports / 1e9;
  if (sol === 0) return "0";
  if (sol < 0.0001) return "<0.0001";
  return sol.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export function formatTokenAmount(amount: number, decimals: number): string {
  const adjusted = amount / Math.pow(10, decimals);
  if (adjusted === 0) return "0";
  if (adjusted < 0.0001) return "<0.0001";
  return adjusted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), "MMM d, yyyy HH:mm");
}

export function formatDateShort(timestamp: number): string {
  return format(new Date(timestamp * 1000), "MMM d, yyyy");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function isValidBase58(str: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  return base58Regex.test(str) && str.length >= 32 && str.length <= 44;
}

export function isValidHeliusKey(key: string): boolean {
  return key.length > 10 && /^[a-f0-9-]+$/i.test(key);
}
