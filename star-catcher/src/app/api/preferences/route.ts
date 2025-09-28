import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import UserPreferences from '@/models/UserPreferences';
import { PreferenceLearner } from '@/lib/preferences/preferenceLearner';

const PreferenceRequestSchema = z.object({
  action: z.enum(['get', 'update', 'learn', 'clear', 'updateThemes']),
  data: z.object({
    userId: z.string().optional(),
    userInput: z.string().optional(),
    feedback: z.enum(['like', 'dislike']).optional(),
    preferences: z.record(z.any()).optional(),
    themes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    styles: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Preferences API Route: Received request');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('🔵 Request body:', JSON.stringify(body, null, 2));
    
    const { action, data } = PreferenceRequestSchema.parse(body);
    console.log('🔵 Parsed action:', action);
    console.log('🔵 Parsed data:', JSON.stringify(data, null, 2));

    await dbConnect();

    let result;

    switch (action) {
      case 'get':
        console.log('🔵 Getting preferences...');
        
        const user = await User.findOne({ email: (session as any).user.email });
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Get preferences from UserPreferences collection
        const userPreferences = await UserPreferences.findOne({ userId: session.user.email });
        
        result = {
          success: true,
          preferences: userPreferences || {
            userId: session.user.email,
            styleKeywords: [],
            preferredColors: [],
            preferredThemes: [],
            componentPreferences: {},
            lastUpdated: Date.now()
          }
        };
        break;

      case 'learn':
        console.log('🔵 Learning from user input...');
        
        if (!data.userInput) {
          return NextResponse.json(
            { error: 'userInput is required for learn action' },
            { status: 400 }
          );
        }

        let userForLearning = await User.findOne({ email: session.user.email });
        if (!userForLearning) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Create a preference learner instance
        const learner = new PreferenceLearner(session.user.email);
        
        // Initialize preferences if they don't exist
        if (!userForLearning.preferences) {
          userForLearning.preferences = {
            styleKeywords: [] as any,
            preferredColors: [],
            preferredThemes: [] as any,
            componentPreferences: new Map(),
            lastUpdated: new Date()
          };
        }
        
        // Load existing preferences if they exist
        if (userForLearning.preferences) {
          learner.setPreferences(JSON.parse(JSON.stringify(userForLearning.preferences)));
        }
        
        // Learn from the user input
        learner.learnFromInput(data.userInput, data.feedback);
        
        // Save updated preferences to database
        const updatedPreferences = learner.getPreferences();
        
        // Clear and rebuild styleKeywords array
        userForLearning.preferences.styleKeywords = [] as any;
        updatedPreferences.styleKeywords.forEach(keyword => {
          userForLearning.preferences!.styleKeywords.push({
            keyword: keyword.keyword,
            category: keyword.category as any,
            weight: keyword.weight,
            usageCount: keyword.usageCount,
            lastUsed: new Date(keyword.lastUsed)
          });
        });
        
        userForLearning.preferences.preferredColors = updatedPreferences.preferredColors as any;
        userForLearning.preferences.preferredThemes = updatedPreferences.preferredThemes as any;
        
        // Convert componentPreferences object to Map
        const componentMap = new Map();
        Object.entries(updatedPreferences.componentPreferences).forEach(([key, value]) => {
          componentMap.set(key, value);
        });
        userForLearning.preferences.componentPreferences = componentMap;
        
        userForLearning.preferences.lastUpdated = new Date();
        await userForLearning.save();

        result = {
          success: true,
          message: 'Preferences learned from user input',
          learnedFrom: data.userInput,
          feedback: data.feedback,
          updatedPreferences: learner.getPreferences()
        };
        break;

      case 'update':
        console.log('🔵 Updating preferences...');
        
        if (!data.preferences) {
          return NextResponse.json(
            { error: 'preferences are required for update action' },
            { status: 400 }
          );
        }

        let userForUpdate = await User.findOne({ email: session.user.email });
        if (!userForUpdate) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Initialize preferences if they don't exist
        if (!userForUpdate.preferences) {
          userForUpdate.preferences = {
            styleKeywords: [] as any,
            preferredColors: [],
            preferredThemes: [] as any,
            componentPreferences: new Map(),
            lastUpdated: new Date()
          };
        }
        
        // Update preferences in database
        if (data.preferences) {
          if (data.preferences.styleKeywords) {
            userForUpdate.preferences.styleKeywords = data.preferences.styleKeywords as any;
          }
          if (data.preferences.preferredColors) {
            userForUpdate.preferences.preferredColors = data.preferences.preferredColors;
          }
          if (data.preferences.preferredThemes) {
            userForUpdate.preferences.preferredThemes = data.preferences.preferredThemes as any;
          }
          if (data.preferences.componentPreferences) {
            userForUpdate.preferences.componentPreferences = data.preferences.componentPreferences as any;
          }
        }
        userForUpdate.preferences.lastUpdated = new Date();
        await userForUpdate.save();

        result = {
          success: true,
          message: 'Preferences updated successfully',
          updatedPreferences: userForUpdate.preferences
        };
        break;

      case 'clear':
        console.log('🔵 Clearing preferences...');
        
        let userForClear = await User.findOne({ email: session.user.email });
        if (!userForClear) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Clear preferences in database
        userForClear.preferences!.styleKeywords = [] as any;
        userForClear.preferences!.preferredColors = [];
        userForClear.preferences!.preferredThemes = [] as any;
        userForClear.preferences!.componentPreferences = new Map();
        userForClear.preferences!.lastUpdated = new Date();
        await userForClear.save();

        result = {
          success: true,
          message: 'Preferences cleared successfully'
        };
        break;

      case 'updateThemes':
        console.log('🔵 Updating themes...');
        
        if (!data.userId) {
          return NextResponse.json(
            { error: 'userId is required for updateThemes action' },
            { status: 400 }
          );
        }

        let userForThemes = await User.findOne({ email: session.user.email });
        if (!userForThemes) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Initialize preferences if they don't exist
        if (!userForThemes.preferences) {
          userForThemes.preferences = {
            styleKeywords: [] as any,
            preferredColors: [],
            preferredThemes: [] as any,
            componentPreferences: new Map(),
            lastUpdated: new Date()
          };
        }

        // Update themes, colors, styles, and keywords
        if (data.themes && userForThemes.preferences) {
          userForThemes.preferences.preferredThemes = [
            ...new Set([...userForThemes.preferences.preferredThemes, ...data.themes])
          ] as any;
        }
        
        if (data.colors && userForThemes.preferences) {
          userForThemes.preferences.preferredColors = [
            ...new Set([...userForThemes.preferences.preferredColors, ...data.colors])
          ];
        }
        
        if ((data.styles || data.keywords) && userForThemes.preferences) {
          // Add styles and keywords as style keywords
          const newKeywords = [
            ...(data.styles || []).map(style => ({ keyword: style, category: 'component-style', weight: 0.7, usageCount: 1, lastUsed: new Date() })),
            ...(data.keywords || []).map(keyword => ({ keyword, category: 'theme', weight: 0.6, usageCount: 1, lastUsed: new Date() }))
          ];
          
          newKeywords.forEach(keyword => {
            userForThemes.preferences!.styleKeywords.push(keyword as any);
          });
        }

        if (userForThemes.preferences) {
          userForThemes.preferences.lastUpdated = new Date();
        }
        await userForThemes.save();

        result = {
          success: true,
          message: 'Themes updated successfully',
          updatedThemes: {
            themes: data.themes || [],
            colors: data.colors || [],
            styles: data.styles || [],
            keywords: data.keywords || []
          }
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    console.log('🔵 Returning successful response:', { success: true, action, result });
    return NextResponse.json({
      success: true,
      action,
      result
    });

  } catch (error) {
    console.error('❌ Preferences API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Preferences API endpoint',
    availableActions: ['get', 'update', 'learn', 'clear', 'updateThemes'],
    usage: 'POST with { action, data }',
  });
}
