import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const SITE_TITLE = "LanaTax — Solana Tax Calculator | Free History & CSV Export";
const SITE_DESCRIPTION =
  "Free Solana tax calculator. Paste a wallet address, see transaction history with charts, export tax-ready CSV for Koinly and CoinLedger. Runs in your browser.";

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
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "https://tax.saneapps.com",
    siteName: "LanaTax",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
