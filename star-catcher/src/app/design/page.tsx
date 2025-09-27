'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GeneratorPanel from '@/components/ui/GeneratorPanel';
import { MemoryItem } from '@/lib/schemas';
import { Menu, Sparkles, Palette, Type } from 'lucide-react';

function DesignGeneratorContent() {
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Design Generator</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/accounts">
                <button
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Sign in
                </button>
              </Link>
              <button
                onClick={() => setIsMemoriesOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Menu className="w-4 h-4" />
                Memories
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Design Generator
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate beautiful font pairings and color palettes with the power of AI. 
            Create cohesive designs that work perfectly together.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Font Pairings Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Type className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Font Pairings</h3>
                <p className="text-gray-600">Generate beautiful typography combinations</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Create harmonious font combinations that enhance readability and visual appeal. 
              Our AI considers contrast, style, and purpose to suggest perfect pairings.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Primary and secondary font selection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Google Fonts integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Usage recommendations</span>
              </div>
            </div>
          </div>

          {/* Color Palettes Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Color Palettes</h3>
                <p className="text-gray-600">Create cohesive color schemes</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Generate professional color palettes with perfect contrast ratios and 
              accessibility considerations. Get primary, secondary, and accent colors.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Primary and secondary colors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Accessibility compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Usage guidelines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generator Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <GeneratorPanel 
            memories={memories}
            setMemories={setMemories}
            isMemoriesOpen={isMemoriesOpen}
            setIsMemoriesOpen={setIsMemoriesOpen}
          />
        </div>
      </main>
    </div>
  );
}

export default function DesignGenerator() {
  return <DesignGeneratorContent />;
}
