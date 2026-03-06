import { JUPITER_TOKEN_LIST } from "./constants";
import type { TokenInfo } from "./types";

let tokenCache: Map<string, TokenInfo> | null = null;

export async function loadTokenList(): Promise<Map<string, TokenInfo>> {
  if (tokenCache) return tokenCache;

  try {
    const res = await fetch(JUPITER_TOKEN_LIST);
    if (!res.ok) {
      console.warn("Failed to load Jupiter token list");
      return new Map();
    }

    const tokens: TokenInfo[] = await res.json();
    tokenCache = new Map(tokens.map((t) => [t.address, t]));
    return tokenCache;
  } catch {
    console.warn("Failed to load Jupiter token list");
    return new Map();
  }
}

export function lookupToken(
  mint: string,
  tokenMap: Map<string, TokenInfo>
): TokenInfo {
  const cached = tokenMap.get(mint);
  if (cached) return cached;

  return {
    address: mint,
    symbol: mint.slice(0, 4) + "...",
    name: "Unknown Token",
    decimals: 9,
  };
}

export function getSOLToken(): TokenInfo {
  return {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  };
}
