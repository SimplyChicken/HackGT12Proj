'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Layout, Navigation, Zap, CreditCard, Square, ArrowRight } from 'lucide-react';
import ClientOnlyWrapper from '@/components/ClientOnlyWrapper';
import Header from '@/components/ui/Header';

// Component type definitions
interface ComponentTemplate {
  name: string;
  type: string;
  icon: React.ReactNode;
  description: string;
  examples: string[];
  href: string;
}

// Component templates
const componentTemplates: ComponentTemplate[] = [
  {
    name: 'Button',
    type: 'button',
    icon: <Layout className="w-6 h-6" />,
    description: 'Interactive buttons with various styles and states',
    examples: [
      'Make it red with rounded corners',
      'Add a shadow and make it larger',
      'Add a loading spinner when clicked',
      'Make it look like a modern card button'
    ],
    href: '/components/button'
  },
  {
    name: 'Navbar',
    type: 'navbar',
    icon: <Navigation className="w-6 h-6" />,
    description: 'Navigation bars with responsive design',
    examples: [
      'Make it dark with white text',
      'Add a mobile hamburger menu',
      'Make it sticky and add a logo',
      'Add a search bar and user menu'
    ],
    href: '/components/navbar'
  },
  {
    name: 'Hero',
    type: 'hero',
    icon: <Zap className="w-6 h-6" />,
    description: 'Eye-catching hero sections for landing pages',
    examples: [
      'Change to a dark theme with neon accents',
      'Add animated background particles',
      'Make it full-screen with video background',
      'Add multiple call-to-action buttons'
    ],
    href: '/components/hero'
  },
  {
    name: 'Card',
    type: 'card',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Flexible card components for content display',
    examples: [
      'Make it a product card with price and rating',
      'Add hover effects and animations',
      'Create a testimonial card layout',
      'Make it a pricing card with features list'
    ],
    href: '/components/card'
  },
  {
    name: 'Footer',
    type: 'footer',
    icon: <Square className="w-6 h-6" />,
    description: 'Site footers with links and company information',
    examples: [
      'Make it dark with social media icons',
      'Add a newsletter signup form',
      'Create a minimal single-column layout',
      'Add company logo and contact information'
    ],
    href: '/components/footer'
  }
];

function ComponentGeneratorContent() {
  return (
    <div className="min-h-screen bg-eggshell">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-space-cadet mb-4 font-poly">
            AI-Powered Component Generator
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto font-outfit">
            Choose from various component types and customize them with natural language instructions. 
            Watch as our AI transforms your components based on your requirements.
          </p>
        </div>

        {/* Component Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-space-cadet mb-6 font-poly">Choose Component Type</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {componentTemplates.map((template) => (
              <Link
                key={template.type}
                href={template.href}
                className="group bg-white rounded-lg shadow-sm border border-slate-gray/20 p-6 hover:shadow-md hover:border-space-cadet/30 transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-space-cadet rounded-lg flex items-center justify-center group-hover:bg-space-cadet/90 transition-colors mb-4">
                    <div className="text-white">
                      {template.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-space-cadet mb-2 font-poly">{template.name}</h3>
                  <p className="text-sm text-slate-gray mb-4 font-outfit">{template.description}</p>
                  <div className="flex items-center text-space-cadet text-sm font-medium group-hover:text-space-cadet/80 font-outfit">
                    <span>Customize</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 p-8">
          <h3 className="text-xl font-semibold text-space-cadet mb-6 text-center font-poly">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-space-cadet rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-medium text-space-cadet mb-2 font-poly">AI-Powered</h4>
              <p className="text-slate-gray font-outfit">Natural language customization using advanced AI models</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-space-cadet rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-medium text-space-cadet mb-2 font-poly">Live Preview</h4>
              <p className="text-slate-gray font-outfit">See your changes in real-time with interactive previews</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-space-cadet rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-medium text-space-cadet mb-2 font-poly">Export Ready</h4>
              <p className="text-slate-gray font-outfit">Get production-ready React components with clean code</p>
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
    <div className="min-h-screen bg-eggshell">
      <Header />
      
      {/* Loading Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-space-cadet mb-4 font-poly">
            AI-Powered Component Generator
          </h2>
          <p className="text-lg text-slate-gray max-w-2xl mx-auto font-outfit">
            Loading...
          </p>
        </div>
      </main>
    </div>
  );
}

// Main export with client-only wrapper
export default function ComponentGenerator() {
  return (
    <ClientOnlyWrapper fallback={<LoadingFallback />}>
      <ComponentGeneratorContent />
    </ClientOnlyWrapper>
  );
}
