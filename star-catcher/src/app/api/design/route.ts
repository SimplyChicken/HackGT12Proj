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
        try {
          result = await generateFontPairings({
            purpose: options.purpose || 'website',
            primaryCategories: options.primaryCategories || ['serif', 'sans-serif'],
            secondaryCategories: options.secondaryCategories || ['serif', 'sans-serif'],
              ...options,
          });
          console.log('Font generation successful:', result);
        } catch (fontError) {
          console.error('Font generation failed:', fontError);
          // Fallback to proper new format
          result = {
            primary: {
              name: 'Arial',
              googleFontUrl: 'https://fonts.googleapis.com/css2?family=Arial:wght@400&display=swap',
              weight: '400',
              style: 'normal',
              usage: 'Use for headings and titles',
            },
            secondary: {
              name: 'Helvetica',
              googleFontUrl: 'https://fonts.googleapis.com/css2?family=Helvetica:wght@400&display=swap',
              weight: '400',
              style: 'normal',
              usage: 'Use for body text and supporting content',
            }
          };
        }
        break;
        
      case 'color':
        try {
          result = await generateTrio();
          console.log('Color generation successful:', result);
        } catch (colorError) {
          console.error('Color generation failed:', colorError);
          // Fallback to simple color trio
          result = {
            primary: { value: '#3B82F6', contrast: '#FFFFFF' },
            secondary: { value: '#F3F4F6', contrast: '#000000' },
            accent: { value: '#EF4444', contrast: '#FFFFFF' }
          };
        }
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

    console.log('Design API response before validation:', response);

    // Validate response against schema
    const validatedResponse = DesignResponseSchema.parse(response);

    console.log('Design API validated response:', validatedResponse);

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
