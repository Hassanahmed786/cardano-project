// File: types/nft.ts

export interface NFTDesign {
  theme: string;
  backgroundColor: string;
  textColor: string;
  message: string;
  sender: string;
  template: string;
  decorations: string[];
}

export interface NFTAsset {
  policyId: string;
  assetName: string;
  imageHash: string;
  metadataHash: string;
  metadata: NFTMetadata;
}

export interface NFTMetadata {
  name: string;
  image: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    sender: string;
    message: string;
    decorations: string[];
    ada_amount: string;
    network: string;
    recipient_address?: string;
    created_at: string;
  };
}

export interface GiftCardNFT {
  txHash: string;
  outputIndex: number;
  adaAmount: string;
  nftAsset: NFTAsset;
  recipientAddress: string;
  senderAddress?: string;
  createdAt: string;
  isRedeemed: boolean;
}