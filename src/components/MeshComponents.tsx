// File: components/MeshComponents.tsx
"use client";

import { useState, useEffect } from 'react';
import { CardanoWallet, useWallet } from '@meshsdk/react';

export default function MeshComponents() {
  const { connected, wallet } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const getWalletAddress = async () => {
      if (connected && wallet) {
        try {
          const addresses = await wallet.getUsedAddresses();
          if (addresses.length > 0) {
            setWalletAddress(addresses[0]);
          }
        } catch (error) {
          console.error('Error getting wallet address:', error);
        }
      } else {
        setWalletAddress('');
      }
    };

    getWalletAddress();
  }, [connected, wallet]);

  if (loading) {
    return <div className="animate-pulse bg-gray-600 h-10 w-32 rounded-lg"></div>;
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
        {connected && walletAddress && (
          <div className="text-green-400 font-medium">
            Connected: {' '}
            <span className="font-mono text-sm">
              {walletAddress.slice(0, 20)}...{walletAddress.slice(-10)}
            </span>
          </div>
        )}
        <div className="wallet-connection-wrapper">
          <CardanoWallet 
            isDark={true}
            label="Connect Wallet"
          />
        </div>
      </div>
    </div>
  );
}