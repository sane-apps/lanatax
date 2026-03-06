"use client";

import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FetchProgressProps {
  loaded: number;
  currentPage: number;
}

export function FetchProgress({ loaded, currentPage }: FetchProgressProps) {
  return (
    <div className="glass-card mx-auto w-full max-w-2xl animate-fade-in rounded-xl p-[21px]">
      <div className="flex items-center gap-[13px]">
        <Loader2 className="h-5 w-5 animate-spin text-[#06B6D4]" />
        <div className="flex-1">
          <div className="mb-[8px] flex items-center justify-between text-sm">
            <span className="text-white">
              Fetching transactions...
            </span>
            <span className="text-white/90">
              {loaded.toLocaleString()} loaded &middot; page {currentPage}
            </span>
          </div>
          <Progress value={undefined} className="h-1.5 bg-white/5" />
        </div>
      </div>
    </div>
  );
}
