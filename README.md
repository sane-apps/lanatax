# LanaTax

Free local-first Solana tax calculator and CSV exporter.

LanaTax lets you paste a Solana wallet address, fetch transaction history through Helius, review the activity in a browser UI, and export tax-ready CSV data for tools like Koinly and CoinLedger.

## What It Does

- Fetches Solana transaction history for a wallet
- Filters results by tax year
- Shows summary stats, transaction tabs, and progress while loading
- Exports CSV data for tax workflows
- Stores wallet, API key, tax year, and cached results in local browser storage

## Stack

- Next.js 16
- React 19
- Solana wallet adapter + `@solana/web3.js`
- Helius API for transaction history
- Recharts for charts and reporting views

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful commands:

```bash
npm run lint
npm run build
```

## Privacy

- Wallet lookups happen against Helius when you request them
- Wallet address, API key, selected tax year, and cached transactions stay in local browser storage
- No account or sign-up flow is required

## Deployment

Production metadata points at [tax.saneapps.com](https://tax.saneapps.com).
