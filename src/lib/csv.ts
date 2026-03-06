import Papa from "papaparse";
import { format } from "date-fns";
import type { TaxEvent } from "./types";

const CSV_DISCLAIMER = [
  "# LanaTax Export - FOR INFORMATIONAL PURPOSES ONLY",
  "# This is NOT tax advice. Consult a qualified tax professional.",
  "# Generated: " + new Date().toISOString(),
  "",
].join("\n");

interface CsvRow {
  Date: string;
  Type: string;
  Asset: string;
  Amount: string;
  "Cost Basis (USD)": string;
  "Proceeds (USD)": string;
  "Fee (SOL)": string;
  "Transaction ID": string;
  Description: string;
}

export function generateCsv(events: TaxEvent[]): string {
  const rows: CsvRow[] = events.map((e) => ({
    Date: format(e.date, "yyyy-MM-dd HH:mm:ss"),
    Type: e.type,
    Asset: e.asset,
    Amount: String(e.amount),
    "Cost Basis (USD)": e.costBasisUsd != null ? e.costBasisUsd.toFixed(2) : "N/A",
    "Proceeds (USD)": e.proceedsUsd != null ? e.proceedsUsd.toFixed(2) : "N/A",
    "Fee (SOL)": String(e.feeSOL),
    "Transaction ID": e.txSignature,
    Description: e.description,
  }));

  const csv = Papa.unparse(rows);
  return CSV_DISCLAIMER + csv;
}

export function downloadCsv(events: TaxEvent[], filename?: string): void {
  const csv = generateCsv(events);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename ?? `lanatax-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
