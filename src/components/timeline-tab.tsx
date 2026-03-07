"use client";

import { useRef, useMemo, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { TransactionCard } from "./transaction-card";
import { TX_TYPE_COLORS } from "@/lib/constants";
import type { HeliusTransaction, TokenInfo } from "@/lib/types";

interface TimelineTabProps {
  transactions: HeliusTransaction[];
  wallet: string;
  tokenMap: Map<string, TokenInfo>;
}

export function TimelineTab({ transactions, wallet, tokenMap }: TimelineTabProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = transactions;

    if (typeFilter) {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.signature.toLowerCase().includes(q) ||
          tx.description?.toLowerCase().includes(q) ||
          tx.type.toLowerCase().includes(q) ||
          tx.tokenTransfers.some((tt) =>
            tt.mint.toLowerCase().includes(q)
          )
      );
    }

    return result;
  }, [transactions, search, typeFilter]);

  const types = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tx of transactions) {
      map[tx.type] = (map[tx.type] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const parentRef = useRef<HTMLDivElement>(null);
  // TanStack Virtual returns function-heavy objects that React Compiler intentionally skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  return (
    <div className="space-y-[21px]">
      {/* Search + filter */}
      <div className="flex flex-col gap-[13px] sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-[#06B6D4]" />
          <Input
            placeholder="Search by signature, type, or token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 border-white/8 bg-white/5 pl-9 text-white placeholder:text-white/90"
          />
        </div>
        <div className="text-sm text-white/90 self-center shrink-0">
          {filtered.length.toLocaleString()} transactions
        </div>
      </div>

      {/* Type filter badges */}
      <div className="flex flex-wrap gap-[8px]">
        <Badge
          className={`cursor-pointer rounded-md border-0 px-2.5 py-1 text-sm transition-colors ${
            !typeFilter
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/90 hover:bg-white/10"
          }`}
          onClick={() => setTypeFilter(null)}
        >
          All
        </Badge>
        {types.map(([type, count]) => (
          <Badge
            key={type}
            className={`cursor-pointer rounded-md border-0 px-2.5 py-1 text-sm transition-colors ${
              typeFilter === type
                ? "bg-white/15 text-white"
                : "bg-white/5 text-white/90 hover:bg-white/10"
            }`}
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
          >
            <span
              className="mr-1 inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  TX_TYPE_COLORS[type] || TX_TYPE_COLORS.UNKNOWN,
              }}
            />
            {type} ({count})
          </Badge>
        ))}
      </div>

      {/* Virtual list */}
      <div
        ref={parentRef}
        className="max-h-[600px] overflow-auto rounded-xl"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const tx = filtered[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
              >
                <div className="pb-[8px]">
                  <TransactionCard
                    tx={tx}
                    wallet={wallet}
                    tokenMap={tokenMap}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="py-[55px] text-center text-white/90">
          No transactions match your filters.
        </div>
      )}
    </div>
  );
}
