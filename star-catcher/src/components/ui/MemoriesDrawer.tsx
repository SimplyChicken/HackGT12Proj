'use client';

import React, { useState, useEffect } from 'react';
import { MemoryItem, Feedback } from '@/lib/schemas';
import { memorySystem } from '@/lib/memory';
import { X, Heart, HeartOff, Clock, Palette, Type, Component as ComponentIcon } from 'lucide-react';

interface MemoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMemory?: (memory: MemoryItem) => void;
}

export default function MemoriesDrawer({ isOpen, onClose, onApplyMemory }: MemoriesDrawerProps) {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'liked' | 'disliked' | 'all'>('liked');

  useEffect(() => {
    if (isOpen) {
      setMemories(memorySystem.getMemories());
      setFeedbacks(memorySystem.getFeedbacks());
    }
  }, [isOpen]);

  const likedMemories = memories.filter(memory => 
    feedbacks.some(feedback => feedback.id === memory.id && feedback.action === 'like')
  );

  const dislikedMemories = memories.filter(memory => 
    feedbacks.some(feedback => feedback.id === memory.id && feedback.action === 'dislike')
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'font':
        return Type;
      case 'color':
        return Palette;
      case 'component':
        return ComponentIcon;
      default:
        return Clock;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMemoryTitle = (memory: MemoryItem) => {
    switch (memory.type) {
      case 'font':
        const fontData = memory.data as any;
        return `${fontData.primary.name} + ${fontData.secondary.name}`;
      case 'color':
        const colorData = memory.data as any;
        return colorData.primary.name;
      case 'component':
        const componentData = memory.data as any;
        return componentData.name;
      default:
        return 'Unknown';
    }
  };

  const getMemoryDescription = (memory: MemoryItem) => {
    switch (memory.type) {
      case 'font':
        const fontData = memory.data as any;
        return fontData.rationale;
      case 'color':
        const colorData = memory.data as any;
        return colorData.rationale;
      case 'component':
        const componentData = memory.data as any;
        return componentData.description;
      default:
        return '';
    }
  };

  const renderMemoryItem = (memory: MemoryItem) => {
    const Icon = getTypeIcon(memory.type);
    const title = getMemoryTitle(memory);
    const description = getMemoryDescription(memory);
    const isLiked = feedbacks.some(f => f.id === memory.id && f.action === 'like');
    const isDisliked = feedbacks.some(f => f.id === memory.id && f.action === 'dislike');

    return (
      <div key={memory.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{title}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {memory.type}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(memory.timestamp)}
                </span>
                {isLiked && <Heart className="w-3 h-3 text-green-500" />}
                {isDisliked && <HeartOff className="w-3 h-3 text-red-500" />}
              </div>
            </div>
          </div>
          
          {onApplyMemory && (
            <button
              onClick={() => onApplyMemory(memory)}
              className="ml-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'liked':
        return likedMemories.length > 0 ? (
          <div className="space-y-3">
            {likedMemories.map(renderMemoryItem)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No liked items yet</p>
            <p className="text-sm">Like some designs to see them here</p>
          </div>
        );
      
      case 'disliked':
        return dislikedMemories.length > 0 ? (
          <div className="space-y-3">
            {dislikedMemories.map(renderMemoryItem)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <HeartOff className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No disliked items</p>
            <p className="text-sm">Your feedback helps improve recommendations</p>
          </div>
        );
      
      case 'all':
        return memories.length > 0 ? (
          <div className="space-y-3">
            {memories.map(renderMemoryItem)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No saved items yet</p>
            <p className="text-sm">Generate designs to build your collection</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Design Memories</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'liked'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Liked ({likedMemories.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('disliked')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'disliked'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <HeartOff className="w-4 h-4" />
                Disliked ({dislikedMemories.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                All ({memories.length})
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderContent()}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Your preferences help improve future recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
