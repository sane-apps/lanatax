"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Search, Key, X, Calendar, ChevronDown, ChevronUp, ExternalLink, Wallet, Shield, Eye, Heart, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidBase58, isValidHeliusKey } from "@/lib/utils";
import type { FetchStatus } from "@/lib/types";

interface HeroInputProps {
  wallet: string;
  apiKey: string;
  taxYear: number;
  onWalletChange: (v: string) => void;
  onApiKeyChange: (v: string) => void;
  onTaxYearChange: (v: number) => void;
  onFetch: () => void;
  onCancel: () => void;
  status: FetchStatus;
}

const AVAILABLE_YEARS = (() => {
  const current = new Date().getFullYear();
  return [current - 1, current, current - 2, current - 3];
})();

const TRUST_BADGES = [
  { icon: Shield, label: "100% On-Device" },
  { icon: Eye, label: "100% Transparent Code" },
  { icon: Heart, label: "Free Forever" },
];

export function HeroInput({
  wallet,
  apiKey,
  taxYear,
  onWalletChange,
  onApiKeyChange,
  onTaxYearChange,
  onFetch,
  onCancel,
  status,
}: HeroInputProps) {
  const [showKeyGuide, setShowKeyGuide] = useState(false);
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const walletValid = wallet.length === 0 || isValidBase58(wallet);
  const apiKeyValid = apiKey.length === 0 || isValidHeliusKey(apiKey);
  const canFetch =
    isValidBase58(wallet) && isValidHeliusKey(apiKey) && status !== "loading";
  const isLoading = status === "loading";

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
    onWalletChange("");
  };

  // Auto-fill wallet address when wallet connects
  const walletConnected = connected && publicKey;
  useEffect(() => {
    if (walletConnected && publicKey) {
      onWalletChange(publicKey.toBase58());
    }
  }, [walletConnected, publicKey, onWalletChange]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-[34px] pt-[89px] pb-[13px]">
      {/* Title */}
      <div className="space-y-[13px] text-center">
        <h1 className="font-display font-semibold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
          Solana Taxes
          <span className="gradient-text-animated"> Made Simple</span>
        </h1>
        <p className="text-white" style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", lineHeight: 1.7 }}>
          Paste your wallet or connect it. Get tax-ready CSV. No sign-up needed.
        </p>
        <p className="font-medium text-[#5CE8FF]" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}>
          100% free. Unlimited transactions. No limits.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-[21px] pt-[13px]">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-[8px]">
              <badge.icon className="h-[18px] w-[18px] text-[#5CE8FF]" />
              <span className="text-[0.95rem] font-medium text-white">{badge.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Inputs */}
      <div className="glass-card mx-auto max-w-2xl space-y-[21px] rounded-2xl p-[34px] max-sm:p-[20px] max-sm:rounded-xl">
        <div className="space-y-[8px]">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-[8px] text-sm font-medium text-white">
              <Search className="h-4 w-4 text-[#06B6D4]" />
              Wallet Address
            </label>
            {walletConnected ? (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1 rounded-md bg-white/5 px-[13px] py-[4px] text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <Wallet className="h-4 w-4 text-green-400" />
                Connected
                <X className="ml-1 h-3 w-3" />
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="flex items-center gap-1 rounded-md bg-[#06B6D4]/10 px-[13px] py-[4px] text-sm font-medium text-[#06B6D4] hover:bg-[#06B6D4]/20 transition-colors"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </button>
            )}
          </div>
          <Input
            placeholder="Enter Solana wallet address..."
            value={wallet}
            onChange={(e) => onWalletChange(e.target.value.trim())}
            disabled={!!walletConnected}
            className={`h-12 border-white/8 bg-white/5 text-base text-white placeholder:text-white/90 ${
              !walletValid ? "border-red-500/50 ring-1 ring-red-500/20" : ""
            } ${walletConnected ? "opacity-90" : ""}`}
          />
          {!walletValid && (
            <p className="text-sm text-red-400">Invalid Solana address format</p>
          )}
        </div>

        <div className="space-y-[8px]">
          <label className="flex items-center gap-[8px] text-sm font-medium text-white">
            <Key className="h-4 w-4 text-[#06B6D4]" />
            Helius API Key
          </label>
          <Input
            placeholder="Enter your free Helius API key..."
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value.trim())}
            type="password"
            className={`h-12 border-white/8 bg-white/5 text-base text-white placeholder:text-white/90 ${
              !apiKeyValid ? "border-red-500/50 ring-1 ring-red-500/20" : ""
            }`}
          />
          {!apiKeyValid && (
            <p className="text-sm text-red-400">
              Invalid API key format. Helius keys look like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            </p>
          )}
          <div className="space-y-[8px]">
            <button
              onClick={() => setShowKeyGuide(!showKeyGuide)}
              className="flex items-center gap-1 text-sm text-[#06B6D4] hover:underline"
            >
              {showKeyGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              How do I get a free Helius API key?
            </button>
            {showKeyGuide && (
              <div className="rounded-lg bg-white/5 p-[13px] text-sm text-white space-y-[8px]">
                <ol className="list-decimal list-inside space-y-[8px]">
                  <li>
                    Go to{" "}
                    <a href="https://dev.helius.xyz" target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:underline">
                      dev.helius.xyz
                    </a>
                    {" "}and create a free account
                  </li>
                  <li>Click &quot;Generate API Key&quot; on your dashboard</li>
                  <li>Copy the key and paste it above</li>
                </ol>
                <p className="text-white">
                  Helius provides 100,000 free API calls/month — more than enough for tax exports.
                </p>
                <a
                  href="https://dev.helius.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-[#06B6D4]/10 px-[13px] py-[8px] text-sm font-medium text-[#06B6D4] hover:bg-[#06B6D4]/20 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Helius Dashboard
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-[8px]">
          <label className="flex items-center gap-[8px] text-sm font-medium text-white">
            <Calendar className="h-4 w-4 text-[#06B6D4]" />
            Tax Year
            <span className="font-normal text-white">(Jan 1 – Dec 31, UTC)</span>
          </label>
          <div className="flex gap-[8px]">
            {AVAILABLE_YEARS.map((year) => (
              <button
                key={year}
                onClick={() => onTaxYearChange(year)}
                className={`flex-1 rounded-lg py-[8px] text-sm font-medium transition-all ${
                  taxYear === year
                    ? "bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#5CE8FF] text-white btn-glow"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-[13px] pt-[8px]">
          {/* Success confirmation */}
          {status === "success" && (
            <div className="flex items-center justify-center gap-[8px] rounded-xl bg-[#06B6D4]/10 py-[13px] animate-fade-in">
              <CheckCircle2 className="h-5 w-5 text-[#06B6D4]" />
              <span className="text-sm font-medium text-[#06B6D4]">
                Transactions loaded successfully
              </span>
            </div>
          )}

          <div className="flex gap-[13px]">
            {isLoading ? (
              <Button
                onClick={onCancel}
                variant="outline"
                className="h-12 flex-1 border-white/10 bg-white/5 text-base text-white hover:bg-white/10"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            ) : (
              <Button
                onClick={onFetch}
                disabled={!canFetch}
                className="btn-glow h-12 flex-1 bg-gradient-to-r from-[#0E7490] via-[#0891B2] to-[#5CE8FF] text-base font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                {status === "success" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refetch Transactions
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Fetch Transactions
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
