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
          document.fonts.load(`${fontPairing.primary.weight} ${fontPairing.primary.name}`),
          document.fonts.load(`${fontPairing.secondary.weight} ${fontPairing.secondary.name}`),
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Font Pairing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Primary Font</h4>
            <p className="text-sm text-gray-600">
              <strong>{fontPairing.primary.name}</strong> ({fontPairing.primary.weight})
            </p>
            <p className="text-xs text-gray-500 mt-1">{fontPairing.primary.usage}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Secondary Font</h4>
            <p className="text-sm text-gray-600">
              <strong>{fontPairing.secondary.name}</strong> ({fontPairing.secondary.weight})
            </p>
            <p className="text-xs text-gray-500 mt-1">{fontPairing.secondary.usage}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 italic">"{fontPairing.rationale}"</p>
        </div>
      </div>

      {/* Typography Preview */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold mb-4">Typography Preview</h3>
        
        {/* Heading Examples */}
        <div className="mb-6">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: primaryFontFamily }}
          >
            Main Heading
          </h1>
          <h2 
            className="text-3xl font-semibold mb-2"
            style={{ fontFamily: primaryFontFamily }}
          >
            Section Heading
          </h2>
          <h3 
            className="text-2xl font-medium mb-2"
            style={{ fontFamily: primaryFontFamily }}
          >
            Subsection Heading
          </h3>
        </div>

        {/* Body Text Examples */}
        <div className="mb-6">
          <p 
            className="text-lg mb-4"
            style={{ fontFamily: secondaryFontFamily }}
          >
            This is a larger body text example using the secondary font. It demonstrates how the font pairing works for reading longer content and provides good readability for articles and descriptions.
          </p>
          <p 
            className="text-base mb-4"
            style={{ fontFamily: secondaryFontFamily }}
          >
            This is regular body text using the secondary font. The combination of these two fonts creates a harmonious typographic hierarchy that guides the reader through the content effectively.
          </p>
          <p 
            className="text-sm text-gray-600"
            style={{ fontFamily: secondaryFontFamily }}
          >
            This is smaller text, often used for captions, footnotes, or supplementary information. The font pairing ensures consistency across all text sizes.
          </p>
        </div>

        {/* Interactive Elements */}
        <div className="space-y-4">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
            style={{ fontFamily: primaryFontFamily }}
          >
            Button Text
          </button>
          <div>
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-800 underline"
              style={{ fontFamily: secondaryFontFamily }}
            >
              Link Text Example
            </a>
          </div>
        </div>
      </div>

      {/* CSS Implementation */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
        <h4 className="text-sm font-medium mb-2">CSS Implementation</h4>
        <pre className="text-xs overflow-x-auto">
          <code>{`/* Import fonts */
@import url('${fontPairing.primary.googleFontUrl}');
@import url('${fontPairing.secondary.googleFontUrl}');

/* CSS Variables */
:root {
  --font-primary: "${fontPairing.primary.name}", sans-serif;
  --font-secondary: "${fontPairing.secondary.name}", sans-serif;
}

/* Usage */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-primary);
  font-weight: ${fontPairing.primary.weight};
}

body, p, span, div {
  font-family: var(--font-secondary);
  font-weight: ${fontPairing.secondary.weight};
}`}</code>
        </pre>
      </div>
    </div>
  );
}
