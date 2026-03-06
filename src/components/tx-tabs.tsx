"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Clock, FileDown } from "lucide-react";
import { OverviewTab } from "./overview-tab";
import { TimelineTab } from "./timeline-tab";
import { TaxExportTab } from "./tax-export-tab";
import type { HeliusTransaction, TokenInfo } from "@/lib/types";
import type { PriceMap } from "@/lib/prices";

interface TxTabsProps {
  transactions: HeliusTransaction[];
  wallet: string;
  tokenMap: Map<string, TokenInfo>;
  solPrices: PriceMap;
}

export function TxTabs({
  transactions,
  wallet,
  tokenMap,
  solPrices,
}: TxTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="glass mb-[34px] h-auto w-full gap-[8px] rounded-xl border-0 p-[8px]">
        <TabsTrigger
          value="overview"
          className="flex-1 gap-[8px] rounded-lg py-[13px] text-sm text-white/90 data-[state=active]:!bg-[#06B6D4]/10 data-[state=active]:!text-[#06B6D4] data-[state=active]:!border-[#06B6D4]/20"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="timeline"
          className="flex-1 gap-[8px] rounded-lg py-[13px] text-sm text-white/90 data-[state=active]:!bg-[#06B6D4]/10 data-[state=active]:!text-[#06B6D4] data-[state=active]:!border-[#06B6D4]/20"
        >
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Timeline</span>
        </TabsTrigger>
        <TabsTrigger
          value="export"
          className="flex-1 gap-[8px] rounded-lg py-[13px] text-sm text-white/90 data-[state=active]:!bg-[#06B6D4]/10 data-[state=active]:!text-[#06B6D4] data-[state=active]:!border-[#06B6D4]/20"
        >
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">Tax Export</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-0">
        <OverviewTab transactions={transactions} />
      </TabsContent>

      <TabsContent value="timeline" className="mt-0">
        <TimelineTab
          transactions={transactions}
          wallet={wallet}
          tokenMap={tokenMap}
        />
      </TabsContent>

      <TabsContent value="export" className="mt-0">
        <TaxExportTab
          transactions={transactions}
          wallet={wallet}
          tokenMap={tokenMap}
          solPrices={solPrices}
        />
      </TabsContent>
    </Tabs>
  );
}
