'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Wand2, Eye, Code, Layout, Navigation, Zap, CreditCard, Square, Heart } from 'lucide-react';
import ClientOnlyWrapper from '@/components/ClientOnlyWrapper';
import Header from '@/components/ui/Header';
import TopPreferences from '@/components/ui/TopPreferences';
import { useSession } from 'next-auth/react';

// Component navigation data
const componentNavItems = [
    { name: 'Button', type: 'button', icon: <Layout className="w-4 h-4" />, href: '/components/button', isActive: true },
    { name: 'Navbar', type: 'navbar', icon: <Navigation className="w-4 h-4" />, href: '/components/navbar', isActive: false },
    { name: 'Hero', type: 'hero', icon: <Zap className="w-4 h-4" />, href: '/components/hero', isActive: false },
    { name: 'Card', type: 'card', icon: <CreditCard className="w-4 h-4" />, href: '/components/card', isActive: false },
    { name: 'Footer', type: 'footer', icon: <Square className="w-4 h-4" />, href: '/components/footer', isActive: false }
];

// Floating examples (currently unused but kept for later)
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

// Minimal code block (keeps Turbopack happy)
const CodeBlock = ({ code }: { code: string }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
    <code>{code}</code>
  </pre>
);

// Sanitize code before injecting into iframe (kept loud logs for debugging)
function sanitizeForIframe(src: string) {
    console.log('🔍 Original code:', JSON.stringify(src));
    const sanitized = src
        .replace(/^\uFEFF/, '')                                              // strip BOM
        .replace(/^\s*```(?:javascript|jsx|js|typescript|ts|tsx)?\s*\r?\n/i, '') // leading fences
        .replace(/\r?\n```[\s]*$/i, '')                                      // trailing fences
        .replace(/```/g, '')                                                 // stray fences
        .replace(/^\s*(javascript|jsx|js|typescript|ts|tsx)\s*\r?\n/i, '')    // stray language tags
        .replace(/^\s*import\s+.*?;?\s*$/gm, '')                              // drop imports
        .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(/g, 'function $1(')
        .replace(/export\s+default\s+[A-Za-z0-9_]+\s*;?/g, '')
        .trim();
    console.log('✅ Sanitized code:', JSON.stringify(sanitized));
    return sanitized;
}

// Renders the React code in an iframe via Babel (UMD)
const DynamicButtonPreview = ({ code }: { code: string }) => {
    const [iframeContent, setIframeContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const sanitizedCode = sanitizeForIframe(code);

            // Fallback ensures <Button /> exists even if the code forgot to define it
            const ensureButtonFallback = `
        if (typeof Button === 'undefined') {
          function Button() {
            return React.createElement('button', {
              className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
            }, 'Click me');
          }
        }
      `;

            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Button Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
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
    body { margin:0; padding:20px; background:#f8f9fa; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family: system-ui, -apple-system, sans-serif; overflow-x:hidden; }
    #root { width:100%; min-height:100vh; display:flex; justify-content:center; align-items:center; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="custom-react">
    ${sanitizedCode}
    ${ensureButtonFallback}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(Button));
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
                    title="Button Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                    style={{ overflowX: 'hidden', overflowY: 'auto' }}
                />
            ) : (
                <div className="flex justify-center items-center h-full text-gray-500">Loading preview...</div>
            )}
        </div>
    );
};

function ButtonCustomizerContent() {
    const { data: session } = useSession();
    const [customizationInput, setCustomizationInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customizedCode, setCustomizedCode] = useState('');
    const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
    const [userInputs, setUserInputs] = useState<string[]>([]);
    const [isFavoriting, setIsFavoriting] = useState(false);

    // Default button template (iframe-safe)
    const defaultButtonCode = `function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Click me
    </button>
  );
}`;

    const getCurrentCode = () => (customizedCode ? customizedCode : defaultButtonCode);

    const handleCustomize = async () => {
        if (!customizationInput.trim()) return;
        setIsLoading(true);
        try {
            const baseCode = customizedCode || defaultButtonCode;
            const response = await fetch('/api/mastra', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'customizeComponent',
                    data: {
                        baseCode,
                        userInput: customizationInput,
                        preferences: {},
                        componentType: 'button',
                    },
                }),
            });
            if (!response.ok) throw new Error('Failed to customize component');

            const result = await response.json();
            if (result?.success && result?.result?.success) {
                setCustomizedCode(result.result.customizedCode);
                setUserInputs((prev) => [...prev, customizationInput]);
                setCustomizationInput('');
                setActiveTab('preview');
            } else {
                throw new Error(result?.result?.error || 'Customization failed');
            }
        } catch (error) {
            console.error('Error customizing button:', error);
            alert('Failed to customize button. Please try again.');
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
            const currentCode = getCurrentCode();
            const response = await fetch('/api/save/components', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    component: {
                        type: 'button',
                        name: 'Custom Button',
                        code: currentCode,
                        description: `Button customized with: ${userInputs.join(', ')}`,
                    },
                    userInputs,
                }),
            });
            if (!response.ok) throw new Error('Failed to save component');

            const result = await response.json();
            if (result?.success) {
                alert('Component saved successfully! Check your Components tab in your account.');
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-1 bg-light rounded-2xl p-1">
                        {componentNavItems.map((item) => (
                            <Link
                                key={item.type}
                                href={item.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all font-outfit ${
                                    item.isActive ? 'bg-white text-ink' : 'text-ink hover:text-[color:var(--accent)]'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-space-cadet mb-4 font-poly">
                        AI-Powered Button Customizer
                    </h2>
                    <p className="text-lg text-slate-gray max-w-2xl mx-auto font-outfit">
                        Start with a simple button and tell our AI how you want to customize it.
                        Watch as it transforms based on your natural language instructions.
                    </p>
                </div>

                {/* Preview Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 mb-8">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-gray/20">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors font-outfit ${
                                activeTab === 'preview'
                                    ? 'text-space-cadet border-b-2 border-space-cadet bg-space-cadet/5'
                                    : 'text-slate-gray hover:text-space-cadet hover:bg-slate-gray/5'
                            }`}
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('source')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors font-outfit ${
                                activeTab === 'source'
                                    ? 'text-space-cadet border-b-2 border-space-cadet bg-space-cadet/5'
                                    : 'text-slate-gray hover:text-space-cadet hover:bg-slate-gray/5'
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
                                    <h3 className="text-lg font-semibold text-space-cadet font-poly">Button Preview</h3>
                                </div>
                                <div className="h-[85vh] flex items-center justify-center p-4 overflow-hidden" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
                                    <div className="flex flex-col items-center w-full">
                                        {/* Screen Frame */}
                                        <div className="relative w-full max-w-2xl bg-black rounded-2xl p-3 shadow-2xl">
                                            <div className="bg-gray-800 rounded-xl p-1">
                                                {/* Screen Content */}
                                                <div className="bg-white rounded-lg shadow-inner" style={{ aspectRatio: '16/10', height: '400px', overflowX: 'hidden', overflowY: 'auto', width: '100%' }}>
                                                    <DynamicButtonPreview code={getCurrentCode()} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Desktop Stand */}
                                        <div className="flex flex-col items-center -mt-1">
                                            <div className="w-20 h-9 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-lg shadow-lg" />
                                            <div className="w-3.5 h-14 bg-gradient-to-b from-gray-600 to-gray-700 shadow-lg" />
                                            <div className="w-36 h-4 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500 rounded-lg shadow-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-semibold text-space-cadet mb-4 text-center font-poly">Source Code</h3>
                                <CodeBlock code={sanitizeForIframe(getCurrentCode())} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Customization Panel */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 p-8">
                    <h3 className="text-lg font-semibold text-space-cadet mb-6 font-poly">Customize Your Button</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="customization" className="block text-sm font-medium text-space-cadet mb-2 font-outfit">
                                    What changes would you like to make?
                                </label>
                                <textarea
                                    id="customization"
                                    value={customizationInput}
                                    onChange={(e) => setCustomizationInput(e.target.value)}
                                    placeholder="e.g., Make it red with white text, add an icon, make it larger..."
                                    className="w-full px-3 py-2 border border-slate-gray/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-space-cadet/30 focus:border-space-cadet resize-none font-outfit"
                                    rows={6}
                                />
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleCustomize}
                                    disabled={isLoading || !customizationInput.trim()}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-md  disabled:bg-slate-gray disabled:cursor-not-allowed transition-colors font-outfit font-medium"
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

                                {(customizedCode || userInputs.length > 0) && (
                                    <button
                                        onClick={handleFavorite}
                                        disabled={isFavoriting || !session?.user?.email}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-slate-gray disabled:cursor-not-allowed transition-colors font-outfit font-medium"
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

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-space-cadet font-outfit">Your Saved Preferences:</h4>
                            <TopPreferences />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Loading fallback
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gray-50">
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
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Button Customizer</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">Loading...</p>
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
