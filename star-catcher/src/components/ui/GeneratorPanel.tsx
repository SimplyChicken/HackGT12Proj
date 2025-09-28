'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FontPairing, ColorPalette, Component, MemoryItem } from '@/lib/schemas';
import { memorySystem } from '@/lib/memory';
import TypographyPreview from './TypographyPreview';
import PreviewCanvas from './PreviewCanvas';
import LikeBar from './LikeBar';
import { Palette, Type, Component as ComponentIcon, Unlock, Lock, UserPlus} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type TabType = 'fonts' | 'colors' | 'components';

interface GeneratorPanelProps {
  className?: string;
  memories?: MemoryItem[];
  setMemories?: (memories: MemoryItem[]) => void;
  isMemoriesOpen?: boolean;
  setIsMemoriesOpen?: (open: boolean) => void;
}

export default function GeneratorPanel({ 
  className = '',
  memories = [],
  setMemories,
  isMemoriesOpen = false,
  setIsMemoriesOpen
}: GeneratorPanelProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('fonts');
  const [currentFont, setCurrentFont] = useState<FontPairing | null>(null);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const ALL_CATEGORIES = ['serif','sans-serif','handwriting','display'] as const;
  type Category = typeof ALL_CATEGORIES[number];

  const [lockPrimary, setLockPrimary] = useState(false);
  const [lockSecondary, setLockSecondary] = useState(false);
  const [primaryCategories, setPrimaryCategories] = useState<Category[]>(['serif','sans-serif']);
  const [secondaryCategories, setSecondaryCategories] = useState<Category[]>(['serif','sans-serif']);

  const toggleIn = (arr: Category[], v: Category) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

  const tabs = [
    { id: 'fonts' as TabType, label: 'Fonts', icon: Type },
    { id: 'colors' as TabType, label: 'Colors', icon: Palette },
    { id: 'components' as TabType, label: 'Components', icon: ComponentIcon },
  ];


    const generateDesign = useCallback(async (type: TabType, options: any = {}) => {
    setError(null);

    try {
      const memories = memorySystem.getLikedItems();
      const response = await fetch('/api/design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type === 'fonts' ? 'font' : type === 'colors' ? 'color' : 'component',
          options,
          memories,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (type === 'fonts') {
        setCurrentFont(result.data);
        const memory = memorySystem.createMemoryFromData('font', result.data);
        memorySystem.saveMemory(memory);
      } else if (type === 'colors') {
        setCurrentPalette(result.data);
        const memory = memorySystem.createMemoryFromData('color', result.data);
        memorySystem.saveMemory(memory);
      } else if (type === 'components') {
        setCurrentComponent(result.data);
        const memory = memorySystem.createMemoryFromData('component', result.data);
        memorySystem.saveMemory(memory);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Generation error:', err);
    }
  }, []);

    const buildOptions = useCallback(() => {
        return {
            primaryCategories,
            secondaryCategories,
            ...(currentFont && (lockPrimary || lockSecondary)
                ? {
                    locked: {
                        ...(lockPrimary ? {
                            primaryName: currentFont.primary.name,
                            primaryWeight: currentFont.primary.weight,
                        } : {}),
                        ...(lockSecondary ? {
                            secondaryName: currentFont.secondary.name,
                            secondaryWeight: currentFont.secondary.weight,
                        } : {}),
                    }
                }
                : {}),
        };
    }, [activeTab, primaryCategories, secondaryCategories, currentFont, lockPrimary, lockSecondary]);

    const generateBoth = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const fontOptions = buildOptions();

            await Promise.all([
                generateDesign('fonts', fontOptions),
                generateDesign('colors', {}), // color-specific options can go here later
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Generation error (both):', err);
        } finally {
            setIsLoading(false);
        }
    }, [buildOptions, generateDesign]);

const { data: session } = useSession();

const handleLike = useCallback(async () => {
  const userEmail = session?.user?.email;
  if (!userEmail) return console.error("No logged-in user email found");

  // Save font if it exists
  if (currentFont) {
    const fontMemory = memorySystem.createMemoryFromData('font', currentFont);
    const fontFeedback = memorySystem.createFeedbackFromMemory(fontMemory, 'like');
    memorySystem.saveMemory(fontMemory);
    memorySystem.saveFeedback(fontFeedback);

    try {
      const res = await fetch('/api/save/fonts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFont),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save font');
      console.log('Font saved:', result);
    } catch (err) {
      console.error('Font save error:', err);
    }
  }

  // Save colors if they exist
  if (currentPalette) {
    const colorData = {
      email: userEmail,
      case_id: Date.now().toString(),
      color: currentPalette.primary.value,
      color2: currentPalette.secondary.value,
    };

    const colorMemory = memorySystem.createMemoryFromData('color', colorData);
    const colorFeedback = memorySystem.createFeedbackFromMemory(colorMemory, 'like');
    memorySystem.saveMemory(colorMemory);
    memorySystem.saveFeedback(colorFeedback);

    try {
      const res = await fetch('/api/save/colors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(colorData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save color');
      console.log('Color saved:', result);
    } catch (err) {
      console.error('Color save error:', err);
    }
  }
}, [currentFont, currentPalette, session]);




    useEffect(() => { //space to generate new fonts and colors
        const handler = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null;
            const tag = t?.tagName;
            const isTyping =
                t?.isContentEditable ||
                tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

            if (isTyping) return;

            if (e.code === 'Space') {
                e.preventDefault();
                if (!isLoading) generateBoth();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isLoading, generateBoth]);

  const renderContent = () => {
        return (
          <div className="space-y-6">
                  {/* Track Preferences Banner for Unauthenticated Users */}
                  {!session && (
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserPlus className="w-5 h-5 text-blue-600" />
                          <div>
                            <h4 className="text-sm font-semibold text-blue-800">
                              Track Your Design Preferences
                            </h4>
                            <p className="text-xs text-blue-600">
                              Sign up to have the AI learn your style preferences and create personalized designs
                            </p>
                          </div>
                        </div>
                        <Link href="/accounts">
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                            Track Preferences
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                      <h4 className="mb-3 text-base font-semibold text-gray-800 text-left">
                          Press the spacebar to generate themes!
                      </h4>

                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                          {/* Primary */}
                          <div>
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-gray-700 leading-none">
                                        Font One
                                    </span>
                                  <button
                                      type="button"
                                      onClick={() => setLockPrimary(v => !v)}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700"
                                  >
                                      {lockPrimary ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                  </button>
                              </div>


                              <div className="flex flex-wrap gap-4">
                                  {ALL_CATEGORIES.map((cat) => (
                                      <label
                                          key={`prim-${cat}`}
                                          className="inline-flex items-center gap-2 text-sm text-gray-700"
                                      >
                                          <input
                                              type="checkbox"
                                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                              checked={primaryCategories.includes(cat)}
                                              onChange={() => setPrimaryCategories((c) => toggleIn(c, cat))}
                                              disabled={lockPrimary}
                                          />
                                          <span className="capitalize">{cat.replace('-', ' ')}</span>
                                      </label>
                                  ))}
                              </div>
                          </div>

                          {/* Secondary */}
                          <div>
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-gray-700 leading-none">
                                    Font Two
                                 </span>

                                  <button
                                      type="button"
                                      onClick={() => setLockSecondary(v => !v)}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700"
                                  >
                                      {lockSecondary ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                  </button>
                              </div>

                              <div className="flex flex-wrap gap-4">
                                  {ALL_CATEGORIES.map((cat) => (
                                      <label
                                          key={`sec-${cat}`}
                                          className="inline-flex items-center gap-2 text-sm text-gray-700"
                                      >
                                          <input
                                              type="checkbox"
                                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                                              checked={secondaryCategories.includes(cat)}
                                              onChange={() => setSecondaryCategories((c) => toggleIn(c, cat))}
                                              disabled={lockSecondary}
                                          />
                                          <span className="capitalize">{cat.replace('-', ' ')}</span>
                                      </label>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>

              <TypographyPreview fontPairing={currentFont} palette={currentPalette} />
            {(currentFont || currentPalette) && (
              <LikeBar onLike={handleLike} />
            )}
          </div>
        );
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
}
