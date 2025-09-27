'use client';

import React, { useState } from 'react';
import GeneratorPanel from '@/components/ui/GeneratorPanel';
import MemoriesDrawer from '@/components/ui/MemoriesDrawer';
import { MemoryItem } from '@/lib/schemas';
import { Menu, Sparkles } from 'lucide-react';

export default function Home() {
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);

  const handleApplyMemory = (memory: MemoryItem) => {
    // In a real app, you'd apply the memory to the current generation
    console.log('Applying memory:', memory);
    setIsMemoriesOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Star Catcher</h1>
            </div>
            
            <button
              onClick={() => setIsMemoriesOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Menu className="w-4 h-4" />
              Memories
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Design Generator
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate beautiful font pairings, accessible color palettes, and production-ready components 
            powered by Mastra AI. Your preferences are remembered to create personalized recommendations.
          </p>
        </div>

        <GeneratorPanel className="max-w-4xl mx-auto" />
      </main>

      {/* Memories Drawer */}
      <MemoriesDrawer
        isOpen={isMemoriesOpen}
        onClose={() => setIsMemoriesOpen(false)}
        onApplyMemory={handleApplyMemory}
      />
    </div>
  );
}
