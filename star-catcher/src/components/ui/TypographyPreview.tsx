'use client';

import React, { useEffect, useState } from 'react';
import { FontPairing } from '@/lib/schemas';

interface TypographyPreviewProps {
  fontPairing: FontPairing | null;
}

export default function TypographyPreview({ fontPairing }: TypographyPreviewProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (!fontPairing) return;

    const loadFonts = async () => {
      try {
        // Load primary font
        const primaryLink = document.createElement('link');
        primaryLink.href = fontPairing.primary.googleFontUrl;
        primaryLink.rel = 'stylesheet';
        document.head.appendChild(primaryLink);

        // Load secondary font
        const secondaryLink = document.createElement('link');
        secondaryLink.href = fontPairing.secondary.googleFontUrl;
        secondaryLink.rel = 'stylesheet';
        document.head.appendChild(secondaryLink);

        // Wait for fonts to load
        await Promise.all([
          document.fonts.load(`${fontPairing.primary.weight}px ${fontPairing.primary.name}`),
          document.fonts.load(`${fontPairing.secondary.weight}px ${fontPairing.secondary.name}`),
        ]);

        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    };

    loadFonts();
  }, [fontPairing]);

  if (!fontPairing) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Click "Generate Font Pairing" to see typography preview</p>
      </div>
    );
  }

  const primaryFontFamily = `"${fontPairing.primary.name}", sans-serif`;
  const secondaryFontFamily = `"${fontPairing.secondary.name}", sans-serif`;

  return (
    <div className="space-y-6">
      {/* Font Information */}
      {/*<div className="bg-gray-50 p-4 rounded-lg">*/}
      {/*  <h3 className="text-lg font-semibold mb-3">Font Pairing Details</h3>*/}
      {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
      {/*    <div>*/}
      {/*      <h4 className="font-medium text-gray-700 mb-2">Primary Font</h4>*/}
      {/*      <p className="text-sm text-gray-600">*/}
      {/*        <strong>{fontPairing.primary.name}</strong> ({fontPairing.primary.weight})*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <h4 className="font-medium text-gray-700 mb-2">Secondary Font</h4>*/}
      {/*      <p className="text-sm text-gray-600">*/}
      {/*        <strong>{fontPairing.secondary.name}</strong> ({fontPairing.secondary.weight})*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Typography Preview */}
      <div className="border border-gray-200 text-center rounded-lg p-6 bg-white">

          {/* Heading Examples */}
        <div className="mb-4">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: primaryFontFamily }}
          >
              {fontPairing.primary.name}
          </h1>
        </div>

        {/* Body Text Examples */}
        <div className="mb-4">
          <p 
            className="text-lg mb-4"
            style={{ fontFamily: secondaryFontFamily }}
          >
              {fontPairing.secondary.name}
          </p>
        </div>
      </div>
    </div>
    );
}
