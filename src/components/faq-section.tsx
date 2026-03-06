"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What does LanaTax do?",
    a: "LanaTax reads your Solana wallet's full transaction history via the Helius API, categorizes each transaction by type (swap, transfer, airdrop, NFT sale, etc.), calculates estimated USD values using historical SOL prices, and exports everything as a tax-ready CSV file compatible with Koinly, CoinLedger, and other tax software.",
  },
  {
    q: "What does LanaTax NOT do?",
    a: "LanaTax is not a tax filing service. It does not file taxes for you, provide legal tax advice, or guarantee accuracy for IRS reporting. It does not track cross-chain transactions (only Solana), does not handle DeFi yield farming calculations, and does not store any data on servers. Always verify the output with a qualified tax professional.",
  },
  {
    q: "Is my data private?",
    a: "100%. LanaTax runs entirely in your browser. Your wallet address, API key, and transaction data never leave your device. There is no backend server, no database, no analytics, and no tracking. Your Helius API key is stored in your browser's localStorage and is only used to make direct API calls from your machine.",
  },
  {
    q: "Why do I need a Helius API key?",
    a: "Helius provides detailed, parsed Solana transaction data that's far richer than what the standard Solana RPC returns. Their free tier gives you 100,000 API calls per month, which is more than enough for tax exports. LanaTax doesn't proxy through any servers — your browser talks directly to Helius, keeping your data private.",
  },
  {
    q: "Is LanaTax really free?",
    a: "Yes — completely free with no limits, no paywalls, and no subscriptions. Unlimited transactions, full CSV export, everything. LanaTax is built by the SaneApps team as a community tool. If it saves you time, consider supporting us on GitHub Sponsors.",
  },
  {
    q: "How accurate are the USD values?",
    a: "USD values are estimated using daily SOL closing prices from CoinGecko. For SOL-denominated transactions, this is quite accurate. For token swaps, LanaTax shows the SOL fee value but cannot determine exact token-to-USD prices (the CSV marks these as N/A). CoinGecko's free tier only provides 365 days of history, so older transactions may not have USD values.",
  },
  {
    q: "What tax year formats are supported?",
    a: "LanaTax uses calendar year (Jan 1 - Dec 31, UTC) which is the standard for US tax reporting. You can select the tax year using the year picker. All timestamps are in UTC to avoid timezone ambiguity.",
  },
  {
    q: "Can I connect my wallet instead of pasting an address?",
    a: "Yes. Click \"Connect Wallet\" to connect Phantom, Solflare, or any Solana wallet extension. This auto-fills your wallet address. You still need a Helius API key since the wallet connection is only used for your address — LanaTax never requests transaction signing permissions.",
  },
  {
    q: "Is LanaTax open source?",
    a: "The code is fully transparent and inspectable. LanaTax is part of the SaneApps family — tools built with a privacy-first, no-telemetry philosophy. You can verify that no data is sent anywhere by inspecting the network tab in your browser's developer tools.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="mb-[34px] text-center font-display font-semibold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-[8px]">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="glass-card overflow-hidden rounded-xl"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-[21px] py-[13px] text-left"
            >
              <span className="text-sm font-medium text-white pr-[13px]">
                {item.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#06B6D4] transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="border-t border-white/5 px-[21px] py-[13px]">
                <p className="text-sm leading-relaxed text-white">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
