'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { FontPairing, ColorPalette } from '@/lib/schemas';

interface TypographyPreviewProps {
  fontPairing: FontPairing | null;
  palette: ColorPalette | null;
}


export default function TypographyPreview({ fontPairing, palette }: TypographyPreviewProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

    const colors = useMemo(() => {
        return {
            primary:   palette?.primary?.value  ?? '#111111',
            secondary: palette?.secondary?.value ?? '#374151',
            accent:    palette?.accent?.value    ?? '#2563eb',
        };
    }, [palette]);

    useEffect(() => {
      if (!fontPairing) return;


      const loadFonts = async () => {
      try {
        // Load primary font
        const primaryLink = document.createElement('link');
        primaryLink.href = fontPairing.primary.googleFontUrl;
        primaryLink.rel = 'stylesheet';
        document.head.appendChild(primaryLink);

        const secondaryLink = document.createElement('link');
        secondaryLink.href = fontPairing.secondary.googleFontUrl;
        secondaryLink.rel = 'stylesheet';
        document.head.appendChild(secondaryLink);

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
        <p> Press space to begin ! </p>
      </div>
    );
  }

  const primaryFontFamily = `"${fontPairing.primary.name}", sans-serif`;
  const secondaryFontFamily = `"${fontPairing.secondary.name}", sans-serif`;

  return (
    <div className="space-y-6">

        <div
            className="mx-auto rounded-xl border border-gray-200 shadow-sm shrink-0"
            style={{ width: 1020, height: 400 }} // ⬅ fixed size
        >
            <div
                className="h-full w-full flex flex-col items-center justify-center p-10"
                style={{ backgroundColor: colors.secondary }}
            >

                <h1 className="text-4xl font-bold mb-8"
                    style={{ fontFamily: primaryFontFamily,
                            color: colors.primary ,
                            fontSize: 'clamp(50px, 6vw, 70px)',
                            paddingBlock: '0.35em',
                    }}
                > Primary </h1>

                <p className="text-lg mb-4"
                   style={{ fontFamily: secondaryFontFamily,
                            color: colors.accent,
                            fontSize: 'clamp(38px, 3.2vw, 45px)',
                            paddingBlock: '0.35em',
                   }}
                > Secondary </p>

            </div>
        </div>

    </div>

    );
}
