import { Vector3 } from "three";

export type BundleType = "main" | "chunk" | "vendor" | "css" | "asset";
export type PerformanceRating =
  | "excellent"
  | "good"
  | "needs-improvement"
  | "poor";

export type AssetInfo = {
  size: number;
  development: boolean;
  hotUpdateChunk: boolean;
  immutable: boolean;
  javascriptModule: boolean;
};

export type ModuleReason = {
  moduleName: string;
  type: string;
};

export type PerformanceBudgets = {
  totalSize: number;
  jsSize: number;
  cssSize: number;
};

export type BundleData = {
  id: string;
  name: string;
  size: number;
  gzipSize: number;
  modules: ModuleData[];
  type: BundleType;
  path: string;
};

export type ModuleData = {
  id: string;
  name: string;
  size: number;
  path: string;
  reasons: string[];
};

export type PlanetData = {
  id: string;
  name: string;
  size: number;
  position: Vector3;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  bundle: BundleData;
};

export type SolarSystemData = {
  planets: PlanetData[];
  totalSize: number;
  centerPosition: Vector3;
  scale: number;
};

export type PerformancePhase = {
  phase: number;
  name: string;
  description: string;
  budgets: PerformanceBudgets;
};

export type SolarSystemConfig = {
  phases: PerformancePhase[];
  currentPhase: number;
  showOrbits: boolean;
  showTooltips: boolean;
  enableAnimation: boolean;
  cameraAutoRotate: boolean;
};

export type BundleAnalyzerAsset = {
  name: string;
  size: number;
  chunks: string[];
  chunkNames: string[];
  info: AssetInfo;
};

export type BundleAnalyzerModule = {
  id: string | number;
  name: string;
  size: number;
  reasons: ModuleReason[];
};

export type BundleAnalyzerChunk = {
  id: string | number;
  entry: boolean;
  files: string[];
  names: string[];
  size: number;
  modules: BundleAnalyzerModule[];
};

export type BundleAnalyzerModuleDetail = {
  id: string | number;
  name: string;
  size: number;
  chunks: Array<string | number>;
  depth: number;
  issuer: string;
  reasons: ModuleReason[];
};

export type BundleAnalyzerResult = {
  assets: BundleAnalyzerAsset[];
  chunks: BundleAnalyzerChunk[];
  modules: BundleAnalyzerModuleDetail[];
};
