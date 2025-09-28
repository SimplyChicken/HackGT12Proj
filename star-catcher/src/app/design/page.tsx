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

        {/* Generator Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
