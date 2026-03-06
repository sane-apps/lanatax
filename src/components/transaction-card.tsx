"use client";

import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { formatAddress, formatDate, formatSol, copyToClipboard } from "@/lib/utils";
import { TX_TYPE_COLORS, SOLSCAN_BASE } from "@/lib/constants";
import type { HeliusTransaction, TokenInfo } from "@/lib/types";
import { lookupToken } from "@/lib/tokens";
import { toast } from "sonner";

interface TransactionCardProps {
  tx: HeliusTransaction;
  wallet: string;
  tokenMap: Map<string, TokenInfo>;
}

export function TransactionCard({ tx, wallet, tokenMap }: TransactionCardProps) {
  const typeColor = TX_TYPE_COLORS[tx.type] || TX_TYPE_COLORS.UNKNOWN;

  return (
    <div className="glass-card rounded-xl p-[21px] transition-colors hover:bg-white/[0.03]">
      <div className="flex flex-wrap items-start justify-between gap-[8px]">
        {/* Left: type + description */}
        <div className="min-w-0 flex-1 space-y-[8px]">
          <div className="flex flex-wrap items-center gap-[8px]">
            <Badge
              className="rounded-md border-0 px-2 py-0.5 text-sm font-medium"
              style={{
                backgroundColor: `${typeColor}20`,
                color: typeColor,
              }}
            >
              {tx.type}
            </Badge>
            <span className="text-sm text-white/90">
              {formatDate(tx.timestamp)}
            </span>
          </div>

          {tx.description && (
            <p className="truncate text-sm text-white/90">
              {tx.description}
            </p>
          )}

          {/* Token chips */}
          <div className="flex flex-wrap gap-[8px]">
            {tx.tokenTransfers.slice(0, 4).map((tt, i) => {
              const token = lookupToken(tt.mint, tokenMap);
              const isIncoming =
                tt.toUserAccount?.toLowerCase() === wallet.toLowerCase();
              return (
                <span
                  key={i}
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm ${
                    isIncoming
                      ? "bg-[#06B6D4]/10 text-[#06B6D4]"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {isIncoming ? "+" : "-"}
                  {Math.abs(tt.tokenAmount).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}{" "}
                  {token.symbol}
                </span>
              );
            })}
            {tx.nativeTransfers
              .filter((nt) => nt.amount > 0)
              .slice(0, 2)
              .map((nt, i) => {
                const isIncoming =
                  nt.toUserAccount.toLowerCase() === wallet.toLowerCase();
                return (
                  <span
                    key={`native-${i}`}
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm ${
                      isIncoming
                        ? "bg-[#06B6D4]/10 text-[#06B6D4]"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isIncoming ? "+" : "-"}
                    {formatSol(nt.amount)} SOL
                  </span>
                );
              })}
          </div>
        </div>

        {/* Right: signature + links */}
        <div className="flex shrink-0 items-center gap-[8px]">
          <button
            onClick={() => {
              copyToClipboard(tx.signature);
              toast.success("Signature copied");
            }}
            className="rounded-md p-1.5 text-white transition-colors hover:bg-white/5 hover:text-white"
            title="Copy signature"
            aria-label="Copy transaction signature"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <a
            href={`${SOLSCAN_BASE}/tx/${tx.signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-white transition-colors hover:bg-white/5 hover:text-white"
            title="View on Solscan"
            aria-label="View transaction on Solscan"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Fee */}
      {tx.fee > 0 && (
        <div className="mt-[8px] text-sm text-white">
          Fee: {formatSol(tx.fee)} SOL
        </div>
      )}
    </div>
  );
}
