// File: components/NFTPreview.tsx
"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface NFTDesign {
  theme: string;
  backgroundColor: string;
  textColor: string;
  message: string;
  sender: string;
  template: string;
  decorations: string[];
}

interface NFTPreviewProps {
  design: NFTDesign;
  adaAmount: string;
  recipientAddress?: string;
}

export interface NFTPreviewRef {
  getCanvas: () => HTMLCanvasElement | null;
}

const NFTPreview = forwardRef<NFTPreviewRef, NFTPreviewProps>(({ design, adaAmount, recipientAddress }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
  }));

  const generateNFTImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, design.backgroundColor);
    gradient.addColorStop(1, design.backgroundColor + '80');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border based on template
    ctx.strokeStyle = '#ffffff40';
    ctx.lineWidth = 4;
    switch (design.template) {
      case 'elegant':
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        break;
      case 'modern':
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
        break;
    }

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 Lovelace Treasury', canvas.width / 2, 80);

    // ADA Amount
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`${adaAmount} ADA`, canvas.width / 2, 150);

    // Message
    if (design.message) {
      ctx.fillStyle = '#e5e7eb';
      ctx.font = '18px Arial';
      const words = design.message.split(' ');
      let line = '';
      let y = 200;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > canvas.width - 80 && i > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[i] + ' ';
          y += 25;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
    }

    // Decorations
    ctx.font = '24px Arial';
    design.decorations.forEach((decoration, index) => {
      const x = 80 + (index % 8) * 60;
      const y = 320 + Math.floor(index / 8) * 30;
      ctx.fillText(decoration, x, y);
    });

    // Sender
    if (design.sender) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`From: ${design.sender}`, canvas.width - 30, canvas.height - 30);
    }

    // Cardano logo/branding
    ctx.fillStyle = '#ffffff60';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Powered by Cardano', 30, canvas.height - 30);
  };

  useEffect(() => {
    generateNFTImage();
  }, [design, adaAmount]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `cardano-gift-card-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          👁️ NFT Preview
        </h3>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <canvas
            ref={canvasRef}
            className="w-full max-w-md mx-auto border rounded-lg shadow-lg"
            style={{ maxHeight: '300px' }}
          />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-300">
            <span>Theme:</span>
            <span className="capitalize">{design.theme}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Template:</span>
            <span className="capitalize">{design.template}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Value:</span>
            <span className="text-amber-400 font-semibold">{adaAmount} ADA</span>
          </div>
          {design.message && (
            <div className="flex justify-between text-gray-300">
              <span>Message:</span>
              <span className="text-right max-w-48 truncate">"{design.message}"</span>
            </div>
          )}
          {design.decorations.length > 0 && (
            <div className="flex justify-between text-gray-300">
              <span>Decorations:</span>
              <span>{design.decorations.join(' ')}</span>
            </div>
          )}
        </div>

        <button
          onClick={downloadImage}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          📥 Download Preview
        </button>
      </div>

      {/* NFT Metadata Preview */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📋 NFT Metadata</h3>
        <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded overflow-x-auto">
{JSON.stringify({
  name: `Lovelace Treasury Gift Card - ${adaAmount} ADA`,
  image: "ipfs://[generated-hash]",
  description: design.message || "A personalized ADA gift card from Lovelace Treasury on Cardano blockchain",
  attributes: [
    { trait_type: "Theme", value: design.theme },
    { trait_type: "Template", value: design.template },
    { trait_type: "ADA Amount", value: adaAmount },
    { trait_type: "Background Color", value: design.backgroundColor },
    { trait_type: "Decorations", value: design.decorations.length },
    { trait_type: "Created", value: new Date().toISOString().split('T')[0] }
  ],
  properties: {
    sender: design.sender || "Anonymous",
    message: design.message,
    decorations: design.decorations,
    ada_amount: adaAmount,
    network: "preprod"
  }
}, null, 2)}
        </pre>
      </div>
    </div>
  );
});

NFTPreview.displayName = 'NFTPreview';

export default NFTPreview;