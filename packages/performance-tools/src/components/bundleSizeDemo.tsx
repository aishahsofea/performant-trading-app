'use client';

import { useState, useEffect } from 'react';
import type { SolarSystemData, BundleData } from '../types/solarSystem';
import { formatFileSize } from '../utils/bundleParser';
import { createDemoSolarSystemData } from '../utils/demo';

type BundleSizeDemoProps = {
  className?: string;
};

export const BundleSizeDemo = ({ className = '' }: BundleSizeDemoProps) => {
  const [solarSystemData, setSolarSystemData] = useState<SolarSystemData | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<BundleData | null>(null);

  useEffect(() => {
    // Load demo data
    const { solarSystemData: demoData } = createDemoSolarSystemData();
    setSolarSystemData(demoData);
  }, []);

  if (!solarSystemData) {
    return <div>Loading Bundle Size Solar System...</div>;
  }

  return (
    <div className={`p-6 bg-gray-900 text-white rounded-lg ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Bundle Size Solar System - Foundation Demo</h2>
      
      {/* Data Overview */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">System Overview</h3>
          <p>Total Size: <span className="text-blue-400 font-mono">{formatFileSize(solarSystemData.totalSize)}</span></p>
          <p>Bundles: <span className="text-green-400">{solarSystemData.planets.length}</span></p>
          <p>Scale Factor: <span className="text-purple-400">{solarSystemData.scale}</span></p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">3D Visualization</h3>
          <p className="text-yellow-400">🚀 Three.js Foundation Ready</p>
          <p className="text-sm text-gray-400">React Three Fiber components created</p>
          <p className="text-sm text-gray-400">Planet positioning calculated</p>
        </div>
      </div>

      {/* Bundle List */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl mb-3">Bundle Planets</h3>
        <div className="grid gap-2">
          {solarSystemData.planets.map((planet) => (
            <div
              key={planet.id}
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedBundle?.id === planet.bundle.id
                  ? 'bg-blue-700'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedBundle(planet.bundle)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span className="font-medium">{planet.bundle.name}</span>
                  <span className="text-xs text-gray-400">({planet.bundle.type})</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{formatFileSize(planet.bundle.size)}</div>
                  <div className="text-xs text-gray-400">
                    Orbit: {planet.orbitRadius.toFixed(1)} • Size: {planet.size.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Bundle Details */}
      {selectedBundle && (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold text-lg mb-3">Bundle Details: {selectedBundle.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="text-gray-400">Size:</span> {formatFileSize(selectedBundle.size)}</p>
              <p><span className="text-gray-400">Gzipped:</span> {formatFileSize(selectedBundle.gzipSize)}</p>
              <p><span className="text-gray-400">Type:</span> {selectedBundle.type}</p>
            </div>
            <div>
              <p><span className="text-gray-400">Modules:</span> {selectedBundle.modules.length}</p>
              <p><span className="text-gray-400">Path:</span> <span className="font-mono text-xs">{selectedBundle.path}</span></p>
            </div>
          </div>
          
          {selectedBundle.modules.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Modules:</h4>
              <div className="max-h-32 overflow-y-auto">
                {selectedBundle.modules.map((module) => (
                  <div key={module.id} className="text-sm text-gray-400 mb-1">
                    <span className="font-mono">{module.name}</span>
                    <span className="ml-2">({formatFileSize(module.size)})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Foundation Status */}
      <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded">
        <h3 className="font-semibold text-green-400 mb-2">✅ Bundle Size Solar System Foundation Complete</h3>
        <ul className="text-sm space-y-1 text-green-300">
          <li>✅ TypeScript types and utilities created</li>
          <li>✅ Bundle data parsing and transformation</li>
          <li>✅ Planet positioning and scaling algorithms</li>
          <li>✅ 3D component structure (Three.js + React Three Fiber)</li>
          <li>✅ Demo data and interactive preview</li>
        </ul>
        <p className="text-xs text-gray-400 mt-2">
          Ready for integration with existing bundle analyzer and 3D visualization rendering.
        </p>
      </div>
    </div>
  );
};