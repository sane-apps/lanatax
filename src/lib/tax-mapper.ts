import type { HeliusTransaction, TaxEvent, TaxEventType, TokenInfo } from "./types";
import { lookupToken } from "./tokens";
import { getSOLPrice, isStablecoin, isSOLMint, type PriceMap } from "./prices";

export function mapTransactionsToTaxEvents(
  transactions: HeliusTransaction[],
  wallet: string,
  tokenMap: Map<string, TokenInfo>,
  solPrices?: PriceMap
): TaxEvent[] {
  const walletLower = wallet.toLowerCase();
  const events: TaxEvent[] = [];

  for (const tx of transactions) {
    const mapped = mapTransaction(tx, walletLower, tokenMap, solPrices);
    events.push(...mapped);
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function mapTransaction(
  tx: HeliusTransaction,
  wallet: string,
  tokenMap: Map<string, TokenInfo>,
  solPrices?: PriceMap
): TaxEvent[] {
  const events: TaxEvent[] = [];
  const date = new Date(tx.timestamp * 1000);
  const feeSOL = tx.fee / 1e9;
  const solPrice = solPrices ? getSOLPrice(solPrices, tx.timestamp) : null;
  const feeUsd = solPrice != null ? feeSOL * solPrice : null;

  switch (tx.type) {
    case "SWAP":
      events.push(...mapSwap(tx, wallet, tokenMap, date, feeSOL, solPrice));
      break;
    case "TRANSFER":
      events.push(...mapTransfer(tx, wallet, tokenMap, date, feeSOL, solPrice));
      break;
    case "NFT_SALE":
      events.push(...mapNftSale(tx, wallet, date, feeSOL, solPrice));
      break;
    case "NFT_MINT":
    case "COMPRESSED_NFT_MINT":
      events.push(makeEvent(date, "MINT", "NFT", 1, feeUsd, null, feeSOL, tx));
      break;
    case "BURN":
    case "BURN_NFT":
      events.push(makeEvent(date, "BURN", "Token", 0, null, null, feeSOL, tx));
      break;
    case "STAKE_SOL":
      events.push(...mapStake(tx, wallet, date, feeSOL, solPrice));
      break;
    case "UNSTAKE_SOL":
      events.push(...mapUnstake(tx, wallet, date, feeSOL, solPrice));
      break;
    default:
      events.push(...mapUnknown(tx, wallet, tokenMap, date, feeSOL, solPrice));
  }

  // Add fee event if wallet is fee payer
  if (tx.feePayer.toLowerCase() === wallet && feeSOL > 0) {
    events.push(makeEvent(date, "FEE", "SOL", feeSOL, feeUsd, null, 0, tx));
  }

  return events;
}

function estimateUsd(
  amount: number,
  mint: string,
  solPrice: number | null
): number | null {
  if (isSOLMint(mint)) {
    return solPrice != null ? amount * solPrice : null;
  }
  if (isStablecoin(mint)) {
    return amount; // 1:1 USD
  }
  return null;
}

function estimateUsdForSOL(
  solAmount: number,
  solPrice: number | null
): number | null {
  return solPrice != null ? solAmount * solPrice : null;
}

function mapSwap(
  tx: HeliusTransaction,
  wallet: string,
  tokenMap: Map<string, TokenInfo>,
  date: Date,
  feeSOL: number,
  solPrice: number | null
): TaxEvent[] {
  const events: TaxEvent[] = [];
  const swap = tx.events?.swap;

  if (swap) {
    // Calculate total USD value of the swap from the SOL/stablecoin leg
    let swapUsdValue: number | null = null;

    // Try to get USD value from native legs first
    if (swap.nativeInput) {
      const amt = Number(swap.nativeInput.amount) / 1e9;
      if (amt > 0 && solPrice != null) swapUsdValue = amt * solPrice;
    }
    if (swapUsdValue == null && swap.nativeOutput) {
      const amt = Number(swap.nativeOutput.amount) / 1e9;
      if (amt > 0 && solPrice != null) swapUsdValue = amt * solPrice;
    }

    // Try stablecoin legs
    if (swapUsdValue == null) {
      for (const t of [...swap.tokenInputs, ...swap.tokenOutputs]) {
        if (isStablecoin(t.mint)) {
          swapUsdValue = Number(t.rawTokenAmount.tokenAmount) / Math.pow(10, t.rawTokenAmount.decimals);
          break;
        }
      }
    }

    // Token outputs = received = BUY
    for (const output of swap.tokenOutputs) {
      const token = lookupToken(output.mint, tokenMap);
      const amount = Number(output.rawTokenAmount.tokenAmount) / Math.pow(10, output.rawTokenAmount.decimals);
      const usd = estimateUsd(amount, output.mint, solPrice) ?? swapUsdValue;
      events.push(makeEvent(date, "BUY", token.symbol, amount, usd, null, feeSOL, tx));
    }

    if (swap.nativeOutput) {
      const amount = Number(swap.nativeOutput.amount) / 1e9;
      if (amount > 0) {
        const usd = estimateUsdForSOL(amount, solPrice);
        events.push(makeEvent(date, "BUY", "SOL", amount, usd, null, feeSOL, tx));
      }
    }

    // Token inputs = spent = SELL
    for (const input of swap.tokenInputs) {
      const token = lookupToken(input.mint, tokenMap);
      const amount = Number(input.rawTokenAmount.tokenAmount) / Math.pow(10, input.rawTokenAmount.decimals);
      const usd = estimateUsd(amount, input.mint, solPrice) ?? swapUsdValue;
      events.push(makeEvent(date, "SELL", token.symbol, amount, null, usd, feeSOL, tx));
    }

    if (swap.nativeInput) {
      const amount = Number(swap.nativeInput.amount) / 1e9;
      if (amount > 0) {
        const usd = estimateUsdForSOL(amount, solPrice);
        events.push(makeEvent(date, "SELL", "SOL", amount, null, usd, feeSOL, tx));
      }
    }
  } else {
    // Fallback: use tokenTransfers
    for (const transfer of tx.tokenTransfers) {
      const token = lookupToken(transfer.mint, tokenMap);
      const isIncoming = transfer.toUserAccount?.toLowerCase() === wallet;
      const amount = Math.abs(transfer.tokenAmount);
      const usd = estimateUsd(amount, transfer.mint, solPrice);
      events.push(
        makeEvent(
          date,
          isIncoming ? "BUY" : "SELL",
          token.symbol,
          amount,
          isIncoming ? usd : null,
          isIncoming ? null : usd,
          feeSOL,
          tx
        )
      );
    }
  }

  return events;
}

function mapTransfer(
  tx: HeliusTransaction,
  wallet: string,
  tokenMap: Map<string, TokenInfo>,
  date: Date,
  feeSOL: number,
  solPrice: number | null
): TaxEvent[] {
  const events: TaxEvent[] = [];

  for (const nt of tx.nativeTransfers) {
    const amount = nt.amount / 1e9;
    if (amount <= 0) continue;

    const isIncoming = nt.toUserAccount.toLowerCase() === wallet;
    const type: TaxEventType = isIncoming ? "TRANSFER_IN" : "TRANSFER_OUT";
    const usd = estimateUsdForSOL(amount, solPrice);
    events.push(makeEvent(
      date, type, "SOL", amount,
      isIncoming ? usd : null,
      isIncoming ? null : usd,
      feeSOL, tx
    ));
  }

  for (const tt of tx.tokenTransfers) {
    const token = lookupToken(tt.mint, tokenMap);
    const amount = Math.abs(tt.tokenAmount);
    if (amount <= 0) continue;

    const isIncoming = tt.toUserAccount?.toLowerCase() === wallet;
    const type: TaxEventType =
      isIncoming && !tt.fromUserAccount ? "AIRDROP" : isIncoming ? "TRANSFER_IN" : "TRANSFER_OUT";
    const usd = estimateUsd(amount, tt.mint, solPrice);
    events.push(makeEvent(
      date, type, token.symbol, amount,
      isIncoming ? usd : null,
      isIncoming ? null : usd,
      feeSOL, tx
    ));
  }

  return events;
}

function mapNftSale(
  tx: HeliusTransaction,
  wallet: string,
  date: Date,
  feeSOL: number,
  solPrice: number | null
): TaxEvent[] {
  const nft = tx.events?.nft;
  if (!nft) return [];

  const isSeller = nft.seller.toLowerCase() === wallet;
  const amountSOL = nft.amount / 1e9;
  const usd = estimateUsdForSOL(amountSOL, solPrice);

  return [
    makeEvent(
      date,
      isSeller ? "NFT_SALE" : "NFT_PURCHASE",
      "NFT",
      amountSOL,
      isSeller ? null : usd,
      isSeller ? usd : null,
      feeSOL,
      tx
    ),
  ];
}

function mapStake(
  tx: HeliusTransaction,
  wallet: string,
  date: Date,
  feeSOL: number,
  solPrice: number | null
): TaxEvent[] {
  const total = tx.nativeTransfers
    .filter((nt) => nt.fromUserAccount.toLowerCase() === wallet)
    .reduce((sum, nt) => sum + nt.amount / 1e9, 0);

  if (total <= 0) return [];
  const usd = estimateUsdForSOL(total, solPrice);
  return [makeEvent(date, "STAKE", "SOL", total, usd, null, feeSOL, tx)];
}

function mapUnstake(
  tx: HeliusTransaction,
  wallet: string,
  date: Date,
  feeSOL: number,
  solPrice: number | null
): TaxEvent[] {
  const total = tx.nativeTransfers
    .filter((nt) => nt.toUserAccount.toLowerCase() === wallet)
    .reduce((sum, nt) => sum + nt.amount / 1e9, 0);

  if (total <= 0) return [];
  const usd = estimateUsdForSOL(total, solPrice);
  return [makeEvent(date, "UNSTAKE", "SOL", total, usd, null, feeSOL, tx)];
}

function mapUnknown(
  tx: HeliusTransaction,
  wallet: string,
  tokenMap: Map<string, TokenInfo>,
  date: Date,
  feeSOL: number,
  solPrice: number | null
): TaxEvent[] {
  const events: TaxEvent[] = [];

  for (const nt of tx.nativeTransfers) {
    const amount = nt.amount / 1e9;
    if (amount <= 0) continue;
    const isIncoming = nt.toUserAccount.toLowerCase() === wallet;
    const usd = estimateUsdForSOL(amount, solPrice);
    events.push(
      makeEvent(
        date,
        isIncoming ? "TRANSFER_IN" : "TRANSFER_OUT",
        "SOL",
        amount,
        isIncoming ? usd : null,
        isIncoming ? null : usd,
        feeSOL,
        tx
      )
    );
  }

  for (const tt of tx.tokenTransfers) {
    const token = lookupToken(tt.mint, tokenMap);
    const amount = Math.abs(tt.tokenAmount);
    if (amount <= 0) continue;
    const isIncoming = tt.toUserAccount?.toLowerCase() === wallet;
    const usd = estimateUsd(amount, tt.mint, solPrice);
    events.push(
      makeEvent(
        date,
        isIncoming ? "TRANSFER_IN" : "TRANSFER_OUT",
        token.symbol,
        amount,
        isIncoming ? usd : null,
        isIncoming ? null : usd,
        feeSOL,
        tx
      )
    );
  }

  if (events.length === 0) {
    events.push(makeEvent(date, "UNKNOWN", "Unknown", 0, null, null, feeSOL, tx));
  }

  return events;
}

function makeEvent(
  date: Date,
  type: TaxEventType,
  asset: string,
  amount: number,
  costBasisUsd: number | null,
  proceedsUsd: number | null,
  feeSOL: number,
  tx: HeliusTransaction
): TaxEvent {
  return {
    date,
    type,
    asset,
    amount,
    costBasisUsd,
    proceedsUsd,
    feeSOL,
    txSignature: tx.signature,
    description: tx.description || `${type} ${asset}`,
  };
}
