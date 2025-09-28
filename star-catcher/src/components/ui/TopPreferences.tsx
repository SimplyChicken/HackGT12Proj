'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Palette, Type, Star } from 'lucide-react';

interface UserPreferences {
  preferredColors: string[];
  styleKeywords: Array<{
    keyword: string;
    category: string;
    weight: number;
    usageCount: number;
  }>;
  preferredThemes: string[];
  componentPreferences: Record<string, any>;
}

interface ColorCombo {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
}

interface FontPairing {
  heading: string;
  body: string;
  name: string;
}

const TopPreferences = () => {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPreferences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get',
          data: {}
        }),
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
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch preferences`);
      }

      const result = await response.json();
      console.log('🔍 Preferences API response:', result);
      
      if (result.success) {
        setPreferences(result.result.preferences);
        console.log('🔍 Set preferences:', result.result.preferences);
      } else {
        throw new Error(result.error || 'Failed to fetch preferences');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      
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
    console.log('🔍 TopPreferences useEffect - session:', session);
    
    if (!session?.user?.email) {
      console.log('🔍 No session or email, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('🔍 Session found, fetching preferences for:', session.user.email);
    fetchUserPreferences();
  }, [session?.user?.email, fetchUserPreferences]);

  // Generate top 3 color combinations from user's preferred colors
  const colorCombos = useMemo((): ColorCombo[] => {
    if (!preferences?.preferredColors || preferences.preferredColors.length === 0) {
      // Default color combinations if no preferences
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

    const colors = preferences.preferredColors;
    const combos: ColorCombo[] = [];

    // Generate combinations from user's colors
    for (let i = 0; i < Math.min(3, colors.length); i++) {
      const primary = colors[i];
      const secondary = colors[(i + 1) % colors.length] || colors[0];
      const accent = colors[(i + 2) % colors.length] || colors[1] || '#F59E0B';
      
      combos.push({
        primary,
        secondary,
        accent,
        name: `Custom ${i + 1}`
      });
    }

    return combos;
  }, [preferences?.preferredColors]);

  // Generate top 3 font pairings from user's preferences
  const fontPairings = useMemo((): FontPairing[] => {
    if (!preferences?.styleKeywords || preferences.styleKeywords.length === 0) {
      // Default font pairings if no preferences
      return [
        {
          heading: 'Inter',
          body: 'Inter',
          name: 'Modern Clean'
        },
        {
          heading: 'Playfair Display',
          body: 'Source Sans Pro',
          name: 'Elegant Serif'
        },
        {
          heading: 'Poppins',
          body: 'Open Sans',
          name: 'Friendly Sans'
        }
      ];
    }

    const fontKeywords = preferences.styleKeywords
      .filter(keyword => 
        keyword.category === 'typography' || 
        keyword.keyword.toLowerCase().includes('font') ||
        keyword.keyword.toLowerCase().includes('type')
      )
      .sort((a, b) => (b.weight * b.usageCount) - (a.weight * a.usageCount));

    const pairings: FontPairing[] = [];

    // Generate font pairings based on user preferences
    const headingFonts = ['Inter', 'Poppins', 'Playfair Display', 'Montserrat', 'Roboto'];
    const bodyFonts = ['Inter', 'Source Sans Pro', 'Open Sans', 'Lato', 'Roboto'];

    for (let i = 0; i < 3; i++) {
      const heading = fontKeywords[i]?.keyword || headingFonts[i % headingFonts.length];
      const body = bodyFonts[i % bodyFonts.length];
      
      pairings.push({
        heading,
        body,
        name: `Style ${i + 1}`
      });
    }

    return pairings;
  }, [preferences?.styleKeywords]);

  if (!session?.user?.email) {
    return (
      <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-eggshell to-slate-gray/10 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Star className="w-8 h-8 text-slate-gray mx-auto mb-2" />
            <p className="text-sm text-slate-gray font-outfit">Sign in to see your saved preferences</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-eggshell to-slate-gray/10 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-space-cadet"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-eggshell to-slate-gray/10 p-4">
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-red-500 font-outfit">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-4 h-4 text-space-cadet" />
        <h4 className="text-sm font-medium text-space-cadet font-outfit">Style Keywords</h4>
      </div>
      <div className="space-y-1">
        {preferences?.styleKeywords && preferences.styleKeywords.length > 0 ? (
          preferences.styleKeywords
            .sort((a, b) => (b.weight * b.usageCount) - (a.weight * a.usageCount))
            .slice(0, 3)
            .map((keyword, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-gray/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-space-cadet font-outfit">{keyword.keyword}</span>
                    <span className="text-xs text-slate-gray font-outfit capitalize bg-slate-gray/10 px-1.5 py-0.5 rounded">
                      {keyword.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-gray bg-slate-gray/10 px-1.5 py-0.5 rounded-full font-outfit">
                    {keyword.usageCount}x
                  </span>
                </div>
              </div>
            ))
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-gray/20">
            <p className="text-xs text-slate-gray font-outfit">No style preferences yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPreferences;
