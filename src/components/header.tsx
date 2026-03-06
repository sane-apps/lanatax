"use client";

import { Coins, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="glass fixed top-0 right-0 left-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-[21px] sm:px-[34px]">
        <div className="flex items-center gap-[8px] sm:gap-[13px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0E7490] via-[#0891B2] to-[#5CE8FF]">
            <Coins className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            LanaTax
          </span>
          <a
            href="https://x.com/mert/status/2023796809068392703"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-[8px] text-sm italic text-white transition-colors hover:text-[#06B6D4] sm:flex"
          >
            &ldquo;so, Lana — do my solana taxes. make no mistakes.&rdquo;
            <span className="not-italic text-[#06B6D4]">— @mert, CEO of Helius</span>
          </a>
        </div>

        <div className="flex items-center gap-[13px]">
          <a
            href="/guides.html"
            className="text-sm text-white/80 transition-colors hover:text-[#5CE8FF]"
          >
            Guides
          </a>
          <a
            href="https://github.com/sponsors/MrSaneApps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[8px] rounded-lg bg-white/5 px-[13px] py-[8px] text-sm font-medium text-white transition-all hover:bg-white/10"
          >
            <Heart className="h-4 w-4 text-[#ea4aaa]" />
            <span className="hidden sm:inline">Donate</span>
          </a>
          <a
            href="https://saneapps.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-white transition-colors hover:text-[#06B6D4] sm:inline"
          >
            by SaneApps
          </a>
        </div>
      </div>
    </header>
  );
}
