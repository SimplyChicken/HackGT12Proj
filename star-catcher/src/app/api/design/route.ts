import { NextRequest, NextResponse } from 'next/server';
import { designAgent } from '@/lib/mastra/agent';
import { DesignResponseSchema, MemoryItemSchema } from '@/lib/schemas';
import { z } from 'zod';

const RequestSchema = z.object({
  type: z.enum(['font', 'color', 'component']),
  options: z.record(z.any()).optional(),
  memories: z.array(MemoryItemSchema).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, options = {}, memories = [] } = RequestSchema.parse(body);

    // Update agent with user memories for personalized recommendations
    if (memories.length > 0) {
      designAgent.setMemories(memories);
    }

    // Generate the design using the agent
    const result = await designAgent.generate(type, options);

    const response = {
      type,
      data: result,
    };

    // Validate response against schema
    const validatedResponse = DesignResponseSchema.parse(response);

    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Design API endpoint',
    availableTypes: ['font', 'color', 'component'],
    usage: 'POST with { type, options?, memories? }',
  });
}
