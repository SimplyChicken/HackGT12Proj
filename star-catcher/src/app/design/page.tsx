'use client';

import React, { useState } from 'react';
import GeneratorPanel from '@/components/ui/GeneratorPanel';
import { MemoryItem } from '@/lib/schemas';
import Header from '@/components/ui/Header';

function DesignGeneratorContent() {
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  return (
    <div className="min-h-screen bg-page">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4">

        {/* Generator Panel */}
        <div className="bg-light rounded-b-3xl shadow-sm border border-slate-gray/20">
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
