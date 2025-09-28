import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    console.log('🔵 User Data API Route: Received request');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract the most recent color pairs (last 3)
    const recentColorPairs = user.colorPairs?.slice(-3) || [];
    
    // Extract the most recent font pairs (last 3)
    const recentFontPairs = user.fontPairs?.slice(-3) || [];

    const result = {
      success: true,
      data: {
        colorPairs: recentColorPairs,
        fontPairs: recentFontPairs,
        preferences: user.preferences || {
          styleKeywords: [],
          preferredColors: [],
          preferredThemes: [],
          componentPreferences: {},
          lastUpdated: Date.now()
        }
      }
    };

    console.log('🔵 Returning user data:', { 
      colorPairsCount: recentColorPairs.length, 
      fontPairsCount: recentFontPairs.length 
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ User Data API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
