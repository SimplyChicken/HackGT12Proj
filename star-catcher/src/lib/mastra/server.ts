import { Mastra } from "@mastra/core/mastra";
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { memorySystem } from "../memory";

// Tool for extracting themes and keywords from user input
const extractThemesTool = createTool({
  id: "extractThemesTool",
  description: "Extract design themes and keywords from user input and store them in user preferences",
  inputSchema: z.object({
    userInput: z.string().describe('The user input to analyze for themes and keywords'),
    userId: z.string().optional().describe('User ID for storing preferences (optional)')
  }),
  execute: async (context: any) => {
    const { userInput, userId } = context;
    
    try {
      console.log('🟡 ExtractThemes tool executing with:', { userInput, userId });
      
      // Use OpenAI to extract themes from user input
      const openaiClient = openai("gpt-4o-mini");
      
      const themeExtractionPrompt = `Analyze the following user input and extract design themes, style preferences, and keywords. Return a JSON object with the following structure:

{
  "themes": ["theme1", "theme2", "theme3"],
  "colors": ["color1", "color2"],
  "styles": ["style1", "style2"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
If you can't fulfill any of these keywords, you don't have to. If it is clear, then add it.

User Input: "${userInput}"

Focus on:
- Design themes (modern, minimal, bold, elegant, playful, corporate, etc.)
- Color preferences (specific colors mentioned or implied)
- Style preferences (rounded, sharp, shadowed, flat, etc.)
- General keywords that describe their aesthetic preferences

Return only the JSON object, no other text.`;

      const response = await openaiClient.doGenerate({
        prompt: [{ role: 'user', content: [{ type: 'text', text: themeExtractionPrompt }] }]
      });
      const extractedText = response.content[0].type === 'text' ? response.content[0].text.trim() : '';
      
      // Parse the JSON response
      let extractedThemes;
      try {
        // Clean up the response to extract just the JSON
        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedThemes = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('🟡 Error parsing theme extraction response:', parseError);
        // Fallback to basic extraction
        extractedThemes = {
          themes: [],
          colors: [],
          styles: [],
          keywords: []
        };
      }
      
      console.log('🟡 Extracted themes:', extractedThemes);
      
      // Store the extracted themes in user preferences
      if (userId) {
        // Store in user's account preferences
        try {
          await fetch('/api/preferences', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'updateThemes',
              data: {
                userId,
                themes: extractedThemes.themes,
                colors: extractedThemes.colors,
                styles: extractedThemes.styles,
                keywords: extractedThemes.keywords
              }
            }),
          });
        } catch (error) {
          console.error('🟡 Error storing themes to user account:', error);
        }
      }
      
      // Memory system no longer handles user input learning
    
    return {
      success: true,
        extractedThemes,
        message: 'Themes extracted and stored successfully'
    };
  } catch (error) {
      console.error('🟡 ExtractThemes tool error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
  }
});

// Create the Component Agent using Mastra
console.log('🟢 Initializing Mastra Component Agent...');
console.log('🟢 OpenAI API Key available:', !!process.env.OPENAI_API_KEY);

const componentAgent = new Agent({
  name: "ComponentAgent",
  instructions: `
    You are an expert React component customizer powered by the Mastra AI framework.

    Your role:
    - Execute any user request, no matter how complex or unusual
    - Transform React components (buttons, navbars, heroes, cards, footers) based on natural language instructions
    - Implement any styling, functionality, or behavior requested
    - Use Tailwind CSS for styling
    - Maintain clean, production-ready React code

    CRITICAL COMPATIBILITY REQUIREMENTS - MUST FOLLOW ALL RULES:
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

    CRITICAL STRUCTURE PRESERVATION RULES - MUST FOLLOW:
    - KEEP the exact same function structure: function Navbar() { return (...) }
    - KEEP the exact same JSX structure: <nav><div><div>...</div></div></nav>
    - DO NOT include any mounting code (createRoot, render) - the iframe handles mounting
    - ONLY modify colors, text content, styling classes, and simple content
    - DO NOT add mobile menus, state management, or complex functionality
    - DO NOT change the overall layout or component hierarchy
    - ONLY customize what the user specifically requests (colors, text, styling)

    Guidelines:
    - Always start with the provided base component code
    - Implement exactly what the user asks for, without simplification
    - Use proper React patterns and hooks when needed
    - Apply Tailwind CSS classes for all styling
    - Handle complex requirements like animations, state management, interactions
    - Support any level of customization complexity
    - Ensure iframe compatibility at all times
    
    When asked to customize a component, analyze the base code and user requirements, then return the complete customized React component code that fully implements the user's request. Return only the React component code without explanations.
  `,
  model: openai("gpt-4o-mini"),
  tools: {
    extractThemesTool
  }
});

console.log('🟢 Component Agent created successfully');

// Initialize Mastra with the component agent
console.log('🟢 Initializing Mastra instance...');
export const mastra = new Mastra({
  agents: { componentAgent },
});
console.log('🟢 Mastra instance created successfully');

export { componentAgent, extractThemesTool };
