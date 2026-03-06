"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

const PRODUCTS = [
  {
    name: "SaneBar",
    icon: "/icons/sanebar-icon.png",
    url: "https://sanebar.com/?ref=lanatax",
    description: "Hide menu bar clutter with a click. Lock sensitive icons behind Touch ID. The Bartender alternative for macOS Tahoe.",
  },
  {
    name: "SaneClip",
    icon: "/icons/saneclip-icon.png",
    url: "https://saneclip.com/?ref=lanatax",
    description: "Clipboard history that never leaves your Mac. Touch ID protection, instant search, text transforms.",
  },
  {
    name: "SaneHosts",
    icon: "/icons/sanehosts-icon.png",
    url: "https://sanehosts.com/?ref=lanatax",
    description: "Block ads, trackers, and telemetry at the system level. A clean UI for your hosts file.",
  },
  {
    name: "SaneClick",
    icon: "/icons/saneclick-icon.png",
    url: "https://saneclick.com/?ref=lanatax",
    description: "Right-click power tools for Finder. Resize images, convert files, run scripts — all from context menus.",
  },
];

export function SaneAppsShowcase() {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="space-y-[8px] text-center mb-[34px]">
        <h2 className="font-display font-semibold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
          More from Sane<span className="text-[#5CE8FF]">Apps</span>
        </h2>
        <p className="text-white" style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", lineHeight: 1.7 }}>
          Privacy-first tools for macOS. No telemetry. No subscriptions.
        </p>
      </div>

      <div className="grid gap-[13px] sm:grid-cols-2">
        {PRODUCTS.map((product) => (
          <a
            key={product.name}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-[20px] p-[34px] max-sm:p-[20px] max-sm:rounded-[14px] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1"
            style={{
              background: "linear-gradient(145deg, #16161f 0%, #0f0f16 100%)",
              border: "1px solid rgba(92, 232, 255, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(92, 232, 255, 0.6)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(92, 232, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(92, 232, 255, 0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Top shimmer line on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              }}
            />

            <div className="flex items-start gap-[13px]">
              <Image
                src={product.icon}
                alt={product.name}
                width={56}
                height={56}
                className="shrink-0 rounded-[12px]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px]">
                  <h3 className="text-base font-semibold text-white">
                    {product.name}
                  </h3>
                  <ExternalLink className="h-3.5 w-3.5 text-white/20 transition-colors group-hover:text-[#5CE8FF]" />
                </div>
                <p className="mt-[8px] text-[0.95rem] leading-relaxed text-white/90">
                  {product.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-[21px] text-center">
        <a
          href="https://saneapps.com/?ref=lanatax"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[8px] rounded-xl bg-white/5 px-[21px] py-[13px] text-sm font-medium text-white transition-all hover:bg-white/10"
        >
          View all products at saneapps.com
          <ExternalLink className="h-4 w-4 text-[#5CE8FF]" />
        </a>
      </div>
    </section>
  );
}
