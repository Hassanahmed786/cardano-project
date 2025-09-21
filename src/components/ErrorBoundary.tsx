// File: components/ErrorBoundary.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Filter out wallet extension errors that we can't control
    const isWalletExtensionError = 
      error.message?.includes('runtime.lastError') ||
      error.message?.includes('topic') ||
      error.message?.includes('contentscript') ||
      error.message?.includes('inpage') ||
      error.stack?.includes('contentscript') ||
      error.stack?.includes('inpage');

    if (!isWalletExtensionError) {
      console.error('Uncaught error:', error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // Check if it's a wallet extension error
      const isWalletError = 
        this.state.error?.message?.includes('runtime.lastError') ||
        this.state.error?.message?.includes('topic') ||
        this.state.error?.stack?.includes('contentscript') ||
        this.state.error?.stack?.includes('inpage');

      if (isWalletError) {
        // For wallet extension errors, just render children normally
        return this.props.children;
      }

      // For other errors, show fallback UI
      return this.props.fallback || (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2">⚠️ Something went wrong</h3>
          <p className="text-gray-300 text-sm">
            Please refresh the page and try again. If the problem persists, try using a different wallet.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;