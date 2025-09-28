import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const PreferenceRequestSchema = z.object({
  action: z.enum(['get', 'update', 'learn', 'clear']),
  data: z.object({
    userId: z.string().optional(),
    userInput: z.string().optional(),
    feedback: z.enum(['like', 'dislike']).optional(),
    preferences: z.record(z.any()).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Preferences API Route: Received request');
    
    const body = await request.json();
    console.log('🔵 Request body:', JSON.stringify(body, null, 2));
    
    const { action, data } = PreferenceRequestSchema.parse(body);
    console.log('🔵 Parsed action:', action);
    console.log('🔵 Parsed data:', JSON.stringify(data, null, 2));

    let result;

    switch (action) {
      case 'get':
        console.log('🔵 Getting preferences...');
        
        // For now, return empty preferences since we're using localStorage on client side
        // In a real app, you'd fetch from database using userId
        result = {
          success: true,
          preferences: {
            styleKeywords: [],
            preferredColors: [],
            preferredThemes: [],
            componentPreferences: {}
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

        // In a real app, you'd save to database here
        // For now, we'll just return success since the client-side memory system handles it
        result = {
          success: true,
          message: 'Preferences learned from user input',
          learnedFrom: data.userInput,
          feedback: data.feedback
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

        // In a real app, you'd update the database here
        result = {
          success: true,
          message: 'Preferences updated successfully',
          updatedPreferences: data.preferences
        };
        break;

      case 'clear':
        console.log('🔵 Clearing preferences...');
        
        // In a real app, you'd clear from database here
        result = {
          success: true,
          message: 'Preferences cleared successfully'
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
    availableActions: ['get', 'update', 'learn', 'clear'],
    usage: 'POST with { action, data }',
  });
}
