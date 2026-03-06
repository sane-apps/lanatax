import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LanaTax — Solana Tax Calculator | Free Transaction History & CSV Export",
  description:
    "Free Solana tax calculator. Paste your wallet address, see full transaction history with charts, and export tax-ready CSV for Koinly and CoinLedger. 100% on-device, no sign-up required.",
  keywords: [
    "Solana tax calculator",
    "Solana transactions",
    "crypto tax CSV",
    "Koinly Solana",
    "CoinLedger Solana",
    "Solana wallet history",
    "Helius API",
    "Solana tax export",
  ],
  authors: [{ name: "Mr. Sane", url: "https://saneapps.com" }],
  openGraph: {
    title: "LanaTax — Solana Tax Calculator",
    description:
      "Paste your Solana wallet, see full transaction history, export tax-ready CSV. 100% on-device. No sign-up.",
    url: "https://tax.saneapps.com",
    siteName: "LanaTax",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LanaTax — Solana Tax Calculator",
    description:
      "Paste your Solana wallet, get tax-ready CSV. 100% free. No sign-up.",
    site: "@saneapps",
    creator: "@saneapps",
  },
  metadataBase: new URL("https://tax.saneapps.com"),
  alternates: {
    canonical: "https://tax.saneapps.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#050507",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"cbd53694e0654329ae1436b06f70a9b4"}'
        />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#0f0f14",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f0f0f5",
            },
          }}
        />
      </body>
    </html>
  );
}
