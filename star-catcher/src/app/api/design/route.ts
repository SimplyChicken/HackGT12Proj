import { NextRequest, NextResponse } from 'next/server';
import { generateFontPairings } from '@/lib/tools/generateFontPairings';
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
          secondaryCategories: options.secondaryCategories || ['serif', 'sans-serif']
        });
        break;
        
      case 'color':
        // TODO: Implement color palette generation
        result = {
          primary: {
            name: 'Ocean Blue',
            value: '#2563eb',
            contrast: '#ffffff',
            usage: 'Primary actions and links'
          },
          secondary: {
            name: 'Forest Green',
            value: '#059669',
            contrast: '#ffffff',
            usage: 'Secondary actions and success states'
          },
          accent: {
            name: 'Sunset Orange',
            value: '#ea580c',
            contrast: '#ffffff',
            usage: 'Highlights and warnings'
          },
          neutral: {
            name: 'Slate Gray',
            value: '#64748b',
            contrast: '#ffffff',
            usage: 'Text and borders'
          },
          background: {
            name: 'Pure White',
            value: '#ffffff',
            contrast: '#000000',
            usage: 'Main background'
          },
          surface: {
            name: 'Light Gray',
            value: '#f8fafc',
            contrast: '#000000',
            usage: 'Card backgrounds'
          },
          text: {
            name: 'Dark Gray',
            value: '#1e293b',
            contrast: '#ffffff',
            usage: 'Primary text'
          },
          rationale: 'A modern, accessible color palette with high contrast ratios and professional appeal.'
        };
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
