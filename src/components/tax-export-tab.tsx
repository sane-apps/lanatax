"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Heart } from "lucide-react";
import { mapTransactionsToTaxEvents } from "@/lib/tax-mapper";
import { downloadCsv } from "@/lib/csv";
import { TAX_TYPE_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import type { HeliusTransaction, TokenInfo } from "@/lib/types";
import type { PriceMap } from "@/lib/prices";

interface TaxExportTabProps {
  transactions: HeliusTransaction[];
  wallet: string;
  tokenMap: Map<string, TokenInfo>;
  solPrices: PriceMap;
}

export function TaxExportTab({
  transactions,
  wallet,
  tokenMap,
  solPrices,
}: TaxExportTabProps) {
  const events = useMemo(
    () => mapTransactionsToTaxEvents(transactions, wallet, tokenMap, solPrices),
    [transactions, wallet, tokenMap, solPrices]
  );

  const typeSummary = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of events) {
      map[e.type] = (map[e.type] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [events]);

  return (
    <div className="space-y-[21px]">
      {/* Summary */}
      <Card className="glass-card animate-fade-in border-0 rounded-xl">
        <CardHeader className="pb-[13px] px-[21px] pt-[21px]">
          <CardTitle className="text-sm font-medium text-white/90">
            Tax Event Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-[21px] px-[21px] pb-[21px]">
          <div className="grid grid-cols-2 gap-[13px] sm:grid-cols-3 lg:grid-cols-4">
            {typeSummary.map(([type, count]) => (
              <div key={type} className="rounded-lg bg-white/5 p-[13px]">
                <div className="text-sm text-white/90">
                  {TAX_TYPE_LABELS[type] || type}
                </div>
                <div className="mt-[8px] text-lg font-semibold text-white">
                  {count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-white/90">
            {events.length} total tax events from{" "}
            {transactions.length} transactions
            {events.length > 0 && (
              <>
                {" "}
                &middot; {formatDateShort(transactions[transactions.length - 1].timestamp)}{" "}
                to {formatDateShort(transactions[0].timestamp)}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview table */}
      <Card className="glass-card animate-fade-in border-0 rounded-xl">
        <CardHeader className="pb-[13px] px-[21px] pt-[21px]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-white/90">
              CSV Preview
            </CardTitle>
            <Badge className="border-0 bg-white/5 text-sm text-white/90">
              Koinly-compatible format
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-[21px] pb-[21px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-white/90">
                  <th className="pb-[8px] pr-[21px]">Date</th>
                  <th className="pb-[8px] pr-[21px]">Type</th>
                  <th className="pb-[8px] pr-[21px]">Asset</th>
                  <th className="pb-[8px] pr-[21px] text-right">Amount</th>
                  <th className="hidden pb-[8px] pr-[21px] text-right sm:table-cell" title="The original USD value when you acquired the asset">
                    Cost Basis
                    <span className="ml-1 cursor-help text-[#06B6D4]">&#9432;</span>
                  </th>
                  <th className="hidden pb-[8px] pr-[21px] text-right sm:table-cell" title="The USD value when you sold or disposed of the asset">
                    Proceeds
                    <span className="ml-1 cursor-help text-[#06B6D4]">&#9432;</span>
                  </th>
                  <th className="pb-[8px] text-right">Fee (SOL)</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 10).map((e, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.03] text-white/90"
                  >
                    <td className="py-[8px] pr-[21px] whitespace-nowrap">
                      {formatDateShort(e.date.getTime() / 1000)}
                    </td>
                    <td className="py-[8px] pr-[21px]">
                      <Badge className="border-0 bg-white/5 text-sm text-white">
                        {TAX_TYPE_LABELS[e.type] || e.type}
                      </Badge>
                    </td>
                    <td className="py-[8px] pr-[21px] text-white">{e.asset}</td>
                    <td className="py-[8px] pr-[21px] text-right font-mono text-white">
                      {e.amount.toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </td>
                    <td className="hidden py-[8px] pr-[21px] text-right font-mono text-white/90 sm:table-cell">
                      {e.costBasisUsd != null ? `$${e.costBasisUsd.toFixed(2)}` : "—"}
                    </td>
                    <td className="hidden py-[8px] pr-[21px] text-right font-mono text-white/90 sm:table-cell">
                      {e.proceedsUsd != null ? `$${e.proceedsUsd.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-[8px] text-right font-mono text-white">
                      {e.feeSOL.toFixed(6)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {events.length > 10 && (
            <p className="mt-[13px] text-sm text-white">
              Showing 10 of {events.length} events...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Download button — always available */}
      <Button
        onClick={() => downloadCsv(events)}
        disabled={events.length === 0}
        className="h-[55px] w-full gap-[8px] bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#5CE8FF] text-base font-semibold text-white hover:opacity-90 disabled:opacity-40"
      >
        <Download className="h-4.5 w-4.5" />
        Download CSV ({events.length} events)
      </Button>

      {/* Post-download support prompt */}
      <div className="flex items-center justify-center gap-[8px] rounded-xl bg-white/[0.03] py-[13px] text-sm text-white">
        <Heart className="h-4 w-4 text-[#ea4aaa]" />
        LanaTax is free forever.{" "}
        <a
          href="https://github.com/sponsors/MrSaneApps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#06B6D4] hover:underline"
        >
          Support the developer
        </a>
        {" "}if it saved you time.
      </div>
    </div>
  );
}
