'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Palette, Star } from 'lucide-react';

interface ColorPair {
  case_id: string;
  primary: {
    name: string;
    value: string;
    contrast: string;
  };
  secondary: {
    name: string;
    value: string;
    contrast: string;
  };
  accent: {
    name: string;
    value: string;
    contrast: string;
  };
}

interface ColorCombo {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
}

const TopColors = () => {
  const { data: session } = useSession();
  const [colorPairs, setColorPairs] = useState<ColorPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response ok:', response.ok);
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          // User not authenticated - this is expected for non-signed-in users
          console.log('🔍 401 error - user not authenticated');
          setLoading(false);
          return;
        }
        
        console.log('🔍 Non-401 error, status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.log('🔍 Error data:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch user data`);
      }

      const result = await response.json();
      console.log('🔍 User data API response:', result);
      
      if (result.success) {
        setColorPairs(result.data.colorPairs || []);
        console.log('🔍 Set color pairs:', result.data.colorPairs);
      } else {
        throw new Error(result.error || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error
        setError('Network error - please check your connection');
      } else if (error instanceof Error) {
        // Only set error for actual failures, not authentication issues
        if (!error.message.includes('401') && !error.message.includes('Authentication required')) {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('🔍 TopColors useEffect - session:', session);
    
    if (!session?.user?.email) {
      console.log('🔍 No session or email, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('🔍 Session found, fetching user data for:', session.user.email);
    fetchUserData();
  }, [session?.user?.email, fetchUserData]);


  // Generate top 3 color combinations from user's saved color pairs
  const colorCombos = useMemo((): ColorCombo[] => {
    if (!colorPairs || colorPairs.length === 0) {
      // Default color combinations if no saved colors
      return [
        {
          primary: '#3B82F6',
          secondary: '#1E40AF', 
          accent: '#F59E0B',
          name: 'Ocean Blue'
        },
        {
          primary: '#10B981',
          secondary: '#059669',
          accent: '#F59E0B',
          name: 'Forest Green'
        },
        {
          primary: '#8B5CF6',
          secondary: '#7C3AED',
          accent: '#EC4899',
          name: 'Purple Dream'
        }
      ];
    }

    // Convert saved color pairs to display format
    const combos: ColorCombo[] = colorPairs.slice(-3).map((pair, index) => ({
      primary: pair.primary.value,
      secondary: pair.secondary.value,
      accent: pair.accent.value,
      name: `Saved ${index + 1}`
    }));

    return combos;
  }, [colorPairs]);

  if (!session?.user?.email) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-gray/20">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-slate-gray" />
          <p className="text-xs text-slate-gray font-outfit">Sign in to see your saved colors</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-gray/20">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-space-cadet"></div>
          <p className="text-xs text-slate-gray font-outfit">Loading colors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-gray/20">
        <div className="flex items-center gap-2">
          <p className="text-xs text-red-500 font-outfit">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-space-cadet" />
        <h4 className="text-sm font-medium text-space-cadet font-outfit">Your Top Colors</h4>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {colorCombos.map((combo, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-gray/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-space-cadet font-outfit">{combo.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-md overflow-hidden shadow-sm border border-slate-gray/20">
                <div 
                  className="w-6 h-6" 
                  style={{ backgroundColor: combo.primary }}
                  title={`Primary: ${combo.primary}`}
                />
                <div 
                  className="w-6 h-6" 
                  style={{ backgroundColor: combo.secondary }}
                  title={`Secondary: ${combo.secondary}`}
                />
                <div 
                  className="w-6 h-6" 
                  style={{ backgroundColor: combo.accent }}
                  title={`Accent: ${combo.accent}`}
                />
              </div>
              <div className="flex-1 text-xs text-slate-gray font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-xs hover:text-space-cadet transition-colors cursor-pointer" title="Click to copy" onClick={() => navigator.clipboard.writeText(combo.primary)}>{combo.primary}</span>
                  <span className="text-slate-gray/50">•</span>
                  <span className="text-xs hover:text-space-cadet transition-colors cursor-pointer" title="Click to copy" onClick={() => navigator.clipboard.writeText(combo.secondary)}>{combo.secondary}</span>
                  <span className="text-slate-gray/50">•</span>
                  <span className="text-xs hover:text-space-cadet transition-colors cursor-pointer" title="Click to copy" onClick={() => navigator.clipboard.writeText(combo.accent)}>{combo.accent}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopColors;
