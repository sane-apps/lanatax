"use client";

import { Separator } from "@/components/ui/separator";
import { withReferralSource } from "@/lib/referral";

const LINKS = [
  { label: "Sponsor", href: "https://github.com/sponsors/MrSaneApps" },
  { label: "Privacy", href: "https://saneapps.com/privacy" },
  { label: "Contact", href: "mailto:hi@saneapps.com" },
  { label: "SaneApps", href: "https://saneapps.com/?ref=lanatax" },
];

export function Footer() {
  return (
    <footer className="pb-[34px] pt-[55px]">
      <Separator className="mb-[34px] bg-white/5" />
      <div className="flex flex-col items-center gap-[13px] text-center">
        <p className="text-sm font-semibold text-white">
          No cloud processing. Wallet data stays on your device.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[21px]">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={withReferralSource(link.href)}
              {...(link.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="text-sm text-white transition-colors hover:text-[#5CE8FF]"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-sm text-white">
          Made with care by Mr. Sane &middot; &copy; {new Date().getFullYear()} LanaTax
        </p>
        <p className="text-sm text-white">
          Built by SaneApps. The site uses privacy-respecting Cloudflare Web Analytics.
        </p>
        <p className="text-sm text-white">
          Not tax advice. Always consult a qualified tax professional.
        </p>
      </div>
    </footer>
  );
}
