// File: utils/errorSuppression.ts

// List of known wallet extension error patterns that we can safely ignore
const WALLET_ERROR_PATTERNS = [
  'runtime.lastError',
  'Could not establish connection',
  'Receiving end does not exist',
  'Cannot read properties of undefined (reading \'topic\')',
  'contentscript.js',
  'inpage.js',
  'extension context invalidated',
  'message port closed',
  'Extension context invalidated',
  'Inject Connector',
  'Cannot redefine property: ethereum',
  'Begin Wallet Injected',
  'Begin Wallet Bitcoin Injected',
  'evmAsk.js',
  'injected.js'
];

export const suppressWalletErrors = () => {
  if (typeof window === 'undefined') return;

  // Suppress console errors, warnings, and logs for wallet extension issues
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  console.error = (...args: any[]) => {
    const message = args.join(' ');
    const isWalletError = WALLET_ERROR_PATTERNS.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!isWalletError) {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    const isWalletError = WALLET_ERROR_PATTERNS.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!isWalletError) {
      originalWarn.apply(console, args);
    }
  };

  console.log = (...args: any[]) => {
    const message = args.join(' ');
    const isWalletError = WALLET_ERROR_PATTERNS.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!isWalletError) {
      originalLog.apply(console, args);
    }
  };

  // Handle unhandled promise rejections from wallet extensions
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    const isWalletError = WALLET_ERROR_PATTERNS.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isWalletError) {
      event.preventDefault();
      // Optionally log wallet errors in a different way
      console.debug('Suppressed wallet extension error:', message);
    }
  };

  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Return cleanup function
  return () => {
    console.error = originalError;
    console.warn = originalWarn;
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};

export const logWalletConnectionAttempt = (walletName: string) => {
  console.log(`🔗 Attempting to connect to ${walletName} wallet...`);
};

export const logWalletConnectionSuccess = (walletName: string) => {
  console.log(`✅ Successfully connected to ${walletName} wallet`);
};

export const logWalletConnectionError = (walletName: string, error: any) => {
  // Only log if it's not a known wallet extension error
  const message = error?.message || error?.toString() || '';
  const isKnownError = WALLET_ERROR_PATTERNS.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );

  if (!isKnownError) {
    console.error(`❌ Failed to connect to ${walletName} wallet:`, error);
  } else {
    console.debug(`🔇 Suppressed ${walletName} wallet extension error:`, message);
  }
};