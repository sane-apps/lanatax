// Helius Enhanced Transaction types
export interface HeliusTransaction {
  signature: string;
  description: string;
  type: HeliusTransactionType;
  source: string;
  fee: number;
  feePayer: string;
  slot: number;
  timestamp: number;
  nativeTransfers: NativeTransfer[];
  tokenTransfers: TokenTransfer[];
  accountData: AccountData[];
  transactionError: string | null;
  events: TransactionEvents;
}

export type HeliusTransactionType =
  | "SWAP"
  | "TRANSFER"
  | "NFT_SALE"
  | "NFT_LISTING"
  | "NFT_CANCEL_LISTING"
  | "NFT_BID"
  | "NFT_BID_CANCELLED"
  | "NFT_MINT"
  | "BURN"
  | "BURN_NFT"
  | "STAKE_SOL"
  | "UNSTAKE_SOL"
  | "COMPRESSED_NFT_MINT"
  | "UNKNOWN";

export interface NativeTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  amount: number;
}

export interface TokenTransfer {
  fromUserAccount: string | null;
  toUserAccount: string | null;
  fromTokenAccount: string | null;
  toTokenAccount: string | null;
  tokenAmount: number;
  mint: string;
  tokenStandard: string;
}

export interface AccountData {
  account: string;
  nativeBalanceChange: number;
  tokenBalanceChanges: TokenBalanceChange[];
}

export interface TokenBalanceChange {
  userAccount: string;
  tokenAccount: string;
  rawTokenAmount: {
    tokenAmount: string;
    decimals: number;
  };
  mint: string;
}

export interface TransactionEvents {
  swap?: SwapEvent;
  nft?: NftEvent;
}

export interface SwapEvent {
  nativeInput: { account: string; amount: string } | null;
  nativeOutput: { account: string; amount: string } | null;
  tokenInputs: SwapToken[];
  tokenOutputs: SwapToken[];
  tokenFees: SwapToken[];
  innerSwaps: InnerSwap[];
}

export interface SwapToken {
  userAccount: string;
  tokenAccount: string;
  mint: string;
  rawTokenAmount: {
    tokenAmount: string;
    decimals: number;
  };
}

export interface InnerSwap {
  tokenInputs: SwapToken[];
  tokenOutputs: SwapToken[];
  tokenFees: SwapToken[];
  nativeFees: { account: string; amount: string }[];
  programInfo: { source: string; account: string };
}

export interface NftEvent {
  seller: string;
  buyer: string;
  amount: number;
  nfts: { mint: string; tokenStandard: string }[];
}

// Tax event types
export type TaxEventType =
  | "BUY"
  | "SELL"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "AIRDROP"
  | "FEE"
  | "NFT_PURCHASE"
  | "NFT_SALE"
  | "STAKE"
  | "UNSTAKE"
  | "MINT"
  | "BURN"
  | "UNKNOWN";

export interface TaxEvent {
  date: Date;
  type: TaxEventType;
  asset: string;
  amount: number;
  costBasisUsd: number | null;
  proceedsUsd: number | null;
  feeSOL: number;
  txSignature: string;
  description: string;
}

// Token metadata
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

// Fetch state
export type FetchStatus = "idle" | "loading" | "success" | "error" | "cancelled";

export interface FetchState {
  status: FetchStatus;
  transactions: HeliusTransaction[];
  error: string | null;
  progress: {
    loaded: number;
    total: number | null;
    currentPage: number;
  };
}

// Stats
export interface WalletStats {
  totalTransactions: number;
  totalFees: number;
  uniqueTokens: number;
  typeDistribution: Record<string, number>;
  volumeByMonth: { month: string; count: number }[];
}
