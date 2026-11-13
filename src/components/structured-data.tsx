// JSON-LD structured data for SEO
// All content is hardcoded static strings — no user input, no injection risk.

import { FAQ_ITEMS } from "@/lib/faq";

const WEB_APP_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "LanaTax",
  description:
    "Free Solana tax calculator. Paste a wallet address, see transaction history with charts, export tax-ready CSV for Koinly and CoinLedger. Runs in your browser.",
  url: "https://tax.saneapps.com",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Completely free — no limits, no subscription",
  },
  featureList: [
    "Solana transaction history viewer",
    "Tax-ready CSV export (Koinly/CoinLedger)",
    "Transaction type categorization",
    "Historical USD cost basis estimates",
    "Runs in your browser, no LanaTax server",
    "Unlimited transactions",
  ],
  author: {
    "@type": "Person",
    name: "Mr. Sane",
    url: "https://saneapps.com",
  },
});

const FAQ_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

export function StructuredData() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEB_APP_SCHEMA }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />
    </>
  );
}
