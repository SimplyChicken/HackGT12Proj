import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Force Node.js runtime to avoid Edge runtime issues with Mastra
export const runtime = 'nodejs';



const RequestSchema = z.object({
  action: z.enum(['customizeComponent', 'chat']),
  data: z.object({
    baseCode: z.string().optional(),
    userInput: z.string().optional(),
    preferences: z.record(z.any()).optional(),
    message: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Mastra API Route: Received request');
    
    const body = await request.json();
    console.log('🔵 Request body:', JSON.stringify(body, null, 2));
    
    const { action, data } = RequestSchema.parse(body);
    console.log('🔵 Parsed action:', action);
    console.log('🔵 Parsed data:', JSON.stringify(data, null, 2));

    let result;

    switch (action) {
      case 'customizeComponent':
        console.log('🔵 Processing customizeComponent action');
        
        if (!data.baseCode) {
          console.error('❌ Missing baseCode');
          return NextResponse.json(
            { error: 'baseCode is required for customizeComponent action' },
            { status: 400 }
          );
        }
        if (!data.userInput) {
          console.error('❌ Missing userInput');
          return NextResponse.json(
            { error: 'userInput is required for customizeComponent action' },
            { status: 400 }
          );
        }

        console.log('🔵 Calling Mastra agent...');
        console.log('🔵 MASTRA FRAMEWORK: Loading componentAgent from Mastra server...');
        
        // Use the existing generateComponent function directly
        const { generateComponent } = await import('@/lib/tools/generateComponent');
        console.log('🔵 Using generateComponent function directly');
        
        // Call the generateComponent function
        const componentResult = await generateComponent({
          componentType: 'button',
          userInput: data.userInput,
          preferences: data.preferences,
          baseCode: data.baseCode
        });
        
        const agentResult = {
          text: componentResult.code,
          success: true
        };
        
        console.log('🔵 Agent result:', JSON.stringify(agentResult, null, 2));

        // Extract the customized code from the agent's text response
        if (agentResult.text) {
          let customizedCode = agentResult.text.trim();
          // Clean up the response to ensure it's valid React code
          customizedCode = customizedCode.replace(/```typescript\n?/g, '').replace(/```\n?/g, '').trim();
          
          result = {
            success: true,
            customizedCode,
            description: `Customized button based on: "${data.userInput}"`,
            features: [
              'AI-powered customization via generateComponent',
              'Tailwind CSS styling',
              'Dynamic user requirements',
              'Production ready'
            ]
          };
          console.log('✅ Component customization successful, result:', result);
        } else {
          result = {
            success: false,
            error: 'No code generated from generateComponent function'
          };
        }
        break;

      case 'chat':
        if (!data.message && !data.userInput) {
          return NextResponse.json(
            { error: 'message or userInput is required for chat action' },
            { status: 400 }
          );
        }
        
        // For now, return a simple response for chat
        result = {
          success: true,
          response: `I received your message: "${data.message || data.userInput}". I'm a component customization assistant. Please use the customizeComponent action to customize React components.`,
          toolCalls: []
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
    console.error('❌ Mastra API Error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Mastra API endpoint',
    availableActions: ['customizeComponent', 'chat'],
    usage: 'POST with { action, data }',
  });
}
