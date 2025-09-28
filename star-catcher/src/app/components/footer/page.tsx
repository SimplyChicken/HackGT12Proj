'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Wand2, Eye, Code, Layout, Navigation, Zap, CreditCard, Square, ArrowRight, Heart } from 'lucide-react';
import ClientOnlyWrapper from '@/components/ClientOnlyWrapper';
import Header from '@/components/ui/Header';
import TopPreferences from '@/components/ui/TopPreferences';
import TopColors from '@/components/ui/TopColors';
import TopFonts from '@/components/ui/TopFonts';
import { useSession } from 'next-auth/react';

// Component navigation data
const componentNavItems = [
  { name: 'Button', type: 'button', icon: <Layout className="w-4 h-4" />, href: '/components/button', isActive: false },
  { name: 'Navbar', type: 'navbar', icon: <Navigation className="w-4 h-4" />, href: '/components/navbar', isActive: false },
  { name: 'Hero', type: 'hero', icon: <Zap className="w-4 h-4" />, href: '/components/hero', isActive: false },
  { name: 'Card', type: 'card', icon: <CreditCard className="w-4 h-4" />, href: '/components/card', isActive: false },
  { name: 'Footer', type: 'footer', icon: <Square className="w-4 h-4" />, href: '/components/footer', isActive: true }
];

// Floating examples component
const FloatingExamples = ({ examples }: { examples: string[] }) => {
  return (
    <div className="relative h-32 overflow-hidden rounded-lg bg-gradient-to-br from-eggshell to-slate-gray/10 p-4">
      <div className="absolute inset-0">
        {examples.map((example, index) => {
          const delays = ['delay-0', 'delay-1000', 'delay-2000', 'delay-3000', 'delay-4000'];
          const positions = [
            'top-4 left-4', 'top-8 right-8', 'bottom-6 left-6', 'bottom-4 right-4', 'top-12 left-1/2'
          ];
          const animations = [
            'animate-bounce', 'animate-pulse', 'animate-ping', 'animate-spin', 'animate-pulse'
          ];
          
          return (
            <div
              key={index}
              className={`absolute ${positions[index % positions.length]} ${delays[index % delays.length]} ${animations[index % animations.length]} opacity-70 hover:opacity-100 transition-opacity duration-300`}
              style={{
                animationDelay: `${index * 0.5}s`,
                animationDuration: `${3 + (index % 3)}s`
              }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-space-cadet shadow-sm border border-slate-gray/30 font-outfit">
                {example}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple custom code highlighter to avoid Turbopack issues
const CodeBlock = ({ code, language = 'typescript' }: { code: string; language?: string }) => {
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
      <code>{code}</code>
    </pre>
  );
};

// Sanitizer function to clean code before injecting into iframe
function sanitizeForIframe(src: string) {
  console.log('🔍 Original code:', JSON.stringify(src));
  const sanitized = src
    // strip BOM
    .replace(/^\uFEFF/, '')
    // strip leading markdown fences like ```javascript / ```jsx / ```ts / ```tsx / ``` or with CRLF
    .replace(/^\s*```(?:javascript|jsx|js|typescript|ts|tsx)?\s*\r?\n/i, '')
    // strip trailing closing fences
    .replace(/\r?\n```[\s]*$/i, '')
    // remove any stray triple-backticks left in the middle
    .replace(/```/g, '')
    // strip a lone leading language tag if someone returned "javascript\nfunction …"
    .replace(/^\s*(javascript|jsx|js|typescript|ts|tsx)\s*\r?\n/i, '')
    // drop ESM bits that can't run in the iframe
    .replace(/^\s*import\s+.*?;?\s*$/gm, '')
    .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/g, 'function $1(')
    .replace(/export\s+default\s+[A-Za-z0-9_]+\s*;?/g, '')
    .trim();
  console.log('✅ Sanitized code:', JSON.stringify(sanitized));
  return sanitized;
}

// Simple Footer Preview Component that renders the React code in an iframe
const DynamicFooterPreview = ({ code }: { code: string }) => {
  const [iframeContent, setIframeContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPreview = () => {
      try {
        console.log('🔍 Creating footer preview with code:', code);
        const sanitizedCode = sanitizeForIframe(code);
        console.log('🔍 Using sanitized code in iframe:', sanitizedCode);

        // Create HTML content with the React code
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Footer Preview</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        // Configure Babel to prevent language annotations
        Babel.registerPreset('custom-react', {
            presets: [
                [Babel.availablePresets['react'], {
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment',
                    throwIfNamespace: false
                }]
            ]
        });
    </script>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #f8f9fa;
            font-family: system-ui, -apple-system, sans-serif;
            width: 100vw;
            height: 100vh;
            overflow-x: hidden;
        }
        #root {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .footer-content {
            margin-top: auto;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel" data-presets="custom-react">
        const { useState } = React;
        
        ${sanitizedCode}
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<div className="footer-content"><Footer /></div>);
    </script>
</body>
</html>`;

        setIframeContent(htmlContent);
        setError(null);
      } catch (err) {
        console.error('Error creating preview:', err);
        setError('Failed to render preview');
        setIframeContent('');
      }
    };

    createPreview();
  }, [code]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg text-red-500">
        <span>Preview Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      {iframeContent ? (
        <iframe
          srcDoc={iframeContent}
          className="w-full h-full border-0 rounded-lg"
          title="Footer Preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
          style={{ width: '100%', height: '100%', minHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}
        />
      ) : (
        <div className="flex justify-center items-center h-full text-gray-500">Loading preview...</div>
      )}
    </div>
  );
};

function FooterCustomizerContent() {
  const { data: session } = useSession();
  const [customizationInput, setCustomizationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customizedCode, setCustomizedCode] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isFavoriting, setIsFavoriting] = useState(false);

  // Default footer template (iframe-safe)
  const defaultFooterCode = `function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">LinkedIn</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">GitHub</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-gray-600">© 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}`;

  // Get the current code (customized or default)
  const getCurrentCode = () => {
    if (customizedCode) {
      return customizedCode;
    }
    return defaultFooterCode;
  };

  const handleCustomize = async () => {
    if (!customizationInput.trim()) return;

    setIsLoading(true);
    try {
      // Get the current footer code (starter or previously customized)
      const baseCode = customizedCode || defaultFooterCode;

      // Call the Mastra API to customize the footer
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
            preferences: {},
            componentType: 'footer'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to customize component');
      }

      const result = await response.json();
      
      if (result.success && result.result.success) {
        setCustomizedCode(result.result.customizedCode);
        
        // Track the user input
        setUserInputs(prev => [...prev, customizationInput]);
        
        // Clear the input
        setCustomizationInput('');
        
        // Keep on preview tab to show the customized component
        setActiveTab('preview');
      } else {
        throw new Error(result.result?.error || 'Customization failed');
      }
    } catch (error) {
      console.error('Error customizing footer:', error);
      alert('Failed to customize footer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!session?.user?.email) {
      alert('Please sign in to save components');
      return;
    }

    setIsFavoriting(true);
    try {
      const currentCode = customizedCode || defaultFooterCode;
      
      const response = await fetch('/api/save/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component: {
            type: 'footer',
            name: 'Custom Footer',
            code: currentCode,
            description: `Footer customized with: ${userInputs.join(', ')}`
          },
          userInputs: userInputs
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save component');
      }

      const result = await response.json();
      if (result.success) {
        alert('Component saved successfully! Check your Components tab in your account.');
        // Reset the component to start fresh
        setCustomizedCode('');
        setUserInputs([]);
      } else {
        throw new Error('Failed to save component');
      }
    } catch (error) {
      console.error('Error saving component:', error);
      alert('Failed to save component. Please try again.');
    } finally {
      setIsFavoriting(false);
    }
  };

  return (
    <div className="min-h-screen bg-eggshell">
      <Header />

      {/* Component Navigation */}
      <div className="bg-white border-b border-slate-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-1 bg-slate-gray/10 rounded-lg p-1">
              {componentNavItems.map((item) => (
                <Link
                  key={item.type}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all font-outfit ${
                    item.isActive
                      ? 'bg-white text-space-cadet shadow-sm'
                      : 'text-slate-gray hover:text-space-cadet hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-space-cadet mb-4 font-poly">
            AI-Powered Footer Customizer
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto font-outfit">
            Start with a simple footer and tell our AI how you want to customize it. 
            Watch as it transforms based on your natural language instructions.
          </p>
        </div>

        {/* Preview Section - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 mb-8">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-gray/20">
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
          <div className="p-6">
            {activeTab === 'preview' ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Footer Preview
                  </h3>
                </div>
                <div className="h-[85vh] flex items-center justify-center p-4 overflow-hidden" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
                  {/* Desktop Setup */}
                  <div className="flex flex-col items-center w-full">
                    {/* Screen Frame */}
                    <div className="relative w-full max-w-6xl bg-black rounded-2xl p-3 shadow-2xl">
                      {/* Screen Bezel */}
                      <div className="bg-gray-800 rounded-xl p-1">
                        {/* Screen Content */}
                        <div className="bg-white rounded-lg shadow-inner" style={{ aspectRatio: '16/10', height: '500px', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
                          <DynamicFooterPreview code={getCurrentCode()} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Realistic Desktop Stand */}
                    <div className="flex flex-col items-center -mt-1">
                      {/* Stand Neck */}
                      <div className="w-24 h-10 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-lg shadow-lg"></div>
                      {/* Stand Post */}
                      <div className="w-4 h-16 bg-gradient-to-b from-gray-600 to-gray-700 shadow-lg"></div>
                      {/* Stand Base */}
                      <div className="w-40 h-5 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500 rounded-lg shadow-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Source Code
                </h3>
                <CodeBlock code={sanitizeForIframe(getCurrentCode())} language="typescript" />
              </div>
            )}
          </div>
        </div>

        {/* Customization Input - Full Width */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Customize Your Footer
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="customization" className="block text-sm font-medium text-gray-700 mb-2">
                  What changes would you like to make?
                </label>
                <textarea
                  id="customization"
                  value={customizationInput}
                  onChange={(e) => setCustomizationInput(e.target.value)}
                  placeholder="e.g., Add social media icons, make it dark themed, add newsletter signup..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={6}
                />
              </div>

              <div className="space-y-3">
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
                      Customize Footer
                    </>
                  )}
                </button>

                {(customizedCode || userInputs.length > 0) && (
                  <button
                    onClick={handleFavorite}
                    disabled={isFavoriting || !session?.user?.email}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isFavoriting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        {session?.user?.email ? 'Save Component' : 'Sign in to Save'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-space-cadet font-outfit">Your Preferences:</h4>
              <div className="space-y-2">
                <TopColors />
                <TopFonts />
                <TopPreferences />
              </div>
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
              <h1 className="text-xl font-bold text-gray-900">Footer Customizer</h1>
            </div>
          </div>
        </div>
      </header>
      
      {/* Loading Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Footer Customizer
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
export default function FooterCustomizer() {
  return (
    <ClientOnlyWrapper fallback={<LoadingFallback />}>
      <FooterCustomizerContent />
    </ClientOnlyWrapper>
  );
}