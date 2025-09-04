import "./styles/globals.css";

export { SolarSystem } from "./components/SolarSystem";

export * from "./types/solarSystem";

export * from "./utils/bundleParser";
export * from "./utils/demo";

// Explicit type re-exports for better module resolution
export type {
  SolarSystemConfig,
  SolarSystemData,
  PlanetData,
  BundleData,
  ModuleData,
  PerformancePhase,
  PerformanceBudgets,
  BundleAnalyzerResult,
  BundleType,
  PerformanceRating,
} from "./types/solarSystem";
