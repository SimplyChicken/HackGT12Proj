import { NextRequest, NextResponse } from 'next/server';
import { generateFontPairings } from '@/lib/tools/generateFontPairings';
import { generateTrio } from '@/lib/tools/generateColors';
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

    let result;
    
    switch (type) {
      case 'font':
        // Use the generateFontPairings function directly
        result = await generateFontPairings({
          purpose: options.purpose || 'website',
          primaryCategories: options.primaryCategories || ['serif', 'sans-serif'],
          secondaryCategories: options.secondaryCategories || ['serif', 'sans-serif'],
            ...options,
        });
        break;
        
      case 'color':
        result = await generateTrio();
        break;
        
      case 'component':
        // TODO: Implement component generation
        result = {
          type: 'button',
          name: 'Button',
          code: `import React from 'react';

const Button = () => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Click me
    </button>
  );
};

export default Button;`,
          description: 'A simple, clean button component ready for customization',
          props: {
            variant: ['primary', 'secondary', 'outline', 'ghost'],
            size: ['sm', 'md', 'lg']
          }
        };
        break;
        
      default:
        throw new Error(`Unknown type: ${type}`);
    }

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
