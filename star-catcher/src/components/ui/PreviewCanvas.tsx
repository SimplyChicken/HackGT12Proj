'use client';

import React, { useState, useEffect } from 'react';
import { Component } from '@/lib/schemas';

interface PreviewCanvasProps {
  component: Component | null;
}

export default function PreviewCanvas({ component }: PreviewCanvasProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(true);

  if (!component) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Click "Generate Component" to see component preview</p>
      </div>
    );
  }

  // Simple component renderer - in a real app, you'd use a proper component renderer
  const renderComponent = () => {
    if (!component.code) return null;

    // This is a simplified approach - in production, you'd want a proper component renderer
    // For now, we'll show the code and a mock preview
    return (
      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="text-center text-gray-600">
          <p className="mb-4">Component Preview for: <strong>{component.name}</strong></p>
          <div className="bg-white border border-gray-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-500">Component rendered here</p>
            <p className="text-xs text-gray-400 mt-2">
              (In a production app, this would render the actual React component)
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Component Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{component.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{component.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {component.type}
          </span>
          {component.props && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Configurable
            </span>
          )}
        </div>
      </div>

      {/* Toggle between Preview and Code */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setIsPreviewMode(true)}
          className={`px-4 py-2 text-sm font-medium ${
            isPreviewMode
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setIsPreviewMode(false)}
          className={`px-4 py-2 text-sm font-medium ${
            !isPreviewMode
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Code
        </button>
      </div>

      {/* Content */}
      {isPreviewMode ? (
        <div>
          {renderComponent()}
          
          {/* Props Documentation */}
          {component.props && (
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Props</h4>
              <div className="space-y-2">
                {Object.entries(component.props).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{key}</code>
                    <span className="text-gray-600">:</span>
                    <span className="text-gray-500">
                      {Array.isArray(value) ? value.join(' | ') : typeof value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <span className="text-sm text-gray-300">{component.name}.tsx</span>
          </div>
          <pre className="p-4 text-xs overflow-x-auto">
            <code>{component.code}</code>
          </pre>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Usage Instructions</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>1. Copy the component code above</p>
          <p>2. Create a new file with the component</p>
          <p>3. Import and use in your React application</p>
          <p>4. Customize props as needed</p>
        </div>
      </div>

      {/* Component Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Features</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Responsive design</li>
            <li>✓ Tailwind CSS styling</li>
            <li>✓ Accessibility optimized</li>
            <li>✓ Production ready</li>
          </ul>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Semantic HTML</li>
            <li>✓ Proper contrast ratios</li>
            <li>✓ Keyboard navigation</li>
            <li>✓ Screen reader friendly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
