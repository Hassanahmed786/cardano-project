# 🚀 Deployment Guide - Cardano Gift Card dApp

This guide will help you deploy the Cardano Gift Card application to Vercel so anyone can use it on the testnet.

## 📋 Prerequisites

Before deploying, ensure you have:
- [Vercel Account](https://vercel.com) (free)
- [GitHub Account](https://github.com) (free)
- Your project pushed to GitHub
- API keys ready (Blockfrost & Pinata)

## 🔑 Required API Keys

### 1. Blockfrost API (Free)
- Visit: [blockfrost.io](https://blockfrost.io/)
- Create account → New Project → Select "Preprod" network
- Copy the API key

### 2. Pinata IPFS (Free)
- Visit: [pinata.cloud](https://pinata.cloud/)
- Create account → API Keys → Generate new keys
- Copy both API Key and Secret Key
- Note your custom gateway URL

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the `cardano-gift-card` folder if prompted
5. Click "Deploy"

### Step 3: Configure Environment Variables
After deployment, add these environment variables in Vercel:

1. Go to your project dashboard in Vercel
2. Click "Settings" → "Environment Variables"
3. Add the following variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `NEXT_PUBLIC_BLOCKFROST_API_KEY_PREPROD` | `your_blockfrost_key` | For blockchain queries |
| `NEXT_PUBLIC_NETWORK` | `preprod` | Testnet network |
| `NEXT_PUBLIC_PINATA_API_KEY` | `your_pinata_api_key` | For IPFS uploads |
| `NEXT_PUBLIC_PINATA_SECRET_KEY` | `your_pinata_secret` | For IPFS uploads |
| `NEXT_PUBLIC_IPFS_GATEWAY` | `https://your-gateway.mypinata.cloud` | Custom IPFS gateway |

### Step 4: Redeploy
1. Go to "Deployments" tab
2. Click "..." on the latest deployment
3. Select "Redeploy" to apply environment variables

## ✅ Testing Your Deployment

After deployment, test these features:
- [ ] Wallet connection works
- [ ] Balance checking functions
- [ ] Gift card creation (with testnet ADA)
- [ ] NFT generation and IPFS uploads
- [ ] Gift card viewing/management

## 📱 User Instructions

Share these instructions with your users:

### For Users:
1. **Install a Cardano Wallet:**
   - [Lace Wallet](https://www.lace.io/) (Recommended)
   - [Eternl Wallet](https://eternl.io/)
   - [Flint Wallet](https://flint-wallet.com/)

2. **Switch to Preprod Testnet:**
   - Open wallet settings
   - Change network to "Preprod Testnet"

3. **Get Testnet ADA:**
   - Visit [Cardano Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)
   - Enter your wallet address
   - Request free testnet ADA

4. **Use the App:**
   - Visit your deployed URL
   - Connect wallet
   - Create and send gift cards!

## 🌍 Public Access

Your deployed app will be accessible at:
```
https://your-project-name.vercel.app
```

Anyone can now:
- Connect their Cardano wallet
- Use testnet ADA to create gift cards
- Send personalized NFT gift cards
- Redeem received gift cards

## 🔧 Troubleshooting

### Common Issues:
1. **"Insufficient Balance"** → User needs testnet ADA
2. **"Wallet Not Found"** → User needs to install wallet extension
3. **"Wrong Network"** → User must switch to Preprod testnet

### Environment Variables Missing:
- App works without API keys (uses placeholders)
- For full functionality, all API keys are recommended

## 📈 Monitoring

Monitor your deployment:
- Vercel dashboard shows analytics
- Check deployment logs for errors
- Monitor API usage in Blockfrost/Pinata dashboards

## 🎉 Success!

Your Cardano Gift Card dApp is now live and accessible to anyone with a Cardano wallet and testnet ADA!