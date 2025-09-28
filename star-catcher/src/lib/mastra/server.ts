import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { generateComponent } from "../tools/generateComponent";
import { generateFontPairings } from "../tools/generateFontPairings";
import { memorySystem } from "../memory";

// Tool schema for Mastra
const customizeComponentToolSchema = z.object({
  baseCode: z.string().describe('The base component code to customize'),
  userInput: z.string().describe('User requirements for customization'),
  preferences: z.record(z.any()).optional().describe('User preferences for styling and features'),
  componentType: z.enum(['button', 'navbar', 'hero', 'card', 'footer']).optional().describe('The type of component to customize')
});

// Tool for customizing component code using AI
const customizeComponentTool = {
  name: 'customizeComponent',
  description: 'Customize a React component based on user requirements using AI analysis',
  parameters: customizeComponentToolSchema,
  execute: async ({ baseCode, userInput, preferences, componentType }: {
    baseCode: string;
    userInput: string;
    preferences?: any;
    componentType?: 'button' | 'navbar' | 'hero' | 'card' | 'footer';
  }) => {
    try {
      console.log('🟡 CustomizeComponent tool executing with:', { baseCode, userInput, preferences, componentType });
      
      // Learn from user input to improve future recommendations
      memorySystem.learnFromUserInput(userInput);
      
      // Get learned preferences for this component type
      const learnedPreferences = memorySystem.getComponentPreferences(componentType || 'button');
      
      // Merge with provided preferences (provided preferences take precedence)
      const enhancedPreferences = {
        ...learnedPreferences,
        ...preferences,
        // Add learned style keywords to the prompt
        learnedKeywords: memorySystem.getPreferencesForPrompt()
      };
      
      // Use the existing generateComponent function with enhanced preferences
      const result = await generateComponent({
        componentType: componentType || 'button',
        userInput,
        preferences: enhancedPreferences,
        baseCode // Pass the base code to the generator
      });
      
      console.log('🟡 GenerateComponent result:', result);
      
      return {
        success: true,
        customizedCode: result.code,
        description: result.description,
        features: result.features,
        learnedPreferences: learnedPreferences
      };
    } catch (error) {
      console.error('🟡 CustomizeComponent tool error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};

// Tool for generating font pairings
const generateFontPairingsTool = {
  name: 'generateFontPairings',
  description: 'Generate beautiful font pairings using Google Fonts API',
  parameters: {
    type: 'object',
    properties: {
      purpose: {
        type: 'string',
        description: 'The purpose of the font pairing (e.g., website, print, branding)'
      },
      primaryCategories: {
        type: 'array',
        items: { type: 'string' },
        description: 'Categories for primary font (serif, sans-serif, handwriting, display)'
      },
      secondaryCategories: {
        type: 'array',
        items: { type: 'string' },
        description: 'Categories for secondary font (serif, sans-serif, handwriting, display)'
      }
    },
    required: []
  },
  execute: async ({ purpose, primaryCategories, secondaryCategories }: any) => {
    try {
      console.log('🟡 GenerateFontPairings tool executing with:', { purpose, primaryCategories, secondaryCategories });
      
      const result = await generateFontPairings({
        purpose,
        primaryCategories,
        secondaryCategories
      });
      
      console.log('🟡 GenerateFontPairings result:', result);
      
      return {
        success: true,
        fontPairing: result
      };
    } catch (error) {
      console.error('🟡 GenerateFontPairings tool error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};


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
    This component will run in an iframe environment with ES modules and import maps. You MUST ensure compatibility:

    1. CODE FORMAT:
       - Use plain JavaScript with JSX, NOT TypeScript
       - NO type annotations, interfaces, or TypeScript syntax
       - NO "as" type assertions or generics

    2. IMPORTS - ONLY USE THESE ALLOWED IMPORTS:
       - "react" (for useState, useEffect, etc.)
       - "react-dom/client" (only if you need createRoot)
       - "lucide-react" (for icons like Menu, X, Search, etc.)
       - "@radix-ui/react-*" (optional, for advanced components)
       - NO Next.js imports (next/link, next/image, etc.)
       - NO relative imports (./file, ../file)
       - NO @/ imports

    3. COMPONENT STRUCTURE:
       - Must be a self-contained ES module
       - Export as: export default function ComponentName() { ... }
       - Use <a> tags instead of Next.js <Link>
       - Use <img src="https://..."> with full URLs for images

    4. STYLING:
       - Use Tailwind CSS classes only
       - NO CSS modules, SCSS, or styled-components
       - Use inline style={{}} if needed for dynamic styles

    5. ICONS:
       - Use lucide-react imports: import { Menu, X, Search } from "lucide-react"
       - NO other icon libraries

    6. REACT FEATURES:
       - useState, useEffect, and other React hooks are allowed
       - Event handlers (onClick, onChange) are allowed
       - Conditional rendering with && and ternary operators is allowed

    Guidelines:
    - Always start with the provided base component code
    - Implement exactly what the user asks for, without simplification
    - Use proper React patterns and hooks when needed
    - Apply Tailwind CSS classes for all styling
    - Add any necessary imports (React hooks, icons, libraries)
    - Handle complex requirements like animations, state management, interactions
    - Support any level of customization complexity
    - Ensure ES module compatibility at all times
    
    When asked to customize a component, analyze the base code and user requirements, then return the complete customized React component code that fully implements the user's request. Return only the React component code without explanations.
  `,
  model: openai("gpt-4o-mini"),
});

console.log('🟢 Component Agent created successfully');

// Create the Design Agent using Mastra
console.log('🟢 Initializing Mastra Design Agent...');

const designAgent = new Agent({
  name: "DesignAgent",
  instructions: `
    You are an expert design generator powered by the Mastra AI framework.

    Your role:
    - Generate beautiful font pairings using Google Fonts
    - Create cohesive color palettes with accessibility considerations
    - Generate production-ready React components
    - Use user memories to provide personalized recommendations
    - Maintain high-quality, professional design standards

    Guidelines:
    - For font generation: Use the generateFontPairings tool with appropriate categories
    - For color palettes: Create accessible color schemes with proper contrast ratios
    - For components: Generate clean, modern React components with Tailwind CSS
    - Consider user preferences and memories when making recommendations
    - Always provide usage guidelines and rationale for design choices
    
    When generating designs, use the appropriate tools and return structured, validated results.
  `,
  model: openai("gpt-4o-mini"),
});

console.log('🟢 Design Agent created successfully');

// Initialize Mastra with both agents
console.log('🟢 Initializing Mastra instance...');
export const mastra = new Mastra({
  agents: { componentAgent, designAgent },
});
console.log('🟢 Mastra instance created successfully');

// Design Agent wrapper class for easier API usage
export class DesignAgentWrapper {
  private agent: Agent;
  private memories: any[] = [];

  constructor(agent: Agent) {
    this.agent = agent;
  }

  setMemories(memories: any[]) {
    this.memories = memories;
  }

  async generate(type: string, options: any = {}) {
    try {
      let prompt = '';
      
      switch (type) {
        case 'font':
          prompt = `Generate a beautiful font pairing for a website. 
            Primary categories: ${options.primaryCategories?.join(', ') || 'serif, sans-serif'}
            Secondary categories: ${options.secondaryCategories?.join(', ') || 'serif, sans-serif'}
            Purpose: ${options.purpose || 'website'}
            
            ${this.memories.length > 0 ? `Consider these user preferences: ${JSON.stringify(this.memories)}` : ''}
            
            Use the generateFontPairings tool to create a new font pairing.`;
          break;
          
        case 'color':
          prompt = `Generate a cohesive color palette for a website with accessibility considerations.
            ${this.memories.length > 0 ? `Consider these user preferences: ${JSON.stringify(this.memories)}` : ''}
            
            Create a modern, accessible color scheme with proper contrast ratios.`;
          break;
          
        case 'component':
          prompt = `Generate a React component based on the user's requirements.
            Component type: ${options.componentType || 'button'}
            Requirements: ${options.userInput || 'Create a modern, clean component'}
            ${this.memories.length > 0 ? `Consider these user preferences: ${JSON.stringify(this.memories)}` : ''}
            
            Use the customizeComponent tool to generate the component.`;
          break;
          
        default:
          throw new Error(`Unknown generation type: ${type}`);
      }

      const response = await this.agent.generateVNext(prompt);
      
      // For font generation, we need to extract the result from the tool call
      if (type === 'font') {
        // The agent should have called the generateFontPairings tool
        // We'll need to parse the response to get the actual font pairing
        // For now, let's use the generateFontPairings function directly
        const fontResult = await generateFontPairings({
          purpose: options.purpose || 'website',
          primaryCategories: options.primaryCategories || ['serif', 'sans-serif'],
          secondaryCategories: options.secondaryCategories || ['serif', 'sans-serif']
        });
        return fontResult;
      }
      
      // For other types, return the response as-is for now
      return response;
      
    } catch (error) {
      console.error('DesignAgent generation error:', error);
      throw error;
    }
  }
}

// Create the design agent wrapper
const designAgentInstance = new DesignAgentWrapper(designAgent);
export { componentAgent, designAgentInstance as designAgent };
