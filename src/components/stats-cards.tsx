"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownUp, Coins, Hash, Layers } from "lucide-react";
import type { HeliusTransaction, WalletStats } from "@/lib/types";

interface StatsCardsProps {
  transactions: HeliusTransaction[];
}

export function StatsCards({ transactions }: StatsCardsProps) {
  const stats = useMemo(() => computeStats(transactions), [transactions]);

  const cards = [
    {
      label: "Total Transactions",
      value: stats.totalTransactions.toLocaleString(),
      icon: Hash,
      color: "#06B6D4",
    },
    {
      label: "Total Fees",
      value: `${stats.totalFees.toFixed(4)} SOL`,
      icon: Coins,
      color: "#06B6D4",
    },
    {
      label: "Unique Tokens",
      value: stats.uniqueTokens.toLocaleString(),
      icon: Layers,
      color: "#9945FF",
    },
    {
      label: "Tx Types",
      value: Object.keys(stats.typeDistribution).length.toLocaleString(),
      icon: ArrowDownUp,
      color: "#FFD700",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-[13px] lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="glass-card animate-fade-in border-0 rounded-xl"
        >
          <CardContent className="p-[21px]">
            <div className="mb-[13px] flex items-center gap-[8px]">
              <card.icon
                className="h-4 w-4"
                style={{ color: card.color }}
              />
              <span className="text-sm text-white/90 sm:text-sm">
                {card.label}
              </span>
            </div>
            <p className="text-xl font-bold text-white sm:text-2xl">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function computeStats(transactions: HeliusTransaction[]): WalletStats {
  const mints = new Set<string>();
  const typeDistribution: Record<string, number> = {};
  const monthMap: Record<string, number> = {};
  let totalFees = 0;

  for (const tx of transactions) {
    totalFees += tx.fee / 1e9;

    typeDistribution[tx.type] = (typeDistribution[tx.type] || 0) + 1;

    for (const tt of tx.tokenTransfers) {
      mints.add(tt.mint);
    }

    const d = new Date(tx.timestamp * 1000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = (monthMap[key] || 0) + 1;
  }

  const volumeByMonth = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return {
    totalTransactions: transactions.length,
    totalFees,
    uniqueTokens: mints.size,
    typeDistribution,
    volumeByMonth,
  };
}
