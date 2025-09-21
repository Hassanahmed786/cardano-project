// Cardano Gift Card Constants
// This file contains configuration constants for the gift card dApp

// Network Configuration
export const NETWORK = "preview" as const;
export const NETWORK_MAGIC = 2;

// Script Addresses
export const GIFT_CARD_SCRIPT_ADDRESS = "addr_test1wp6hhcjcq5q9qvkz4ae7u5c77qgthqt3plm3ln8cx7u2ldqqsc3sz";

// Smart Contract Configuration
export const GIFT_CARD_SCRIPT_HASH = "5e857cb94fc0c05c949a790661ab9945df66ce8740931616661b1fbf";

// Transaction Configuration
export const MIN_ADA = 2000000; // 2 ADA minimum for UTXOs
export const DEFAULT_PROTOCOL_PARAMETERS = {
  minFeeA: 44,
  minFeeB: 155381,
  poolDeposit: 500000000,
  keyDeposit: 2000000,
  maxTxSize: 16384,
  maxValSize: 5000,
  utxoCostPerWord: 4310,
  coinsPerUtxoWord: 4310,
  maxTxExMem: 16000000,
  maxTxExSteps: 10000000000,
  priceMem: 0.0577,
  priceStep: 0.0000721,
  maxBlockHeaderSize: 1100,
  minPoolCost: 340000000,
  maxBlockExMem: 80000000,
  maxBlockExSteps: 40000000000,
};

// API Endpoints
export const BLOCKFROST_API_URL = "https://cardano-preview.blockfrost.io/api/v0";

// Frontend Configuration
export const APP_NAME = "Lovelace Treasury";
export const APP_DESCRIPTION = "Send and receive ADA gift cards on Cardano with Lovelace Treasury";
export const SUPPORTED_WALLETS = ["lace", "eternl", "flint", "typhon", "nami"] as const;