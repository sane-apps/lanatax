"use client";

import { useState } from "react";
import { Heart, Copy, Check } from "lucide-react";

const CRYPTO_ADDRESSES = [
  {
    name: "BTC",
    address: "3Go9nJu3dj2qaa4EAYXrTsTf5AnhcrPQke",
    icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/btc.svg",
    color: "#F7931A",
    bg: "rgba(247, 147, 26, 0.15)",
    border: "rgba(247, 147, 26, 0.4)",
  },
  {
    name: "ETH",
    address: "0x026668feA51c27F0803055B8c0d881ac2F1e7C3e",
    icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/eth.svg",
    color: "#627EEA",
    bg: "rgba(98, 126, 234, 0.15)",
    border: "rgba(98, 126, 234, 0.4)",
  },
  {
    name: "SOL",
    address: "FBvU83GUmwEYk3HMwZh3GBorGvrVVWSPb8VLCKeLiWZZ",
    icon: "https://cryptologos.cc/logos/solana-sol-logo.svg",
    color: "#9945FF",
    bg: "rgba(153, 69, 255, 0.15)",
    border: "rgba(153, 69, 255, 0.4)",
  },
  {
    name: "ZEC",
    address: "t1PaQ7LSoRDVvXLaQTWmy5tKUAiKxuE9hBN",
    icon: "https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/zec.svg",
    color: "#F4B728",
    bg: "rgba(244, 183, 40, 0.15)",
    border: "rgba(244, 183, 40, 0.4)",
  },
];

function CryptoAddress({
  crypto,
}: {
  crypto: (typeof CRYPTO_ADDRESSES)[number];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(crypto.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex w-full items-center gap-[13px] rounded-lg p-[13px] transition-all"
      style={{
        background: copied ? crypto.bg : "rgba(255,255,255,0.03)",
        border: `1px solid ${copied ? crypto.border : "transparent"}`,
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.background = crypto.bg;
          e.currentTarget.style.borderColor = crypto.border;
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "transparent";
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={crypto.icon}
        alt={crypto.name}
        width={24}
        height={24}
        className="shrink-0 rounded-full"
      />
      <code
        className="flex-1 break-all text-left text-sm transition-colors"
        style={{ color: copied ? crypto.color : "#ffffff" }}
      >
        {copied ? "Copied!" : crypto.address}
      </code>
      {copied ? (
        <Check className="h-4 w-4 shrink-0" style={{ color: crypto.color }} />
      ) : (
        <Copy className="h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-white" />
      )}
    </button>
  );
}

export function SupportSection() {
  return (
    <section className="mx-auto max-w-3xl space-y-[21px]">
      <div className="text-center">
        <h2 className="font-display font-semibold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
          Support the Developer
        </h2>
        <p className="text-white" style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", lineHeight: 1.7, marginTop: "13px" }}>
          I just want to show some love to a dev in the trenches
        </p>
      </div>

      <div className="flex justify-center">
        <a
          href="https://github.com/sponsors/MrSaneApps"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[8px] rounded-xl bg-white/5 px-[21px] py-[13px] text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          <Heart className="h-4 w-4 text-[#ea4aaa]" />
          Sponsor on GitHub
        </a>
      </div>

      <div className="glass-card rounded-xl p-[21px]">
        <p className="mb-[13px] text-sm font-semibold text-white">
          Or send crypto:
        </p>
        <div className="space-y-[8px]">
          {CRYPTO_ADDRESSES.map((crypto) => (
            <CryptoAddress key={crypto.name} crypto={crypto} />
          ))}
        </div>
        <p className="mt-[13px] text-sm text-[#06B6D4]">
          Click any address to copy
        </p>
      </div>
    </section>
  );
}
