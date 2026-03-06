// JSON-LD structured data for SEO
// All content is hardcoded static strings — no user input, no injection risk.

const WEB_APP_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "LanaTax",
  description:
    "Free Solana tax calculator. View transaction history and export tax-ready CSV.",
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
    "100% on-device processing",
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
  mainEntity: [
    {
      "@type": "Question",
      name: "What does LanaTax do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LanaTax reads your Solana wallet transaction history via the Helius API, categorizes each transaction by type, calculates estimated USD values, and exports everything as a tax-ready CSV file compatible with Koinly and CoinLedger.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. LanaTax runs entirely in your browser. Your wallet address, API key, and transaction data never leave your device, and there is no backend server or database storing them. The site uses privacy-respecting Cloudflare Web Analytics, but wallet data stays on your machine.",
      },
    },
    {
      "@type": "Question",
      name: "Is LanaTax really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely free with no limits. Unlimited transactions, full CSV export, no paywalls, no subscriptions. LanaTax is a community tool by SaneApps.",
      },
    },
    {
      "@type": "Question",
      name: "Why do I need a Helius API key?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Helius provides detailed, parsed Solana transaction data. Their free tier gives you 100,000 API calls per month. Your browser talks directly to Helius, keeping your data private.",
      },
    },
  ],
});

// Safe: all schemas are compile-time constants from hardcoded strings above
/* eslint-disable react/no-danger */
export function StructuredData() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEB_APP_SCHEMA }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />
    </>
  );
}
