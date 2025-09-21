// File: components/WelcomePage.tsx
"use client";

import { useState, useEffect } from 'react';
import { ChevronRightIcon, SparklesIcon, ShieldCheckIcon, GlobeAltIcon, CurrencyDollarIcon, BoltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export default function WelcomePage({ onGetStarted }: WelcomePageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Smart Contract Security",
      description: "Your gift cards are secured by Plutus V3 smart contracts on Cardano",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: "Instant Transactions",
      description: "Send and receive gift cards instantly with low fees on Cardano",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global & Decentralized",
      description: "No intermediaries - pure peer-to-peer gift card transfers",
      gradient: "from-green-500 to-emerald-400"
    }
  ];

  const stats = [
    { value: "100%", label: "Decentralized", icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { value: "<1₳", label: "Transaction Fee", icon: <CurrencyDollarIcon className="w-5 h-5" /> },
    { value: "∞", label: "Global Reach", icon: <GlobeAltIcon className="w-5 h-5" /> },
    { value: "24/7", label: "Always Available", icon: <BoltIcon className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">🎁</span>
            </div>
            <span className="text-2xl font-bold text-white">CardanoGift</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Preprod Network</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 md:px-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Hero Section */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                  Future of
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    Gift Cards
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  Send value across the globe instantly with blockchain-secured gift cards. 
                  <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-semibold"> No banks, no borders, no limits.</span>
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`transform transition-all duration-500 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group">
                      <div className="flex items-center justify-center mb-2 text-purple-400 group-hover:text-pink-400 transition-colors">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unique Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Plutus V3 Smart Contracts</h3>
                    <p className="text-gray-400 text-sm">Latest Cardano technology ensuring maximum security and efficiency</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <BoltIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Instant Settlement</h3>
                    <p className="text-gray-400 text-sm">No waiting periods - gift cards are available immediately upon creation</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <GlobeAltIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Zero Intermediaries</h3>
                    <p className="text-gray-400 text-sm">Direct peer-to-peer transfers without banks or payment processors</p>
                  </div>
                </div>
              </div>

              {/* Why Choose Us Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Why <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CardanoGift</span> is Different
                </h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">No Expiration Dates</h4>
                        <p className="text-gray-400 text-sm">Your gift cards never expire - they're permanently secured on the blockchain</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Minimal Fees</h4>
                        <p className="text-gray-400 text-sm">Only pay Cardano network fees (~0.17 ADA) - no additional platform charges</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Open Source</h4>
                        <p className="text-gray-400 text-sm">Fully transparent code - verify the security yourself</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Self-Custodial</h4>
                        <p className="text-gray-400 text-sm">You maintain full control - no third party can freeze or confiscate your funds</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Global Reach</h4>
                        <p className="text-gray-400 text-sm">Send to anyone with a Cardano wallet, anywhere in the world, instantly</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Provably Secure</h4>
                        <p className="text-gray-400 text-sm">Mathematical proofs ensure your gifts can only be claimed by the intended recipient</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <button
                  onClick={onGetStarted}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10">Connect Wallet & Start</span>
                  <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </button>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <SparklesIcon className="w-4 h-4 text-purple-400" />
                    <span>Built on Cardano</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                    <span>Smart Contract Secured</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="w-4 h-4 text-blue-400" />
                    <span>Open Source</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="border-t border-white/10 pt-6">
              <p className="text-gray-400 text-sm">
                Powered by <span className="text-purple-400 font-semibold">Aiken Smart Contracts</span> • 
                Built with <span className="text-pink-400 font-semibold">MeshJS</span> • 
                Secured by <span className="text-blue-400 font-semibold">Cardano</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}