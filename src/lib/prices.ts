const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

// Known stablecoins (mint address -> true)
const STABLECOIN_MINTS = new Set([
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",  // USDT
  "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",   // USDH
  // stSOL and mSOL intentionally excluded — they track SOL price, not $1
  "USD1ttGYvFfqUh3MKP2VzS1fEFGvxnnW5n1T5PXuoKS",   // USD1
]);

// Map of date string "YYYY-MM-DD" -> SOL price in USD
export type PriceMap = Map<string, number>;

/**
 * Fetch SOL/USD daily price history from CoinGecko.
 * Free tier: 365-day max range. Transactions older than that will have null USD values.
 */
export interface PriceResult {
  prices: PriceMap;
  clamped: boolean; // true if range was clamped due to 365-day limit
}

export async function fetchSOLPriceHistory(
  fromTimestamp: number,
  toTimestamp: number
): Promise<PriceResult> {
  const priceMap: PriceMap = new Map();

  // Clamp "from" to 365 days ago (CoinGecko free tier limit)
  const now = Math.floor(Date.now() / 1000);
  const maxFrom = now - 365 * 86400;
  const clamped = fromTimestamp < maxFrom;
  const clampedFrom = Math.max(fromTimestamp, maxFrom);

  // No data to fetch if entire range is too old
  if (clampedFrom >= toTimestamp) {
    console.warn("Transaction range exceeds 365-day price history limit");
    return { prices: priceMap, clamped };
  }

  try {
    const url = `${COINGECKO_BASE}/coins/solana/market_chart/range?vs_currency=usd&from=${clampedFrom}&to=${toTimestamp}`;
    const res = await fetch(url, { referrerPolicy: "no-referrer" });

    if (!res.ok) {
      console.warn(`CoinGecko API returned ${res.status}`);
      return { prices: priceMap, clamped };
    }

    const data = await res.json();
    const prices: [number, number][] = data.prices ?? [];

    for (const [ms, price] of prices) {
      const d = new Date(ms);
      const key = dateKey(d);
      if (!priceMap.has(key)) {
        priceMap.set(key, price);
      }
    }
  } catch (err) {
    console.warn("Failed to fetch SOL price history:", err);
  }

  return { prices: priceMap, clamped };
}

export function getSOLPrice(priceMap: PriceMap, timestamp: number): number | null {
  const d = new Date(timestamp * 1000);
  const key = dateKey(d);

  // Exact date match
  const exact = priceMap.get(key);
  if (exact != null) return exact;

  // Try adjacent days (API might skip some) — use UTC to avoid timezone drift
  for (let offset = 1; offset <= 3; offset++) {
    const before = new Date(d);
    before.setUTCDate(before.getUTCDate() - offset);
    const priceBefore = priceMap.get(dateKey(before));
    if (priceBefore != null) return priceBefore;

    const after = new Date(d);
    after.setUTCDate(after.getUTCDate() + offset);
    const priceAfter = priceMap.get(dateKey(after));
    if (priceAfter != null) return priceAfter;
  }

  return null;
}

export function isStablecoin(mint: string): boolean {
  return STABLECOIN_MINTS.has(mint);
}

export function isSOLMint(mint: string): boolean {
  return (
    mint === "So11111111111111111111111111111111111111112" ||
    mint === "So11111111111111111111111111111111111111111"
  );
}

function dateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
