// File: components/NFTGallery.tsx
"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { PhotoIcon, GiftIcon } from '@heroicons/react/24/outline';

interface NFTGiftCard {
  id: string;
  policyId: string;
  assetName: string;
  metadata: {
    name: string;
    image: string;
    description: string;
    properties: {
      ada_amount: string;
      sender: string;
      message: string;
      theme: string;
      created_at: string;
    };
  };
  isRedeemed: boolean;
  transactionHash: string;
}

interface NFTGalleryProps {
  title?: string;
  showRedeemed?: boolean;
}

export default function NFTGallery({ title = "Your NFT Gift Cards", showRedeemed = true }: NFTGalleryProps) {
  const { connected, wallet } = useWallet();
  const [nftCards, setNftCards] = useState<NFTGiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && wallet) {
      loadNFTGiftCards();
    }
  }, [connected, wallet]);

  const loadNFTGiftCards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get wallet assets
      const assets = await wallet.getAssets();
      
      // Filter for gift card NFTs (would need proper policy ID detection)
      const giftCardNFTs: NFTGiftCard[] = [];
      
      for (const asset of assets) {
        // Check if this is a gift card NFT by examining metadata
        if (asset.quantity === '1' && asset.unit.length > 56) {
          try {
            // In a real app, you'd fetch metadata from IPFS
            // For demo, we'll create mock data
            const mockNFT: NFTGiftCard = {
              id: asset.unit,
              policyId: asset.unit.slice(0, 56),
              assetName: asset.unit.slice(56),
              metadata: {
                name: `Gift Card #${asset.unit.slice(-4)}`,
                image: `https://via.placeholder.com/300x200/6366f1/ffffff?text=Gift+Card`,
                description: "A personalized Cardano gift card NFT",
                properties: {
                  ada_amount: "10",
                  sender: "Anonymous",
                  message: "Happy Birthday!",
                  theme: "birthday",
                  created_at: new Date().toISOString()
                }
              },
              isRedeemed: false,
              transactionHash: "demo_tx_" + Math.random().toString(36).substr(2, 9)
            };
            
            giftCardNFTs.push(mockNFT);
          } catch (err) {
            console.warn('Could not parse NFT metadata:', err);
          }
        }
      }
      
      setNftCards(giftCardNFTs);
    } catch (err) {
      console.error('Error loading NFT gift cards:', err);
      setError('Failed to load NFT gift cards');
    } finally {
      setIsLoading(false);
    }
  };

  const redeemNFT = async (nft: NFTGiftCard) => {
    if (!wallet) return;
    
    try {
      // In a real implementation, this would:
      // 1. Build transaction to burn the NFT
      // 2. Unlock ADA from smart contract
      // 3. Send ADA to user's wallet
      
      console.log('Redeeming NFT:', nft.id);
      
      // Update UI to show as redeemed
      setNftCards(prev => 
        prev.map(card => 
          card.id === nft.id 
            ? { ...card, isRedeemed: true }
            : card
        )
      );
    } catch (err) {
      console.error('Error redeeming NFT:', err);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Connect your wallet to view NFT gift cards</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-4">⚠️ {error}</div>
        <button 
          onClick={loadNFTGiftCards}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredCards = showRedeemed ? nftCards : nftCards.filter(card => !card.isRedeemed);

  if (filteredCards.length === 0) {
    return (
      <div className="text-center py-12">
        <GiftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No NFT gift cards found</p>
        <p className="text-gray-500 text-sm mt-2">
          Create your first NFT gift card to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
          {filteredCards.length} NFT{filteredCards.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((nft) => (
          <div key={nft.id} className="bg-white/5 border border-gray-600 rounded-lg hover:bg-white/10 transition-all duration-200">
            <div className="p-6 pb-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white text-lg font-semibold">{nft.metadata.name}</h3>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    nft.isRedeemed 
                      ? "bg-red-600/20 text-red-300" 
                      : "bg-green-600/20 text-green-300"
                  }`}
                >
                  {nft.isRedeemed ? "Redeemed" : "Active"}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {nft.metadata.properties.ada_amount} ADA • {nft.metadata.properties.theme}
              </p>
            </div>
            
            <div className="px-6 pb-6 space-y-4">
              {/* NFT Image */}
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                <img 
                  src={nft.metadata.image} 
                  alt={nft.metadata.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-gray-400 text-center">
                  <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>NFT Preview</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-sm">
                {nft.metadata.properties.message && (
                  <div>
                    <span className="text-gray-400">Message: </span>
                    <span className="text-white">{nft.metadata.properties.message}</span>
                  </div>
                )}
                {nft.metadata.properties.sender && (
                  <div>
                    <span className="text-gray-400">From: </span>
                    <span className="text-white">{nft.metadata.properties.sender}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Created: </span>
                  <span className="text-white">
                    {new Date(nft.metadata.properties.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {!nft.isRedeemed && (
                <button
                  onClick={() => redeemNFT(nft)}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Redeem {nft.metadata.properties.ada_amount} ADA
                </button>
              )}

              {/* Transaction Link */}
              <div className="text-xs text-gray-500">
                <span>TX: </span>
                <span className="font-mono">{nft.transactionHash.slice(0, 16)}...</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}