// File: components/MyGiftCards.tsx
"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { Transaction, resolvePaymentKeyHash, UTxO } from '@meshsdk/core';
import { GIFT_CARD_SCRIPT_ADDRESS } from '../../utils/constants';
import toast, { Toaster } from 'react-hot-toast';

interface GiftCard {
  txHash: string;
  outputIndex: number;
  amount: string;
  datum: any;
}

export default function MyGiftCards() {
  const { connected, wallet } = useWallet();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (connected && wallet) {
      fetchGiftCards();
    }
  }, [connected, wallet]);

  const fetchGiftCards = async () => {
    if (!connected || !wallet) return;

    setIsLoading(true);
    try {
      // Get user's payment key hash
      const addresses = await wallet.getUsedAddresses();
      if (addresses.length === 0) return;
      
      const userPubKeyHash = resolvePaymentKeyHash(addresses[0]);

      // Get all UTXOs from the wallet (this will include script UTXOs the user can spend)
      const allUtxos = await wallet.getUtxos();
      
      // Filter UTXOs that are at the script address and belong to this user
      const userGiftCards: GiftCard[] = [];
      
      for (const utxo of allUtxos) {
        try {
          // Check if this UTXO is at our script address
          if (utxo.output.address === GIFT_CARD_SCRIPT_ADDRESS && utxo.output.plutusData) {
            // For now, we'll consider all UTXOs at the script address as potential gift cards
            // In a real implementation, you'd decode the datum properly
            userGiftCards.push({
              txHash: utxo.input.txHash,
              outputIndex: utxo.input.outputIndex,
              amount: utxo.output.amount[0].quantity,
              datum: utxo.output.plutusData
            });
          }
        } catch (error) {
          console.error('Error parsing UTXO:', error);
        }
      }

      setGiftCards(userGiftCards);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      toast.error('Failed to fetch gift cards');
    } finally {
      setIsLoading(false);
    }
  };

  const redeemGiftCard = async (giftCard: GiftCard) => {
    if (!connected || !wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    const utxoId = `${giftCard.txHash}#${giftCard.outputIndex}`;
    setIsRedeeming(utxoId);

    try {
      // Get the script from our plutus.json
      const scriptResponse = await fetch('/smart-contract/plutus.json');
      const scriptData = await scriptResponse.json();
      const script = {
        code: scriptData.validators[0].compiledCode,
        version: 'V3' as const
      };

      // Build redemption transaction
      const tx = new Transaction({ initiator: wallet });

      // Add script input
      const utxo: UTxO = {
        input: {
          txHash: giftCard.txHash,
          outputIndex: giftCard.outputIndex
        },
        output: {
          address: GIFT_CARD_SCRIPT_ADDRESS,
          amount: [{ unit: 'lovelace', quantity: giftCard.amount }],
          plutusData: giftCard.datum
        }
      };

      tx.redeemValue({
        value: utxo,
        script: script,
        datum: giftCard.datum,
        redeemer: { data: { alternative: 0, fields: [] } } // Empty redeemer as per contract
      });

      // Get user address for the output
      const addresses = await wallet.getUsedAddresses();
      tx.sendLovelace(addresses[0], giftCard.amount);

      // Build and sign transaction
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      toast.success(`Gift card redeemed! Transaction: ${txHash.slice(0, 20)}...`);
      
      // Refresh gift cards list
      setTimeout(() => {
        fetchGiftCards();
      }, 3000);

    } catch (error) {
      console.error('Error redeeming gift card:', error);
      toast.error('Failed to redeem gift card. Please try again.');
    } finally {
      setIsRedeeming(null);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Connect your wallet to view your gift cards</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <p className="text-gray-300">
          {giftCards.length === 0 ? 'No gift cards found' : `${giftCards.length} gift card(s) available`}
        </p>
        <button
          onClick={fetchGiftCards}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Gift cards list */}
      {!isLoading && giftCards.length === 0 && (
        <div className="text-center py-8">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Gift Cards Yet</h3>
            <p className="text-gray-400 text-sm">
              When someone sends you a gift card, it will appear here.
            </p>
          </div>
        </div>
      )}

      {/* Gift cards grid */}
      <div className="grid gap-4">
        {giftCards.map((giftCard, index) => {
          const utxoId = `${giftCard.txHash}#${giftCard.outputIndex}`;
          const isCurrentlyRedeeming = isRedeeming === utxoId;
          const amountAda = (parseInt(giftCard.amount) / 1000000).toFixed(2);

          return (
            <div
              key={utxoId}
              className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    Gift Card #{index + 1}
                  </h4>
                  <p className="text-2xl font-bold text-green-400">
                    {amountAda} ADA
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Transaction</p>
                  <p className="text-xs text-blue-400 font-mono">
                    {giftCard.txHash.slice(0, 12)}...
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">
                  <p>Ready to redeem</p>
                </div>
                <button
                  onClick={() => redeemGiftCard(giftCard)}
                  disabled={isCurrentlyRedeeming}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isCurrentlyRedeeming ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Redeeming...
                    </div>
                  ) : (
                    'Redeem'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      {giftCards.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
          <p className="text-yellow-400 text-sm">
            💡 <strong>Tip:</strong> Click &quot;Redeem&quot; to claim your ADA. The transaction will be signed with your wallet to prove ownership.
          </p>
        </div>
      )}
    </div>
  );
}