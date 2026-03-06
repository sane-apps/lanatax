import { HELIUS_API_BASE, HELIUS_PAGE_LIMIT } from "./constants";
import type { HeliusTransaction } from "./types";

interface FetchProgress {
  loaded: number;
  currentPage: number;
}

export class HeliusFetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "HeliusFetchError";
  }
}

export async function fetchAllTransactions(
  wallet: string,
  apiKey: string,
  onProgress?: (progress: FetchProgress) => void,
  signal?: AbortSignal
): Promise<HeliusTransaction[]> {
  const allTransactions: HeliusTransaction[] = [];
  let lastSignature: string | undefined;
  let page = 0;

  while (true) {
    if (signal?.aborted) {
      throw new DOMException("Fetch cancelled", "AbortError");
    }

    const url = buildUrl(wallet, apiKey, lastSignature);
    const transactions = await fetchPage(url, signal);

    allTransactions.push(...transactions);
    page++;

    onProgress?.({
      loaded: allTransactions.length,
      currentPage: page,
    });

    if (transactions.length < HELIUS_PAGE_LIMIT) {
      break;
    }

    lastSignature = transactions[transactions.length - 1].signature;

    // Inter-page delay to avoid 403 bans from rapid pagination
    await sleep(500, signal);
  }

  return allTransactions;
}

function buildUrl(
  wallet: string,
  apiKey: string,
  before?: string
): string {
  const params = new URLSearchParams({
    "api-key": apiKey,
    limit: String(HELIUS_PAGE_LIMIT),
  });
  if (before) {
    params.set("before", before);
  }
  return `${HELIUS_API_BASE}/addresses/${wallet}/transactions?${params}`;
}

async function fetchPage(
  url: string,
  signal?: AbortSignal,
  retries = 0
): Promise<HeliusTransaction[]> {
  const MAX_RETRIES = 5;

  try {
    const res = await fetch(url, { signal, referrerPolicy: "no-referrer" });

    if (res.status === 429) {
      if (retries >= MAX_RETRIES) {
        throw new HeliusFetchError("Too many requests to Helius. Wait a minute and try again — this is normal for large wallets.", 429);
      }
      const delay = Math.pow(2, retries) * 1000;
      await sleep(delay, signal);
      return fetchPage(url, signal, retries + 1);
    }

    if (res.status === 401) {
      throw new HeliusFetchError(
        "Your Helius API key is invalid or expired. Generate a new one at dev.helius.xyz.",
        res.status
      );
    }

    if (res.status === 403) {
      throw new HeliusFetchError(
        "Your Helius API key was temporarily blocked (too many requests). Wait a few minutes and try again.",
        res.status
      );
    }

    if (!res.ok) {
      throw new HeliusFetchError(
        `Something went wrong fetching transactions (error ${res.status}). Please try again.`,
        res.status
      );
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new HeliusFetchError("Unexpected response format from Helius API");
    }

    return data as HeliusTransaction[];
  } catch (err) {
    if (err instanceof HeliusFetchError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new HeliusFetchError(
      "Network error — check your internet connection and try again."
    );
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Fetch cancelled", "AbortError"));
    });
  });
}
