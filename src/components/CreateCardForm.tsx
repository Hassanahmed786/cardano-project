// File: components/CreateCardForm.tsx
"use client";

import { useState, useRef } from 'react';
import { useWallet } from '@meshsdk/react';
import { Transaction, resolvePaymentKeyHash } from '@meshsdk/core';
import { GIFT_CARD_SCRIPT_ADDRESS, MIN_ADA } from '../../utils/constants';
import { NFTMetadataService } from '../utils/nftMetadata';
import { NFTDesign } from '../types/nft';
import NFTDesigner from './NFTDesigner';
import NFTPreview, { NFTPreviewRef } from './NFTPreview';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateCardForm() {
  const { connected, wallet } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNFTDesigner, setShowNFTDesigner] = useState(false);
  const [nftDesign, setNftDesign] = useState<NFTDesign>({
    theme: 'birthday',
    backgroundColor: '#6366f1',
    textColor: '#ffffff',
    message: '',
    sender: '',
    template: 'classic',
    decorations: ['🎁', '✨']
  });
  const nftPreviewRef = useRef<NFTPreviewRef>(null);

  const createGiftCard = async () => {
    if (!connected || !wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!recipientAddress || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amountLovelace = parseInt(amount) * 1000000; // Convert ADA to lovelace
    if (amountLovelace < MIN_ADA) {
      toast.error(`Minimum amount is ${MIN_ADA / 1000000} ADA`);
      return;
    }

    // Check wallet balance before proceeding
    try {
      const balance = await wallet.getBalance();
      const totalLovelace = parseInt(balance[0]?.quantity || '0');
      
      // Estimate transaction fees (typically 0.15-0.3 ADA)
      const estimatedFee = 300000; // 0.3 ADA for safety
      const requiredBalance = amountLovelace + estimatedFee;
      
      if (totalLovelace < requiredBalance) {
        const requiredADA = requiredBalance / 1000000;
        const currentADA = totalLovelace / 1000000;
        toast.error(
          `Insufficient balance. Required: ${requiredADA.toFixed(2)} ADA (${amount} ADA + ~0.3 ADA fees), Current: ${currentADA.toFixed(2)} ADA`
        );
        return;
      }
      
      toast.success(`Balance check passed: ${(totalLovelace / 1000000).toFixed(2)} ADA available`);
    } catch (error) {
      console.error('Error checking wallet balance:', error);
      toast.error('Could not check wallet balance. Please ensure wallet is connected.');
      return;
    }

    setIsLoading(true);

    try {
      // Generate NFT assets if NFT designer is enabled
      let nftAssets = null;
      if (showNFTDesigner && nftPreviewRef.current) {
        toast.loading('Creating NFT assets...');
        const canvas = nftPreviewRef.current.getCanvas();
        if (canvas) {
          nftAssets = await NFTMetadataService.createNFTAssets(
            canvas,
            nftDesign,
            amount,
            recipientAddress,
            nftDesign.sender
          );
        }
        toast.dismiss();
        toast.loading('Building transaction...');
      }

      // Convert recipient address to PubKeyHash
      const recipientPubKeyHash = resolvePaymentKeyHash(recipientAddress);
      
      // Create enhanced datum for NFT gift cards
      const datum = {
        alternative: 0,
        fields: [
          recipientPubKeyHash,
          nftAssets ? nftAssets.metadata.properties.ada_amount : amount,
          nftAssets ? nftAssets.imageHash : "",
          nftAssets ? nftAssets.metadataHash : "",
          nftDesign.message || "",
          Math.floor(Date.now() / 1000) // timestamp
        ]
      };

      // Build transaction
      const tx = new Transaction({ initiator: wallet });
      
      // Send ADA to script address with datum
      tx.sendLovelace({
        address: GIFT_CARD_SCRIPT_ADDRESS,
        datum: {
          value: datum,
          inline: true
        }
      }, amountLovelace.toString());

      // If creating NFT, add minting to transaction
      if (nftAssets) {
        const policyId = NFTMetadataService.generatePolicyId();
        const assetName = NFTMetadataService.generateAssetName(nftDesign, amount);
        
        // Note: In production, use proper minting policy with time locks
        // For demo purposes, we'll just include NFT data in the datum
        // The actual NFT minting would require a separate minting policy script
      }

      toast.dismiss();
      toast.loading('Signing transaction...');

      // Build and sign transaction
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      
      toast.dismiss();
      toast.loading('Submitting to blockchain...');
      
      const txHash = await wallet.submitTx(signedTx);

      toast.dismiss();
      toast.success(`Gift card created! Transaction: ${txHash.slice(0, 16)}...`);
      
      // Reset form
      setRecipientAddress('');
      setAmount('');
      setNftDesign({
        theme: 'birthday',
        backgroundColor: '#6366f1',
        textColor: '#ffffff',
        message: '',
        sender: '',
        template: 'classic',
        decorations: ['🎁', '✨']
      });
    } catch (error) {
      console.error('Error creating gift card:', error);
      toast.dismiss();
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('UTxO Balance Insufficient') || error.message.includes('InputSelectionError')) {
          toast.error('Insufficient wallet balance. Please add more ADA to your wallet or reduce the gift card amount.');
        } else if (error.message.includes('Invalid address')) {
          toast.error('Invalid recipient address. Please check the address format.');
        } else if (error.message.includes('User declined')) {
          toast.error('Transaction was cancelled by user.');
        } else {
          toast.error(`Transaction failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to create gift card. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* NFT Toggle */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-400 font-semibold">Create NFT Gift Card</h3>
          <button
            onClick={() => setShowNFTDesigner(!showNFTDesigner)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showNFTDesigner
                ? 'bg-purple-600 text-white'
                : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
            }`}
          >
            {showNFTDesigner ? 'Basic Gift Card' : 'Design NFT'}
          </button>
        </div>
        <p className="text-sm text-gray-300">
          {showNFTDesigner
            ? 'Create a personalized NFT gift card with custom design and metadata'
            : 'Enable NFT mode to create visual gift cards with custom themes and messages'
          }
        </p>
      </div>

      {/* NFT Designer Section */}
      {showNFTDesigner && (
        <div className="space-y-6">
          <NFTDesigner currentDesign={nftDesign} onDesignChange={setNftDesign} />
          <NFTPreview 
            ref={nftPreviewRef}
            design={nftDesign} 
            adaAmount={amount} 
            recipientAddress={recipientAddress} 
          />
        </div>
      )}
      
      {/* Recipient Address Input */}
      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-2">
          Recipient&apos;s Cardano Address
        </label>
        <input
          type="text"
          id="recipient"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="addr_test1..."
          className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Amount Input */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
          Amount (ADA)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="10"
          min="2"
          step="0.1"
          className="w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-1">
          Minimum: {MIN_ADA / 1000000} ADA
        </p>
      </div>

      {/* Create Button */}
      <button
        onClick={createGiftCard}
        disabled={isLoading || !connected}
        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Gift Card...
          </div>
        ) : (
          showNFTDesigner ? 'Create NFT Gift Card' : 'Create Gift Card'
        )}
      </button>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">How it works:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Enter the recipient&apos;s Cardano address</li>
          <li>• Specify the amount of ADA to gift</li>
          {showNFTDesigner && (
            <>
              <li>• Customize your NFT design with themes and messages</li>
              <li>• NFT metadata will be stored on IPFS</li>
            </>
          )}
          <li>• Your ADA will be locked in a smart contract</li>
          <li>• Only the recipient can redeem the gift card</li>
          <li>• Transaction fees apply (~2-3 ADA)</li>
        </ul>
      </div>
    </div>
  );
}