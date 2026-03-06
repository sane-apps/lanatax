"use client";

import { Info } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-white/5 bg-white/[0.02] px-[21px] py-[13px]">
      <div className="flex items-start gap-[8px]">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#06B6D4]/60" />
        <p className="text-sm leading-relaxed text-white/90">
          <strong className="text-white">Not tax advice.</strong> LanaTax
          provides transaction data for informational purposes only. Always
          consult a qualified tax professional. Accuracy depends on Helius API
          data quality.
        </p>
      </div>
    </div>
  );
}
