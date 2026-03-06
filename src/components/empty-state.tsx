"use client";

import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-[13px] py-[89px] text-center">
      <div className="rounded-full bg-white/5 p-[21px]">
        <Inbox className="h-8 w-8 text-[#06B6D4]" />
      </div>
      <p className="text-lg font-medium text-white">No transactions found</p>
      <p className="max-w-sm text-sm text-white/90">
        This wallet has no transaction history on Helius, or the address may be
        incorrect. Double-check and try again.
      </p>
    </div>
  );
}
