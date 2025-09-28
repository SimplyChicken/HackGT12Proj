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

  if (!session) {
    return (
      <div className={`flex items-center justify-center gap-4 p-4 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md">
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Sign up to save favorites</span>
        </div>
        <Link href="/accounts">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-4 p-4 rounded-lg ${className}`}>
      <button
        onClick={onLike}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-md transition-colors"
      >
        <Heart className="w-4 h-4" />
        <span className="text-sm font-medium"> Favorite </span>
      </button>
    </div>
  );
}
