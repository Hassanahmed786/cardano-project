// File: components/WalletConnection.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@meshsdk/react';
import { 
  logWalletConnectionAttempt, 
  logWalletConnectionSuccess, 
  logWalletConnectionError 
} from '../utils/errorSuppression';

export default function WalletConnection() {
  const { connected, wallet, connect, disconnect } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [connectedWalletName, setConnectedWalletName] = useState<string>('');
  const [availableWallets, setAvailableWallets] = useState<any[]>([]);
  const [showWalletList, setShowWalletList] = useState(false);
  const [loading, setLoading] = useState(false);
  const walletListRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Wallet Connection Debug:', {
      connected,
      connectedWalletName,
      walletAddress,
      storedWallet: typeof window !== 'undefined' ? localStorage.getItem('mesh-wallet') : null
    });
  }, [connected, connectedWalletName, walletAddress]);

  useEffect(() => {
    // Check for available wallets with better error handling
    const checkWallets = () => {
      const wallets = [];
      if (typeof window !== 'undefined' && window.cardano) {
        try {
          // Check each wallet with error handling
          if (window.cardano?.lace && typeof window.cardano.lace.enable === 'function') {
            wallets.push({ name: 'Lace', key: 'lace', icon: '🦋' });
          }
          if (window.cardano?.eternl && typeof window.cardano.eternl.enable === 'function') {
            wallets.push({ name: 'Eternl', key: 'eternl', icon: '♾️' });
          }
          if (window.cardano?.flint && typeof window.cardano.flint.enable === 'function') {
            wallets.push({ name: 'Flint', key: 'flint', icon: '🔥' });
          }
          if (window.cardano?.typhon && typeof window.cardano.typhon.enable === 'function') {
            wallets.push({ name: 'Typhon', key: 'typhon', icon: '🌊' });
          }
          if (window.cardano?.nami && typeof window.cardano.nami.enable === 'function') {
            wallets.push({ name: 'Nami', key: 'nami', icon: '🌊' });
          }
        } catch (error) {
          console.warn('Error checking wallet availability:', error);
        }
      }
      setAvailableWallets(wallets);
    };

    // Initial check with delay to allow extensions to load
    const initialTimer = setTimeout(checkWallets, 500);
    
    // Periodic check for wallet availability
    const interval = setInterval(checkWallets, 2000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const getWalletInfo = async () => {
      if (connected && wallet) {
        try {
          // Get wallet address
          const addresses = await wallet.getUsedAddresses();
          if (addresses.length > 0) {
            setWalletAddress(addresses[0]);
          }

          // Detect which wallet is connected with improved logic
          const detectConnectedWallet = () => {
            try {
              if (typeof window !== 'undefined' && window.cardano) {
                // Store the current connected wallet name from MeshJS
                const meshWalletName = localStorage.getItem('mesh-wallet');
                
                // Check each wallet's connection status
                if (meshWalletName === 'lace' || window.cardano.lace?.isEnabled) {
                  return 'Lace 🦋';
                }
                if (meshWalletName === 'eternl' || window.cardano.eternl?.isEnabled) {
                  return 'Eternl ♾️';
                }
                if (meshWalletName === 'flint' || window.cardano.flint?.isEnabled) {
                  return 'Flint 🔥';
                }
                if (meshWalletName === 'typhon' || window.cardano.typhon?.isEnabled) {
                  return 'Typhon 🌊';
                }
                if (meshWalletName === 'nami' || window.cardano.nami?.isEnabled) {
                  return 'Nami 🌊';
                }
                
                // Additional check using wallet connection state
                if (connected) {
                  // Try to identify wallet from available methods or properties
                  const walletKeys = Object.keys(window.cardano || {});
                  for (const key of walletKeys) {
                    const walletObj = window.cardano[key];
                    if (walletObj && walletObj.isEnabled) {
                      switch (key) {
                        case 'lace': return 'Lace 🦋';
                        case 'eternl': return 'Eternl ♾️';
                        case 'flint': return 'Flint 🔥';
                        case 'typhon': return 'Typhon 🌊';
                        case 'nami': return 'Nami 🌊';
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.warn('Error detecting connected wallet:', error);
            }
            return 'Connected Wallet 💳';
          };

          setConnectedWalletName(detectConnectedWallet());
        } catch (error) {
          console.error('Error getting wallet info:', error);
        }
      } else {
        setWalletAddress('');
        setConnectedWalletName('');
      }
    };

    getWalletInfo();
    
    // Also check wallet info periodically to catch state changes
    const interval = setInterval(getWalletInfo, 2000);
    return () => clearInterval(interval);
  }, [connected, wallet]);

  // Check for existing connection on mount and when connected state changes
  useEffect(() => {
    const checkConnectionState = () => {
      // If connected but no wallet name, try to determine it
      if (connected && !connectedWalletName) {
        // Try to restore wallet name from localStorage first
        const storedWallet = localStorage.getItem('mesh-wallet');
        if (storedWallet) {
          const walletDisplayNames = {
            'lace': 'Lace 🦋',
            'eternl': 'Eternl ♾️',
            'flint': 'Flint 🔥',
            'typhon': 'Typhon 🌊',
            'nami': 'Nami 🌊'
          };
          const displayName = walletDisplayNames[storedWallet as keyof typeof walletDisplayNames] || 'Connected Wallet 💳';
          setConnectedWalletName(displayName);
        } else {
          // Fallback: just show generic connected state
          setConnectedWalletName('Connected Wallet 💳');
        }
      }
      
      // If not connected, clear the wallet name
      if (!connected && connectedWalletName) {
        setConnectedWalletName('');
      }
    };

    checkConnectionState();
    
    // Also check after a brief delay to catch async state updates
    const timer = setTimeout(checkConnectionState, 1000);
    return () => clearTimeout(timer);
  }, [connected, connectedWalletName]);

  // Close wallet list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (walletListRef.current && !walletListRef.current.contains(event.target as Node)) {
        setShowWalletList(false);
      }
    };

    if (showWalletList) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showWalletList]);

  const handleConnect = async (walletName: string) => {
    setLoading(true);
    logWalletConnectionAttempt(walletName);
    
    try {
      // Add delay to ensure wallet extension is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await connect(walletName);
      
      // Store the connected wallet name for detection
      if (typeof window !== 'undefined') {
        localStorage.setItem('mesh-wallet', walletName);
      }
      
      setShowWalletList(false);
      
      // Immediately update the connected wallet name
      const walletDisplayNames = {
        'lace': 'Lace 🦋',
        'eternl': 'Eternl ♾️',
        'flint': 'Flint 🔥',
        'typhon': 'Typhon 🌊',
        'nami': 'Nami 🌊'
      };
      
      // Force update the wallet name immediately
      const displayName = walletDisplayNames[walletName as keyof typeof walletDisplayNames] || 'Connected Wallet 💳';
      setConnectedWalletName(displayName);
      
      // Also trigger a re-check after a short delay
      setTimeout(() => {
        if (connected) {
          setConnectedWalletName(displayName);
        }
      }, 500);
      
      logWalletConnectionSuccess(walletName);
    } catch (error) {
      logWalletConnectionError(walletName, error);
      
      // More user-friendly error messages
      let errorMessage = 'Failed to connect wallet. ';
      if (error instanceof Error) {
        if (error.message.includes('User declined')) {
          errorMessage += 'Connection was cancelled by user.';
        } else if (error.message.includes('not found')) {
          errorMessage += 'Wallet not found. Please make sure it is installed.';
        } else {
          errorMessage += 'Please make sure your wallet is installed, unlocked, and set to Preprod testnet.';
        }
      } else {
        errorMessage += 'Please try again or try a different wallet.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      
      // Clear stored wallet name
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mesh-wallet');
      }
      
      setConnectedWalletName('');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Show connected state if we have either connected=true OR wallet address OR stored wallet
  const isConnected = connected || walletAddress || (typeof window !== 'undefined' && localStorage.getItem('mesh-wallet'));

  if (isConnected && (walletAddress || connectedWalletName)) {
    return (
      <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <div className="text-green-400 font-semibold text-sm">
              {connectedWalletName || 'Connected'}
            </div>
          </div>
          {walletAddress && (
            <div className="text-gray-300 font-mono text-xs bg-gray-800/50 px-2 py-1 rounded border">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
            </div>
          )}
          <button
            onClick={handleDisconnect}
            className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25"
          >
            Disconnect
          </button>
        </div>
        {/* Debug info - remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 mt-2">
            Debug: connected={connected.toString()}, name="{connectedWalletName}", stored="{typeof window !== 'undefined' ? localStorage.getItem('mesh-wallet') : 'N/A'}"
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-slate-900/50 backdrop-blur-sm border border-gray-600/50 rounded-xl p-4 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
          <div className="text-orange-400 font-semibold text-sm">
            Not Connected
          </div>
        </div>
        <div className="relative" ref={walletListRef}>
          <button
            onClick={() => setShowWalletList(!showWalletList)}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connecting...
              </>
            ) : (
              <>
                🔗 Connect Wallet
              </>
            )}
          </button>

          {showWalletList && !loading && (
            <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl z-50 min-w-[200px]">
              {availableWallets.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-gray-400 text-xs border-b border-gray-700">
                    Choose a wallet:
                  </div>
                  {availableWallets.map((wallet) => (
                    <button
                      key={wallet.key}
                      onClick={() => handleConnect(wallet.key)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700/50 text-white transition-all duration-200 flex items-center gap-3 last:rounded-b-lg hover:text-purple-300"
                    >
                      <span className="text-lg">{wallet.icon}</span>
                      <span className="font-medium">{wallet.name}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-3 text-gray-400 text-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚫</div>
                    <div className="mb-2">No Cardano wallets detected</div>
                    <div className="text-xs">
                      Install: Lace, Eternl, Flint, or Typhon
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}