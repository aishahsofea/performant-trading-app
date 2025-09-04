// Demo utility to create sample data for Bundle Size Solar System
import type {
  BundleAnalyzerResult,
  SolarSystemConfig,
} from "../types/solarSystem";
import {
  parseBundleAnalyzerData,
  createSolarSystemFromBundles,
} from "./bundleParser";

export const createDemoSolarSystemData = () => {
  // Create sample bundle analyzer data
  const demoAnalyzerResult: BundleAnalyzerResult = {
    assets: [
      {
        name: "main.js",
        size: 150000,
        chunks: ["main"],
        chunkNames: ["main"],
        info: {
          size: 150000,
          development: false,
          hotUpdateChunk: false,
          immutable: true,
          javascriptModule: true,
        },
      },
      {
        name: "vendor.js",
        size: 300000,
        chunks: ["vendor"],
        chunkNames: ["vendor"],
        info: {
          size: 300000,
          development: false,
          hotUpdateChunk: false,
          immutable: true,
          javascriptModule: true,
        },
      },
      {
        name: "chunk.js",
        size: 75000,
        chunks: ["chunk"],
        chunkNames: ["chunk"],
        info: {
          size: 75000,
          development: false,
          hotUpdateChunk: false,
          immutable: true,
          javascriptModule: true,
        },
      },
      {
        name: "styles.css",
        size: 25000,
        chunks: ["styles"],
        chunkNames: ["styles"],
        info: {
          size: 25000,
          development: false,
          hotUpdateChunk: false,
          immutable: true,
          javascriptModule: false,
        },
      },
    ],
    chunks: [
      {
        id: "main",
        entry: true,
        files: ["main.js"],
        names: ["main"],
        size: 150000,
        modules: [],
      },
      {
        id: "vendor",
        entry: false,
        files: ["vendor.js"],
        names: ["vendor"],
        size: 300000,
        modules: [],
      },
      {
        id: "chunk",
        entry: false,
        files: ["chunk.js"],
        names: ["chunk"],
        size: 75000,
        modules: [],
      },
      {
        id: "styles",
        entry: false,
        files: ["styles.css"],
        names: ["styles"],
        size: 25000,
        modules: [],
      },
    ],
    modules: [
      {
        id: "main-module",
        name: "./src/index.js",
        size: 150000,
        chunks: ["main"],
        depth: 0,
        issuer: "",
        reasons: [],
      },
      {
        id: "vendor-module",
        name: "./node_modules/react/index.js",
        size: 300000,
        chunks: ["vendor"],
        depth: 1,
        issuer: "./src/index.js",
        reasons: [],
      },
    ],
  };

  // Parse the analyzer data into solar system data
  const bundles = parseBundleAnalyzerData(demoAnalyzerResult);
  const solarSystemData = createSolarSystemFromBundles(bundles);

  // Create demo configuration
  const config: SolarSystemConfig = {
    phases: [
      {
        phase: 0,
        name: "Initial Setup",
        description: "Basic project setup with no optimizations",
        budgets: {
          totalSize: 1500000,
          jsSize: 1200000,
          cssSize: 300000,
        },
      },
      {
        phase: 1,
        name: "Basic Optimization",
        description: "Initial bundle splitting and code optimization",
        budgets: {
          totalSize: 800000,
          jsSize: 600000,
          cssSize: 200000,
        },
      },
      {
        phase: 2,
        name: "Advanced Optimization",
        description: "Tree shaking, minification, and compression",
        budgets: {
          totalSize: 400000,
          jsSize: 300000,
          cssSize: 100000,
        },
      },
    ],
    currentPhase: 0,
    showOrbits: true,
    showTooltips: true,
    enableAnimation: true,
    cameraAutoRotate: false,
  };

  return {
    solarSystemData,
    config,
    bundles,
  };
};
