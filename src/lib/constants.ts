export const HELIUS_API_BASE = "https://api.helius.xyz/v0";
export const HELIUS_PAGE_LIMIT = 100;

export const STORAGE_KEYS = {
  WALLET: "lanatax_wallet",
  API_KEY: "lanatax_api_key",
  TAX_YEAR: "lanatax_tax_year",
  TRANSACTIONS: "lanatax_transactions",
} as const;

export const SOLSCAN_BASE = "https://solscan.io";
export const JUPITER_TOKEN_LIST = "https://token.jup.ag/strict";

export const TX_TYPE_COLORS: Record<string, string> = {
  SWAP: "#3B82F6",
  TRANSFER: "#9945FF",
  NFT_SALE: "#FFD700",
  NFT_LISTING: "#FF9500",
  NFT_MINT: "#60A5FA",
  BURN: "#FF6B6B",
  STAKE_SOL: "#3B82F6",
  UNSTAKE_SOL: "#60A5FA",
  UNKNOWN: "#e5e5e5",
};

export const TAX_TYPE_LABELS: Record<string, string> = {
  BUY: "Buy",
  SELL: "Sell",
  TRANSFER_IN: "Transfer In",
  TRANSFER_OUT: "Transfer Out",
  AIRDROP: "Airdrop",
  FEE: "Fee",
  NFT_PURCHASE: "NFT Purchase",
  NFT_SALE: "NFT Sale",
  STAKE: "Stake",
  UNSTAKE: "Unstake",
  MINT: "Mint",
  BURN: "Burn",
  UNKNOWN: "Unknown",
};
