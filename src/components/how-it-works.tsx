"use client";

import { Key, Search, Download, Shield } from "lucide-react";

const STEPS = [
  {
    icon: Key,
    title: "Get a Free API Key",
    description:
      "Create a free account at dev.helius.xyz and generate an API key. It takes 30 seconds and gives you 100,000 API calls per month.",
  },
  {
    icon: Search,
    title: "Fetch Your History",
    description:
      "Paste your wallet address (or connect your wallet) and API key. LanaTax pulls your full transaction history directly from Helius — nothing goes through our servers.",
  },
  {
    icon: Shield,
    title: "Review Your Transactions",
    description:
      "See every transaction categorized by type — swaps, transfers, airdrops, NFT sales, staking, and more. Filter by type, search by signature, and review the full timeline.",
  },
  {
    icon: Download,
    title: "Export Tax-Ready CSV",
    description:
      "Download a Koinly/CoinLedger-compatible CSV with timestamps, types, amounts, fees, and estimated USD values. Hand it to your CPA or import it directly.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="mb-[34px] text-center font-display font-semibold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
        How It Works
      </h2>
      <div className="grid gap-[21px] sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-xl p-[21px] transition-all duration-300 hover:-translate-y-1"
            style={{
              background: `
                radial-gradient(ellipse at 90% 50%, rgba(92, 232, 255, 0.06) 0%, transparent 50%),
                linear-gradient(145deg, #16161f 0%, #0f0f16 100%)
              `,
              border: "1px solid rgba(6, 182, 212, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.35)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(6, 182, 212, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div className="flex gap-[13px]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#06B6D4]/10">
                <step.icon className="h-5 w-5 text-[#06B6D4]" />
              </div>
              <div>
                <div className="flex items-center gap-[8px]">
                  <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full bg-[#06B6D4]/25 text-xs font-bold text-[#5CE8FF]">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-[8px] text-[0.95rem] leading-relaxed text-white">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
