import { z } from 'zod';
import { ComponentSchema } from '../schemas';

interface GenerateComponentOptions {
  componentType: 'navbar' | 'hero' | 'card' | 'button' | 'footer';
  style?: string;
  userInput?: string;
  preferences?: any;
  baseCode?: string;
}

// Simple starter button template (iframe-safe)
const defaultButtonTemplate = `function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Click me
    </button>
  );
}`;

export const generateComponent = async (options: GenerateComponentOptions): Promise<any> => {
  const { componentType, style = 'modern', userInput, preferences, baseCode } = options;
  
  // Component templates for different types
  const componentTemplates: Record<string, string> = {
    button: defaultButtonTemplate,
    navbar: `function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="#" className="text-xl font-bold text-gray-900">
              Your Brand
            </a>
          </div>
          
          <div className="ml-10 flex items-baseline space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              About
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

}`,
    hero: `function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Welcome to Our Platform
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Build amazing experiences with our powerful tools and intuitive interface.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10">
                Get started
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

}`,
    card: `function Card() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Card Title</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>This is a simple card component with clean styling.</p>
        </div>
        <div className="mt-5">
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Learn more →
          </a>
        </div>
      </div>
    </div>
  );
}

}`,
    footer: `function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Status</a></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Terms</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Facebook</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

}`
  };
  
  // Use provided base code or template
  let finalCode = baseCode || componentTemplates[componentType] || defaultButtonTemplate;
  
  // If user provided input, apply AI-powered customization
  if (userInput) {
    try {
      // Use OpenAI to customize the component based on user input
      const { openai } = await import('@ai-sdk/openai');
      const { generateText } = await import('ai');
      
      const model = openai('gpt-3.5-turbo');
      
      const result = await generateText({
        model,
        prompt: `You are a React component expert. Customize this ${componentType} component based on the user's requirements.

Base Component:
\`\`\`javascript
${finalCode}
\`\`\`

User Requirements: "${userInput}"

User Preferences: ${JSON.stringify(preferences || {}, null, 2)}

${preferences?.learnedKeywords ? preferences.learnedKeywords : ''}

CRITICAL IFRAME COMPATIBILITY REQUIREMENTS - MUST FOLLOW ALL RULES:
This component will run in an iframe environment with React UMD + Babel standalone. You MUST ensure compatibility:

1. CODE FORMAT:
   - Use plain JavaScript with JSX, NOT TypeScript
   - NO type annotations, interfaces, or TypeScript syntax
   - NO "as" type assertions or generics
   - NO import/export statements - use plain function declarations

2. COMPONENT STRUCTURE:
   - Must be a plain function component: function ComponentName() { ... }
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
- KEEP the exact same function structure: function ComponentName() { return (...) }
- KEEP the exact same JSX structure
- DO NOT include any mounting code (createRoot, render) - the iframe handles mounting
- ONLY modify colors, text content, styling classes, and simple content
- DO NOT add mobile menus, state management, or complex functionality
- DO NOT change the overall layout or component hierarchy
- ONLY customize what the user specifically requests (colors, text, styling)

Please analyze the base code and user requirements, then return the complete customized React component code that fully implements the user's request while preserving the exact structure above. Return only the React component code without explanations, following ALL the iframe compatibility and structure preservation rules above.`,
      });

      if (result.text) {
        finalCode = result.text.trim();
        // Clean up the response to ensure it's valid React code
        finalCode = finalCode.replace(/```typescript\n?/g, '').replace(/```\n?/g, '');
      }
    } catch (error) {
      console.error('Failed to customize component with AI:', error);
      // Fallback to base code if AI fails
    }
  }
  
  const componentName = componentType.charAt(0).toUpperCase() + componentType.slice(1);
  
  const component = {
    type: componentType,
    name: componentName,
    code: finalCode,
    description: userInput 
      ? `A customized ${componentType} component based on your requirements: "${userInput}"`
      : `A responsive ${componentType} component built with React and Tailwind CSS. Features modern design principles and accessibility best practices.`,
    props: componentType === 'button' ? {
      variant: ['primary', 'secondary', 'outline', 'ghost'],
      size: ['sm', 'md', 'lg']
    } : componentType === 'card' ? {
      title: 'string',
      description: 'string',
      image: 'string (optional)',
      action: 'object (optional)'
    } : undefined,
    style: style,
    features: userInput ? [
      'AI-powered customization',
      'Tailwind CSS styling',
      'Dynamic user requirements',
      'Production ready'
    ] : [
      'Responsive design',
      'Tailwind CSS styling',
      'Accessibility best practices',
      'Production ready'
    ],
    preferences: preferences
  };

  return ComponentSchema.parse(component);
};