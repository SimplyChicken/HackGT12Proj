'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Palette, Type, Wand2 } from 'lucide-react';
import Header from "@/components/ui/Header";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-eggshell">
      <Header />

      {/* Full-screen sections */}
      <section className="w-full h-screen bg-[#F0E7D5] flex items-center justify-between px-12 relative">
    {/* Left text box */}
    <div className="max-w-[800px] -translate-y-12 relative">
      <h2 className="text-[85px] font-bold mb-4 font-poly text-[#212842] leading-[0.9]">
        Great Design
        <br />
        Fast, Easy
      </h2>
      <p className="text-[20px] text-[#212842] font-outfit">
        Palettes, Font Pairs, Website Components, More
      </p>

      {/* Line with centered scroll indicator */}
      <div className="relative mt-8">
        <hr className="border-t-2 border-[#212842]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#F0E7D5] px-2">
          <span className="text-lg font-outfit text-[#212842]">Scroll For More</span>
          <Image
            src="/images/down-arrow.png"
            alt="Scroll down"
            width={24}
            height={24}
            className="animate-bounce"
          />
        </div>
      </div>
    </div>

    {/* Right image */}
    <div className="flex-shrink-0">
      <Image
        src="/images/image-1.png"
        alt="Hero image"
        width={788}
        height={804}
        className="rounded-lg"
      />
    </div>
  </section>

  <section className="w-full h-screen bg-[#212842]">
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#F8F3EA] mb-4 font-poly">
              Welcome to easel
            </h2>

            <hr className="border-t-2 border-[#F8F3EA] w-[450px] mx-auto my-6" />

            <p className="text-xl text-slate-gray max-w-3xl mx-auto font-outfit mt-4">
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
                    <Wand2 className="w-6 h-6 text-space-cadet" style={{ color: "#212842" }}/>
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
                    <Palette className="w-6 h-6 text-slate-gray" style={{ color: "#212842" }}/>
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
                    <Type className="w-6 h-6 text-space-cadet" style={{ color: "#212842" }}/>
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
      </section>
      <div className='bg-[#131624ff] w-full h-16'></div>
    </div>
  );
}