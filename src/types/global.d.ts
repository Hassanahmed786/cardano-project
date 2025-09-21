// File: types/global.d.ts
declare global {
  interface Window {
    cardano?: {
      lace?: any;
      eternl?: any;
      flint?: any;
      typhon?: any;
      nami?: any;
      [key: string]: any;
    };
  }
}

export {};