'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { Type, Star } from 'lucide-react';

interface FontPair {
  case_id: string;
  primary: {
    name: string;
    googleFontUrl?: string;
    weight?: string;
    style?: string;
    usage?: string;
  };
  secondary: {
    name: string;
    googleFontUrl?: string;
    weight?: string;
    style?: string;
    usage?: string;
  };
}

interface FontPairing {
  heading: string;
  body: string;
  name: string;
}

const TopFonts = () => {
  const { data: session } = useSession();
  const [fontPairs, setFontPairs] = useState<FontPair[]>([]);
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
        setFontPairs(result.data.fontPairs || []);
        console.log('🔍 Set font pairs:', result.data.fontPairs);
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
    console.log('🔍 TopFonts useEffect - session:', session);
    
    if (!session?.user?.email) {
      console.log('🔍 No session or email, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('🔍 Session found, fetching user data for:', session.user.email);
    fetchUserData();
  }, [session?.user?.email, fetchUserData]);

  // Generate top 3 font pairings from user's saved font pairs
  const fontPairings = useMemo((): FontPairing[] => {
    if (!fontPairs || fontPairs.length === 0) {
      // Default font pairings if no saved fonts
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

    // Convert saved font pairs to display format
    const pairings: FontPairing[] = fontPairs
      .filter(pair => pair && (pair.primary || pair.secondary)) // Filter out invalid pairs
      .slice(-3)
      .map((pair, index) => ({
        heading: pair.primary?.name || 'Unknown Font',
        body: pair.secondary?.name || 'Unknown Font',
        name: `Saved ${index + 1}`
      }));

    return pairings;
  }, [fontPairs]);

  if (!session?.user?.email) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-gray/20">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-slate-gray" />
          <p className="text-xs text-slate-gray font-outfit">Sign in to see your saved fonts</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-slate-gray/20">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-space-cadet"></div>
          <p className="text-xs text-slate-gray font-outfit">Loading fonts...</p>
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
        <Type className="w-4 h-4 text-space-cadet" />
        <h4 className="text-sm font-medium text-space-cadet font-outfit">Your Top Fonts</h4>
      </div>
      <div className="space-y-2">
        {fontPairings.map((pairing, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-slate-gray/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-space-cadet font-outfit">{pairing.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-space-cadet" style={{ fontFamily: pairing.heading }}>
                  {pairing.heading}
                </p>
                <p className="text-xs text-slate-gray" style={{ fontFamily: pairing.body }}>
                  {pairing.body}
                </p>
              </div>
              <div className="text-xs text-slate-gray font-mono">
                <div className="text-right">
                  <div className="text-xs opacity-75">Heading</div>
                  <div className="text-xs opacity-75">Body</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFonts;
