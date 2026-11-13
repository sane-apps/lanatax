"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/faq";


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
