'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface LikeBarProps {
  onLike: () => void;
  onDislike: () => void;
  className?: string;
}

export default function LikeBar({ onLike, onDislike, className = '' }: LikeBarProps) {
  return (
    <div className={`flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg ${className}`}>
      <button
        onClick={onLike}
        className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-sm font-medium">👍 Like</span>
      </button>
      
      <button
        onClick={onDislike}
        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="text-sm font-medium">👎 Dislike</span>
      </button>
    </div>
  );
}
