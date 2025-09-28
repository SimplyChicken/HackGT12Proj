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
    componentType: z.enum(['button', 'navbar', 'hero', 'card', 'footer']).optional(),
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
        
        // Import the Mastra server to get the component agent
        const { componentAgent } = await import('@/lib/mastra/server');
        console.log('🔵 Using Mastra componentAgent');
        
        // Create a prompt for the agent to customize the component
        const prompt = `Customize this ${data.componentType || 'button'} component based on the user's requirements.

Base Component Code:
\`\`\`javascript
${data.baseCode}
\`\`\`

User Requirements: "${data.userInput}"

User Preferences: ${JSON.stringify(data.preferences || {}, null, 2)}

CRITICAL IFRAME COMPATIBILITY REQUIREMENTS - MUST FOLLOW ALL RULES:
This component will run in an iframe environment with React UMD + Babel standalone. You MUST ensure compatibility:

1. CODE FORMAT:
   - Use plain JavaScript with JSX, NOT TypeScript
   - NO type annotations, interfaces, or TypeScript syntax
   - NO "as" type assertions or generics
   - NO import/export statements - use plain function declarations

2. COMPONENT STRUCTURE:
   - Must be a plain function component: function Navbar() { ... }
   - NO export default or export statements
   - NO import statements (React hooks are available globally)
   - Use React hooks directly: const [state, setState] = useState(false)

3. STYLING:
   - Use Tailwind CSS classes only
   - NO CSS modules, SCSS, or styled-components
   - Use inline style={{}} if needed for dynamic styles

4. ICONS:
   - Use inline SVG elements instead of icon libraries
   - NO external icon imports (lucide-react, etc.)
   - Example: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">...</svg>

5. REACT FEATURES:
   - useState, useEffect, and other React hooks are allowed
   - Event handlers (onClick, onChange) are allowed
   - Conditional rendering with && and ternary operators is allowed
   - Use <a> tags instead of Next.js <Link>
   - Use <img src="https://..."> with full URLs for images

6. EXAMPLES OF CORRECT FORMAT:
   function Navbar() {
     const [isOpen, setIsOpen] = useState(false);
     return (
       <nav className="bg-white shadow-sm">
         <button onClick={() => setIsOpen(!isOpen)}>
           <svg className="w-6 h-6">...</svg>
         </button>
       </nav>
     );
   }

CRITICAL STRUCTURE PRESERVATION RULES - MUST FOLLOW:
- KEEP the exact same function structure: function Navbar() { return (...) }
- KEEP the exact same JSX structure: <nav><div><div>...</div></div></nav>
- DO NOT include any mounting code (createRoot, render) - the iframe handles mounting
- ONLY modify colors, text content, styling classes, and simple content
- DO NOT add mobile menus, state management, or complex functionality
- DO NOT change the overall layout or component hierarchy
- ONLY customize what the user specifically requests (colors, text, styling)

Please analyze the base code and user requirements, then return the complete customized React component code that fully implements the user's request while preserving the exact structure above. Return only the React component code without explanations, following ALL the iframe compatibility and structure preservation rules above.`;

        // Call the Mastra agent using generate method
        const agentResult = await componentAgent.generateVNext(prompt);
        
        console.log('🔵 Agent result:', JSON.stringify(agentResult, null, 2));

        // Extract the customized code from the agent's response
        if (agentResult.text) {
          let customizedCode = agentResult.text.trim();
          // Clean up the response to ensure it's valid React code
          customizedCode = customizedCode.replace(/```typescript\n?/g, '').replace(/```\n?/g, '').trim();
          
          result = {
            success: true,
            customizedCode,
            description: `Customized ${data.componentType || 'button'} based on: "${data.userInput}"`,
            features: [
              'AI-powered customization via Mastra agent',
              'Tailwind CSS styling',
              'Dynamic user requirements',
              'Production ready'
            ]
          };
          console.log('✅ Component customization successful, result:', result);
        } else {
          result = {
            success: false,
            error: 'No code generated from Mastra agent'
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
