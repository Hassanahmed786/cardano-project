// File: components/NFTDesigner.tsx
"use client";

import { useState } from 'react';
import { SwatchIcon, PhotoIcon, SparklesIcon, HeartIcon, GiftIcon, CakeIcon } from '@heroicons/react/24/outline';

interface NFTDesign {
  theme: string;
  backgroundColor: string;
  textColor: string;
  message: string;
  sender: string;
  template: string;
  decorations: string[];
}

interface NFTDesignerProps {
  onDesignChange: (design: NFTDesign) => void;
  currentDesign: NFTDesign;
}

const themes = [
  { id: 'birthday', name: 'Birthday', icon: <CakeIcon className="w-5 h-5" />, gradient: 'from-pink-500 to-purple-500' },
  { id: 'holiday', name: 'Holiday', icon: <GiftIcon className="w-5 h-5" />, gradient: 'from-red-500 to-green-500' },
  { id: 'anniversary', name: 'Anniversary', icon: <HeartIcon className="w-5 h-5" />, gradient: 'from-rose-500 to-pink-500' },
  { id: 'celebration', name: 'Celebration', icon: <SparklesIcon className="w-5 h-5" />, gradient: 'from-yellow-500 to-orange-500' },
  { id: 'gradient', name: 'Modern', icon: <SwatchIcon className="w-5 h-5" />, gradient: 'from-blue-500 to-purple-500' },
  { id: 'minimal', name: 'Minimal', icon: <PhotoIcon className="w-5 h-5" />, gradient: 'from-gray-600 to-gray-800' }
];

const backgroundColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', 
  '#10b981', '#06b6d4', '#3b82f6', '#1f2937', '#374151'
];

const templates = [
  { id: 'classic', name: 'Classic Card', preview: '🎁' },
  { id: 'modern', name: 'Modern Frame', preview: '💎' },
  { id: 'elegant', name: 'Elegant Border', preview: '✨' },
  { id: 'festive', name: 'Festive Style', preview: '🎉' },
  { id: 'minimalist', name: 'Clean Design', preview: '⚡' }
];

const decorations = [
  '🎈', '🎉', '🎊', '🌟', '✨', '💫', '🎀', '🌹', 
  '🦋', '🌈', '🔥', '💎', '👑', '🎵', '🌸', '🍀'
];

export default function NFTDesigner({ onDesignChange, currentDesign }: NFTDesignerProps) {
  const [localDesign, setLocalDesign] = useState<NFTDesign>(currentDesign);

  const updateDesign = (updates: Partial<NFTDesign>) => {
    const newDesign = { ...localDesign, ...updates };
    setLocalDesign(newDesign);
    onDesignChange(newDesign);
  };

  const toggleDecoration = (decoration: string) => {
    const newDecorations = localDesign.decorations.includes(decoration)
      ? localDesign.decorations.filter(d => d !== decoration)
      : [...localDesign.decorations, decoration];
    updateDesign({ decorations: newDecorations });
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">🎨 Choose Theme</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateDesign({ 
                theme: theme.id,
                backgroundColor: theme.id === 'minimal' ? '#374151' : localDesign.backgroundColor 
              })}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                localDesign.theme === theme.id
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
            >
              <div className={`p-1 rounded bg-gradient-to-r ${theme.gradient} text-white`}>
                {theme.icon}
              </div>
              <span className="text-white text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">📋 Card Template</h3>
        <div className="grid grid-cols-5 gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => updateDesign({ template: template.id })}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                localDesign.template === template.id
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
            >
              <div className="text-2xl mb-1">{template.preview}</div>
              <div className="text-xs text-gray-300">{template.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">🎨 Background Color</h3>
        <div className="flex flex-wrap gap-2">
          {backgroundColors.map((color) => (
            <button
              key={color}
              onClick={() => updateDesign({ backgroundColor: color })}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                localDesign.backgroundColor === color
                  ? 'border-white scale-110'
                  : 'border-gray-500 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">💌 Personal Message</h3>
        <textarea
          value={localDesign.message}
          onChange={(e) => updateDesign({ message: e.target.value })}
          placeholder="Write a personal message for your gift card..."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:border-purple-400 focus:outline-none"
          rows={3}
          maxLength={200}
        />
        <div className="text-sm text-gray-400 mt-1">
          {localDesign.message.length}/200 characters
        </div>
      </div>

      {/* Sender Name */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">✍️ From</h3>
        <input
          type="text"
          value={localDesign.sender}
          onChange={(e) => updateDesign({ sender: e.target.value })}
          placeholder="Your name (optional)"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
          maxLength={50}
        />
      </div>

      {/* Decorations */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">✨ Decorations</h3>
        <div className="grid grid-cols-8 gap-2">
          {decorations.map((decoration) => (
            <button
              key={decoration}
              onClick={() => toggleDecoration(decoration)}
              className={`p-2 rounded-lg border-2 transition-all duration-200 text-xl ${
                localDesign.decorations.includes(decoration)
                  ? 'border-purple-400 bg-purple-500/20 scale-110'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:scale-105'
              }`}
            >
              {decoration}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-400 mt-2">
          Selected: {localDesign.decorations.join(' ')} ({localDesign.decorations.length}/8)
        </div>
      </div>
    </div>
  );
}