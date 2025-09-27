'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Eye, Code } from 'lucide-react';
import ClientOnlyWrapper from '@/components/ClientOnlyWrapper';

// Simple custom code highlighter to avoid Turbopack issues
const CodeBlock = ({ code, language = 'typescript' }: { code: string; language?: string }) => {
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  );
};

// Dynamic Button Preview Component using Tailwind Play CDN iframe
const DynamicButtonPreview = ({ code }: { code: string }) => {
  const [iframeContent, setIframeContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderWithTailwindPlay = () => {
      try {
        if (!code.trim()) {
          setIframeContent('');
          return;
        }

        // Create a complete React component that can be rendered in the iframe
        const createRenderableComponent = (componentCode: string) => {
          console.log('🔍 Processing component code for iframe:', componentCode);
          
          // Clean up the component code
          let cleanCode = componentCode.trim();
          
          // Remove any code block markers
          cleanCode = cleanCode.replace(/```typescript\n?/g, '').replace(/```\n?/g, '');
          
          // Check if this is a complete React component
          if (cleanCode.includes('const ') && cleanCode.includes('useState') && cleanCode.includes('export default')) {
            console.log('✅ Detected complete React component with hooks');
            
            // Extract the component name and the entire component function
            const componentMatch = cleanCode.match(/const\s+(\w+)\s*=\s*\(\)\s*=>\s*{([\s\S]*?)};?\s*export\s+default\s+\1/);
            if (componentMatch) {
              const componentName = componentMatch[1];
              const componentBody = componentMatch[2];
              console.log('✅ Extracted component:', componentName);
              return { type: 'complete', name: componentName, body: componentBody };
            }
          }
          
          // Fallback to simple JSX extraction
          const jsxMatch = cleanCode.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
          if (jsxMatch) {
            const jsxContent = jsxMatch[1].trim();
            console.log('✅ Extracted JSX content:', jsxContent);
            return { type: 'jsx', content: jsxContent };
          }
          
          // If no return statement found, try to extract button element directly
          const buttonMatch = cleanCode.match(/<button[\s\S]*?<\/button>/);
          if (buttonMatch) {
            console.log('✅ Found button element:', buttonMatch[0]);
            return { type: 'jsx', content: buttonMatch[0] };
          }
          
          // Fallback to default
          console.log('⚠️ Using fallback button');
          return { type: 'jsx', content: '<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Click me</button>' };
        };

        const componentData = createRenderableComponent(code);

        // Create HTML content for the iframe with Tailwind Play CDN and React
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Button Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .preview-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="preview-container" id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        // Component code from AI
        ${componentData.type === 'complete' 
          ? `const ${componentData.name} = () => {${componentData.body}};`
          : `const Button = () => { return (${componentData.content}); };`
        }
        
        // Render the component
        ReactDOM.render(${componentData.type === 'complete' ? `<${componentData.name} />` : '<Button />'}, document.getElementById('root'));
    </script>
</body>
</html>`;

        setIframeContent(htmlContent);
        setError(null);
      } catch (err) {
        console.error('Error creating iframe content:', err);
        setError('Failed to render preview');
        setIframeContent('');
      }
    };

    renderWithTailwindPlay();
  }, [code]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg text-red-500">
        <span>Preview Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg">
      {iframeContent ? (
        <iframe
          srcDoc={iframeContent}
          className="w-full h-full border-0 rounded-lg"
          title="Button Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      ) : (
        <div className="text-gray-500">No component to preview</div>
      )}
    </div>
  );
};

function ButtonCustomizerContent() {
  const [customizationInput, setCustomizationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customizedCode, setCustomizedCode] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');

  // Get the current code (customized or default)
  const getCurrentCode = () => {
    if (customizedCode) {
      return customizedCode;
    }
    return `import React from 'react';

const Button = () => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Click me
    </button>
  );
};

export default Button;`;
  };

  const handleCustomize = async () => {
    if (!customizationInput.trim()) return;

    setIsLoading(true);
    try {
      // Get the current button code (starter or previously customized)
      const baseCode = customizedCode || `import React from 'react';

const Button = () => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Click me
    </button>
  );
};

export default Button;`;

      // Call the Mastra API to customize the button
      const response = await fetch('/api/mastra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'customizeComponent',
          data: {
            baseCode,
            userInput: customizationInput,
            preferences: {}
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to customize component');
      }

      const result = await response.json();
      
      if (result.success && result.result.success) {
        setCustomizedCode(result.result.customizedCode);
        
        // Clear the input
        setCustomizationInput('');
        
        // Switch to source tab to show the customized code
        setActiveTab('source');
      } else {
        throw new Error(result.result?.error || 'Customization failed');
      }
    } catch (error) {
      console.error('Error customizing button:', error);
      alert('Failed to customize button. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Button Customizer</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Button Customizer
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with a simple button and tell our AI how you want to customize it. 
            Watch as it transforms based on your natural language instructions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Button Preview with Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('source')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'source'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Code className="w-4 h-4" />
                Source Code
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'preview' ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                    Button Preview
                  </h3>
                  <DynamicButtonPreview code={getCurrentCode()} />
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                    Source Code
                  </h3>
                  <CodeBlock code={getCurrentCode()} language="typescript" />
                </div>
              )}
            </div>
          </div>

          {/* Customization Input */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Customize Your Button
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="customization" className="block text-sm font-medium text-gray-700 mb-2">
                  What changes would you like to make?
                </label>
                <textarea
                  id="customization"
                  value={customizationInput}
                  onChange={(e) => setCustomizationInput(e.target.value)}
                  placeholder="e.g., Make it red with rounded corners, add a shadow, make it larger, add an icon..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>

              <button
                onClick={handleCustomize}
                disabled={isLoading || !customizationInput.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Customizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Customize Button
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Try these examples:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• "Make it red with rounded corners"</li>
                <li>• "Add a shadow and make it larger"</li>
                <li>• "Change to green with white text"</li>
                <li>• "Add a loading spinner when clicked"</li>
                <li>• "Make it look like a modern card button"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Button Customizer</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Loading Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Button Customizer
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Loading...
          </p>
        </div>
      </main>
    </div>
  );
}

// Main export with client-only wrapper
export default function ButtonCustomizer() {
  return (
    <ClientOnlyWrapper fallback={<LoadingFallback />}>
      <ButtonCustomizerContent />
    </ClientOnlyWrapper>
  );
}
