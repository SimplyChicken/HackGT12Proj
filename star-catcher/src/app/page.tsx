'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Palette, Type, Wand2 } from 'lucide-react';

export default function Home() {
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
              <h1 className="text-xl font-bold text-gray-900">Star Catcher</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/accounts">
                <button
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Sign in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Star Catcher
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered design and development toolkit. Generate beautiful components, 
            create stunning color palettes, and craft perfect typography with the power of artificial intelligence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Button Customizer */}
          <Link href="/button" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Wand2 className="w-6 h-6 text-blue-600" />
            </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Button Customizer</h3>
                  <p className="text-gray-600">AI-powered button generation</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Start with a simple button and customize it with natural language. 
                Watch as AI transforms your ideas into beautiful, functional components.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Natural language customization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Live preview with iframe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Export ready code</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Design Generator */}
          <Link href="/design" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Design Generator</h3>
                  <p className="text-gray-600">Fonts & color palettes</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Generate beautiful font pairings and cohesive color palettes. 
                Create professional designs with AI-powered suggestions.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Font pairing generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Color palette creation</span>
            </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Accessibility compliance</span>
          </div>
              </div>
            </div>
          </Link>

          {/* Accounts */}
          <Link href="/accounts" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Type className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Account Management</h3>
                  <p className="text-gray-600">Sign in & preferences</p>
            </div>
          </div>
              <p className="text-gray-600 mb-6">
                Manage your account, save your favorite designs, and access 
                personalized recommendations based on your preferences.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Save favorites</span>
        </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Personalized experience</span>
    </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}