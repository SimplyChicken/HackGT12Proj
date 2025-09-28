import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import getServerSession from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
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
    if (!(session as any)?.user?.email) {
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

        result = {
          success: true,
          preferences: user.preferences || {
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

        let userForLearning = await User.findOne({ email: (session as any).user.email });
        if (!userForLearning) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Create a preference learner instance
        const learner = new PreferenceLearner((session as any).user.email);
        
        // Load existing preferences if they exist
        if (userForLearning.preferences) {
          learner.setPreferences(userForLearning.preferences);
        }
        
        // Learn from the user input
        learner.learnFromInput(data.userInput, data.feedback);
        
        // Save updated preferences to database
        userForLearning.preferences = learner.getPreferences();
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

        let userForUpdate = await User.findOne({ email: (session as any).user.email });
        if (!userForUpdate) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Update preferences in database
        userForUpdate.preferences = {
          ...userForUpdate.preferences,
          ...data.preferences,
          lastUpdated: Date.now()
        };
        await userForUpdate.save();

        result = {
          success: true,
          message: 'Preferences updated successfully',
          updatedPreferences: userForUpdate.preferences
        };
        break;

      case 'clear':
        console.log('🔵 Clearing preferences...');
        
        let userForClear = await User.findOne({ email: (session as any).user.email });
        if (!userForClear) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Clear preferences in database
        userForClear.preferences = {
          styleKeywords: [],
          preferredColors: [],
          preferredThemes: [],
          componentPreferences: {},
          lastUpdated: Date.now()
        };
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

        let userForThemes = await User.findOne({ email: (session as any).user.email });
        if (!userForThemes) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        // Initialize preferences if they don't exist
        if (!userForThemes.preferences) {
          userForThemes.preferences = {
            styleKeywords: [],
            preferredColors: [],
            preferredThemes: [],
            componentPreferences: {},
            lastUpdated: Date.now()
          };
        }

        // Update themes, colors, styles, and keywords
        if (data.themes) {
          userForThemes.preferences.preferredThemes = [
            ...new Set([...userForThemes.preferences.preferredThemes, ...data.themes])
          ];
        }
        
        if (data.colors) {
          userForThemes.preferences.preferredColors = [
            ...new Set([...userForThemes.preferences.preferredColors, ...data.colors])
          ];
        }
        
        if (data.styles || data.keywords) {
          // Add styles and keywords as style keywords
          const newKeywords = [
            ...(data.styles || []).map(style => ({ keyword: style, category: 'component-style', weight: 0.7, usageCount: 1, lastUsed: Date.now() })),
            ...(data.keywords || []).map(keyword => ({ keyword, category: 'theme', weight: 0.6, usageCount: 1, lastUsed: Date.now() }))
          ];
          
          userForThemes.preferences.styleKeywords = [
            ...userForThemes.preferences.styleKeywords,
            ...newKeywords
          ];
        }

        userForThemes.preferences.lastUpdated = Date.now();
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
