'use client';

import React from 'react';
import { ColorPalette } from '@/lib/schemas';

interface PalettePreviewProps {
  palette: ColorPalette | null;
}

export default function PalettePreview({ palette }: PalettePreviewProps) {
  if (!palette) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Click "Generate Color Palette" to see color preview</p>
      </div>
    );
  }

  const colorSwatches = [
    { name: 'Primary', color: palette.primary, usage: palette.primary.usage },
    { name: 'Secondary', color: palette.secondary, usage: palette.secondary.usage },
    { name: 'Accent', color: palette.accent, usage: palette.accent.usage },
    { name: 'Neutral', color: palette.neutral, usage: palette.neutral.usage },
    { name: 'Background', color: palette.background, usage: palette.background.usage },
    { name: 'Surface', color: palette.surface, usage: palette.surface.usage },
    { name: 'Text', color: palette.text, usage: palette.text.usage },
  ];

  const getContrastColor = (hexColor: string): string => {
    // Simple contrast calculation - returns white or black based on luminance
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="space-y-6">
      {/* Palette Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Color Palette Details</h3>
        <p className="text-sm text-gray-600 italic mb-4">"{palette.rationale}"</p>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colorSwatches.map((swatch) => (
          <div key={swatch.name} className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="h-24 flex items-center justify-center"
              style={{ backgroundColor: swatch.color.value }}
            >
              <span 
                className="text-sm font-medium px-2 py-1 rounded"
                style={{ 
                  color: getContrastColor(swatch.color.value),
                  backgroundColor: swatch.color.value === '#FFFFFF' ? '#000000' : 'transparent'
                }}
              >
                {swatch.color.name}
              </span>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-gray-900">{swatch.name}</h4>
              <p className="text-sm text-gray-600 font-mono">{swatch.color.value}</p>
              <p className="text-xs text-gray-500 mt-1">{swatch.usage}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Contrast:</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  swatch.color.contrast === 'AAA' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  WCAG {swatch.color.contrast}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
        <div 
          className="rounded-lg p-6 space-y-4"
          style={{ backgroundColor: palette.background.value }}
        >
          <div 
            className="rounded-lg p-4"
            style={{ backgroundColor: palette.surface.value }}
          >
            <h4 
              className="text-xl font-semibold mb-2"
              style={{ color: palette.text.value }}
            >
              Sample Card Title
            </h4>
            <p 
              className="text-sm mb-4"
              style={{ color: palette.neutral.value }}
            >
              This is a sample card with the generated color palette applied. The colors work together to create a cohesive design.
            </p>
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 rounded-md text-white text-sm font-medium"
                style={{ backgroundColor: palette.primary.value }}
              >
                Primary Action
              </button>
              <button 
                className="px-4 py-2 rounded-md text-white text-sm font-medium"
                style={{ backgroundColor: palette.secondary.value }}
              >
                Secondary Action
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: palette.accent.value }}
            />
            <span 
              className="text-sm"
              style={{ color: palette.text.value }}
            >
              Accent color indicator
            </span>
          </div>
        </div>
      </div>

      {/* CSS Variables */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">CSS Variables</h4>
        <pre className="text-xs overflow-x-auto">
          <code>{`:root {
  --color-primary: ${palette.primary.value};
  --color-secondary: ${palette.secondary.value};
  --color-accent: ${palette.accent.value};
  --color-neutral: ${palette.neutral.value};
  --color-background: ${palette.background.value};
  --color-surface: ${palette.surface.value};
  --color-text: ${palette.text.value};
}

/* Usage examples */
.primary-button {
  background-color: var(--color-primary);
  color: white;
}

.secondary-button {
  background-color: var(--color-secondary);
  color: white;
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-neutral);
}

.text-primary {
  color: var(--color-text);
}`}</code>
        </pre>
      </div>

      {/* Tailwind Configuration */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">Tailwind Configuration</h4>
        <pre className="text-xs overflow-x-auto">
          <code>{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${palette.primary.value}',
        secondary: '${palette.secondary.value}',
        accent: '${palette.accent.value}',
        neutral: '${palette.neutral.value}',
        background: '${palette.background.value}',
        surface: '${palette.surface.value}',
        text: '${palette.text.value}',
      }
    }
  }
}`}</code>
        </pre>
      </div>
    </div>
  );
}
