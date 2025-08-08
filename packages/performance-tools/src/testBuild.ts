// Test build file to verify types and utilities work
import type { BundleAnalyzerResult, SolarSystemConfig } from './types/solarSystem';
import { parseBundleAnalyzerData, createSolarSystemFromBundles, formatFileSize } from './utils/bundleParser';

// Mock data for testing
const mockAnalyzerResult: BundleAnalyzerResult = {
  assets: [{
    name: 'main.js',
    size: 150000,
    chunks: ['main'],
    chunkNames: ['main'],
    info: {
      size: 150000,
      development: false,
      hotUpdateChunk: false,
      immutable: true,
      javascriptModule: true
    }
  }],
  chunks: [{
    id: 'main',
    entry: true,
    files: ['main.js'],
    names: ['main'],
    size: 150000,
    modules: []
  }],
  modules: [{
    id: 'main-module',
    name: './src/index.js',
    size: 150000,
    chunks: ['main'],
    depth: 0,
    issuer: '',
    reasons: []
  }]
};

const mockConfig: SolarSystemConfig = {
  phases: [],
  currentPhase: 0,
  showOrbits: true,
  showTooltips: true,
  enableAnimation: true,
  cameraAutoRotate: false
};

// Test the utility functions
const bundles = parseBundleAnalyzerData(mockAnalyzerResult);
const solarSystemData = createSolarSystemFromBundles(bundles);
const formattedSize = formatFileSize(150000);

console.log('Bundle Size Solar System foundation test successful');
console.log('Parsed bundles:', bundles.length);
console.log('Solar system planets:', solarSystemData.planets.length);
console.log('Formatted size:', formattedSize);