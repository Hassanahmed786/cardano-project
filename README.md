# 🎁 Cardano NFT Gift Card dApp

try our app: https://lovelacetreasury.vercel.app/

A revolutionary decentralized application that transforms traditional gift cards into personalized NFTs on the Cardano blockchain. Create beautiful, customizable NFT gift cards that can be loaded with ADA and redeemed by recipients.

## ✨ Features

### � **Personalized NFT Gift Cards**
- 🎂 **6 Beautiful Themes**: Birthday, Holiday, Anniversary, Celebration, Modern, Minimal
- 🎨 **Custom Templates**: Classic, Modern, Elegant, Fun, Vintage designs
- 🌈 **10 Background Colors**: Vibrant gradient options
- 💌 **Personal Messages**: Add heartfelt messages to your gift cards
- ✨ **16 Decorative Elements**: Emojis and symbols to enhance your design
- 👁️ **Real-time Preview**: See your NFT design as you create it
- ⚡ **Real-time Updates**: Live transaction status and gift card management

## Technology Stack

- **Smart Contract**: Aiken (Plutus V3)
- **Frontend**: Next.js 15 with TypeScript
- **Blockchain Integration**: MeshJS
- **Styling**: TailwindCSS
- **Network**: Cardano Preprod Testnet

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Aiken** (v1.1.19 or higher)
- **Cardano wallet** (Nami, Eternl, Flint, etc.) with Preprod testnet ADA

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cardano-gift-card
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile the Smart Contract

Navigate to the smart contract directory and build:

```bash
cd smart-contract
aiken build
cd ..
```

This will generate:
- `smart-contract/plutus.json` - The compiled smart contract
- Updated script hash and address in `utils/constants.ts`

### 4. Set Up Environment Variables (Optional)

Create a `.env.local` file for any additional configuration:

```bash
# Add any environment variables if needed
NEXT_PUBLIC_NETWORK=preprod
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

### Creating a Gift Card

1. **Connect Wallet**: Click "Connect Wallet" and select your Cardano wallet
2. **Enter Details**: 
   - Recipient's Cardano address (must be a valid testnet address)
   - Amount in ADA (minimum 2 ADA)
3. **Create**: Click "Create Gift Card" and sign the transaction
4. **Confirmation**: Wait for blockchain confirmation

### Redeeming a Gift Card

1. **Connect Wallet**: Connect the wallet that should receive the gift card
2. **View Cards**: Your available gift cards will appear in "My Gift Cards"
3. **Redeem**: Click "Redeem" on any gift card and sign the transaction
4. **Receive ADA**: The locked ADA will be transferred to your wallet

## Smart Contract Details

### Datum Structure
```aiken
pub type GiftCardDatum {
  recipient: ByteArray, // PubKeyHash of the recipient
}
```

### Validator Logic
- **Spend Condition**: Transaction must be signed by the recipient (PubKeyHash in datum)
- **Redeemer**: Simple void type (no data required)
- **Security**: Only the designated recipient can unlock the funds

## Project Structure

```
cardano-gift-card/
├── smart-contract/
│   ├── aiken.toml                 # Aiken project configuration
│   ├── validators/
│   │   └── gift_card.ak          # Main smart contract
│   └── plutus.json               # Compiled contract output
├── src/
│   ├── app/
│   │   ├── layout.tsx            # App layout with MeshProvider
│   │   ├── page.tsx              # Main page component
│   │   └── globals.css           # Global styles
│   └── components/
│       ├── CreateCardForm.tsx    # Gift card creation form
│       └── MyGiftCards.tsx       # Gift card management
├── utils/
│   └── constants.ts              # App configuration constants
├── package.json
└── README.md
```

## Configuration

Key configuration values in `utils/constants.ts`:

- `GIFT_CARD_SCRIPT_ADDRESS`: The smart contract address on Preprod testnet
- `GIFT_CARD_SCRIPT_HASH`: The script hash for transaction building
- `MIN_ADA`: Minimum ADA amount for gift cards (2 ADA)
- `NETWORK_MAGIC`: Preprod testnet magic number (1)

## Testing

### Prerequisites for Testing
1. **Preprod Testnet ADA**: Get test ADA from the [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet/)
2. **Two Wallet Addresses**: One for creating and one for receiving gift cards

### Test Scenarios
1. **Create Gift Card**: Send ADA to another address
2. **Check Balance**: Verify locked UTXOs at script address
3. **Redeem Gift Card**: Connect recipient wallet and claim funds
4. **Error Handling**: Test with insufficient funds, wrong addresses, etc.

## Troubleshooting

### Common Issues

**"Wallet not connecting"**
- Ensure your wallet is set to Preprod testnet
- Try refreshing the page and reconnecting

**"Transaction failed"**
- Check you have sufficient ADA for transaction fees (~2-3 ADA)
- Verify recipient address is valid Preprod testnet address
- Ensure minimum gift card amount (2 ADA)

**"Gift cards not showing"**
- Check wallet is connected to correct network (Preprod)
- Try refreshing the gift cards list
- Ensure transactions have been confirmed on-chain

**"Smart contract compilation errors"**
- Verify Aiken is installed correctly (`aiken --version`)
- Check dependencies in `smart-contract/aiken.toml`
- Ensure you're in the correct directory when running `aiken build`

## Development

### Adding New Features

1. **Smart Contract Changes**: Edit `smart-contract/validators/gift_card.ak`
2. **Rebuild Contract**: Run `aiken build` in smart-contract directory
3. **Update Constants**: Update script hash in `utils/constants.ts`
4. **Frontend Changes**: Modify components as needed

### Deployment

1. **Mainnet Deployment**: Update network configuration to mainnet
2. **Build Production**: Run `npm run build`
3. **Deploy**: Use your preferred deployment platform (Vercel, Netlify, etc.)

## Security Considerations

- ⚠️ **Testnet Only**: This implementation is for Preprod testnet
- 🔒 **Smart Contract Auditing**: Consider professional audit for mainnet deployment
- 💰 **Fee Management**: Account for transaction fees in gift card amounts
- 🔍 **Address Validation**: Always validate recipient addresses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Preprod testnet
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions and support:
- Check the troubleshooting section above
- Review Aiken documentation: [https://aiken-lang.org](https://aiken-lang.org)
- Review MeshJS documentation: [https://meshjs.dev](https://meshjs.dev)
- Open an issue in this repository

---

**Happy gifting on Cardano! 🎁**
