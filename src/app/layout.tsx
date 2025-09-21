import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientMeshProvider from "../components/providers/MeshProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lovelace Treasury - Cardano Gift Cards",
  description: "Send and receive ADA gift cards secured by smart contracts on Cardano with Lovelace Treasury",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress wallet extension errors on page load
              (function() {
                const walletErrorPatterns = [
                  'runtime.lastError',
                  'Could not establish connection',
                  'Receiving end does not exist',
                  'Cannot read properties of undefined (reading \\'topic\\')',
                  'contentscript.js',
                  'inpage.js'
                ];
                
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  const isWalletError = walletErrorPatterns.some(pattern => 
                    message.toLowerCase().includes(pattern.toLowerCase())
                  );
                  if (!isWalletError) {
                    originalError.apply(console, arguments);
                  }
                };
                
                window.addEventListener('unhandledrejection', function(event) {
                  const message = event.reason?.message || event.reason?.toString() || '';
                  const isWalletError = walletErrorPatterns.some(pattern => 
                    message.toLowerCase().includes(pattern.toLowerCase())
                  );
                  if (isWalletError) {
                    event.preventDefault();
                  }
                });
              })();
            `,
          }}
        />
        <ClientMeshProvider>
          {children}
        </ClientMeshProvider>
      </body>
    </html>
  );
}