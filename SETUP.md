# 🚀 Cardano Gift Card App - Complete Setup Guide

## Prerequisites & Installation

### 1. Install Cardano Wallet Browser Extension

**Choose ONE of these wallets:**

#### 🏆 Lace Wallet (Recommended - Official IOG Wallet)
- **Website**: https://www.lace.io/
- **Chrome Extension**: https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk
- **Features**: Official IOG wallet, modern UI, secure
- **Setup**: Install → Create/Import Wallet → Settings → Network → "Preprod"

#### 💎 Eternl Wallet
- **Website**: https://eternl.io/
- **Chrome Extension**: https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka
- **Features**: Advanced features, multi-platform, very popular
- **Setup**: Install → Create/Import Wallet → Settings → Network → "Preprod"

#### ⚡ Flint Wallet
- **Website**: https://flint-wallet.com/
- **Chrome Extension**: https://chrome.google.com/webstore/detail/flint-wallet/hnfanknocfeofbddgcijnmhnfnkdnaad
- **Features**: Fast, lightweight, simple
- **Setup**: Install → Create/Import Wallet → Switch to "Testnet"

#### 🌊 Typhon Wallet
- **Website**: https://typhonwallet.io/
- **Chrome Extension**: https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh
- **Features**: Advanced DeFi features
- **Setup**: Install → Create/Import Wallet → Settings → "Preprod Testnet"

### 2. Get FREE Testnet ADA

**Cardano Testnet Faucet:**
- **URL**: https://docs.cardano.org/cardano-testnet/tools/faucet/
- **Amount**: Request 1000 ADA (free testnet tokens)
- **Time**: 1-2 minutes to receive
- **Required**: Your Preprod testnet wallet address

### 3. API Keys (Optional but Recommended)

#### Blockfrost API (For viewing gift cards)
- **Website**: https://blockfrost.io/
- **Sign up** → Create new project
- **Select "Preprod"** network
- **Copy API key** and add to `.env.local`

## Current App Status

### ✅ What's Working Without APIs:
- **Wallet Connection** - Connect any Cardano wallet
- **Create Gift Cards** - Send ADA to any address
- **Smart Contract** - Deployed on Preprod testnet
- **Beautiful UI** - Complete futuristic interface

### ⚠️ What Needs API Key:
- **View Gift Cards** - See gift cards sent to you
- **Transaction History** - Detailed blockchain data
- **Balance Queries** - Real-time wallet balances

## Quick Start (Minimum Setup)

1. **Install Nami Wallet** (5 minutes)
2. **Switch to Preprod Testnet** (1 minute)
3. **Get 1000 testnet ADA** (2 minutes)
4. **Connect wallet to app** (30 seconds)
5. **Create your first gift card** (1 minute)

**Total time: ~10 minutes to be fully functional!**

## Environment Configuration

Your app will work with just a wallet, but for full features:

```bash
# .env.local
NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD=your_api_key_here
NEXT_PUBLIC_NETWORK=preprod
```

## Troubleshooting

### "No Cardano wallets detected"
- Make sure wallet extension is installed
- Refresh the page after installing wallet
- Check that wallet is unlocked
- Try switching browser tabs

### "Connection failed"
- Ensure wallet is on Preprod testnet
- Check wallet is unlocked
- Try disconnecting and reconnecting
- Clear browser cache if needed

## Testing Your Setup

1. **Connect Wallet** → Should show your address
2. **Create Gift Card** → Send 5-10 ADA to another address
3. **Check Transaction** → View on Cardano explorer
4. **Switch Wallets** → Try redeeming the gift card

## Production Deployment

When ready for mainnet:
1. Switch all wallets to "Mainnet"
2. Update `NEXT_PUBLIC_NETWORK=mainnet` 
3. Get Mainnet Blockfrost API key
4. Deploy to Vercel/Netlify/similar

---

**Your app is ready to use with just a wallet and testnet ADA! 🎉**