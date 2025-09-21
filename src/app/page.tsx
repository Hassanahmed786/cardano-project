// File: app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Error boundary for wallet issues
const ErrorBoundary = dynamic(() => import('../components/ErrorBoundary'), {
  ssr: false
});

// Dynamically import components to avoid SSR issues
const CreateCardForm = dynamic(() => import('../components/CreateCardForm'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-700 h-48 rounded-lg"></div>
});

const MyGiftCards = dynamic(() => import('../components/MyGiftCards'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-700 h-48 rounded-lg"></div>
});

const NFTGallery = dynamic(() => import('../components/NFTGallery'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-700 h-48 rounded-lg"></div>
});

const WelcomePage = dynamic(() => import('../components/WelcomePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  )
});

// Import MeshJS components dynamically to avoid SSR
const DynamicWalletConnection = dynamic(
  () => import('../components/WalletConnection'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-600 h-10 w-32 rounded-lg"></div>
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomePage onGetStarted={handleGetStarted} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        {/* Header */}
        <header className="border-b border-gray-700/50 backdrop-blur-sm bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowWelcome(true)}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎁</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Lovelace Treasury</h1>
                    <p className="text-xs text-gray-400">Blockchain Gift Cards</p>
                  </div>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <ErrorBoundary>
                  <DynamicWalletConnection />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            🎁 Create Gift Card
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'cards'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            📋 My Gift Cards
          </button>
          <button
            onClick={() => setActiveTab('nfts')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'nfts'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            🖼️ NFT Gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {activeTab === 'create' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Create Gift Card
              </h2>
              <CreateCardForm />
            </div>
          )}

          {activeTab === 'cards' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                My Gift Cards
              </h2>
              <MyGiftCards />
            </div>
          )}

          {activeTab === 'nfts' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                NFT Gallery
              </h2>
              <NFTGallery />
            </div>
          )}
        </div>
      </main>

        {/* Footer */}
        <footer className="border-t border-gray-700/50 backdrop-blur-sm bg-black/20 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-400">
              <p>Built with ❤️ using Aiken, Next.js, and MeshJS</p>
              <p className="text-sm mt-1">Secure gift cards on the Cardano blockchain</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}