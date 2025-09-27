'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface LikeBarProps {
  onLike: () => void;
  onDislike: () => void;
  className?: string;
}

export default function LikeBar({ onLike, onDislike, className = '' }: LikeBarProps) {
  return (
    <div className={`flex items-center justify-center gap-4 p-4 rounded-lg ${className}`}>
      <button
        onClick={onLike}
        className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors"
      >
        <Heart className="w-4 h-4" />
        <span className="text-sm font-medium"> Favorite </span>
      </button>
    </div>
  );
}
