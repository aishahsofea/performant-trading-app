import { Vector3 } from "three";
import type {
  BundleAnalyzerResult,
  BundleData,
  PlanetData,
  SolarSystemData,
  BundleType,
  PerformanceRating,
} from "../types/solarSystem";

/**
 * Parse webpack bundle analyzer results into Solar System data structure
 */
export const parseBundleAnalyzerData = (
  analyzerData: BundleAnalyzerResult
): BundleData[] => {
  const bundles: BundleData[] = [];

  // Parse assets into bundle data
  analyzerData.assets.forEach((asset, index) => {
    const bundle: BundleData = {
      id: `bundle-${index}`,
      name: asset.name,
      size: asset.size,
      gzipSize: Math.floor(asset.size * 0.7), // Estimate gzip size
      type: determineBundleType(asset.name),
      path: asset.name,
      modules: [],
    };

    // Find related modules for this bundle
    const relatedModules = analyzerData.modules.filter((module) =>
      asset.chunks.some((chunkId) => module.chunks.indexOf(chunkId) !== -1)
    );

    bundle.modules = relatedModules.map((module) => ({
      id: String(module.id),
      name: module.name,
      size: module.size,
      path: module.name,
      reasons: module.reasons.map((reason) => reason.moduleName),
    }));

    bundles.push(bundle);
  });

  return bundles;
};

/**
 * Transform bundle data into planet data for 3D visualization
 */
export const createSolarSystemFromBundles = (
  bundles: BundleData[]
): SolarSystemData => {
  const totalSize = bundles.reduce((sum, bundle) => sum + bundle.size, 0);
  const planets: PlanetData[] = [];

  // Sort bundles by size (smallest first)
  const sortedBundles = [...bundles].sort((a, b) => a.size - b.size);

  // Find max bundle size for scaling
  const maxBundleSize = Math.max(...sortedBundles.map((b) => b.size));

  // Create planets with positions based on size and type
  sortedBundles.forEach((bundle, index) => {
    const planet = createPlanetFromBundle(bundle, index, maxBundleSize);
    planets.push(planet);
  });

  return {
    planets,
    totalSize,
    centerPosition: new Vector3(0, 0, 0),
    scale: calculateOptimalScale(totalSize),
  };
};

/**
 * Create a planet representation of a bundle
 */
const createPlanetFromBundle = (
  bundle: BundleData,
  index: number,
  maxBundleSize: number
): PlanetData => {
  // Add some randomness but keep it deterministic based on bundle name
  const seedHash = bundle.name
    .split("")
    .reduce((a, b) => a + b.charCodeAt(0), 0);
  const randomOffset = (seedHash % 100) / 100; // 0-1 based on name

  // Calculate planet size with better scaling to show size differences
  const minSize = 0.3;
  const maxSize = 2.5;

  // Use logarithmic scaling to better show size differences
  const normalizedSize = bundle.size / maxBundleSize;
  const logScale = Math.log10(normalizedSize * 9 + 1); // Log scale from 0 to 1
  const planetSize = minSize + (maxSize - minSize) * logScale;

  // Calculate orbit radius based on planet size to prevent overlaps
  const baseRadius = 2;
  const sizeBasedSpacing = planetSize * 2; // More space for bigger planets
  const indexSpacing = index * 2; // Base spacing between orbits
  const orbitRadius = baseRadius + indexSpacing + sizeBasedSpacing;

  // Position planet on orbit with better distribution
  // Use golden angle for better distribution
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
  const angle = index * goldenAngle;

  const finalAngle = angle + randomOffset * Math.PI * 0.5; // Add up to 90 degrees variation

  const position = new Vector3(
    Math.cos(finalAngle) * orbitRadius,
    0, // Keep all planets on the same orbital plane
    Math.sin(finalAngle) * orbitRadius
  );

  return {
    id: bundle.id,
    name: bundle.name,
    size: planetSize,
    position,
    color: getBundleTypeColor(bundle.type),
    orbitRadius,
    orbitSpeed: 0.1 / (orbitRadius * 0.5), // Faster orbit - visible animation
    bundle,
  };
};

/**
 * Determine bundle type from filename
 */
const determineBundleType = (filename: string): BundleType => {
  if (filename.indexOf(".css") !== -1) return "css";
  if (
    filename.indexOf("vendor") !== -1 ||
    filename.indexOf("node_modules") !== -1
  )
    return "vendor";
  if (filename.indexOf("chunk") !== -1) return "chunk";
  if (filename.indexOf("main") !== -1 || filename.indexOf("app") !== -1)
    return "main";
  return "asset";
};

/**
 * Get color for bundle type
 */
const getBundleTypeColor = (type: BundleType): string => {
  const colors = {
    main: "#4F46E5", // Indigo - Main application code
    chunk: "#10B981", // Green - Code chunks
    vendor: "#F59E0B", // Amber - Third-party dependencies
    css: "#EF4444", // Red - Stylesheets
    asset: "#8B5CF6", // Purple - Other assets
  };

  return colors[type];
};

/**
 * Calculate optimal scale for the solar system based on total size
 */
const calculateOptimalScale = (totalSize: number): number => {
  // Scale based on common bundle size ranges
  if (totalSize < 100000) return 1.0; // < 100KB
  if (totalSize < 500000) return 0.8; // < 500KB
  if (totalSize < 1000000) return 0.6; // < 1MB
  return 0.4; // > 1MB
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Calculate performance impact score
 */
export const calculatePerformanceImpact = (
  bundleSize: number,
  phase: number
): {
  score: number;
  rating: PerformanceRating;
} => {
  // Performance budgets by phase (in bytes)
  const budgets = [
    { total: 1500000, rating: "poor" }, // Phase 0-1: Deliberately poor
    { total: 1200000, rating: "poor" }, // Phase 2: Still poor
    { total: 800000, rating: "needs-improvement" }, // Phase 3: Improving
    { total: 500000, rating: "good" }, // Phase 4: Good
    { total: 300000, rating: "good" }, // Phase 5: Very good
    { total: 200000, rating: "excellent" }, // Phase 6: Excellent
  ];

  const budget = budgets[Math.min(phase, budgets.length - 1)];
  if (!budget) {
    return { score: 0, rating: "poor" };
  }

  const ratio = bundleSize / budget.total;
  const score = Math.max(0, Math.min(100, (1 - ratio) * 100));

  let rating: PerformanceRating;
  if (score >= 90) rating = "excellent";
  else if (score >= 75) rating = "good";
  else if (score >= 50) rating = "needs-improvement";
  else rating = "poor";

  return { score, rating };
};
