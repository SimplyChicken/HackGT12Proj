'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Palette, Type, Wand2 } from 'lucide-react';
import Header from "@/components/ui/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-eggshell">

        <Header />


        {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-space-cadet mb-6 font-poly">
            Welcome to Star Catcher
          </h2>
          <p className="text-xl text-slate-gray max-w-3xl mx-auto font-outfit">
            Your AI-powered design and development toolkit. Generate beautiful components, 
            create stunning color palettes, and craft perfect typography with the power of artificial intelligence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Component Generator */}
          <Link href="/components" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-space-cadet/10 rounded-lg flex items-center justify-center group-hover:bg-space-cadet/20 transition-colors">
                  <Wand2 className="w-6 h-6 text-space-cadet" />
            </div>
                <div>
                  <h3 className="text-xl font-semibold text-space-cadet font-poly">Component Generator</h3>
                  <p className="text-slate-gray font-outfit">AI-powered component generation</p>
                </div>
              </div>
              <p className="text-slate-gray mb-6 font-outfit">
                Generate and customize various React components with natural language. 
                Choose from buttons, navbars, heroes, cards, and footers.
              </p>
              <div className="space-y-2 text-sm text-slate-gray font-outfit">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                  <span>Multiple component types</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                  <span>Live preview with iframe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                  <span>Export ready code</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Design Generator */}
          <Link href="/design" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-gray/10 rounded-lg flex items-center justify-center group-hover:bg-slate-gray/20 transition-colors">
                  <Palette className="w-6 h-6 text-slate-gray" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-space-cadet font-poly">Design Generator</h3>
                  <p className="text-slate-gray font-outfit">Fonts & color palettes</p>
                </div>
              </div>
              <p className="text-slate-gray mb-6 font-outfit">
                Generate beautiful font pairings and cohesive color palettes. 
                Create professional designs with AI-powered suggestions.
              </p>
              <div className="space-y-2 text-sm text-slate-gray font-outfit">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-gray rounded-full"></div>
                  <span>Font pairing generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-gray rounded-full"></div>
                  <span>Color palette creation</span>
            </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-gray rounded-full"></div>
                  <span>Accessibility compliance</span>
          </div>
              </div>
            </div>
          </Link>

          {/* Accounts */}
          <Link href="/accounts" className="group">
            <div className="bg-white rounded-lg shadow-sm border border-slate-gray/20 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-space-cadet/10 rounded-lg flex items-center justify-center group-hover:bg-space-cadet/20 transition-colors">
                  <Type className="w-6 h-6 text-space-cadet" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-space-cadet font-poly">Account Management</h3>
                  <p className="text-slate-gray font-outfit">Register & preferences</p>
            </div>
          </div>
              <p className="text-slate-gray mb-6 font-outfit">
                Create your account, save your favorite designs, and access 
                personalized recommendations based on your preferences.
              </p>
              <div className="space-y-2 text-sm text-slate-gray font-outfit">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                  <span>Secure authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
                  <span>Save favorites</span>
        </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-space-cadet rounded-full"></div>
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