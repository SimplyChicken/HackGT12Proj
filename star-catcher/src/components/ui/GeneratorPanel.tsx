'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FontPairing, ColorPalette, Component, MemoryItem } from '@/lib/schemas';
import { memorySystem } from '@/lib/memory';
import TypographyPreview from './TypographyPreview';
import LikeBar from './LikeBar';
import { Palette, Type, Component as ComponentIcon, Unlock, Lock} from 'lucide-react';
import { useSession } from 'next-auth/react';



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
  const [activeTab, setActiveTab] = useState<TabType>('fonts');
  const [currentFont, setCurrentFont] = useState<FontPairing | null>(null);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

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


    const handleLike = useCallback(async (type: TabType) => {
        const userEmail = session?.user?.email;
        if (!userEmail) {
            console.error("No logged-in user email found");
            return;
        }

        // Save font
        if ((type === 'fonts' || type === 'components') && currentFont) {
            try {
                const res = await fetch('/api/save/fonts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...currentFont, email: userEmail }),
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || 'Failed to save font');
                // optional: also keep local memory
                const mem = memorySystem.createMemoryFromData('font', currentFont);
                memorySystem.saveMemory(mem);
            } catch (err) {
                console.error('Font save error:', err);
            }
        }

        // Save colors
        if ((type === 'colors' || type === 'components') && currentPalette) {
            const colorData = {
                email: userEmail,
                case_id: Date.now().toString(),
                color: currentPalette.primary.value,
                color2: currentPalette.secondary.value,
            };
            try {
                const res = await fetch('/api/save/colors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(colorData),
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || 'Failed to save color');
                // optional: also keep local memory
                const mem = memorySystem.createMemoryFromData('color', currentPalette);
                memorySystem.saveMemory(mem);
            } catch (err) {
                console.error('Color save error:', err);
            }
        }
    }, [session, currentFont, currentPalette]);


    const hasAutoGenerated = useRef(false);

    useEffect(() => {
        if (hasAutoGenerated.current) return;     // guard against double-run (StrictMode)
        hasAutoGenerated.current = true;

        // only generate if nothing is set yet (optional)
        if (!currentFont || !currentPalette) {
            generateBoth();
        }
    }, [generateBoth, currentFont, currentPalette]);


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

                <h4 className="font-outfit text-left text-sm md:text-base font-medium text-ink/80">
                    Press spacebar to generate themes!
                </h4>

                <TypographyPreview fontPairing={currentFont} palette={currentPalette} />

                {/* Controls card */}
                <div className="rounded-2xl border border-bg bg-nav-surface p-6 shadow-sm">

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Primary */}
                        <div>
                            <div className="mb-3 flex items-center gap-1">
                              <span className="font-outfit text-sm font-medium leading-none text-ink/90">
                                    Primary Font
                              </span>
                                <button
                                    type="button"
                                    onClick={() => setLockPrimary(v => !v)}
                                    aria-pressed={lockPrimary}
                                    className="className=inline-flex items-center gap-2 px-3 py-1.5 text-sm text-ink"
                                >
                                    {lockPrimary ? (
                                        <Lock className="h-4 w-4" />
                                    ) : (
                                        <Unlock className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {ALL_CATEGORIES.map(cat => (
                                    <label
                                        key={`prim-${cat}`}
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-outfit text-sm capitalize text-ink/80 border border-bg"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded-sm checkbox-ink focus:ring-2 focus:ring-[color:var(--ink)]/30"
                                            checked={primaryCategories.includes(cat)}
                                            onChange={() => setPrimaryCategories(c => toggleIn(c, cat))}
                                            disabled={lockPrimary}
                                        />
                                        <span>{cat.replace("-", " ")}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Secondary */}
                        <div>
                            <div className="mb-3 flex items-center gap-1">
                                      <span className="font-outfit text-sm font-medium leading-none text-ink/90">
                                        Secondary Font
                                      </span>
                                <button
                                    type="button"
                                    onClick={() => setLockSecondary(v => !v)}
                                    aria-pressed={lockSecondary}
                                    className="className=inline-flex items-center gap-2 px-3 py-1.5 text-sm text-ink"
                                >
                                    {lockSecondary ? (
                                        <Lock className="h-4 w-4" />
                                    ) : (
                                        <Unlock className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {ALL_CATEGORIES.map(cat => (
                                    <label
                                        key={`sec-${cat}`}
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-outfit text-sm capitalize text-ink/80 border border-bg"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded-sm checkbox-ink focus:ring-2 focus:ring-[color:var(--ink)]/30"
                                            checked={secondaryCategories.includes(cat)}
                                            onChange={() => setSecondaryCategories(c => toggleIn(c, cat))}
                                            disabled={lockSecondary}
                                        />
                                        <span>{cat.replace("-", " ")}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {currentFont && <LikeBar onLike={() => handleLike("fonts")} />}
            </div>
        );
    };

    return (
    <div className={`bg-light rounded-lg shadow-lg ${className}`}>

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
