'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GeneratorPanel from '@/components/ui/GeneratorPanel';
import { MemoryItem } from '@/lib/schemas';
import { Menu, Sparkles, Palette, Type } from 'lucide-react';
import Header from '@/components/ui/Header';

function DesignGeneratorContent() {
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  return (
    <div className="min-h-screen bg-eggshell">
      <Header onOpenMemories={() => setIsMemoriesOpen(true)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-space-cadet mb-4 font-poly">
            AI-Powered Design Generator
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto font-outfit">
            Generate beautiful font pairings and color palettes with the power of AI. 
            Create cohesive designs that work perfectly together.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Font Pairings Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-space-cadet rounded-lg flex items-center justify-center">
                <Type className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-space-cadet font-poly">Font Pairings</h3>
                <p className="text-slate-gray font-outfit">Generate beautiful typography combinations</p>
              </div>
            </div>
            <p className="text-slate-gray mb-6 font-outfit">
              Create harmonious font combinations that enhance readability and visual appeal. 
              Our AI considers contrast, style, and purpose to suggest perfect pairings.
            </p>
            <div className="space-y-2 text-sm text-slate-gray font-outfit">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                <span>Primary and secondary font selection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                <span>Google Fonts integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                <span>Usage recommendations</span>
              </div>
            </div>
          </div>

          {/* Color Palettes Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-gray rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-space-cadet font-poly">Color Palettes</h3>
                <p className="text-slate-gray font-outfit">Create cohesive color schemes</p>
              </div>
            </div>
            <p className="text-slate-gray mb-6 font-outfit">
              Generate professional color palettes with perfect contrast ratios and 
              accessibility considerations. Get primary, secondary, and accent colors.
            </p>
            <div className="space-y-2 text-sm text-slate-gray font-outfit">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-gray rounded-full"></div>
                <span>Primary and secondary colors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-gray rounded-full"></div>
                <span>Accessibility compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-gray rounded-full"></div>
                <span>Usage guidelines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generator Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20">
          <GeneratorPanel 
            memories={memories}
            setMemories={setMemories}
            isMemoriesOpen={isMemoriesOpen}
            setIsMemoriesOpen={setIsMemoriesOpen}
          />
        </div>

        </div>
      </main>
    </div>
  );
}

export default function DesignGenerator() {
  return <DesignGeneratorContent />;
}
