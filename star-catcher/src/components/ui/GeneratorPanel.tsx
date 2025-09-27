'use client';

import React, { useState, useCallback } from 'react';
import { FontPairing, ColorPalette, Component, MemoryItem } from '@/lib/schemas';
import { memorySystem } from '@/lib/memory';
import TypographyPreview from './TypographyPreview';
import PalettePreview from './PalettePreview';
import PreviewCanvas from './PreviewCanvas';
import LikeBar from './LikeBar';
import { Palette, Type, Component as ComponentIcon } from 'lucide-react';

type TabType = 'fonts' | 'colors' | 'components';

interface GeneratorPanelProps {
  className?: string;
}

export default function GeneratorPanel({ className = '' }: GeneratorPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('fonts');
  const [currentFont, setCurrentFont] = useState<FontPairing | null>(null);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette | null>(null);
  const [currentComponent, setCurrentComponent] = useState<Component | null>(null);
  const [componentType, setComponentType] = useState<string>('button');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'fonts' as TabType, label: 'Fonts', icon: Type },
    { id: 'colors' as TabType, label: 'Colors', icon: Palette },
    { id: 'components' as TabType, label: 'Components', icon: ComponentIcon },
  ];

  const generateDesign = useCallback(async (type: TabType, options: any = {}) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLike = useCallback((type: TabType) => {
    let currentData: any = null;
    
    if (type === 'fonts' && currentFont) {
      currentData = currentFont;
    } else if (type === 'colors' && currentPalette) {
      currentData = currentPalette;
    } else if (type === 'components' && currentComponent) {
      currentData = currentComponent;
    }

    if (currentData) {
      const memory = memorySystem.createMemoryFromData(
        type === 'fonts' ? 'font' : type === 'colors' ? 'color' : 'component',
        currentData
      );
      const feedback = memorySystem.createFeedbackFromMemory(memory, 'like');
      memorySystem.saveMemory(memory);
      memorySystem.saveFeedback(feedback);
    }
  }, [currentFont, currentPalette, currentComponent]);

  const handleDislike = useCallback((type: TabType) => {
    let currentData: any = null;
    
    if (type === 'fonts' && currentFont) {
      currentData = currentFont;
    } else if (type === 'colors' && currentPalette) {
      currentData = currentPalette;
    } else if (type === 'components' && currentComponent) {
      currentData = currentComponent;
    }

    if (currentData) {
      const memory = memorySystem.createMemoryFromData(
        type === 'fonts' ? 'font' : type === 'colors' ? 'color' : 'component',
        currentData
      );
      const feedback = memorySystem.createFeedbackFromMemory(memory, 'dislike');
      memorySystem.saveMemory(memory);
      memorySystem.saveFeedback(feedback);
    }
  }, [currentFont, currentPalette, currentComponent]);

  const renderContent = () => {
    switch (activeTab) {
      case 'fonts':
        return (
          <div className="space-y-6">
            <TypographyPreview fontPairing={currentFont} />
            {currentFont && (
              <LikeBar
                onLike={() => handleLike('fonts')}
                onDislike={() => handleDislike('fonts')}
              />
            )}
          </div>
        );
      case 'colors':
        return (
          <div className="space-y-6">
            <PalettePreview palette={currentPalette} />
            {currentPalette && (
              <LikeBar
                onLike={() => handleLike('colors')}
                onDislike={() => handleDislike('colors')}
              />
            )}
          </div>
        );
      case 'components':
        return (
          <div className="space-y-6">
            <PreviewCanvas component={currentComponent} />
            {currentComponent && (
              <LikeBar
                onLike={() => handleLike('components')}
                onDislike={() => handleDislike('components')}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Component Type Selector - Only show for components tab */}
        {activeTab === 'components' && (
          <div className="mb-4">
            <label htmlFor="componentType" className="block text-sm font-medium text-gray-700 mb-2">
              Component Type
            </label>
            <select
              id="componentType"
              value={componentType}
              onChange={(e) => setComponentType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="button">Button</option>
              <option value="navbar">Navbar</option>
              <option value="hero">Hero Section</option>
              <option value="footer">Footer</option>
              <option value="card">Card</option>
              <option value="modal">Modal</option>
              <option value="form">Form</option>
              <option value="badge">Badge</option>
              <option value="alert">Alert</option>
              <option value="breadcrumb">Breadcrumb</option>
              <option value="pagination">Pagination</option>
              <option value="tabs">Tabs</option>
              <option value="accordion">Accordion</option>
              <option value="dropdown">Dropdown</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>
        )}

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={() => generateDesign(activeTab, activeTab === 'components' ? { componentType } : {})}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              `Generate ${activeTab === 'fonts' ? 'Font Pairing' : activeTab === 'colors' ? 'Color Palette' : `${componentType} Component`}`
            )}
          </button>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}
