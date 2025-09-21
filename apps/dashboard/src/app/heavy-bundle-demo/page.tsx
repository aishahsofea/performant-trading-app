"use client";

import React, { useState } from "react";
import HeavyBundleLoader from "@/components/heavy-bundle-loader";
// Import the unused trading calculations to include them in bundle (even though not used)
import {
  UNUSED_TRADING_LIBRARIES,
  UNUSED_MARKET_DATA,
  UNUSED_TRADING_CONFIGS,
} from "@/lib/unused-trading-calculations";
import {
  validateBundleBloat,
  getBundleAnalytics,
} from "@/lib/validate-bundle-bloat";

export default function HeavyBundleDemoPage() {
  const [enableCalculations, setEnableCalculations] = useState(false);
  const [bundleAnalysis, setBundleAnalysis] = useState<{
    librariesCount: number;
    dataStructuresSize: number;
    configObjectsCount: number;
  }>({
    librariesCount: 0,
    dataStructuresSize: 0,
    configObjectsCount: 0,
  });

  React.useEffect(() => {
    // Validate bundle bloat implementation
    const validation = validateBundleBloat();
    const analytics = getBundleAnalytics();

    // Calculate bundle analysis on component mount
    const librariesCount = Object.keys(UNUSED_TRADING_LIBRARIES).length;
    const dataStructuresSize = Object.keys(UNUSED_MARKET_DATA).reduce(
      (total, key) => {
        const data = UNUSED_MARKET_DATA[key as keyof typeof UNUSED_MARKET_DATA];
        return total + (Array.isArray(data) ? data.length : 1);
      },
      0
    );
    const configObjectsCount = Object.keys(UNUSED_TRADING_CONFIGS).length;

    setBundleAnalysis({
      librariesCount,
      dataStructuresSize,
      configObjectsCount,
    });

    // Log validation results for development
    console.log("Bundle Bloat Validation:", validation);
    console.log("Bundle Analytics:", analytics);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                AC 5: JavaScript Bundle Bloat Demo
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This page demonstrates deliberate JavaScript bundle bloat for
                  performance optimization learning:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Heavy dependencies installed without tree shaking</li>
                  <li>
                    Entire libraries imported instead of selective imports
                  </li>
                  <li>
                    Unused trading calculation libraries included in bundle
                  </li>
                  <li>Webpack configuration prevents optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Heavy Bundle Demo
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-800 mb-2">
                Unused Libraries
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                {bundleAnalysis.librariesCount}
              </p>
              <p className="text-sm text-orange-700">
                Trading calculation classes
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">
                Market Data Objects
              </h3>
              <p className="text-2xl font-bold text-red-600">
                {bundleAnalysis.dataStructuresSize.toLocaleString()}
              </p>
              <p className="text-sm text-red-700">Unused data structures</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Config Objects
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {bundleAnalysis.configObjectsCount}
              </p>
              <p className="text-sm text-yellow-700">
                Heavy configuration objects
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              Bundle Bloat Impact Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">
                  Heavy Dependencies Installed:
                </h4>
                <ul className="text-blue-600 space-y-1">
                  <li>• D3.js (~500KB) - Full library import</li>
                  <li>• Plotly.js (~3MB) - Dynamic import (build-safe)</li>
                  <li>• Three.js (~600KB) - Full library import</li>
                  <li>• TensorFlow.js (~2MB) - Full library import</li>
                  <li>• Lodash (~70KB) - Full library import</li>
                  <li>• RxJS (~200KB) - Full library import</li>
                  <li>• Math.js (~500KB) - Full library import</li>
                  <li>• Moment.js (~70KB) - Deprecated but heavy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">
                  Bundle Optimization Disabled:
                </h4>
                <ul className="text-blue-600 space-y-1">
                  <li>• Tree shaking disabled in webpack</li>
                  <li>• Minification disabled for production</li>
                  <li>• Code splitting disabled</li>
                  <li>• Module concatenation disabled</li>
                  <li>• All vendor libraries in main bundle</li>
                  <li>• Unused exports included</li>
                  <li>• Side effects marking disabled</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={enableCalculations}
                onChange={(e) => setEnableCalculations(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Enable Heavy Calculations (⚠️ May cause performance issues)
              </span>
            </label>
          </div>

          {enableCalculations && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  Heavy calculations enabled. This will execute complex
                  operations using all imported libraries.
                </span>
              </div>
            </div>
          )}
        </div>

        <HeavyBundleLoader enableHeavyCalculations={enableCalculations} />

        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Performance Optimization Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Bundle Size Optimization:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Enable tree shaking</li>
                <li>
                  • Use selective imports (import {`{ specific }`} from
                  'library')
                </li>
                <li>• Remove unused dependencies</li>
                <li>• Enable webpack optimization</li>
                <li>• Implement code splitting</li>
                <li>• Use dynamic imports for heavy libraries</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Runtime Performance:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Lazy load heavy calculations</li>
                <li>• Use Web Workers for intensive tasks</li>
                <li>• Implement virtual scrolling</li>
                <li>• Cache expensive computations</li>
                <li>• Use service workers for background processing</li>
                <li>• Optimize re-renders with React.memo</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bundle Analysis Commands
          </h2>
          <div className="bg-gray-100 rounded p-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Analyze current bundle size:
            </h3>
            <code className="text-sm text-gray-700 bg-white p-2 rounded block">
              ANALYZE=true pnpm build
            </code>
            <h3 className="font-medium text-gray-800 mb-2 mt-4">
              Build with heavy bundle mode:
            </h3>
            <code className="text-sm text-gray-700 bg-white p-2 rounded block">
              HEAVY_BUNDLE=true pnpm build
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
