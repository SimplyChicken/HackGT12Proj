'use client';

import React from 'react';
import { Heart, UserPlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface LikeBarProps {
  onLike: () => void;
  className?: string;
}

export default function LikeBar({ onLike, className = '' }: LikeBarProps) {
  const { data: session } = useSession();

  if (session) {
      return (
          <div className={`flex items-center justify-center gap-4 p-4 rounded-lg ${className}`}>
              <button
                  onClick={onLike}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-ink rounded-md transition-colors "
              >
                  <Heart className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white"> Favorite </span>
              </button>
          </div>
      );
  }

}
