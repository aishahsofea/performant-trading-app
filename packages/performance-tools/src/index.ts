// 3D Solar System Components
export { SolarSystem } from "./components/solar-system/SolarSystem";
export { Planet } from "./components/solar-system/Planet";

// Demo Component
export { BundleSizeDemo } from "./components/bundleSizeDemo";

// Utils
export {
  parseBundleAnalyzerData,
  createSolarSystemFromBundles,
  formatFileSize,
  calculatePerformanceImpact,
} from "./utils/bundleParser";

export { createDemoSolarSystemData } from "./utils/demo";

// Types
export type {
  BundleType,
  PerformanceRating,
  AssetInfo,
  ModuleReason,
  PerformanceBudgets,
  BundleData,
  ModuleData,
  PlanetData,
  SolarSystemData,
  PerformancePhase,
  SolarSystemConfig,
  BundleAnalyzerAsset,
  BundleAnalyzerModule,
  BundleAnalyzerChunk,
  BundleAnalyzerModuleDetail,
  BundleAnalyzerResult,
} from "./types/solarSystem";
