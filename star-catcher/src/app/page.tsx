'use client';

import React, { useState } from 'react';
import GeneratorPanel from '@/components/ui/GeneratorPanel';
import MemoriesDrawer from '@/components/ui/MemoriesDrawer';
import { MemoryItem } from '@/lib/schemas';
import Header from '@/components/ui/Header';

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
      <Header onOpenMemories={() => setIsMemoriesOpen(true)} />

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
    </div>
  );
}
