// File: utils/nftMetadata.ts
import { NFTDesign } from '../types/nft';

// IPFS configuration
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://cyan-casual-bobolink-796.mypinata.cloud/ipfs/';

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

export class NFTMetadataService {
  /**
   * Generate NFT metadata from design and gift card details
   */
  static generateMetadata(
    design: NFTDesign, 
    adaAmount: string, 
    recipientAddress?: string,
    sender?: string
  ): NFTMetadata {
    return {
      name: `Lovelace Treasury Gift Card - ${adaAmount} ADA`,
      image: "", // Will be filled after IPFS upload
      description: design.message || `A personalized ${adaAmount} ADA gift card from Lovelace Treasury on the Cardano blockchain. Redeemable by the recipient.`,
      attributes: [
        { trait_type: "Theme", value: design.theme },
        { trait_type: "Template", value: design.template },
        { trait_type: "ADA Amount", value: adaAmount },
        { trait_type: "Background Color", value: design.backgroundColor },
        { trait_type: "Decorations Count", value: design.decorations.length },
        { trait_type: "Has Message", value: design.message ? "Yes" : "No" },
        { trait_type: "Has Sender", value: design.sender ? "Yes" : "No" },
        { trait_type: "Created Date", value: new Date().toISOString().split('T')[0] }
      ],
      properties: {
        sender: design.sender || sender || "Anonymous",
        message: design.message,
        decorations: design.decorations,
        ada_amount: adaAmount,
        network: "preprod",
        recipient_address: recipientAddress,
        created_at: new Date().toISOString()
      }
    };
  }

  /**
   * Upload image to IPFS using Pinata
   */
  static async uploadImageToIPFS(imageBlob: Blob, filename: string): Promise<string> {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.warn('Pinata API keys not configured, using placeholder');
      return 'ipfs://QmPlaceholderHashForImage123456789';
    }

    try {
      const formData = new FormData();
      formData.append('file', imageBlob, filename);
      
      const pinataMetadata = JSON.stringify({
        name: filename,
        keyvalues: {
          type: 'cardano-gift-card-image',
          created: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', pinataMetadata);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pinata upload error:', response.status, response.statusText, errorText);
        throw new Error(`Pinata upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      // Fallback to placeholder
      return 'ipfs://QmPlaceholderHashForImage123456789';
    }
  }

  /**
   * Upload metadata JSON to IPFS
   */
  static async uploadMetadataToIPFS(metadata: NFTMetadata): Promise<string> {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.warn('Pinata API keys not configured, using placeholder');
      return 'ipfs://QmPlaceholderHashForMetadata123456789';
    }

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `gift-card-metadata-${Date.now()}.json`,
            keyvalues: {
              type: 'cardano-gift-card-metadata',
              ada_amount: metadata.properties.ada_amount,
              created: metadata.properties.created_at
            }
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Pinata metadata upload error:', response.status, response.statusText, errorText);
        throw new Error(`Pinata metadata upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      // Fallback to placeholder
      return 'ipfs://QmPlaceholderHashForMetadata123456789';
    }
  }

  /**
   * Generate NFT image from canvas
   */
  static generateImageFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to generate image from canvas');
        }
      }, 'image/png');
    });
  }

  /**
   * Complete NFT creation workflow
   */
  static async createNFTAssets(
    canvas: HTMLCanvasElement,
    design: NFTDesign,
    adaAmount: string,
    recipientAddress?: string,
    sender?: string
  ): Promise<{ imageHash: string; metadataHash: string; metadata: NFTMetadata }> {
    try {
      // Generate image blob from canvas
      const imageBlob = await this.generateImageFromCanvas(canvas);
      
      // Upload image to IPFS
      const imageHash = await this.uploadImageToIPFS(
        imageBlob, 
        `gift-card-${Date.now()}.png`
      );
      
      // Generate metadata with image hash
      const metadata = this.generateMetadata(design, adaAmount, recipientAddress, sender);
      metadata.image = imageHash;
      
      // Upload metadata to IPFS
      const metadataHash = await this.uploadMetadataToIPFS(metadata);
      
      return {
        imageHash,
        metadataHash,
        metadata
      };
    } catch (error) {
      console.error('Error creating NFT assets:', error);
      throw error;
    }
  }

  /**
   * Generate a simple policy ID (for demo purposes)
   * In production, this would be generated by the minting transaction
   */
  static generatePolicyId(): string {
    const timestamp = Date.now().toString(16);
    const random = Math.random().toString(16).substring(2, 10);
    return `${timestamp}${random}`.padEnd(56, '0');
  }

  /**
   * Generate asset name from design
   */
  static generateAssetName(design: NFTDesign, adaAmount: string): string {
    const theme = design.theme.substring(0, 4);
    const amount = adaAmount.replace('.', '');
    const timestamp = Date.now().toString(16).substring(-6);
    return `GiftCard${theme}${amount}${timestamp}`;
  }
}