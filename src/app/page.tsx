"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { AnimatedBackground } from "@/components/animated-background";
import { Header } from "@/components/header";
import { WalletProvider } from "@/components/wallet-provider";
import { HeroInput } from "@/components/hero-input";
import { FetchProgress } from "@/components/fetch-progress";
import { StatsCards } from "@/components/stats-cards";
import { TxTabs } from "@/components/tx-tabs";
import { Disclaimer } from "@/components/disclaimer";
import { Footer } from "@/components/footer";
import { EmptyState } from "@/components/empty-state";
import { HowItWorks } from "@/components/how-it-works";
import { SaneAppsShowcase } from "@/components/saneapps-showcase";
import { Testimonials } from "@/components/testimonials";
import { FAQSection } from "@/components/faq-section";
import { SupportSection } from "@/components/support-section";
import { StructuredData } from "@/components/structured-data";
import { useTransactions } from "@/hooks/use-transactions";
import { useLocalStorageString } from "@/hooks/use-local-storage";
import { loadTokenList } from "@/lib/tokens";
import { fetchSOLPriceHistory, type PriceMap, type PriceResult } from "@/lib/prices";
import { STORAGE_KEYS } from "@/lib/constants";
import type { TokenInfo, HeliusTransaction } from "@/lib/types";

const DEFAULT_TAX_YEAR = new Date().getFullYear() - 1;

export default function Home() {
  return (
    <WalletProvider>
      <HomeContent />
    </WalletProvider>
  );
}

function HomeContent() {
  const [wallet, setWallet] = useLocalStorageString(STORAGE_KEYS.WALLET);
  const [apiKey, setApiKey] = useLocalStorageString(STORAGE_KEYS.API_KEY);
  const [taxYear, setTaxYear] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_TAX_YEAR;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TAX_YEAR);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 2020 && parsed <= new Date().getFullYear()) {
          return parsed;
        }
      }
    } catch { /* ignore */ }
    return DEFAULT_TAX_YEAR;
  });

  // Persist tax year selection
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TAX_YEAR, String(taxYear));
    } catch { /* ignore */ }
  }, [taxYear]);
  const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
  const [solPrices, setSolPrices] = useState<PriceMap>(new Map());

  const {
    status,
    transactions,
    error,
    progress,
    fetchTransactions,
    cancel,
    setTransactions,
  } = useTransactions();

  // Filter transactions to the selected tax year
  const filteredTransactions = useMemo(() => {
    const yearStart = Date.UTC(taxYear, 0, 1) / 1000;
    const yearEnd = Date.UTC(taxYear + 1, 0, 1) / 1000;
    return transactions.filter(
      (tx) => tx.timestamp >= yearStart && tx.timestamp < yearEnd
    );
  }, [transactions, taxYear]);

  // Load token list on mount
  useEffect(() => {
    loadTokenList().then(setTokenMap);
  }, []);

  // Fetch SOL price history for the selected tax year
  useEffect(() => {
    if (filteredTransactions.length === 0) {
      setSolPrices(new Map());
      return;
    }

    const yearStart = Date.UTC(taxYear, 0, 1) / 1000;
    const yearEnd = Date.UTC(taxYear + 1, 0, 1) / 1000;
    const from = yearStart - 86400;
    const to = yearEnd + 86400;

    fetchSOLPriceHistory(from, to).then((result: PriceResult) => {
      if (result.prices.size > 0) {
        setSolPrices(result.prices);
        toast.success(`Loaded SOL prices for ${taxYear} (${result.prices.size} days)`);
      }
      if (result.clamped) {
        toast.warning(
          "Some transactions are older than 365 days — USD values may be missing for those dates.",
          { duration: 8000 }
        );
      }
    });
  }, [filteredTransactions.length, taxYear]);

  // Restore cached transactions on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (cached) {
        const parsed: HeliusTransaction[] = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [setTransactions]);

  const handleFetch = useCallback(async () => {
    const result = await fetchTransactions(wallet, apiKey);
    if (result && result.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.TRANSACTIONS,
          JSON.stringify(result)
        );
      } catch {
        toast.warning("Could not cache transactions — localStorage may be full");
      }
      toast.success(`Loaded ${result.length.toLocaleString()} transactions`);
    } else if (result && result.length === 0) {
      toast.info("No transactions found for this wallet");
    }
  }, [wallet, apiKey, fetchTransactions]);

  return (
    <>
      <AnimatedBackground />
      <Header />

      <main className="mx-auto min-h-screen max-w-6xl overflow-x-hidden px-[21px] sm:px-[34px]">
        <HeroInput
          wallet={wallet}
          apiKey={apiKey}
          taxYear={taxYear}
          onWalletChange={setWallet}
          onApiKeyChange={setApiKey}
          onTaxYearChange={setTaxYear}
          onFetch={handleFetch}
          onCancel={cancel}
          status={status}
        />

        {/* Error banner */}
        {status === "error" && error && (
          <div className="mx-auto mb-[34px] max-w-2xl animate-fade-in rounded-xl border border-red-500/10 bg-red-500/5 px-[21px] py-[13px]">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Loading progress */}
        {status === "loading" && (
          <div className="mb-[34px]">
            <FetchProgress
              loaded={progress.loaded}
              currentPage={progress.currentPage}
            />
          </div>
        )}

        {/* Results */}
        {status === "success" && transactions.length > 0 && (
          <div className="space-y-[34px] pb-[34px] animate-fade-in">
            {/* Year filter info */}
            {filteredTransactions.length !== transactions.length && (
              <div className="mx-auto max-w-2xl rounded-xl border border-[#06B6D4]/10 bg-[#06B6D4]/5 px-[21px] py-[13px] text-center">
                <p className="text-sm text-white">
                  Showing <span className="font-semibold">{filteredTransactions.length.toLocaleString()}</span> transactions
                  for tax year <span className="font-semibold">{taxYear}</span>
                  {" "}(out of {transactions.length.toLocaleString()} total)
                </p>
              </div>
            )}

            {filteredTransactions.length > 0 ? (
              <>
                <StatsCards transactions={filteredTransactions} />
                <TxTabs
                  transactions={filteredTransactions}
                  wallet={wallet}
                  tokenMap={tokenMap}
                  solPrices={solPrices}
                />
                <Disclaimer />
              </>
            ) : (
              <div className="flex flex-col items-center gap-[13px] py-[55px] text-center">
                <p className="text-lg font-medium text-white">
                  No transactions in {taxYear}
                </p>
                <p className="max-w-sm text-sm text-white/90">
                  This wallet has no transactions between Jan 1 and Dec 31, {taxYear}.
                  Try selecting a different tax year.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {status === "success" && transactions.length === 0 && <EmptyState />}

        {/* Info sections — always visible */}
        <div className="space-y-[89px] pt-[89px]">
          <HowItWorks />
          <SaneAppsShowcase />
          <Testimonials />
          <FAQSection />
          <SupportSection />
        </div>

        <Footer />
      </main>

      <StructuredData />
    </>
  );
}
